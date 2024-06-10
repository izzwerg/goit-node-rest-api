import Joi from "joi";

const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

export const updateContactFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export default {
  createContactSchema,
  updateContactSchema,
  updateContactFavoriteSchema,
};
