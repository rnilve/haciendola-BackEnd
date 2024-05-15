/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import bcrypt from 'bcrypt';
import { EMPTY_STRING } from '../../utils/constants';
import { sheetToData } from '../../utils/sheetFiles';
import { ExecQuery } from '../connection';

export async function migrateProducts(execQuery: ExecQuery) {
  console.log('Executing migrateProducts');

  const filePath = path.join(__dirname, '..', 'files', 'productos.xlsx');

  const columns = ['Handle', 'Title', 'Description', 'SKU', 'Grams','Stock','Price','Compare Price','Barcode'];

  const result = await sheetToData({
    filePath,
    columns,
  });
  
  const rows = result.rows as any[];

  if (!rows || !rows.length) {
    console.log('No rows');
    process.exit();
  }

  const columnsDB = [
    {
      name: 'handle',
      key: 'Handle',
    },
    {
      name: 'title',
      key: 'Title',
    },
    {
      name: 'description',
      key: 'Description',
    },
    {
      name: 'sku',
      key: 'SKU',
    },
    {
      name: 'grams',
      key: 'Grams',
    },
    {
      name: 'stock',
      key: 'Stock',
    },
    {
      name: 'price',
      key: 'Price',
    },
    {
      name: 'compare_Price',
      key: 'Compare Price',
    },
    {
      name: 'barcode',
      key: 'Barcode',
    }
  ];

  const fields = columnsDB.map((field) => field.name).join(', ');
  const columnsKeys = columnsDB.map((field) => field.key);

 
  const values = rows.map((row) => {
    const valuesRow = columnsKeys
      .map((key) => {
        const value = row[key] ?? EMPTY_STRING;
        return `'${value}'`;
      })
      .join(', ');

    return `( ${valuesRow} )`;
  });

  const query = `insert into products (${fields}) values ${values.join(
    ', '
  )} returning id`;

  const resultInsert = await execQuery(query);
  const rowsInserted = resultInsert?.rows as any[];

  
}
