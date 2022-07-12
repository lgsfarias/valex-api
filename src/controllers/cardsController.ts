import { Request, Response } from 'express';
import { cardsService } from '../services/index.js';
import * as cardUtils from './../utils/cardUtils.js';

const createCard = async (req: Request, res: Response) => {
  const { employeeId, type } = req.body;

  const employee = await cardsService.getEmployeeById(employeeId);
  await cardsService.verifyIfEmployeeHasCard(employeeId, type);
  const cardNumber = cardUtils.generateCardNumber();
  const cardholderName = cardUtils.generateCardHolderName(employee);
  const expirationDate = cardUtils.generateExpirationDate();
  const [securityCode, encryptedsecurityCode] =
    cardUtils.generateSecurityCode();

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

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardUtils.verifyIfCardIsNotActive(card);
  await cardUtils.verifyIfCardIsExpired(card);
  await cardUtils.verifySecurityCode(cardCvv, card);

  await cardsService.activateCard(cardId, password);

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
  await cardUtils.verifyIfCardIsActive(card);
  await cardUtils.verifyIfCardIsExpired(card);
  await cardUtils.verifyIfCardIsBloqued(card);
  await cardUtils.verifyPassword(password, card);

  await cardsService.blockCard(cardId);

  res.status(200).send('Card blocked successfully');
};

const unlockCard = async (req: Request, res: Response) => {
  const { cardId, password } = req.body;

  const card = await cardsService.verifyIfCardExists(cardId);
  await cardUtils.verifyIfCardIsActive(card);
  await cardUtils.verifyIfCardIsExpired(card);
  await cardUtils.verifyIfCardIsUnlocked(card);
  await cardUtils.verifyPassword(password, card);

  await cardsService.unlockCard(cardId);

  res.status(200).send('Card unlocked successfully');
};

export { createCard, activateCard, getBalance, blockCard, unlockCard };
