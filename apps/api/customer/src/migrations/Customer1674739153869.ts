
import { MigrationInterface, QueryRunner } from "typeorm";
export class Customer1674739153869 implements MigrationInterface {
name = 'Customer1674739153869'
public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "reserved-credits" (
                "orderId" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "reservedAmount" integer NOT NULL,
                CONSTRAINT "PK_64ae47a91c4a4f3da445df79a93" PRIMARY KEY ("orderId")
            )
        `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "reserved-credits"
        `);
}
}
