import { Router } from 'express';
import { makeRecharge } from '../controllers/rechargesController.js';
import verifyApiKey from '../middlewares/verifyApiKey.js';
import verifySchema from '../middlewares/schemaValidation.js';
import * as schemas from '../schemas/index.js';

const rechargesRouter = Router();

rechargesRouter.post(
  '/',
  verifySchema(schemas.makeRechargeSchema),
  verifyApiKey,
  makeRecharge,
);

export default rechargesRouter;
