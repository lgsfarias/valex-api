import joi from 'joi';

const deleteVirtualCardSchema = joi.object({
  dardId: joi.number().integer().positive().required(),
  password: joi.string().length(4).required(),
});

export default deleteVirtualCardSchema;
