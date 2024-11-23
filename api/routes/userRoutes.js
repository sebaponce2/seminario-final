import { Router } from 'express';
import { createUser, getUserLogin } from '../controllers/userController.js';

const router = Router();

router.post('/register', createUser);
router.get('/login', getUserLogin);

export default router;