import AppError from '../utils/errors/AppError.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';

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

export const verifyIfEmployeeWorksForCompany = async (
  employeeId: number,
  companyId: number,
) => {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  if (employee.companyId !== companyId) {
    throw new AppError('Employee does not work for this company', 400);
  }
};

export const makeRecharge = async ({
  cardId,
  amount,
}: {
  cardId: number;
  amount: number;
}) => {
  await rechargeRepository.insert({
    cardId,
    amount,
  });
};
