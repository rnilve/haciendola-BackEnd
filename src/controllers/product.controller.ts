

import { Request, Response } from 'express';
import { Product } from '../models/Products';
import { ProductT } from '../types/ProductT';

export const createProduct = async (req: Request, res: Response) => {
  const product = new Product(req.execQuery);
  if (!validateData(req)) throw 'BE101';
  const result = await product.create(req.body);
  return res.resp({ data: result });
};

export const getProducts = async (req: Request, res: Response) => {
  const product = new Product(req.execQuery);
  const result = await product.all();
  return res.resp({ data: result });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = new Product(req.execQuery);
  if (!validateNumber(req.params.id)) throw 'BE101';
  const result = await product.get(Number(req.params.id));
  return res.resp({ data: result });
};

export const updateproduct = async (req: Request, res: Response) => {
  const product = new Product(req.execQuery);
  const result = await product.update(req.body);
  return res.resp({ data: result });
};

export const deleteproduct = async (req: Request, res: Response) => {
  const product = new Product(req.execQuery);
  if (!validateNumber(req.params.id)) throw 'BE101';
  const result = await product.delete(Number(req.params.id));
  return res.resp({ data: result });
};

function validateNumber(data: string) {
  const number = Number(data);
  return !isNaN(number);
}

function validateData(req: Request) {
  const { title } = req.body as ProductT;

  if (!title) return false;
  return true;
}
