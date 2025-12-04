

import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { Notification } from "../models/notification.model.js";

/* ------------------------ ADD NEW POST ------------------------ */

export const addNewPost = async (req, res) => {
  try {
    const { caption, taggedUsers } = req.body;
    const file = req.file;
    const authorId = req.id;

    if (!file) {
      return res
        .status(400)
        .json({ message: "Image or video required", success: false });
    }

    let postData = { caption, author: authorId };
    
    // Parse taggedUsers if it's a JSON string
    if (taggedUsers) {
      try {
        postData.taggedUsers = typeof taggedUsers === 'string' ? JSON.parse(taggedUsers) : taggedUsers;
      } catch (e) {
        postData.taggedUsers = [];
      }
    }
    
    let cloudResponse;

    // IMAGE
    if (file.mimetype.startsWith("image/")) {
      const optimizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;

      cloudResponse = await cloudinary.uploader.upload(fileUri, {
        resource_type: "image",
      });

      postData.image = cloudResponse.secure_url;
    }

    // VIDEO
    else if (file.mimetype.startsWith("video/")) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        async (error, result) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Video upload failed", success: false });
          }

          postData.video = result.secure_url;

          const post = await Post.create(postData);
          const user = await User.findById(authorId);

          if (user) {
            user.posts.push(post._id);
            await user.save();
          }

          await post.populate({ path: "author", select: "-password" });

          return res.status(201).json({
            message: "New post added",
            post,
            success: true,
          });
        }
      );

      uploadStream.end(file.buffer);
      return;
    } else {
      return res
        .status(400)
        .json({ message: "Unsupported file type", success: false });
    }

    // For images
    const post = await Post.create(postData);
    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

/* ------------------------ GET ALL POSTS (with isBookmarked) --- */

export const getAllPost = async (req, res) => {
  try {
    const loginUserId = req.id; // from isAuthenticated middleware

    const [posts, loginUser] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .populate({ path: "author", select: "username profilePicture" })
        .populate({
          path: "comments",
          sort: { createdAt: -1 },
          populate: { path: "author", select: "username profilePicture" },
        }),
      User.findById(loginUserId).select("bookmarks"),
    ]);

    const bookmarkSet = new Set(
      (loginUser?.bookmarks || []).map((id) => id.toString())
    );

    const postsWithFlags = posts.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        isBookmarked: bookmarkSet.has(p._id.toString()),
      };
    });

    return res.status(200).json({ posts: postsWithFlags, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

/* ------------------------ GET USER POSTS (with isBookmarked) -- */

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id; // logged-in user

    const [posts, loginUser] = await Promise.all([
      Post.find({ author: authorId })
        .sort({ createdAt: -1 })
        .populate({
          path: "author",
          select: "username profilePicture",
        })
        .populate({
          path: "comments",
          sort: { createdAt: -1 },
          populate: { path: "author", select: "username profilePicture" },
        }),
      User.findById(authorId).select("bookmarks"),
    ]);

    const bookmarkSet = new Set(
      (loginUser?.bookmarks || []).map((id) => id.toString())
    );

    const postsWithFlags = posts.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        isBookmarked: bookmarkSet.has(p._id.toString()),
      };
    });

    return res.status(200).json({ posts: postsWithFlags, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

/* --------------------- GET SINGLE POST (+meta) ---------------- */

export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId)
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username profilePicture" },
      });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const hasLiked = post.likes?.some(
      (id) => id.toString() === userId.toString()
    );

    const isBookmarked = await User.exists({
      _id: userId,
      bookmarks: postId,
    });

    return res.status(200).json({
      success: true,
      post,
      meta: {
        hasLiked: !!hasLiked,
        isBookmarked: !!isBookmarked,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch post" });
  }
};

/* ---------------------------- LIKE ---------------------------- */

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();

    const user = await User.findById(userId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();

    if (postOwnerId !== userId) {
      const notification = {
        type: "like",
        userId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit("notification", notification);
      }

      await Notification.create({
        user: postOwnerId,
        type: "like",
        fromUser: userId,
        post: post._id,
      });
    }

    return res
      .status(200)
      .json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

/* --------------------------- DISLIKE -------------------------- */

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    await post.updateOne({ $pull: { likes: userId } });
    await post.save();

    return res
      .status(200)
      .json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

/* --------------------------- COMMENT -------------------------- */

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "text is required", success: false });
    }

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    if (post.author.toString() !== userId) {
      await Notification.create({
        user: post.author,
        type: "comment",
        fromUser: userId,
        post: post._id,
      });
    }

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

/* ---------------------- GET COMMENTS OF POST ------------------ */

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        message: "No comments found for this post",
        success: false,
      });
    }

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

/* --------------------------- DELETE --------------------------- */

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    if (user) {
      user.posts = user.posts.filter(
        (id) => id.toString() !== postId
      );
      await user.save();
    }

    await Comment.deleteMany({ post: postId });

    return res
      .status(200)
      .json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

/* -------------------------- BOOKMARK -------------------------- */

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(userId);

    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Post bookmarked",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false });
  }
};

// Tag users in a post
export const tagUsers = async (req, res) => {
  try {
    const postId = req.params.id;
    const { taggedUsers } = req.body;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Only the post author can tag users
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "You can only tag users in your own posts",
        success: false,
      });
    }

    // Update tagged users
    post.taggedUsers = taggedUsers || [];
    await post.save();

    return res.status(200).json({
      message: "Users tagged successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
