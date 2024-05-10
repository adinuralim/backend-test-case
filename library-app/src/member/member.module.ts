import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { Member } from './entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Book } from 'src/book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Transaction, Book])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
