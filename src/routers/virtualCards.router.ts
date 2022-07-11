import { Router } from 'express';
import {
  createVirtualCard,
  deleteVirtualCard,
} from '../controllers/virtualCardsController.js';

const virtualCardsRouter = Router();

virtualCardsRouter.post('/', createVirtualCard);
virtualCardsRouter.delete('/', deleteVirtualCard);
// cardsRouter.post('/activate', activateCard);
// cardsRouter.get('/balance', getBalance);
// cardsRouter.post('/lock', blockCard);
// cardsRouter.post('/unlock', unlockCard);

export default virtualCardsRouter;
