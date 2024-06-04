import contactsService from "../services/contactsServices.js";
import schema from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { error } = schema.createContactSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const { name, email, phone } = req.body;
      const createdContact = await contactsService.addContact(
        name,
        email,
        phone
      );
      res.status(200).json(createdContact);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (contact) {
      const { name, email, phone } = req.body;
      if (!name && !email && !phone) {
        res.status(400).json({ message: "Body must have at least one field" });
      } else {
        const { error } = schema.updateContactSchema.validate(req.body);
        if (error) {
          res.status(400).json({ message: error.message });
        } else {
          await contactsService.updateContact(id, name, email, phone);
          const newContact = await contactsService.getContactById(id);
          res.status(200).json(newContact);
        }
      }
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContactFavorite = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);
  if (contact) {
    const { favorite } = req.body;
    const { error } = schema.updateContactFavoriteSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      try {
        const updatedContact = await contactsService.updateStatusContact(
          id,
          favorite
        );
        res.status(200).json(updatedContact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } else {
    res.status(404).json({ message: "Not found" });
  }
};
