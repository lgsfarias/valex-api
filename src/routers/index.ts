import { Router } from 'express';
import cardsRouter from './cards.router.js';
import rechargesRouter from './recharges.router.js';

const router = Router();

router.use('/cards', cardsRouter);
router.use('/recharges', rechargesRouter);

export default router;
