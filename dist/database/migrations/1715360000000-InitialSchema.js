"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1715360000000 = void 0;
class InitialSchema1715360000000 {
    name = 'InitialSchema1715360000000';
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
        await queryRunner.query(`CREATE TYPE "user_type" AS ENUM('TUTOR', 'PARENT', 'STUDENT')`);
        await queryRunner.query(`CREATE TYPE "gender" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TYPE "verification_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "user_type" "user_type" NOT NULL, "gender" "gender" NOT NULL, "avatar_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672df88af87152a8f11588177" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tutor_profiles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "full_name" character varying NOT NULL, "country" character varying, "bio" text, "hourly_rate" numeric(10,2), "subjects" jsonb, "languages" jsonb, "qualifications" text, "experience" text, "verification_status" "verification_status" NOT NULL DEFAULT 'PENDING', "id_document_url" character varying, "cert_document_url" character varying, "verified_at" TIMESTAMP, CONSTRAINT "REL_5cf8051c-fe29-4ee0-9629-a380bd1340ae" UNIQUE ("user_id"), CONSTRAINT "PK_tutor_profiles" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parent_profiles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "full_name" character varying NOT NULL, CONSTRAINT "REL_parent_profiles_user" UNIQUE ("user_id"), CONSTRAINT "PK_parent_profiles" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_profiles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "full_name" character varying NOT NULL, "parent_id" uuid, CONSTRAINT "REL_student_profiles_user" UNIQUE ("user_id"), CONSTRAINT "PK_student_profiles" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" ADD CONSTRAINT "FK_tutor_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parent_profiles" ADD CONSTRAINT "FK_parent_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD CONSTRAINT "FK_student_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD CONSTRAINT "FK_student_profiles_parent" FOREIGN KEY ("parent_id") REFERENCES "parent_profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP CONSTRAINT "FK_student_profiles_parent"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP CONSTRAINT "FK_student_profiles_user"`);
        await queryRunner.query(`ALTER TABLE "parent_profiles" DROP CONSTRAINT "FK_parent_profiles_user"`);
        await queryRunner.query(`ALTER TABLE "tutor_profiles" DROP CONSTRAINT "FK_tutor_profiles_user"`);
        await queryRunner.query(`DROP TABLE "student_profiles"`);
        await queryRunner.query(`DROP TABLE "parent_profiles"`);
        await queryRunner.query(`DROP TABLE "tutor_profiles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "verification_status"`);
        await queryRunner.query(`DROP TYPE "gender"`);
        await queryRunner.query(`DROP TYPE "user_type"`);
    }
}
exports.InitialSchema1715360000000 = InitialSchema1715360000000;
//# sourceMappingURL=1715360000000-InitialSchema.js.map