import { Router } from "express";
import {
  cancelExchangeRequest,
  createPost,
  createRequestExchange,
  createUser,
  getPostDescription,
  getPostsAdmin,
  getPostsClient,
  getPostsToExchange,
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
router.get("/getPostsToExchange", getPostsToExchange);
router.post("/createExchangeRequest", createRequestExchange);
router.put("/cancelExchangeRequest", cancelExchangeRequest);

export default router;
