import { Router } from 'express';
import {
  createCard,
  activateCard,
  getBalance,
  blockCard,
  unlockCard,
} from '../controllers/cardsController.js';
import verifyApiKey from '../middlewares/verifyApiKey.js';
import verifySchema from '../middlewares/schemaValidation.js';
import * as schemas from '../schemas/index.js';

const cardsRouter = Router();

cardsRouter.post(
  '/',
  verifySchema(schemas.createCardSchema),
  verifyApiKey,
  createCard,
);
cardsRouter.post(
  '/activate',
  verifySchema(schemas.activateCardSchema),
  activateCard,
);
cardsRouter.get('/balance/:cardId', getBalance);
cardsRouter.post('/lock', verifySchema(schemas.blockCardSchema), blockCard);
cardsRouter.post('/unlock', verifySchema(schemas.unlockCardSchema), unlockCard);

export default cardsRouter;
