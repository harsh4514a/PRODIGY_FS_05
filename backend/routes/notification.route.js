// backend/routes/notification.route.js
import express from "express";
import { Notification } from "../models/notification.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Get notifications for the logged-in user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.id })
      .populate("fromUser", "username profilePicture")
      // 👇 populate the post so we get its image (change "image" to your real field)
      .populate("post", "image postImage postThumbnail video")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
});

// Get unread notification count
router.get("/unread/count", isAuthenticated, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.id, 
      isRead: false 
    });

    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch unread count" });
  }
});

// Mark notifications as read
router.post("/mark-read", isAuthenticated, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to mark notifications as read" });
  }
});

export default router;
