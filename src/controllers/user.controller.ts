

import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserT } from '../types/UserT';
import { EMPTY_STRING } from '../utils/constants';

export const createUser = async (req: Request, res: Response) => {
  const user = new User(req.execQuery);
  if (!validateData(req)) throw 'BE101';
  const result = await user.create(req.body);
  return res.resp({ data: result });
};

export const byNickname = async (req: Request, res: Response) => {
    const user = new User(req.execQuery);
    const result = await user.byNickname(req.body.nickname);
    if(!result){
        throw 'BE106'
    }
    result.password = EMPTY_STRING;
    result.security_question = EMPTY_STRING;
    return res.resp({ data: result });
  };


  export const compareQuestion = async (req: Request, res: Response) => {
    const user = new User(req.execQuery);
    console.log(req.body)
    const {question,id_user} = req.body;
    const result = await user.compareQuestion(id_user);
    if((result.security_question?.toLocaleUpperCase() != question.toLocaleUpperCase())){
        throw 'BE105'
    }
    return res.resp({ data: result });
  };

  export const recoveryPassword = async (req: Request, res: Response) => {
    const user = new User(req.execQuery);
    const result = await user.updatePassword(req.body);
    return res.resp({ data: result });
  };



function validateData(req: Request) {
    const { name,last_name,nickname,password,security_question } = req.body as UserT;
    if (!name || !last_name || !nickname || ! password || !security_question) return false;
    return true;
  }