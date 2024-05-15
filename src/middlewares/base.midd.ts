
import { NextFunction, Request, Response } from 'express';
import { connection } from '../database/connection';

const base = async (req: Request, res: Response, next: NextFunction) => {
  const { execQuery, end } = await connection();
  req.execQuery = execQuery;
  req.end = end;
  res.resp = (json = {}) => {
    const { code, message, data } = json;
    end();
    return res.json({
      code: code || 'BE000',
      message: message || 'Success',
      data,
    });
  };
  next();
};

export default base;
