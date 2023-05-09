const express = require('express');
const contacts = require('../../models/contacts');

const { createContactSchema, updateContactSchema, favoriteContactSchema } = require('../../utils/validation/contactsValidationSchemas');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const result = await contacts.getContacts();
    res.json(result);
});

router.get('/:contactId', async (req, res, next) => {
    try {
        const contact = await contacts.getContactById(req.params.contactId);
        res.json(contact);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.post('/', async (req, res, next) => {
    const { name, email, phone } = req.body;
    const { error } = createContactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    } else {
        const newContact = {
            name,
            email,
            phone,
        };

        const contact = await contacts.addContact(newContact);
        if (contact) {
            res.status(201).json(contact);
        }
    }
});

router.delete('/:contactId', async (req, res, next) => {
    try {
        const contact = await contacts.removeContact(req.params.contactId);
        if (contact) {
            res.json({ message: 'contact deleted' });
        }
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.put('/:contactId', async (req, res, next) => {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    } else {
        try {
            const contact = await contacts.updateContact(req.params.contactId, req.body);
            if (contact) {
                res.json(contact);
            }
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
});

router.patch('/:contactId/favorite', async (req, res) => {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const { error } = favoriteContactSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: 'missing field favorite' });
    }

    try {
        const updatedContact = await contacts.updateStatusContact(contactId, { favorite });
        res.json(updatedContact);
    } catch (error) {
        res.status(404).json({ message: 'Not found' });
    }
});

module.exports = router;