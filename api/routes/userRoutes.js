import { Router } from "express";
import {
  createUser,
  getProfileDetails,
  getUserLogin,
} from "../controllers/userController.js";
import {
  createPost,
  getCategories,
  getMyPosts,
  getPostDescription,
  getPostsAdmin,
  getPostsClient,
  getProvinces,
  updatePostStatus,
} from "../controllers/productController.js";
import {
  cancelExchangeRequest,
  confirmExchange,
  createRequestExchange,
  getExchangeDetails,
  getExchangesHistory,
  getPostRequestsList,
  getPostsToExchange,
  updateExchangeRequestStatus,
} from "../controllers/exchangeController.js";
import {
  createNewMessage,
  getChatMessages,
  getChatsList,
  validateChat,
} from "../controllers/chatController.js";

const router = Router();

router.post("/register", createUser);
router.get("/login", getUserLogin);
router.get("/getProvinces", getProvinces);
router.get("/getCategories", getCategories);
router.post("/createPost", createPost);
router.get("/getPostsClient", getPostsClient);
router.get("/getPostsAdmin", getPostsAdmin);
router.get("/getPostDescription/:product_id", getPostDescription);
router.put("/updatePostStatus", updatePostStatus);
router.get("/getPostsToExchange", getPostsToExchange);
router.post("/createExchangeRequest", createRequestExchange);
router.put("/cancelExchangeRequest", cancelExchangeRequest);
router.get("/getPostRequestsList", getPostRequestsList);
router.put("/updateExchangeRequestStatus", updateExchangeRequestStatus);
router.get("/getExchangeDetails", getExchangeDetails);
router.put("/confirmExchange", confirmExchange);
router.get("/getExchangesHistory", getExchangesHistory);
router.get("/getProfileDetails", getProfileDetails);
router.get("/getMyPosts", getMyPosts);
router.get("/getChatsList", getChatsList);
router.get("/validateChat", validateChat);
router.get("/getChatMessages", getChatMessages);
router.post("/createNewMessage", createNewMessage);

export default router;