import { RowValues } from 'exceljs';

export type UploadFileT = {
  file?: Express.Multer.File;
  filePath?: string;
  columns: string[];
};

export type UploadFileProcessT = {
  columns: string[];
  rows?: RowValues[] | unknown;
};

export type RowData = {
  [key: string]: unknown;
};
