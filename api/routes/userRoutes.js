import { Router } from 'express';
import { getUsers, createUser, getMessage } from '../controllers/userController.js';
const router = Router();

router.get('/hola', getMessage);
router.get('/users', getUsers);
router.post('/register', createUser);

export default router;