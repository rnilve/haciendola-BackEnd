
import { UserT } from './UserT';

export type LoginT = {
  nickname: string;
  password: string;
  remember?: boolean;
};

export type RespLoginT = {
  token: string;
};
