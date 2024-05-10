import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'libs/interceptor/response.interceptor';
import { MemberBorrowDto, MemberReturnDto } from './dto/member.dto';

@ApiTags('Members')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @UseInterceptors(ResponseInterceptor)
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':code')
  @UseInterceptors(ResponseInterceptor)
  findOne(@Param('code') memberCode: string) {
    return this.memberService.findOne(memberCode);
  }

  @Post('/borrow')
  @UseInterceptors(ResponseInterceptor)
  borrowBook(@Body() payload: MemberBorrowDto) {
    return this.memberService.borrowBook(payload);
  }

  @Post('/return')
  @UseInterceptors(ResponseInterceptor)
  returnBook(@Body() payload: MemberReturnDto) {
    return this.memberService.returnBook(payload);
  }
}
