import express from 'express';
import { isActive, signout, signup } from '../controllers/auth-controller.js';
import { signin } from '../controllers/auth-controller.js';
import { google } from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);
router.get('/active', isActive);
export default router;
