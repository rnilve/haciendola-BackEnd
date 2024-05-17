
import bcrypt from 'bcrypt';
import { SECRET_PASSWORD } from '../config';
import { ExecQuery } from '../database/connection';
import { mapQuery } from '../utils/mapQuery';
import { EMPTY_STRING } from '../utils/constants';
import { UserT } from '../types/UserT';

export class User {
  private execQuery: ExecQuery;

  constructor(execQuery: ExecQuery) {
    this.execQuery = execQuery;
  }

  async create(data: UserT) {
    data.password = await bcrypt.hash(data.password, SECRET_PASSWORD);
    const query = mapQuery(
      'insert into users ({fields}) values ({values}) returning *',
      data
    );

    const result = await this.execQuery(query);
    const row = result?.rows[0] as UserT;
    row.password = EMPTY_STRING;
    return row;
  }

  async all() {
    const query = 'select * from users order by id asc';
    const result = await this.execQuery(query);
    const rows = result?.rows.map((row) => {
      row.password = EMPTY_STRING;
      return row;
    }) as UserT[];
    return rows;
  }

  async get(id: number) {
    const query = `select * from users where id = ${id}`;
    const result = await this.execQuery(query);
    const row = result?.rows[0] as UserT;
    row.password = EMPTY_STRING;
    return row;
  }




  async update(data: UserT) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SECRET_PASSWORD);
    }

    const query = mapQuery(
      `update users set {fields} where id = ${data.id}`,
      data
    );
    const result = await this.execQuery(query);
    const rowCount = result?.rowCount;
    return { id: data.id, rowCount } as UserT;
  }

  
  async updatePassword(data: UserT) {
    console.log(data)
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SECRET_PASSWORD);
    }

    const query = mapQuery(
      `update users set password ='${data.password}' where id = ${data.id}`,
      data
    );
    const result = await this.execQuery(query);
    const rowCount = result?.rowCount;
    return { id: data.id, rowCount } as UserT;
  }

  async compareQuestion(id_user:number) {
    const query = `select * from users where id = ${id_user} `;
    console.log(query)
    const result = await this.execQuery(query);
    return result?.rows[0] as UserT;
  }






  async delete(id: number) {
    const query = `delete from users where id = ${id}`;
    const result = await this.execQuery(query);
    const rowCount = result?.rowCount;
    return { id, rowCount } as UserT;
  }

  async byEmail(email: string) {
    const query = `select email from users where email = '${email}'`;
    const result = await this.execQuery(query);
    const row = result?.rows[0] as UserT;
    return row;
  }

  async byIdentification(identificacion: string) {
    const query = `select ci from users where ci = '${identificacion}'`;
    const result = await this.execQuery(query);
    const row = result?.rows[0] as UserT;
    return row;
  }

  async byEmailLogin(email: string) {
    const query = `select * from users where email = '${email}'`;
    const result = await this.execQuery(query);
    return result?.rows[0] as UserT;
  }

  async byNickname(nickname: string) {
    const query = `select * from users where nickname = '${nickname}'`;
    const result = await this.execQuery(query);
    return result?.rows[0] as UserT;
  }


  async login(data: Pick<UserT, 'nickname' | 'password'>) {
    const userData = await this.byNickname(data.nickname);
    if (!userData) throw 'BE102';

    const isMatch = await this.comparePassword(
      data.password,
      userData.password
    );
    if (!isMatch) throw 'BE102';
    if (!userData.status) throw 'BE003';

    userData.password = EMPTY_STRING;

    return userData;
  }

  async comparePassword(password: string, hash: string) {
    return (await bcrypt.compare(password, hash)) as boolean;
  }

  static async encodePassword(password: string) {
    return bcrypt.hash(password, SECRET_PASSWORD);
  }

  async saveImage(data: Pick<UserT, 'id' | 'image_url' | 'thumbnail_url'>) {
    const query = `update users set image_url = '${data.image_url}', thumbnail_url = '${data.thumbnail_url}' where id = ${data.id}`;
    const result = await this.execQuery(query);
    const rowCount = result?.rowCount;
    return { id: data.id, rowCount } as UserT;
  }
}
