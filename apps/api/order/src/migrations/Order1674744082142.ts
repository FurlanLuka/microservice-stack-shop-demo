
import { MigrationInterface, QueryRunner } from "typeorm";
export class Order1674744082142 implements MigrationInterface {
name = 'Order1674744082142'
public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order"
            ADD "failureReason" character varying
        `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order" DROP COLUMN "failureReason"
        `);
}
}
