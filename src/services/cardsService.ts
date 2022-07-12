import { faker } from '@faker-js/faker';
import AppError from '../utils/errors/AppError.js';
import { Card } from '../repositories/cardRepository.js';
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

export const verifyIfCardExists = async (cardId: number) => {
  const card = await cardRepository.findById(cardId);

  if (!card) {
    throw new AppError('Card not found', 404);
  }

  return card;
};

export const verifyIfCardExistsByDetails = async (
  number: string,
  cardholderName: string,
  expirationDate: string,
) => {
  const card = await cardRepository.findByCardDetails(
    number,
    cardholderName,
    expirationDate,
  );

  if (!card) {
    throw new AppError('Card not found', 404);
  }

  return card;
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

export const createVirtualCard = async (card: Card) => {
  await cardRepository.insert(card);
};

export const activateCard = async (cardId: number, password: string) => {
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

export const blockCard = async (cardId: number) => {
  await cardRepository.update(cardId, { isBlocked: true });
};

export const unlockCard = async (cardId: number) => {
  await cardRepository.update(cardId, { isBlocked: false });
};

export const deleteCard = async (cardId: number) => {
  await cardRepository.remove(cardId);
};
