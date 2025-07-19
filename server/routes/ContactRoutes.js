import Router from 'express';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { getContactForDMList, searchContacts } from '../controllers/ContactsController.js';

const  contactsRoutes = Router();

contactsRoutes.post('/search', verifyToken, searchContacts)
contactsRoutes.get('/get-contact-for-dm', verifyToken, getContactForDMList);

export default contactsRoutes;