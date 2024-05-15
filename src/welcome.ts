import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.resp({ message: 'Welcome to the API' });
});

export default router;
