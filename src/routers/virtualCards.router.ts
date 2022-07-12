import { Router } from 'express';
import {
  createVirtualCard,
  deleteVirtualCard,
} from '../controllers/virtualCardsController.js';
import verifySchema from '../middlewares/schemaValidation.js';
import * as schemas from '../schemas/index.js';

const virtualCardsRouter = Router();

virtualCardsRouter.post(
  '/',
  verifySchema(schemas.createVirtualCardSchema),
  createVirtualCard,
);
virtualCardsRouter.delete(
  '/',
  verifySchema(schemas.deleteVirtualCardSchema),
  deleteVirtualCard,
);

export default virtualCardsRouter;
