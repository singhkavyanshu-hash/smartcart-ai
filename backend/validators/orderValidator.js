const Joi = require("joi");

const orderSchema = Joi.object({
  customer_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .email()
    .trim()
    .required(),

  phone: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit Indian mobile number",
    }),

  address: Joi.string()
    .trim()
    .min(5)
    .max(255)
    .required(),

  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  state: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  pincode: Joi.string()
    .trim()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Pincode must be a valid 6-digit number",
    }),

  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number()
          .integer()
          .positive()
          .required(),

        quantity: Joi.number()
          .integer()
          .positive()
          .required(),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  orderSchema,
};