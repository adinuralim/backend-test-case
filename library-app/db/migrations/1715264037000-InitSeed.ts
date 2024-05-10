import { books, members } from 'db/mock';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSeed1715264037000 implements MigrationInterface {
  name = 'InitSeed1715264037000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('members')
      .values(members)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('books')
      .values(books)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "members"`);
    await queryRunner.query(`TRUNCATE TABLE "books"`);
  }
}
