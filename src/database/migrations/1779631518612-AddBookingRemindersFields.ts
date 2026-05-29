import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingRemindersFields1779631518612 implements MigrationInterface {
    name = 'AddBookingRemindersFields1779631518612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "reminder_24h_sent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "reminder_1h_sent" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "reminder_1h_sent"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "reminder_24h_sent"`);
    }

}
