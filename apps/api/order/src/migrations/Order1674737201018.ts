
import { MigrationInterface, QueryRunner } from "typeorm";
export class Order1674737201018 implements MigrationInterface {
name = 'Order1674737201018'
public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."order_status_enum" AS ENUM('CREATED', 'PAYMENT_RESERVED', 'PAID', 'SHIPPED', 'FAILED')
        `);
        await queryRunner.query(`
            CREATE TABLE "order" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "price" integer NOT NULL,
                "status" "public"."order_status_enum" NOT NULL DEFAULT 'CREATED',
                CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
            )
        `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TYPE "public"."order_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "order"
        `);
}
}
