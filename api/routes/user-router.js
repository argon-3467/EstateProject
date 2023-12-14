import express from 'express';
import usertest  from '../controllers/user-controller.js'

const router = express.Router();

router.get('/test', usertest);

export default router;