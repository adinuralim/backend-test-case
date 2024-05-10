import { ApiProperty } from '@nestjs/swagger';

export class BookData {
  @ApiProperty()
  bookCode: string;

  @ApiProperty({
    default: 1,
  })
  qty: number;
}

export class MemberBorrowDto {
  @ApiProperty()
  memberCode: string;

  @ApiProperty({
    isArray: true,
    type: BookData,
  })
  books: BookData[];
}

export class MemberReturnDto {
  @ApiProperty()
  memberCode: string;

  @ApiProperty({
    isArray: true,
    type: String,
  })
  books: string[];
}

export class MemberDto {
  code: string;
  name: string;
  countBookBorrowed: number;
}
