import { Router, Request, Response } from 'express';
import { createCard, activateCard } from '../controllers/cardsController.js';
import verifyApiKey from '../middlewares/verifyApiKey.js';

const cardsRouter = Router();

cardsRouter.post('/', verifyApiKey, createCard);
cardsRouter.post('/activate', activateCard);

export default cardsRouter;
