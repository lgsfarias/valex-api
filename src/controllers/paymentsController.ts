import { Request, Response } from 'express';
import { cardsService, paymentsService } from './../services/index.js';
import * as cardUtils from './../utils/cardUtils.js';

const makePayment = async (req: Request, res: Response) => {
  const {
    cardId,
    password,
    businessId,
    amount,
  }: {
    cardId: number;
    password: string;
    businessId: number;
    amount: number;
  } = req.body;

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardUtils.verifyIfCardIsNotVirtual(card);
  await cardUtils.verifyIfCardIsActive(card);
  await cardUtils.verifyIfCardIsExpired(card);
  await cardUtils.verifyIfCardIsBloqued(card);
  await cardUtils.verifyPassword(password, card);
  const business = await paymentsService.verifyIfBusinessExist(businessId);
  paymentsService.verifyIfBusinessIsTheSameType(business, card.type);
  const balance = await cardsService.getBalance(cardId);
  await paymentsService.verifyIfCardHasEnoughBalance(balance, amount);
  await paymentsService.makePayment({ cardId, businessId, amount });

  res.status(200).json({
    message: 'Payment made successfully',
  });
};

const makeOnlinePayment = async (req: Request, res: Response) => {
  const {
    cardNumber,
    cardholderName,
    expirationDate,
    securityCode,
    businessId,
    amount,
  }: {
    cardNumber: string;
    cardholderName: string;
    expirationDate: string;
    securityCode: string;
    businessId: number;
    amount: number;
  } = req.body;

  const card = await cardsService.verifyIfCardExistsByDetails(
    cardNumber,
    cardholderName,
    expirationDate,
  );

  await cardUtils.verifyIfCardIsActive(card);
  await cardUtils.verifyIfCardIsExpired(card);
  await cardUtils.verifyIfCardIsBloqued(card);
  await cardUtils.verifySecurityCode(securityCode, card);
  const business = await paymentsService.verifyIfBusinessExist(businessId);
  paymentsService.verifyIfBusinessIsTheSameType(business, card.type);

  const balance = await cardsService.getBalance(
    card.isVirtual ? card.originalCardId : card.id,
  );
  await paymentsService.verifyIfCardHasEnoughBalance(balance, amount);
  await paymentsService.makePayment({
    cardId: card.isVirtual ? card.originalCardId : card.id,
    businessId,
    amount,
  });

  res.status(200).json({
    message: 'Payment made successfully',
  });
};

export { makePayment, makeOnlinePayment };
