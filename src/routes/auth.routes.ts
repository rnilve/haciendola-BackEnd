
import { Router } from 'express';
import {
  auchInfo,
  login,
  profile,
  profileToken,
} from '../controllers/auth.controller';
import { auth } from '../middlewares/auth.midd';
import { errHandler } from '../utils/tryCatch';

const router = Router();

router.post('/login', errHandler(login));
router.get('/profile', auth, errHandler(profile));
router.post('/profile/token', errHandler(profileToken));
router.get('/info', auth, errHandler(auchInfo));

export default router;
