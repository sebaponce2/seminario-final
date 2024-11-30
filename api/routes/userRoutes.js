import { Router } from "express";
import {
  cancelExchangeRequest,
  confirmExchange,
  createPost,
  createRequestExchange,
  createUser,
  getExchangeDetails,
  getExchangesHistory,
  getPostDescription,
  getPostRequestsList,
  getPostsAdmin,
  getPostsClient,
  getPostsToExchange,
  getProfileDetails,
  getUserLogin,
  updateExchangeRequestStatus,
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
router.get("/getPostRequestsList", getPostRequestsList);
router.put("/updateExchangeRequestStatus", updateExchangeRequestStatus);
router.get("/getExchangeDetails", getExchangeDetails);
router.put("/confirmExchange", confirmExchange);
router.get("/getExchangesHistory", getExchangesHistory);
router.get("/getProfileDetails", getProfileDetails);

export default router;
