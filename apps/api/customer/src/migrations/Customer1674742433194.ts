
import { MigrationInterface, QueryRunner } from "typeorm";
export class Customer1674742433194 implements MigrationInterface {
name = 'Customer1674742433194'
public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reserved-credits"
            ALTER COLUMN "orderId" DROP DEFAULT
        `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reserved-credits"
            ALTER COLUMN "orderId"
            SET DEFAULT uuid_generate_v4()
        `);
}
}
