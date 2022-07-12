import { Request, Response } from 'express';
import { cardsService, rechargesService } from './../services/index.js';
import * as cardUtils from './../utils/cardUtils.js';

const makeRecharge = async (req: Request, res: Response) => {
  const { cardId, amount } = req.body;

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardUtils.verifyIfCardIsActive(card);
  await cardUtils.verifyIfCardIsExpired(card);
  await cardUtils.verifyIfCardIsNotVirtual(card);
  await rechargesService.verifyIfEmployeeWorksForCompany(
    card.employeeId,
    res.locals.company.id,
  );

  await rechargesService.makeRecharge({ cardId, amount });

  res.status(201).json({ message: 'Recharge successful' });
};

export { makeRecharge };
