
import { MigrationInterface, QueryRunner } from "typeorm";
export class Shipping1674744144699 implements MigrationInterface {
name = 'Shipping1674744144699'
public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "shipping-address" (
                "customerId" uuid NOT NULL,
                "address" character varying NOT NULL,
                CONSTRAINT "PK_62f7ae88a25dcab7ba0aca83595" PRIMARY KEY ("customerId")
            )
        `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "shipping-address"
        `);
}
}
