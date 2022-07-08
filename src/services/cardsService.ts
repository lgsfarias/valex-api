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
    isBlocked: true,
    type,
  };

  await cardsRepository.insert(card);
};

export { isValidApiKey, createCard };
