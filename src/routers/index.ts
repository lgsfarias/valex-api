import { Router } from 'express';
import cardsRouter from './cards.router.js';
import rechargesRouter from './recharges.router.js';
import paymentsRouter from './payments.router.js';
import virtualCardsRouter from './virtualCards.router.js';

const router = Router();

router.use('/cards/virtual', virtualCardsRouter);
router.use('/cards', cardsRouter);
router.use('/recharges', rechargesRouter);
router.use('/payments', paymentsRouter);

export default router;
