import { Business } from '../repositories/businessRepository.js';
import { Card } from '../repositories/cardRepository.js';
import cryptr from '../config/cryptr.js';
import AppError from '../utils/errors/AppError.js';
import * as cardsRepository from '../repositories/cardRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';

export const verifyPassword = async (password: string, cardId: number) => {
  const card = await cardsRepository.findById(cardId);

  if (cryptr.decrypt(card.password) !== password) {
    throw new AppError('Invalid password', 400);
  }
};

export const verifyIfBusinessExist = async (businessId: number) => {
  const business = await businessRepository.findById(businessId);

  if (!business) {
    throw new AppError('Business not found', 404);
  }

  return business;
};

export const verifyIfBusinessIsTheSameType = (
  business: Business,
  type: 'groceries' | 'restaurant' | 'transport' | 'education' | 'health',
) => {
  if (business.type !== type) {
    throw new AppError('Business type is not the same of card', 400);
  }
};

export const verifyIfCardHasEnoughBalance = async (
  balance: number,
  amount: number,
) => {
  if (balance < amount) {
    throw new AppError('Insufficient balance', 400);
  }
};

export const makePayment = async ({
  cardId,
  businessId,
  amount,
}: {
  cardId: number;
  businessId: number;
  amount: number;
}) => {
  await paymentRepository.insert({ cardId, businessId, amount });
};
