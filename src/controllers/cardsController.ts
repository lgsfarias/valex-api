import { Request, Response } from 'express';
import * as cardServices from '../services/cardsService.js';

const createCard = async (req: Request, res: Response) => {
  const { employeeId, type } = req.body;

  const employee = await cardServices.getEmployeeById(employeeId);
  await cardServices.verifyIfEmployeeHasCard(employeeId, type);
  const cardNumber = cardServices.generateCardNumber();
  const cardholderName = cardServices.generateCardHolderName(employee);
  const expirationDate = cardServices.generateExpirationDate();
  const [, encryptedsecurityCode] = cardServices.generateSecurityCode();

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

  await cardServices.createCard(card);

  res.status(201).send('Card created successfully');
};

const activateCard = async (req: Request, res: Response) => {
  const { cardId, cardCvc, password } = req.body;

  await cardServices.activateCard(cardId, cardCvc, password);

  res.status(200).send('Card activated successfully');
};

export { createCard, activateCard };
