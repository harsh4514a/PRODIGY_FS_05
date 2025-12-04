import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Instagram,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Also refresh when likeNotification changes (real-time notification)
  useEffect(() => {
    if (likeNotification) {
      fetchUnreadCount();
    }
  }, [likeNotification]);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/notification/unread/count`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setUnreadCount(res.data.count);
      }
    } catch (error) {
      console.log("Failed to fetch unread count", error);
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = async (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    } else if (textType === "Notifications") {
      // Mark notifications as read when user clicks on Notifications
      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/notification/mark-read`,
          {},
          {
            withCredentials: true,
          }
        );
        setUnreadCount(0);
      } catch (error) {
        console.log("Failed to mark notifications as read", error);
      }
      navigate("/notification");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>
            <img
              src={DEFAULT_AVATAR}
              alt="default avatar"
              className="w-full h-full rounded-full"
            />
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <div className="my-8 pl-3 flex items-center gap-2">
          <Instagram size={32} strokeWidth={1.5} />
          <h1 className="font-bold text-xl">Instagram</h1>
        </div>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span>{item.text}</span>
                {item.text === "Notifications" && unreadCount > 0 && (
                  <span className="absolute top-2 left-6 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
