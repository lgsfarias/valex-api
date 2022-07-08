import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import * as cardsRepository from '../repositories/cardRepository.js';
import * as companiesRepository from '../repositories/companyRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const isValidApiKey = async (apiKey: string) => {
  const validCompany = await companiesRepository.findByApiKey(apiKey);

  return !!validCompany;
};

const createCard = async (
  employeeId: number,
  type: 'groceries' | 'restaurant' | 'transport' | 'education' | 'health',
) => {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw {
      status: 404,
      message: 'Employee not found',
    };
  }

  const employeeAlreadyHasCard = await cardsRepository.findByTypeAndEmployeeId(
    type,
    employeeId,
  );

  if (employeeAlreadyHasCard) {
    throw {
      status: 400,
      message: 'Employee already has a card',
    };
  }

  const { fullName } = employee;
  const cardholderName = fullName
    .split(' ')
    .filter((name) => name.length > 2)
    .map((word, index, row) => {
      if (index === 0 || index === row.length - 1) {
        return word.toUpperCase();
      }

      return word[0].toUpperCase();
    })
    .join(' ');

  const expirationDate = new Date(
    new Date().getTime() + 5 * 365 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString('pt-br', {
    year: '2-digit',
    month: '2-digit',
  });

  const securityCode = faker.finance.creditCardCVV();
  const encryptedsecurityCode = cryptr.encrypt(securityCode);

  const card = {
    employeeId,
    number: faker.finance.creditCardNumber(),
    cardholderName,
    securityCode: encryptedsecurityCode,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  };

  await cardsRepository.insert(card);
};

const activateCard = async (
  cardId: number,
  cardCvc: string,
  password: string,
) => {
  if (password.length !== 4) {
    throw {
      status: 400,
      message: 'Password must be 4 digits long',
    };
  }

  const card = await cardsRepository.findById(cardId);

  if (!card) {
    throw {
      status: 404,
      message: 'Card not found',
    };
  }

  if (
    card.expirationDate <
    new Date().toLocaleDateString('pt-br', {
      year: '2-digit',
      month: '2-digit',
    })
  ) {
    throw {
      status: 400,
      message: 'Card expired',
    };
  }

  if (card.password) {
    throw {
      status: 400,
      message: 'Card already activated',
    };
  }

  if (cardCvc !== cryptr.decrypt(card.securityCode)) {
    throw {
      status: 400,
      message: 'Invalid security code',
    };
  }

  const encryptedPassword = cryptr.encrypt(password);

  await cardsRepository.update(cardId, { password: encryptedPassword });
};

export { isValidApiKey, createCard, activateCard };
