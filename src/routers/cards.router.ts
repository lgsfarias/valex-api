import { Router } from 'express';
import {
  createCard,
  activateCard,
  getBalance,
  blockCard,
  unlockCard,
} from '../controllers/cardsController.js';
import verifyApiKey from '../middlewares/verifyApiKey.js';

const cardsRouter = Router();

cardsRouter.post('/', verifyApiKey, createCard);
cardsRouter.post('/activate', activateCard);
cardsRouter.get('/balance', getBalance);
cardsRouter.post('/lock', blockCard);
cardsRouter.post('/unlock', unlockCard);

export default cardsRouter;
