import { faker } from '@faker-js/faker';
import AppError from '../utils/errors/AppError.js';
import { Card } from '../repositories/cardRepository.js';
import cryptr from '../config/cryptr.js';

export const generateCardNumber = (flag: string = '') => {
  if (flag) {
    return faker.finance.creditCardNumber(flag);
  }
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

export const verifyIfCardIsActive = async (card: any) => {
  if (!card.password) {
    throw new AppError('Card is not active', 400);
  }
};

export const verifyIfCardIsNotActive = async (card: any) => {
  if (card.password) {
    throw new AppError('Card is active', 400);
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

export const verifyIfCardIsVirtual = async (card: any) => {
  if (!card.isVirtual) {
    throw new AppError('Card is not virtual', 400);
  }
};

export const verifyIfCardIsNotVirtual = async (card: any) => {
  if (card.isVirtual) {
    throw new AppError('Card is virtual', 400);
  }
};

export const verifyPassword = async (password: string, card: Card) => {
  if (cryptr.decrypt(card.password) !== password) {
    throw new AppError('Invalid password', 400);
  }
};

export const verifySecurityCode = async (securityCode: string, card: Card) => {
  if (cryptr.decrypt(card.securityCode) !== securityCode) {
    throw new AppError('Invalid security code', 400);
  }
};
