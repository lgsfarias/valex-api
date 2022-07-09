import { faker } from '@faker-js/faker';
import AppError from '../utils/errors/AppError.js';
import * as cardsRepository from '../repositories/cardRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import cryptr from '../config/cryptr.js';

export const getEmployeeById = async (employeeId: number) => {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  return employee;
};

export const verifyIfEmployeeHasCard = async (
  employeeId: number,
  type: 'groceries' | 'restaurant' | 'transport' | 'education' | 'health',
) => {
  const employeeAlreadyHasCard = await cardsRepository.findByTypeAndEmployeeId(
    type,
    employeeId,
  );

  if (employeeAlreadyHasCard) {
    throw new AppError('Employee already has card', 400);
  }
};

export const generateCardNumber = () => {
  return faker.finance.creditCardNumber();
};

export const generateCardHolderName = (employee: any) => {
  const { fullName } = employee;
  const cardholderName = fullName
    .split(' ')
    .filter((name: string) => name.length > 2)
    .map((word: string, index: number, row: string[]) => {
      if (index === 0 || index === row.length - 1) {
        return word.toUpperCase();
      }

      return word[0].toUpperCase();
    })
    .join(' ');

  return cardholderName;
};

export const generateExpirationDate = () => {
  const expirationDate = new Date(
    new Date().getTime() + 5 * 365 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString('pt-br', {
    year: '2-digit',
    month: '2-digit',
  });

  return expirationDate;
};

export const generateSecurityCode = () => {
  const securityCode = faker.finance.creditCardCVV();
  const encryptedsecurityCode = cryptr.encrypt(securityCode);

  return [securityCode, encryptedsecurityCode];
};

export const createCard = async (card: {
  employeeId: number;
  number: string;
  cardholderName: string;
  securityCode: string;
  expirationDate: string;
  isVirtual: boolean;
  isBlocked: boolean;
  type: 'groceries' | 'restaurant' | 'transport' | 'education' | 'health';
}) => {
  await cardsRepository.insert(card);
};

export const activateCard = async (
  cardId: number,
  cardCvc: string,
  password: string,
) => {
  if (password.length !== 4) {
    throw new AppError('Password must be 4 digits long', 400);
  }

  const card = await cardsRepository.findById(cardId);

  if (!card) {
    throw new AppError('Card not found', 404);
  }

  if (
    card.expirationDate <
    new Date().toLocaleDateString('pt-br', {
      year: '2-digit',
      month: '2-digit',
    })
  ) {
    throw new AppError('Card expired', 400);
  }

  if (card.password) {
    throw new AppError('Card already activated', 400);
  }

  if (cardCvc !== cryptr.decrypt(card.securityCode)) {
    throw new AppError('Invalid security code', 400);
  }

  const encryptedPassword = cryptr.encrypt(password);

  await cardsRepository.update(cardId, { password: encryptedPassword });
};

export const getBalance = async (cardId: number) => {
  const totalRecharges = await rechargeRepository.getTotalAmountByCardId(
    cardId,
  );
  const totalPayments = await paymentRepository.getTotalAmountByCardId(cardId);

  const balance = totalRecharges - totalPayments;

  return balance;
};
