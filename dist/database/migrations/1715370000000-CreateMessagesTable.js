"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessagesTable1715370000000 = void 0;
class CreateMessagesTable1715370000000 {
    name = 'CreateMessagesTable1715370000000';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "sender_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "content" text NOT NULL, "attachment_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_messages" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_messages_receiver" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_messages_receiver"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_messages_sender"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }
}
exports.CreateMessagesTable1715370000000 = CreateMessagesTable1715370000000;
//# sourceMappingURL=1715370000000-CreateMessagesTable.js.map