import { Request, Response } from 'express';
import { cardsService } from '../services/index.js';
import * as cardUtils from './../utils/cardUtils.js';

const createVirtualCard = async (req: Request, res: Response) => {
  const { originalCardId, password } = req.body;

  const originalCard = await cardsService.verifyIfCardExists(originalCardId);
  await cardUtils.verifyIfCardIsActive(originalCard);
  await cardUtils.verifyIfCardIsExpired(originalCard);
  await cardUtils.verifyIfCardIsBloqued(originalCard);
  await cardUtils.verifyPassword(password, originalCard);

  const cardNumber = cardUtils.generateCardNumber('mastercard');
  const expirationDate = cardUtils.generateExpirationDate();
  const [securityCode, encryptedsecurityCode] =
    cardUtils.generateSecurityCode();

  const card = {
    employeeId: originalCard.employeeId,
    number: cardNumber,
    password: originalCard.password,
    cardholderName: originalCard.cardholderName,
    securityCode: encryptedsecurityCode,
    expirationDate,
    isVirtual: true,
    isBlocked: false,
    type: originalCard.type,
    originalCardId,
  };

  await cardsService.createCard(card);

  console.log({ securityCode });
  res.status(201).send('Card created successfully');
};

const deleteVirtualCard = async (req: Request, res: Response) => {
  const { cardId, password } = req.body;

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardUtils.verifyIfCardIsVirtual(card);
  await cardUtils.verifyPassword(password, card);

  await cardsService.deleteCard(cardId);

  res.status(200).send('Card deleted successfully');
};

export { createVirtualCard, deleteVirtualCard };
