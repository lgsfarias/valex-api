import { Request, Response } from 'express';
import { cardsService } from '../services/index.js';

const createCard = async (req: Request, res: Response) => {
  const { employeeId, type } = req.body;

  const employee = await cardsService.getEmployeeById(employeeId);
  await cardsService.verifyIfEmployeeHasCard(employeeId, type);
  const cardNumber = cardsService.generateCardNumber();
  const cardholderName = cardsService.generateCardHolderName(employee);
  const expirationDate = cardsService.generateExpirationDate();
  const [securityCode, encryptedsecurityCode] =
    cardsService.generateSecurityCode();

  const card = {
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode: encryptedsecurityCode,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  };

  await cardsService.createCard(card);

  console.log({ securityCode });
  res.status(201).send('Card created successfully');
};

const activateCard = async (req: Request, res: Response) => {
  const { cardId, cardCvv, password } = req.body;

  await cardsService.activateCard(cardId, cardCvv, password);

  res.status(200).send('Card activated successfully');
};

const getBalance = async (req: Request, res: Response) => {
  const { cardId } = req.body;

  await cardsService.verifyIfCardExists(cardId);
  const balance = await cardsService.getBalance(cardId);
  const transactions = await cardsService.getTransactions(cardId);
  const recharges = await cardsService.getRecharges(cardId);

  res.status(200).json({
    balance,
    transactions,
    recharges,
  });
};

const blockCard = async (req: Request, res: Response) => {
  const { cardId, password } = req.body;

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardsService.verifyIfCardIsActive(card);
  await cardsService.verifyIfCardIsExpired(card);
  await cardsService.verifyIfCardIsBloqued(card);
  await cardsService.verifyPassword(password, cardId);

  await cardsService.blockCard(cardId);

  res.status(200).send('Card blocked successfully');
};

const unlockCard = async (req: Request, res: Response) => {
  const { cardId, password } = req.body;

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardsService.verifyIfCardIsActive(card);
  await cardsService.verifyIfCardIsExpired(card);
  await cardsService.verifyIfCardIsUnlocked(card);
  await cardsService.verifyPassword(password, cardId);

  await cardsService.unlockCard(cardId);

  res.status(200).send('Card unlocked successfully');
};

export { createCard, activateCard, getBalance, blockCard, unlockCard };
