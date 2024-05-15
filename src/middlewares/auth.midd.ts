
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { errHandler } from '../utils/tryCatch';
import { EMPTY_STRING } from '../utils/constants';

const SECRET = process.env.SECRET || EMPTY_STRING;

export const auth = errHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw 'BE002';

    const token = authHeader.split(' ')[1];
    if (!token) throw 'BE002';

    jwt.verify(token, SECRET, (err, user) => {
      if (err) throw 'BE002';
      req.user = user;
      next();
    });
  }
);
