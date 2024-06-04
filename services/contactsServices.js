import fs from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf8", (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
  });
  return JSON.parse(data);
}

async function getContactById(contactId) {
  let mass = await listContacts();
  let needContact = mass.find((contact) => contact.id === contactId);
  if (needContact === undefined) {
    return null;
  } else {
    return needContact;
  }
}

async function removeContact(contactId) {
  let mass = await listContacts();
  let delContact = await getContactById(contactId);
  if (delContact === undefined) {
    return null;
  } else {
    let filteredMass = mass.filter((contact) => contact.id != contactId);
    fs.writeFile(contactsPath, JSON.stringify(filteredMass), (err) => {
      if (err) {
        console.log(err.message);
      }
    });
    return delContact;
  }
}

async function addContact(name, email, phone) {
  let newContact = {
    name: name,
    email: email,
    phone: phone,
    id: nanoid(),
  };
  let mass = await listContacts();
  mass.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(mass), (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  return newContact;
}

async function updateContact(contactId, name, email, phone) {
  const updatedContact = await getContactById(contactId);
  if (updatedContact) {
    const contacts = await listContacts();

    const newContacts = contacts.map((contact) => {
      if (contact.id !== contactId) {
        return { ...contact };
      }
      return {
        ...contact,
        name: name !== undefined ? name : contact.name,
        email: email !== undefined ? email : contact.email,
        phone: phone !== undefined ? phone : contact.phone,
      };
    });
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return updatedContact;
  } else {
    return null;
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
