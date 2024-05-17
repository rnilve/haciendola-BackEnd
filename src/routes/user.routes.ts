
import { Router } from 'express';
import {
  createUser,
  byNickname,
  recoveryPassword,
  compareQuestion

} from '../controllers/user.controller';
import { errHandler } from '../utils/tryCatch';

const router = Router();

router.post('/', errHandler(createUser));
router.post('/nickname', errHandler(byNickname));
router.post('/update-password', errHandler(recoveryPassword));
router.post('/compare-question', errHandler(compareQuestion));


export default router;
