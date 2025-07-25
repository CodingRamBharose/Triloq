import { Router } from 'express';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { createChannel, getUserChannels } from '../controllers/ChannelController.js';

const channelRoutes = Router();

channelRoutes.post('/create', verifyToken, createChannel);
channelRoutes.get('/get-user-channels', verifyToken, getUserChannels);

export default channelRoutes;