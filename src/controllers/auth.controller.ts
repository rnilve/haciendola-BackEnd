

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { EMPTY_STRING } from '../utils/constants';
import { User } from '../models/User';
import { UserT } from '../types/UserT';
import { LoginT } from '../types/AuthT';

const SECRET = process.env.SECRET || EMPTY_STRING;

const timeToExpire = 300;

export const login = async (req: Request, res: Response) => {
  const { nickname, password } = req.body as LoginT;
  if (!nickname || !password) throw 'BE101';

  const user = new User(req.execQuery);
  const data = await user.login({ nickname, password });

  if (!data || !data.id) throw 'BE102';


  const token = await jwt.sign(data, SECRET, {
    expiresIn: timeToExpire,
  });

  return res.resp({
    data: {
      token,
    },
  });
};

export const profile = async (req: Request, res: Response) => {
  return res.resp({
    data: req.user,
  });
};

export const profileToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) throw 'BE101';

  const data = await jwt.verify(token, SECRET);
  return res.resp({
    data,
  });
};

export const auchInfo = async (req: Request, res: Response) => {
  const userLogin = req.user as UserT;
  if (!userLogin.id) return res.resp();

  const user = new User(req.execQuery);
  const data = await user.get(userLogin.id);
  if (!data || !data.id) return res.resp();


  const token = await jwt.sign(data, SECRET, {
    expiresIn: timeToExpire,
  });

  return res.resp({
    data: {
      token,
      profile: data
    },
  });
};
