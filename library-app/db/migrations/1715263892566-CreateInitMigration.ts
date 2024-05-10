import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitMigration1715263892566 implements MigrationInterface {
  name = 'CreateInitMigration1715263892566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "memberCode" character varying NOT NULL, "bookCode" character varying NOT NULL, "qty" integer NOT NULL DEFAULT '1', "status" integer NOT NULL DEFAULT '1', "transactionDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d2c4c0bb81f6e6b0e689917362" ON "transactions" ("memberCode", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7d690067c803c5ecd6aad5eb0e" ON "transactions" ("memberCode", "bookCode", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b9933091ef851796327cdf3633" ON "transactions" ("memberCode", "bookCode") `,
    );
    await queryRunner.query(
      `CREATE TABLE "members" ("code" character varying NOT NULL, "name" character varying NOT NULL, "isPenalized" boolean NOT NULL DEFAULT false, "penalizedDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8b08a36b59b238402b8c38d1f6f" PRIMARY KEY ("code"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "books" ("code" character varying NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "stock" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_c19328bbdf15e7ddbea3812318d" PRIMARY KEY ("code"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "books"`);
    await queryRunner.query(`DROP TABLE "members"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b9933091ef851796327cdf3633"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7d690067c803c5ecd6aad5eb0e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d2c4c0bb81f6e6b0e689917362"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
  }
}
