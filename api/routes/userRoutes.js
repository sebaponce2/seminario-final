import { Router } from 'express';
const router = Router();
import { getUsers, createUser } from '../controllers/userController.js';

router.get('/users', getUsers);
router.post('/register', createUser);

export default router;