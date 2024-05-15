/* eslint-disable no-console */
import { Pool, PoolClient, QueryResult } from 'pg';
import poolConnection from './pool';

export type ExecQuery = (query: string) => Promise<QueryResult | undefined>;
export type ResultQuery = QueryResult;

type ConnectionT = {
  execQuery: ExecQuery;
  end: () => void;
};

export async function connection(): Promise<ConnectionT> {
  let pool: Pool;
  let client: PoolClient;

  const releaseClient = () => {
    client.release();
    console.log('Cliente liberado automáticamente');
  };

  const timeoutRelease = setTimeout(() => {
    releaseClient();
  }, 10000);

  async function init() {
    try {
      pool = poolConnection;
      client = await pool.connect();
      clearTimeout(timeoutRelease);
    } catch (err) {
      console.log(`Error connecting to database: ${err}`);
      clearTimeout(timeoutRelease);
      releaseClient();
      throw 'BE010';
    }
  }

  await init();

  async function execQuery(query: string) {
    try {
      const result = await client.query(query);
      return result;
    } catch (err) {
      console.log(`Error executing query: ${err}`);
      throw 'BE010';
    }
  }

  function end() {
    if (client) {
      client.release();
    }
    clearTimeout(timeoutRelease);
  }

  return {
    execQuery,
    end,
  };
}
