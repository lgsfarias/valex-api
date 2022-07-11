import { Request, Response } from 'express';
import AppError from '../utils/errors/AppError.js';
import { cardsService, paymentsService } from './../services/index.js';

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

  if (!cardId || !password || !businessId || !amount) {
    console.log(req.body);
    throw new AppError('Missing parameters', 400);
  }

  if (amount < 0) {
    throw new AppError('Invalid amount', 400);
  }

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardsService.verifyIfCardIsNotVirtual(card);
  await cardsService.verifyIfCardIsActive(card);
  await cardsService.verifyIfCardIsExpired(card);
  await cardsService.verifyIfCardIsBloqued(card);
  await cardsService.verifyPassword(password, cardId);
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

  const parameters = [
    'cardNumber',
    'cardholderName',
    'expirationDate',
    'securityCode',
    'businessId',
    'amount',
  ];
  for (const key of parameters) {
    if (!req.body[key]) {
      throw new AppError(`Missing ${key}`, 400);
    }
  }

  if (amount < 0) {
    throw new AppError('Invalid amount', 400);
  }

  const card = await cardsService.verifyIfCardExistsByDetails(
    cardNumber,
    cardholderName,
    expirationDate,
  );

  await cardsService.verifyIfCardIsActive(card);
  await cardsService.verifyIfCardIsExpired(card);
  await cardsService.verifyIfCardIsBloqued(card);
  await cardsService.verifySecurityCode(securityCode, card);
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
