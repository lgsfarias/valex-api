import joi from 'joi';

const makePaymentSchema = joi.object({
  cardId: joi.number().integer().positive().required(),
  password: joi.string().length(4).required(),
  businessId: joi.number().integer().positive().required(),
  amount: joi.number().integer().positive().required(),
});

export default makePaymentSchema;
