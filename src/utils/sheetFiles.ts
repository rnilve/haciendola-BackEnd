import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import multer from 'multer';
import { RowData, UploadFileProcessT, UploadFileT } from '../types/UploadFileT';
import { DEFAULT_DATE, FOLDER_UPLOADS, ZERO } from '../utils/constants';

export async function sheetToData(uploadFile: UploadFileT) {
  const { file, filePath, columns } = uploadFile;
  try {
    const page = ZERO;
    const rows = await getSheetValuesExcel({ file, filePath, page, columns });

    const result: UploadFileProcessT = {
      columns,
      rows,
    };

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw 'BE103';
  }
}

export function uploadOnlyFile(fieldName: string) {
  return multer({ dest: FOLDER_UPLOADS }).single(fieldName);
}

export function createPath(file: Express.Multer.File) {
  const basePath = path.join(__dirname, '../..');
  const filePath = path.join(basePath, file.path);
  return filePath;
}

type getSheetValuesExcelT = {
  file?: Express.Multer.File;
  filePath?: string;
  page: number;
  columns: string[];
};

async function getSheetValuesExcel(props: getSheetValuesExcelT) {
  const { file, filePath, page, columns } = props;

  const workbook = new ExcelJS.Workbook();
  await workbookReadFile({ workbook, file, filePath });
  const worksheet = workbook.worksheets[page];

  const rows: ExcelJS.RowValues[] = worksheet.getSheetValues();
  const result = processContentExcel(columns, rows);

  return result;
}

async function workbookReadFile({
  workbook,
  file,
  filePath,
}: {
  workbook: ExcelJS.Workbook;
  file?: Express.Multer.File;
  filePath?: string;
}) {
  if (file) {
    await workbook.xlsx.readFile(createPath(file));
    return;
  }

  if (filePath) {
    await workbook.xlsx.readFile(filePath);
  }
}

function processContentExcel(header: string[], rows: ExcelJS.RowValues[]) {
  const filteredRows = rows.filter(
    (row) =>
      Array.isArray(row) &&
      row.length > ZERO &&
      row !== null &&
      row.length > ZERO
  ); // Remove empty rows

  const headers = getHeaderWithoutNulls(filteredRows); // Remove first row (headers) and save it
  const nullCount = countNullValuesInArray(headers); // Count null values in headers
  let processData: RowData[] = []; // Create response to data process

  // Remove null values in rows
  filteredRows.forEach(
    (row) => Array.isArray(row) && row.splice(ZERO, nullCount)
  );

  // Remove null values in headers
  Array.isArray(headers) &&
    headers.length > ZERO &&
    headers.splice(ZERO, nullCount);

  // Complete rows with null values to match header length
  if (Array.isArray(headers)) {
    filteredRows.forEach((row) => {
      if (Array.isArray(row)) {
        const additionalNullsCount = headers.length - row.length;
        additionalNullsCount > ZERO &&
          row.push(...new Array(additionalNullsCount).fill(null));
      }
    });
  }

  // Create json data with headers without blank values
  if (Array.isArray(headers)) {
    processData = filteredRows.map((row) => {
      if (Array.isArray(row)) {
        return headers.reduce((item, header, i) => {
          if (i < row.length && row[i] !== undefined) {
            item[header as string] = formatValue(row[i]);
          } else {
            item[header as string] = null;
          }

          return item;
        }, {} as { [key: string]: unknown });
      }
      return {};
    });
  }

  // Create final json data with header selected by user
  const newDataProcess = processData.map((item) => {
    const newItem: { [key: string]: unknown } = {};
    header = header.length === ZERO ? (headers as string[]) : header;
    header.forEach((column) => {
      newItem[column] = item[column];
    });
    return newItem;
  });

  return newDataProcess;
}

function formatValue(value: unknown) {
  if (typeof value === 'object' && value instanceof Date) {
    const stringValue = value.toISOString();
    if (stringValue.includes(DEFAULT_DATE)) {
      return parseTime(value);
    } else {
      return parseDate(value);
    }
  }

  return value;
}

function parseDate(dateIn: Date) {
  const date = new Date(dateIn);

  if (!isNaN(date.getTime())) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  return null;
}

function parseTime(dateTimeIn: Date) {
  const dateTime = new Date(dateTimeIn);

  if (!isNaN(dateTime.getTime())) {
    const hours = dateTime.getUTCHours();
    const minutes = dateTime.getUTCMinutes();
    const seconds = dateTime.getUTCSeconds();
    return `${hours}:${minutes}:${seconds}`;
  }

  return null;
}

function countNullValuesInArray(headers: ExcelJS.RowValues): number {
  if (!Array.isArray(headers)) {
    return ZERO;
  }
  const firstNonNullIndex = headers.findIndex(
    (header) => header !== null && header !== undefined
  );
  return Math.max(ZERO, firstNonNullIndex);
}

export function removeFile(file: Express.Multer.File) {
  const path = createPath(file);
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

export function validaSheet(file: Express.Multer.File) {
  const ext = file.originalname.split('.').pop();
  if (ext !== 'xlsx') throw 'BE104';
  return true;
}

function getHeaderWithoutNulls(rows: ExcelJS.RowValues[]) {
  const headerRow = findHeaderRow(rows);
  if (headerRow) {
    const index = rows.indexOf(headerRow);
    if (index !== -1) {
      rows.splice(index, 1);
    }
  }
  return headerRow;
}

function findHeaderRow(rows: ExcelJS.RowValues[]) {
  for (const row of rows) {
    if (Array.isArray(row)) {
      const values = Object.values(row);
      if (!values.some((value) => value === null || value === undefined)) {
        const uniqueValues = [...new Set(values)];
        if (values.length === uniqueValues.length) {
          return row;
        }
      }
    }
  }
  return undefined;
}
