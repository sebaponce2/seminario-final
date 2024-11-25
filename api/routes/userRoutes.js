import { Router } from 'express';
import { createPost, createUser, getPostsAdmin, getPostsClient, getUserLogin } from '../controllers/controllers.js';

const router = Router();

router.post('/register', createUser);
router.get('/login', getUserLogin);
router.post('/createPost', createPost);
router.get('/getPostsClient', getPostsClient);
router.get('/getPostsAdmin', getPostsAdmin);

export default router;