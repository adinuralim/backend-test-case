import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private repo: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.repo.find({});
  }

  async findOne(bookCode: string): Promise<Book> {
    const result = await this.repo.findOne({
      where: {
        code: bookCode,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
