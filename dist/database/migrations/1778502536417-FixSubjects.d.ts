import { MigrationInterface, QueryRunner } from "typeorm";
export declare class FixSubjects1778502536417 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
