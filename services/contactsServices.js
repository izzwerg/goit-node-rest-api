import Contact from "../models/contact.js";

async function listContacts(filter, page, limit) {
  try {
    const skip = (page - 1) * limit;
    const contacts = await Contact.find(filter).skip(skip).limit(limit);

    const total = await Contact.countDocuments(filter);
    return {
      total,
      page,
      limit,
      contacts,
    };
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function getContactById(contactId, ownerId) {
  try {
    const contact = await Contact.findOne({ _id: contactId, owner: ownerId });
    return contact;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function removeContact(contactId, ownerId) {
  try {
    const data = await Contact.findOneAndDelete({
      _id: contactId,
      owner: ownerId,
    });
    return data;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function addContact(ownerId, name, email, phone, favorite = false) {
  const newBook = {
    name: name,
    email: email,
    phone: phone,
    favorite: favorite,
    owner: ownerId,
  };

  try {
    const data = await Contact.create(newBook);

    return data;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function updateContact(contactId, ownerId, contactName, email, phone, favorite) {
  let updatedContact = await Contact.findOne({
    _id: contactId,
    owner: ownerId,
  });
  if (updatedContact) {
    const newData = {
      name: contactName !== undefined ? contactName : updateContact.contactName,
      email: email !== undefined ? email : updateContact.email,
      phone: phone !== undefined ? phone : updateContact.phone,
      favorite: favorite !== undefined ? favorite : updateContact.favorite,
    };
    await Contact.findByIdAndUpdate(contactId, newData, {
      new: true,
    });
    updatedContact = await Contact.findOne({
      _id: contactId,
      owner: ownerId,
    });
    return updatedContact;
  } else {
    return null;
  }
}

async function updateStatusContact(contactId, owner, body) {
  try {
    let name = undefined;
    let email = undefined;
    let phone = undefined;
    const result = updateContact(contactId, owner, name, email, phone, body);
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
