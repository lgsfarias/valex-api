import { Router } from 'express';
import {
  makePayment,
  makeOnlinePayment,
} from '../controllers/paymentsController.js';

const paymentsRouter = Router();

paymentsRouter.post('/', makePayment);
paymentsRouter.post('/online', makeOnlinePayment);

export default paymentsRouter;
