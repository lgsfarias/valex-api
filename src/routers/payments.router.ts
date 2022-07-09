import { Router } from 'express';
import { makePayment } from '../controllers/paymentsController.js';

const paymentsRouter = Router();

paymentsRouter.post('/', makePayment);

export default paymentsRouter;
