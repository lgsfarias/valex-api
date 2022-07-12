import joi from 'joi';

const blockCardSchema = joi.object({
  cardId: joi.number().integer().positive().required(),
  password: joi.string().length(4).required(),
});

export default blockCardSchema;
