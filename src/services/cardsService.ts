import { faker } from '@faker-js/faker';
import AppError from '../utils/errors/AppError.js';
import {
  cardRepository,
  employeeRepository,
  rechargeRepository,
  paymentRepository,
} from '../repositories/index.js';
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
  const employeeAlreadyHasCard = await cardRepository.findByTypeAndEmployeeId(
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
  await cardRepository.insert(card);
};

export const activateCard = async (
  cardId: number,
  cardCvc: string,
  password: string,
) => {
  if (password.length !== 4) {
    throw new AppError('Password must be 4 digits long', 400);
  }

  const card = await cardRepository.findById(cardId);

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

  await cardRepository.update(cardId, { password: encryptedPassword });
};

export const getBalance = async (cardId: number) => {
  const totalRecharges = await rechargeRepository.getTotalAmountByCardId(
    cardId,
  );
  const totalPayments = await paymentRepository.getTotalAmountByCardId(cardId);

  const balance = totalRecharges - totalPayments;

  return balance;
};

export const getTransactions = async (cardId: number) => {
  const transactions = await paymentRepository.findByCardId(cardId);

  return transactions;
};

export const getRecharges = async (cardId: number) => {
  const recharges = await rechargeRepository.findByCardId(cardId);

  return recharges;
};

export const verifyIfCardExists = async (cardId: number) => {
  const card = await cardRepository.findById(cardId);

  if (!card) {
    throw new AppError('Card not found', 404);
  }

  return card;
};

export const verifyIfCardIsActive = async (card: any) => {
  if (!card.password) {
    throw new AppError('Card is not active', 400);
  }
};

export const verifyIfCardIsExpired = async (card: any) => {
  const expirationMonth = parseInt(card.expirationDate.split('/')[0]);
  const expirationYear = parseInt(card.expirationDate.split('/')[1]) + 2000;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (expirationYear < currentYear) {
    throw new AppError('Card is expired', 400);
  }
  if (expirationYear === currentYear && expirationMonth < currentMonth) {
    throw new AppError('Card is expired', 400);
  }
};

export const verifyIfCardIsBloqued = async (card: any) => {
  if (card.isBlocked) {
    throw new AppError('Card is blocked', 400);
  }
};

export const verifyIfCardIsUnlocked = async (card: any) => {
  if (!card.isBlocked) {
    throw new AppError('Card is not blocked', 400);
  }
};

export const verifyPassword = async (password: string, cardId: number) => {
  const card = await cardRepository.findById(cardId);

  if (cryptr.decrypt(card.password) !== password) {
    throw new AppError('Invalid password', 400);
  }
};

export const blockCard = async (cardId: number) => {
  await cardRepository.update(cardId, { isBlocked: true });
};

export const unlockCard = async (cardId: number) => {
  await cardRepository.update(cardId, { isBlocked: false });
};
