import AppError from '../utils/errors/AppError.js';
import {
  paymentRepository,
  businessRepository,
} from '../repositories/index.js';

export const verifyIfBusinessExist = async (businessId: number) => {
  const business = await businessRepository.findById(businessId);

  if (!business) {
    throw new AppError('Business not found', 404);
  }

  return business;
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
