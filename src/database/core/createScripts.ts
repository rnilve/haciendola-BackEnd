import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const createFile = (name: string, content: string) => {
  const basePath = path.join(__dirname, '../..');
  const dirPath = path.join(basePath, '/database/scripts');

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  fs.writeFile(`${dirPath}/${name}`, content, (err) => {
    if (err) {
      console.log(`Error creating ${name} file: ${err}`);
    }
  });
};

const nameScript = (name: string) => {
  const date = new Date();
  const year = date.getFullYear();
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());

  const time = date
    .toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
    .replace(/:/g, '');

  if (parseInt(month) < 10) month = `0${month}`;
  if (parseInt(day) < 10) day = `0${day}`;

  return `${year}_${month}_${day}_${time}_${name}.sql`;
};

const createScripts = async () => {
  const arg = process.argv[2];
  const name = (arg && arg.trim()) || 'script';
  const nameFile = nameScript(name);
  const content =
    'create table if not exists <table_name> (\n' +
    '  id serial primary key not null,\n' +
    '  name varchar(255) not null\n' +
    ');';

  createFile(nameFile, content);
  console.log(`\x1b[32mScript ${nameFile} created\x1b[0m`);
};

createScripts();
