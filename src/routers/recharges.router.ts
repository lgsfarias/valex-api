import { Router } from 'express';
import { makeRecharge } from '../controllers/rechargesController.js';
import verifyApiKey from '../middlewares/verifyApiKey.js';

const rechargesRouter = Router();

rechargesRouter.post('/', verifyApiKey, makeRecharge);

export default rechargesRouter;
