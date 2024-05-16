
import { Router } from 'express';
import {
  createProduct,
  getProduct,
  getProducts,
  updateproduct,
  deleteproduct,
  getProductsLimit
} from '../controllers/product.controller';
import { errHandler } from '../utils/tryCatch';

const router = Router();

router.post('/', errHandler(createProduct));
router.get('/', errHandler(getProducts));
router.post('/', errHandler(createProduct));
router.post('/pagination', errHandler(getProductsLimit));
router.get('/:id', errHandler(getProduct));
router.put('/:id', errHandler(updateproduct));
router.delete('/:id', errHandler(deleteproduct));

export default router;
