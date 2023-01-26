
import { MigrationInterface, QueryRunner } from "typeorm";
export class Order1674739226576 implements MigrationInterface {
name = 'Order1674739226576'
public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order"
            ADD "customerId" uuid NOT NULL
        `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order" DROP COLUMN "customerId"
        `);
}
}
