import 'dotenv/config';
import { ExecQuery, connection } from '../connection';
import { migrateProducts } from '../scriptsCustom/productsScript';


async function initValidation(execQuery: ExecQuery) {

  await migrateProducts(execQuery);

}



async function migrateScriptsData() {
  console.log('Executing scripts data...\n');
  const { execQuery, end } = await connection();

  await initValidation(execQuery);
  end();
  console.log('\n\x1b[42m All scripts data executed \x1b[0m');
  process.exit(0);
}

migrateScriptsData();
