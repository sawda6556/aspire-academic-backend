import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.RAILWAY_POSTGRES_URL;
if (databaseUrl) {
  const masked = databaseUrl.replace(/:([^:@/]+)@/, ':****@');
  console.log(`PROBE: [DataSource] Using masked URL: ${masked}`);
}
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production' && !databaseUrl && !process.env.POSTGRES_HOST) {
  throw new Error('FATAL: No database connection information found in production environment variables.');
}

const useSsl = !!databaseUrl || nodeEnv === 'production';

export default new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? { url: databaseUrl, ssl: useSsl ? { rejectUnauthorized: false } : false }
    : {
        host: process.env.PGHOST || process.env.POSTGRES_HOST,
        port: parseInt(process.env.PGPORT || process.env.POSTGRES_PORT || '5432'),
        username: process.env.PGUSER || process.env.POSTGRES_USER,
        password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD,
        database: process.env.PGDATABASE || process.env.POSTGRES_DB,
        ssl: useSsl ? { rejectUnauthorized: false } : false,
      }),
  entities: [nodeEnv === 'production' ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [nodeEnv === 'production' ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts'],
  synchronize: false,
});
