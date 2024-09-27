const Joi = require('joi');
const { ValidationError } = require('../middleware/errors');

const clientSchema = Joi.object({
  userSub: Joi.string().required(),
  clientName: Joi.string().required()
});

function validateClient(req, res, next) {
  const { error } = clientSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }
  next();
}

module.exports = {
  validateClient
};
