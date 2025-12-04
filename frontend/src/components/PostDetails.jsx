// frontend/src/components/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((store) => store.auth);

  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // prevent background scroll
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/post/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setPost(res.data.post);

          setLiked(res.data.meta?.hasLiked || false);
          setBookmarked(res.data.meta?.isBookmarked || false);
        }
      } catch (err) {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const closeModal = () => navigate(-1);

  if (loading || !post)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60">
        Loading...
      </div>
    );

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center"
      onClick={closeModal}
    >
      {/* White Post Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-5xl w-full h-[90vh] rounded-xl flex overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute -top-10 right-0 text-white text-3xl"
        >
          <X size={32} />
        </button>

        {/* LEFT MEDIA */}
        <div className="flex-[3] bg-black flex items-center justify-center">
          {post.image && (
            <img
              src={post.image}
              className="max-h-[90vh] w-full object-contain"
              alt=""
            />
          )}
          {post.video && (
            <video
              src={post.video}
              controls
              className="max-h-[90vh] w-full object-contain"
            />
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-[2] flex flex-col border-l overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between py-3 px-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.profilePicture} />
                <AvatarFallback>
                  {post.author.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold">{post.author.username}</span>
            </div>
            <MoreHorizontal />
          </div>

          {/* COMMENTS SCROLL AREA */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* CAPTION */}
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.author.profilePicture} />
                <AvatarFallback>
                  {post.author.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold mr-2">
                  {post.author.username}
                </span>
                {post.caption}
              </div>
            </div>

            {/* COMMENTS */}
            {post.comments?.map((c) => (
              <div key={c._id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={c.author.profilePicture} />
                  <AvatarFallback>
                    {c.author.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold mr-2">
                    {c.author.username}
                  </span>
                  {c.text}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="border-t px-4 py-3">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <Heart
                  onClick={() => setLiked(!liked)}
                  className={
                    liked ? "text-red-500 fill-red-500 cursor-pointer" : "cursor-pointer"
                  }
                />
                <MessageCircle className="cursor-pointer" />
                <Send className="cursor-pointer" />
              </div>

              <Bookmark
                onClick={() => setBookmarked(!bookmarked)}
                className={
                  bookmarked ? "fill-black text-black cursor-pointer" : "cursor-pointer"
                }
              />
            </div>

            <p className="font-semibold mt-2">{post.likes?.length} likes</p>

            {/* COMMENT BOX */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 border-t pt-2 mt-2"
            >
              <input
                className="flex-1 outline-none text-sm"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                disabled={!commentText.trim()}
                className="text-[#0095F6] disabled:opacity-40 font-semibold"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
