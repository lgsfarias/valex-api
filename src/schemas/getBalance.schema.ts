import joi from 'joi';

const getBalanceSchema = joi.object({
  cardId: joi.number().integer().positive().required(),
});

export default getBalanceSchema;
