import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getUserPost,
  likePost,
  getSinglePost,
  tagUsers,
} from "../controllers/post.controller.js";

const router = express.Router();

router
  .route("/addpost")
  .post(isAuthenticated, upload.single("file"), addNewPost);

router.route("/all").get(isAuthenticated, getAllPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);

// 👇 NEW – must be before :id/like, :id/dislike etc.
router.route("/:id").get(isAuthenticated, getSinglePost);

router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);
router.route("/:id/tag").post(isAuthenticated, tagUsers);

export default router;
