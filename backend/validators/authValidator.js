const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 100 characters",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(255)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),

  password: Joi.string()
    .min(6)
    .max(72)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must not exceed 72 characters",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(255)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),

  password: Joi.string()
    .min(6)
    .max(72)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
};