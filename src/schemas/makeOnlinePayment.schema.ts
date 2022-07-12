import joi from 'joi';

const makeOnlinePaymentSchema = joi.object({
  cardNumber: joi.string().required(),
  cardholderName: joi.string().required(),
  expirationDate: joi
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
    .required()
    .messages({
      'string.pattern.base': 'Expiration date must be in the format MM/YY',
    }),
  securityCode: joi.string().length(3).required(),
  businessId: joi.number().integer().positive().required(),
  amount: joi.number().integer().positive().required(),
});

export default makeOnlinePaymentSchema;
