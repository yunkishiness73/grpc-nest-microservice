import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'micro_order',
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true, //never true in production
  logging: true,
  // ssl: {
  //   rejectUnauthorized: true,
  // },
}