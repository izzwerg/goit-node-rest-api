import contactsService from "../services/contactsServices.js";
import schema from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    let { page = 1, limit = 20, favorite } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const filter = {
      owner: req.user.id,
    };

    if (favorite === "true") {
      filter.favorite = true;
    } else if (favorite === "false") {
      filter.favorite = false;
    }

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ message: "Bad request." });
    }

    const contacts = await contactsService.listContacts(filter, page, limit);
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id, req.user.id);
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
    const deletedContact = await contactsService.removeContact(id, req.user.id);
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
      const {name, email, phone } = req.body;
      const owner = req.user.id;
      const createdContact = await contactsService.addContact(
        owner,
        name,
        email,
        phone
      );
      res.status(201).json(createdContact);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id, req.user.id);
    if (contact) {
      const { name, email, phone, favorite } = req.body;
      const owner = req.user.id;
      if (!name && !email && !phone && !(typeof favorite == "boolean")) {
        res.status(400).json({ message: "Body must have at least one field" });
      } else {
        const { error } = schema.updateContactSchema.validate(req.body);
        if (error) {
          res.status(400).json({ message: error.message });
        } else {
          await contactsService.updateContact(id, owner, name, email, phone, favorite);
          const newContact = await contactsService.getContactById(id, req.user.id);
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
  const owner = req.user.id;
  const contact = await contactsService.getContactById(id, owner);
  if (contact) {
    const { favorite } = req.body;
    const { error } = schema.updateContactFavoriteSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      try {
        const updatedContact = await contactsService.updateStatusContact(
          id,
          owner,
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
