import { Router } from 'express';
import { createPost, createUser, getUserLogin } from '../controllers/userController.js';

const router = Router();

router.post('/register', createUser);
router.get('/login', getUserLogin);
router.post('/createPost', createPost);

export default router;