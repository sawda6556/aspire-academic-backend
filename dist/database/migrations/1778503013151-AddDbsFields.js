"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDbsFields1778503013151 = void 0;
class AddDbsFields1778503013151 {
    name = 'AddDbsFields1778503013151';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "dbs_certificate_url" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."tutor_profiles_dbs_verified_status_enum" AS ENUM('PENDING', 'VERIFIED', 'REQUIRED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "dbs_verified_status" "public"."tutor_profiles_dbs_verified_status_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "dbs_certificate_number" character varying`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "is_on_update_service" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD "dbs_last_checked_at" TIMESTAMP`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "dbs_last_checked_at"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "is_on_update_service"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "dbs_certificate_number"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "dbs_verified_status"`);
        await queryRunner.query(`DROP TYPE "public"."tutor_profiles_dbs_verified_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP COLUMN "dbs_certificate_url"`);
    }
}
exports.AddDbsFields1778503013151 = AddDbsFields1778503013151;
//# sourceMappingURL=1778503013151-AddDbsFields.js.map