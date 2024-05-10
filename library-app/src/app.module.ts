import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { MemberModule } from './member/member.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), MemberModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
