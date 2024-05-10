import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { ResponseInterceptor } from 'libs/interceptor/response.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @UseInterceptors(ResponseInterceptor)
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':code')
  @UseInterceptors(ResponseInterceptor)
  findOne(@Param('code') bookCode: string) {
    return this.bookService.findOne(bookCode);
  }
}
