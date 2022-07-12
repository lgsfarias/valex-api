import { Business } from '../repositories/businessRepository.js';
import AppError from '../utils/errors/AppError.js';

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
