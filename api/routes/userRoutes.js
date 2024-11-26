import { Router } from "express";
import {
  createPost,
  createUser,
  getPostDescription,
  getPostsAdmin,
  getPostsClient,
  getUserLogin,
  updatePostStatus,
} from "../controllers/controllers.js";

const router = Router();

router.post("/register", createUser);
router.get("/login", getUserLogin);
router.post("/createPost", createPost);
router.get("/getPostsClient", getPostsClient);
router.get("/getPostsAdmin", getPostsAdmin);
router.get("/getPostDescription/:product_id", getPostDescription);
router.put("/updatePostStatus", updatePostStatus);

export default router;
