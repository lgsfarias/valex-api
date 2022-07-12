import joi from 'joi';

const createVirtualCardSchema = joi.object({
  originalCardId: joi.number().integer().positive().required(),
  password: joi.string().length(4).required(),
});

export default createVirtualCardSchema;
