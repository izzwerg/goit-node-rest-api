import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json(contacts);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

export const getOneContact = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
