import fs from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf8", (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
  });
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  let mass = await listContacts();
  let needContact = mass.find((contact) => contact.id === contactId);
  if (needContact === undefined) {
    return null;
  } else {
    return needContact;
  }
}

export async function removeContact(contactId) {
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

export async function addContact(name, email, phone) {
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
