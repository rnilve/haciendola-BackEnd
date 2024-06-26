import { ExecQuery } from "../database/connection";
import { PaginationT, ProductPaginationT, ProductT } from "../types/ProductT";
import { mapQuery } from "../utils/mapQuery";


export class Product {
  private execQuery: ExecQuery;

  constructor(execQuery: ExecQuery) {
    this.execQuery = execQuery;
  }

  async create(data: ProductT) {
    const query = mapQuery(
      'insert into products ({fields}) values ({values}) returning *',
      data
    );

    const result = await this.execQuery(query);
    const row = result?.rows[0] as ProductT;
    return row;
  }

  async all() {
    const query = 'select * from products order by id asc';
    const result = await this.execQuery(query);
    const rows = result?.rows as ProductT[];
    return rows;
  }

  async get(id: number) {
    const query = `select * from products where id = ${id}`;
    const result = await this.execQuery(query);
    const row = result?.rows[0] as ProductT;
    return row;
  }

  async update(data: ProductT) {
    const query = mapQuery(
      `update products set {fields} where id = ${data.id}`,
      data
    );
    const result = await this.execQuery(query);
    const rowCount = result?.rowCount;
    return { id: data.id, rowCount } as ProductT;
  }

  async delete(id: number) {
    const query = `delete from products where id = ${id}`;
    const result = await this.execQuery(query);
    const rowCount = result?.rowCount;
    return { rowCount } as ProductT;
  }



  async getproductsforGroup(group_id: number) {
    const query = `select * from products where group_id = ${group_id}`;
    const result = await this.execQuery(query);
    const rows = result?.rows as ProductT[];
    return rows;
  }

  async allProductsPagination(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;
    const query = `SELECT * FROM products ORDER BY id desc LIMIT ${pageSize} OFFSET ${offset}`;
    const result = await this.execQuery(query);
    const rows = result?.rows as ProductT[];
    const countQuery = 'SELECT COUNT(*) FROM products';
    const countResult = await this.execQuery(countQuery);
    const totalCount = parseInt(countResult?.rows[0].count, 10);
    const pagination: PaginationT = {
      currentPage: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
  }

    const resultProducts : ProductPaginationT ={
      products:rows,
      pagination:pagination
    } 

    return resultProducts;
}
}
