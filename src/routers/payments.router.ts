import { Router } from 'express';
import {
  makePayment,
  makeOnlinePayment,
} from '../controllers/paymentsController.js';
import verifySchema from '../middlewares/schemaValidation.js';
import * as schemas from '../schemas/index.js';

const paymentsRouter = Router();

paymentsRouter.post('/', verifySchema(schemas.makePaymentSchema), makePayment);
paymentsRouter.post(
  '/online',
  verifySchema(schemas.makeOnlinePaymentSchema),
  makeOnlinePayment,
);

export default paymentsRouter;
