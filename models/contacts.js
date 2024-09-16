const Contact = require('../models/contact');

const getContacts = async () => {
  const contacts = await Contact.find({});
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw new Error('Not found');
  }
  return contact;
};

const addContact = async (body) => {
  const contact = new Contact(body);
  await contact.save();
  return contact;
};

const removeContact = async (contactId) => {
  const contact = await Contact.findByIdAndRemove(contactId);
  if (!contact) {
    throw new Error('Not found');
  }
  return contact;
};

const updateContact = async (contactId, body) => {
  const contact = await Contact.findByIdAndUpdate(contactId, body, { new: true });
  if (!contact) {
    throw new Error('Not found');
  }
  return contact;
};

const updateStatusContact = async (contactId, body) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, { favorite: body.favorite }, { new: true });

  return updatedContact;
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};