// frontend/src/components/Notification.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setAuthUser } from "../redux/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/notification`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);


  const handleFollowBack = async (fromUserId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/user/followorunfollow/${fromUserId}`,
        {},
        { withCredentials: true }
      );
      if (user) {
        const updatedUser = {
          ...user,
          following: [...(user.following || []), fromUserId],
        };
        dispatch(setAuthUser(updatedUser));
      }
      setNotifications((prev) =>
        prev.map((n) =>
          n.fromUser && n.fromUser._id === fromUserId
            ? { ...n, followBacked: true }
            : n
        )
      );
    } catch (error) {
      console.error("Follow back failed", error);
    }
  };

  const handleUnfollow = async (fromUserId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/user/followorunfollow/${fromUserId}`,
        {},
        { withCredentials: true }
      );
      if (user) {
        const updatedUser = {
          ...user,
          following: (user.following || []).filter((id) => id !== fromUserId),
        };
        dispatch(setAuthUser(updatedUser));
      }
      // Optionally update notifications UI if needed
    } catch (error) {
      console.error("Unfollow failed", error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  const getDisplayName = (u) => u?.username || "";
  const getRealName = (u) => u?.fullName || u?.name || "";

  const handleUserClick = (u) => {
    console.log("user clicked", u);
    u && navigate(`/profile/${u._id || u.username}`);
  }

  const handlePostClick = (postId) => postId && navigate(`/post/${postId}`);

  const timeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = (now - created) / 1000;
    const mins = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return created.toLocaleDateString();
  };

  const getPostInfo = (post) => {
    if (!post) return { id: null, thumb: null, isVideo: false };

    if (typeof post === "object") {
      const isVideo = !!post.video;
      return {
        id: post._id,
        thumb:
          post.postThumbnail ||
          post.image ||
          post.video ||
          post.postImage ||
          post.imageUrl ||
          null,
        isVideo,
      };
    }

    return { id: post, thumb: null, isVideo: false };
  };

  const getNotifText = (n) => {
    if (n.type === "follow") return "started following you.";
    if (n.type === "comment") return "commented on your post.";
    if (n.type === "like") return "liked your post.";
    return "";
  };

  const renderFollowButton = (notif) => {
    if (!notif.fromUser || !user) return null;
    const isFollowing = user.following?.includes(notif.fromUser._id);
    if (isFollowing) {
      return (
        <button
          onClick={() => handleUnfollow(notif.fromUser._id)}
          className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-300"
        >
          Following
        </button>
      );
    }
    if (notif.followBacked) {
      return (
        <button
          disabled
          className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 text-sm font-semibold"
        >
          Following
        </button>
      );
    }
    return (
      <button
        onClick={() => handleFollowBack(notif.fromUser._id)}
        className="px-4 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600"
      >
        Follow Back
      </button>
    );
  };

  const groupByTime = (notifs) => {
    const now = new Date();
    const groups = { new: [], today: [], week: [], month: [] };

    notifs.forEach((n) => {
      const created = new Date(n.createdAt);
      const diffMs = now - created;
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffHours <= 1) groups.new.push(n);
      else if (diffDays < 1) groups.today.push(n);
      else if (diffDays < 7) groups.week.push(n);
      else groups.month.push(n);
    });

    return groups;
  };

  const { new: newNotifs, today, week, month } = groupByTime(notifications);

  const Section = ({ title, items }) => {
    if (!items.length) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        {items.map((notif) => {
          const {
            id: postId,
            thumb: postThumb,
            isVideo,
          } = getPostInfo(notif.post);

          return (
            <div
              key={notif._id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="cursor-pointer"
                  onClick={() => handleUserClick(notif.fromUser)}
                >
                  <Avatar className="w-12 h-12 bg-gray-100">
                    <AvatarImage src={notif.fromUser?.profilePicture} />
                    <AvatarFallback>
                      {getDisplayName(notif.fromUser)?.[0]?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="text-sm">
                  <span
                    className="font-semibold cursor-pointer"
                    onClick={() => handleUserClick(notif.fromUser)}
                  >
                    {getDisplayName(notif.fromUser)}
                  </span>
                  {getRealName(notif.fromUser) && (
                    <span className="text-gray-500">
                      {" "}
                      ({getRealName(notif.fromUser)})
                    </span>
                  )}
                  <span> {getNotifText(notif)}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {timeAgo(notif.createdAt)}
                  </div>
                </div>
              </div>

              {notif.type === "follow" ? (
                renderFollowButton(notif)
              ) : postThumb ? (
                isVideo ? (
                  <video
                    src={postThumb}
                    className="w-12 h-12 rounded-md object-cover cursor-pointer"
                    onClick={() => handlePostClick(postId)}
                  />
                ) : (
                  <img
                    src={postThumb}
                    alt="post"
                    className="w-12 h-12 rounded-md object-cover cursor-pointer"
                    onClick={() => handlePostClick(postId)}
                  />
                )
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <Section title="New" items={newNotifs} />
      <Section title="Today" items={today} />
      <Section title="This week" items={week} />
      <Section title="This month" items={month} />
    </div>
  );
};

export default Notification;
