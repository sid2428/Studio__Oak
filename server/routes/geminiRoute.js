// server/routes/geminiRoute.js

import express from 'express';
import authUser from '../middlewares/authUser.js';
import { generateChatResponse } from '../controllers/geminiController.js';

const geminiRouter = express.Router();

// Using authUser middleware to get userId
geminiRouter.post('/chat', authUser, generateChatResponse);

export {geminiRouter};
