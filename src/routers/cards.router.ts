import { Router, Request, Response } from 'express';
import { createCard } from '../controllers/cardsController.js';
import verifyApiKey from '../middlewares/verifyApiKey.js';

const cardsRouter = Router();

cardsRouter.post('/', verifyApiKey, createCard);

export default cardsRouter;
