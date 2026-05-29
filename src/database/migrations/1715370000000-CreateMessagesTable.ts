import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMessagesTable1715370000000 implements MigrationInterface {
    name = 'CreateMessagesTable1715370000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "sender_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "content" text NOT NULL, "attachment_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_messages" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_messages_receiver" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_messages_receiver"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_messages_sender"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}
