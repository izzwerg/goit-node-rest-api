import Contact from "../models/contact.js";

async function listContacts() {
  try {
    const allContacts = await Contact.find();
    return allContacts;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function removeContact(contactId) {
  try {
    const data = await Contact.findByIdAndDelete(contactId);
    return data;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function addContact(name, email, phone, favorite = false) {
  const newBook = {
    name: name,
    email: email,
    phone: phone,
    favorite: favorite,
  };

  try {
    const data = await Contact.create(newBook);

    return data;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function updateContact(contactId, favorite, name, email, phone) {
  const targetContact = await Contact.findById(contactId);
  if (targetContact == null) {
    return null;
  }
  const newData = {
    name: name !== undefined ? name : targetContact.name,
    email: email !== undefined ? email : targetContact.email,
    phone: phone !== undefined ? phone : targetContact.phone,
    favorite: favorite !== undefined ? favorite : targetContact.favorite,
  };

  try {
    const result = await Contact.findByIdAndUpdate(contactId, newData, {
      new: true,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function updateStatusContact(contactId, body) {
  try {
    const result = updateContact(contactId, body);
    if (result === null) {
      return null;
    }
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
