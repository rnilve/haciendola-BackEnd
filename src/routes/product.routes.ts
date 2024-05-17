
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
import { auth } from '../middlewares/auth.midd';

const router = Router();

router.post('/',auth, errHandler(createProduct));
router.get('/',auth, errHandler(getProducts));
router.post('/',auth, errHandler(createProduct));
router.post('/pagination',auth, errHandler(getProductsLimit));
router.get('/:id',auth, errHandler(getProduct));
router.put('/:id',auth, errHandler(updateproduct));
router.delete('/:id',auth, errHandler(deleteproduct));

export default router;
