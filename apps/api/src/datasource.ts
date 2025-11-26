import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';

config();

const env = new ConfigService()
const dirname = `${process.cwd()}/src`

export default new DataSource({
  url: env.get("DATABASE_URL"),
  type: "postgres",
  entities: ['**/*.entity{.ts,.js}'],
  migrations: [join(dirname, 'migrations', '*{.ts,.js}')],
  migrationsTableName: "migrations",
  migrationsRun: false,
  extra: {
    connectionLimit: 10,
  }
})
