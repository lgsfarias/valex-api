import joi from 'joi';

const activateCardSchema = joi.object({
  cardId: joi.number().integer().positive().required(),
  cardCvv: joi.string().length(3).required(),
  password: joi.string().length(4).required(),
});

export default activateCardSchema;
