import { Pool } from 'pg';

const ENV = process.env;

const poolConnection = new Pool({
  host: ENV.DB_HOST,
  port: Number(ENV.DB_PORT),
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  ssl: ENV.DB_SSL ? JSON.parse(ENV.DB_SSL) : undefined,
});

export default poolConnection;
