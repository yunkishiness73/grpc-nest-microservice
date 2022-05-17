import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'micro_auth',
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: false, //never true in production
  logging: true,
  // ssl: {
  //   rejectUnauthorized: true,
  // },
}