import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddDbsFields1778503013151 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
