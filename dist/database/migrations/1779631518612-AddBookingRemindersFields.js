"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBookingRemindersFields1779631518612 = void 0;
class AddBookingRemindersFields1779631518612 {
    name = 'AddBookingRemindersFields1779631518612';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "reminder_24h_sent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "reminder_1h_sent" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "reminder_1h_sent"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "reminder_24h_sent"`);
    }
}
exports.AddBookingRemindersFields1779631518612 = AddBookingRemindersFields1779631518612;
//# sourceMappingURL=1779631518612-AddBookingRemindersFields.js.map