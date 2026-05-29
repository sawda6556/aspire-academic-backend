import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddBookingRemindersFields1779631518612 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
