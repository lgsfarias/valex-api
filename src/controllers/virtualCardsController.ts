import { Request, Response } from 'express';
import { cardsService } from '../services/index.js';

const createVirtualCard = async (req: Request, res: Response) => {
  const { originalCardId, password } = req.body;

  const originalCard = await cardsService.verifyIfCardExists(originalCardId);
  await cardsService.verifyIfCardIsActive(originalCard);
  await cardsService.verifyIfCardIsExpired(originalCard);
  await cardsService.verifyIfCardIsBloqued(originalCard);
  await cardsService.verifyPassword(password, originalCardId);

  const cardNumber = cardsService.generateCardNumber('mastercard');
  const expirationDate = cardsService.generateExpirationDate();
  const [securityCode, encryptedsecurityCode] =
    cardsService.generateSecurityCode();

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
  await cardsService.verifyIfCardIsVirtual(card);
  await cardsService.verifyPassword(password, cardId);

  await cardsService.deleteCard(cardId);

  res.status(200).send('Card deleted successfully');
};

export { createVirtualCard, deleteVirtualCard };
