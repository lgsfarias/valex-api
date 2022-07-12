import joi from 'joi';

const makeRechargeSchema = joi.object({
  cardId: joi.number().integer().positive().required(),
  amount: joi.number().integer().positive().required(),
});

export default makeRechargeSchema;
