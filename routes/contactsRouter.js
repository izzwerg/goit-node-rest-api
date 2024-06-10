import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactFavorite,
} from "../controllers/contactsControllers.js";
import authMiddleware from "../middlewares/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);

contactsRouter.get("/:id", authMiddleware, getOneContact);

contactsRouter.delete("/:id", authMiddleware, deleteContact);

contactsRouter.post("/", authMiddleware, createContact);

contactsRouter.put("/:id", authMiddleware, updateContact);

contactsRouter.patch("/:id/favorite", authMiddleware, updateContactFavorite);

export default contactsRouter;
