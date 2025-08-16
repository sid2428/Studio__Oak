import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import { createSupportRequest, getSupportRequests, updateSupportRequestStatus } from '../controllers/supportController.js';

const supportRouter = express.Router();

// Route for a user to create a support request
supportRouter.post('/request', authUser, createSupportRequest);

// Route for an admin to get all support requests
supportRouter.get('/requests', authSeller, getSupportRequests);

// **NEW** Route for an admin to update a support request's status
supportRouter.post('/request/update', authSeller, updateSupportRequestStatus);

export {supportRouter};
