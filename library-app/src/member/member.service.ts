import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  Transaction,
  TransactionStatusEnum,
} from 'src/transaction/entities/transaction.entity';
import { MemberBorrowDto, MemberDto, MemberReturnDto } from './dto/member.dto';
import { Book } from 'src/book/entities/book.entity';
import { addDays } from 'date-fns';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private repo: Repository<Member>,
    @InjectRepository(Transaction)
    private trasactionRepo: Repository<Transaction>,
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}
  // helper
  private async validateBorrow(
    dto: MemberBorrowDto,
    member: Member,
  ): Promise<string[]> {
    const errors: string[] = [];
    const maxBorrowed = 2;

    const timeNow = new Date();
    if (member.isPenalized && addDays(member.penalizedDate, 3) >= timeNow) {
      errors.push(
        `member with penalty cannot able to borrow the book for 3 days`,
      );
    }

    // Members may not borrow more than 2 books
    const transactions = member.transactions.filter(
      (x) => x.status == TransactionStatusEnum.BORROW,
    );

    const bookBorrowedCount = transactions
      .map((x) => x.qty)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    if (bookBorrowedCount >= maxBorrowed) {
      errors.push(`not borrow more than ${maxBorrowed} books`);
      return errors;
    }

    const bookBorrowCount = dto.books
      .map((x) => x.qty)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    if (bookBorrowCount + bookBorrowedCount > maxBorrowed) {
      errors.push(`not borrow more than ${maxBorrowed} books`);
      return errors;
    }

    // Borrowed books are not borrowed by other members
    for (const book of dto.books) {
      const exists = await this.trasactionRepo.exists({
        where: {
          bookCode: book.bookCode,
          memberCode: Not(dto.memberCode),
          status: TransactionStatusEnum.BORROW,
        },
      });

      if (exists) {
        errors.push(`books are borrowed by other members`);
        return errors;
      }
    }

    return errors;
  }

  private async validateReturn(
    dto: MemberReturnDto,
    member: Member,
  ): Promise<string[]> {
    const errors: string[] = [];

    // The returned book is a book that the member has borrowed
    const transactions = member.transactions.filter(
      (x) => x.status == TransactionStatusEnum.BORROW,
    );

    for (const bookCode of dto.books) {
      const filters = transactions.filter((x) => x.bookCode == bookCode);
      if (filters.length == 0) {
        errors.push(`member not borrowed the book`);
        return errors;
      }
    }
    return errors;
  }

  // query
  async findAll(): Promise<MemberDto[]> {
    const members = await this.repo.find({
      relations: {
        transactions: true,
      },
    });
    return members.map((x) => {
      const dto = new MemberDto();
      dto.code = x.code;
      dto.name = x.name;
      dto.countBookBorrowed =
        x.transactions.filter((x) => x.status == TransactionStatusEnum.BORROW)
          .length ?? 0;

      return dto;
    });
  }

  async findOne(memberCode: string): Promise<MemberDto> {
    const result = await this.repo.findOne({
      where: {
        code: memberCode,
      },
      relations: {
        transactions: true,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    const dto = new MemberDto();
    dto.code = result.code;
    dto.name = result.name;
    dto.countBookBorrowed =
      result.transactions.filter(
        (x) => x.status == TransactionStatusEnum.BORROW,
      ).length ?? 0;
    return dto;
  }

  // command
  async borrowBook(dto: MemberBorrowDto): Promise<boolean> {
    const member = await this.repo.findOne({
      where: {
        code: dto.memberCode,
      },
      relations: {
        transactions: true,
      },
    });

    if (!member) {
      throw new BadRequestException('member not found');
    }

    const errors = await this.validateBorrow(dto, member);

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(', '));
    }

    // save to transactions
    for (const book of dto.books) {
      const currentBook = await this.bookRepo.findOne({
        where: {
          code: book.bookCode,
        },
      });

      if (!currentBook) {
        throw new NotFoundException(`book [${book.bookCode}] not found`);
      }

      if (currentBook.stock == 0) {
        throw new BadRequestException(`book : out of stock`);
      }

      const transaction = new Transaction();
      transaction.bookCode = book.bookCode;
      transaction.qty = book.qty;
      transaction.memberCode = dto.memberCode;
      transaction.transactionDate = new Date();
      await this.trasactionRepo.save(this.trasactionRepo.create(transaction));

      // decerment stock
      currentBook.stock -= 1;
      await this.bookRepo.save(currentBook);

      if (member.isPenalized) {
        await this.repo.update(
          {
            code: member.code,
          },
          { isPenalized: false, penalizedDate: null },
        );
      }
    }

    return true;
  }

  async returnBook(dto: MemberReturnDto): Promise<boolean> {
    const member = await this.repo.findOne({
      where: {
        code: dto.memberCode,
      },
      relations: {
        transactions: true,
      },
    });

    if (!member) {
      throw new BadRequestException('member not found');
    }

    const errors = await this.validateReturn(dto, member);

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(', '));
    }

    // save to transactions
    for (const bookCode of dto.books) {
      const currentBook = await this.bookRepo.findOne({
        where: {
          code: bookCode,
        },
      });

      if (!currentBook) {
        throw new NotFoundException(`book [${bookCode}] not found`);
      }

      const transaction = await this.trasactionRepo.findOne({
        where: {
          bookCode: currentBook.code,
          memberCode: dto.memberCode,
          status: TransactionStatusEnum.BORROW,
        },
      });

      const timeNow = new Date();

      if (addDays(transaction.transactionDate, 7) < timeNow) {
        await this.repo.update(
          {
            code: member.code,
          },
          {
            isPenalized: true,
            penalizedDate: timeNow,
          },
        );
      }

      if (!transaction) {
        throw new NotFoundException(`transaction  not found`);
      }

      transaction.transactionDate = new Date();
      transaction.status = TransactionStatusEnum.RETURN;
      await this.trasactionRepo.save(transaction);

      // decerment stock
      currentBook.stock += 1;
      await this.bookRepo.save(currentBook);
    }

    return true;
  }
}
