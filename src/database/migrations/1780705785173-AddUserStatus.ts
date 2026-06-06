import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserStatus1780705785173 implements MigrationInterface {
    name = 'AddUserStatus1780705785173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'SUSPENDED')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "resource_purchases" ADD "platform_fee" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "resource_purchases" ADD "tutor_revenue" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource_purchases" DROP COLUMN "tutor_revenue"`);
        await queryRunner.query(`ALTER TABLE "resource_purchases" DROP COLUMN "platform_fee"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    }

}
