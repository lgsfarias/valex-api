import AppError from '../utils/errors/AppError.js';
import {
  employeeRepository,
  rechargeRepository,
} from './../repositories/index.js';

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
