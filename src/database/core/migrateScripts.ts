/* eslint-disable no-console */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { ExecQuery, connection } from '../connection';

async function initValidation(execQuery: ExecQuery) {
  const query =
    'create table if not exists scripts (\n' +
    '  id serial primary key not null,\n' +
    '  name varchar(255) not null\n' +
    ');';

  await execQuery(query);
}

export async function scriptLast(execQuery: ExecQuery) {
  const query = 'select name from scripts order by id desc limit 1';
  const result = await execQuery(query);

  return result?.rows[0]?.name as string;
}

export async function scriptAll(execQuery: ExecQuery) {
  const query = 'select name from scripts order by id asc';
  const result = await execQuery(query);

  return result?.rows as { name: string }[];
}

async function createScript(name: string, execQuery: ExecQuery) {
  const query = `insert into scripts (name) values ('${name}')`;
  await execQuery(query);
}

function getScripts() {
  const basePath = path.join(__dirname, '../..');
  const dirPath = path.join(basePath, '/database/scripts');

  const files = fs.readdirSync(dirPath);

  const scripts = files.map((file) => {
    const filePath = path.join(dirPath, file);
    const data = fs.readFileSync(filePath, 'utf8');
    return {
      name: file,
      data,
    };
  });

  return scripts;
}

async function migrateScripts() {
  console.log('Executing scripts...\n');

  const { execQuery, end } = await connection();

  await initValidation(execQuery);
  const scriptsExecuted = await scriptAll(execQuery);

  let scripts = getScripts();
  if (scriptsExecuted.length) {
    scripts = scripts.filter(
      (script) =>
        !scriptsExecuted.find(
          (scriptExecuted) => scriptExecuted.name === script.name
        )
    );
  }

  for (const script of scripts) {
    try {
      const result = await execQuery(script.data);

      if (result) {
        await createScript(script.name, execQuery);
        console.log(`Script: ${script.name}`, '\x1b[32mexecuted\x1b[0m');
      } else {
        throw new Error('Error executing script');
      }
    } catch (error) {
      console.log(`Script: ${script.name} \x1b[31merror\x1b[0m`);
      console.log('\n\x1b[41m Error executing scripts \x1b[0m');
      end();
      process.exit(0);
    }
  }

  end();
  console.log('\n\x1b[42m All scripts executed \x1b[0m');
  process.exit(0);
}

migrateScripts();
