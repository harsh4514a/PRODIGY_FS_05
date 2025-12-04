// frontend/src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AtSign,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Bookmark,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Instagram-style default avatar (used everywhere)
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";

/* --------------------- Post Details Modal --------------------- */

const PostDetailsModal = ({ postId, onPostDeleted }) => {
  const { user } = useSelector((store) => store.auth);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await axios.get(
          `${API_BASE_URL}/api/v1/post/${postId}`,
          { withCredentials: true }
        );

        if (res.data.success && res.data.post) {
          const fetchedPost = res.data.post;
          const meta = res.data.meta || {};
          setPost(fetchedPost);

          // driven directly by DB
          setLiked(!!meta.hasLiked);
          setBookmarked(!!meta.isBookmarked);
        } else {
          setErrorMsg(res.data.message || "Post not found");
        }
      } catch (error) {
        setErrorMsg(
          error?.response?.data?.message ||
            "Failed to fetch post from server"
        );
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  // ---- actions ----

  const handleToggleLike = async () => {
    if (!post || !user?._id) return;
    try {
      const route = liked ? "dislike" : "like";
      await axios.get(
        `${API_BASE_URL}/api/v1/post/${post._id}/${route}`,
        { withCredentials: true }
      );

      setPost((prev) =>
        !prev
          ? prev
          : {
              ...prev,
              likes: liked
                ? prev.likes.filter((id) => id !== user._id)
                : [...(prev.likes || []), user._id],
            }
      );
      setLiked((prev) => !prev);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update like");
    }
  };

  const handleToggleBookmark = async () => {
    if (!post) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/post/${post._id}/bookmark`,
        { withCredentials: true }
      );
      setBookmarked(res.data.type === "saved");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update bookmark");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/${post._id}/comment`,
        { text: commentText.trim() },
        { withCredentials: true }
      );

      if (res.data.success && res.data.comment) {
        setPost((prev) =>
          !prev
            ? prev
            : { ...prev, comments: [...(prev.comments || []), res.data.comment] }
        );
        setCommentText("");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to add comment");
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    try {
      setDeleting(true);
      const res = await axios.delete(
        `${API_BASE_URL}/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Post deleted successfully");
        setShowDeleteDialog(false);
        onPostDeleted && onPostDeleted(post._id);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const isPostOwner = user?._id === post?.author?._id;

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white rounded-xl">
        Loading post...
      </div>
    );
  }
  if (errorMsg || !post) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white rounded-xl">
        Post not found. {errorMsg}
      </div>
    );
  }

  const createdAtFull = post.createdAt
    ? new Date(post.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  const createdAtShort = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex w-full h-full max-h-[90vh] bg-white rounded-xl overflow-hidden">
      {/* LEFT: media */}
      <div className="flex-[3] bg-black flex items-center justify-center">
        {post.image && (
          <img
            src={post.image}
            alt={post.caption || "Post image"}
            className="max-h-[90vh] w-full object-contain"
          />
        )}
        {!post.image && post.video && (
          <video
            src={post.video}
            controls
            className="max-h-[90vh] w-full object-contain bg-black"
          />
        )}
      </div>

      {/* RIGHT: details panel */}
      <div className="flex-[2] flex flex-col border-l bg-white min-w-[320px] max-w-[420px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={post.author?.profilePicture || DEFAULT_AVATAR}
                alt={post.author?.username}
              />
              <AvatarFallback>
                <img
                  src={DEFAULT_AVATAR}
                  alt="default avatar"
                  className="w-full h-full rounded-full"
                />
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm">
              {post.author?.username}
            </span>
          </div>
          {isPostOwner && (
            <div className="relative">
              <button onClick={() => setShowOptionsMenu(!showOptionsMenu)}>
                <MoreHorizontal size={20} />
              </button>
              {showOptionsMenu && (
                <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      setShowOptionsMenu(false);
                      setShowDeleteDialog(true);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2 rounded-lg"
                  >
                    <Trash2 size={16} />
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Caption + comments (scrollable) */}
        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 text-sm">
          {/* caption */}
          {post.caption && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage
                  src={post.author?.profilePicture || DEFAULT_AVATAR}
                  alt={post.author?.username}
                />
                <AvatarFallback>
                  <img
                    src={DEFAULT_AVATAR}
                    alt="default avatar"
                    className="w-full h-full rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold mr-1">
                  {post.author?.username}
                </span>
                <span>{post.caption}</span>
                <div className="text-[11px] text-gray-400 mt-1">
                  {createdAtFull}
                </div>
              </div>
            </div>
          )}

          {/* comments */}
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c) => (
              <div key={c._id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage
                    src={c.author?.profilePicture || DEFAULT_AVATAR}
                    alt={c.author?.username}
                  />
                  <AvatarFallback>
                    <img
                      src={DEFAULT_AVATAR}
                      alt="default avatar"
                      className="w-full h-full rounded-full"
                    />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold mr-1">
                    {c.author?.username}
                  </span>
                  <span>{c.text}</span>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {c.createdAt &&
                      new Date(c.createdAt).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No comments yet.</div>
          )}
        </div>

        {/* Footer: icons + likes + date + add comment */}
        <div className="border-t px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleToggleLike} className="hover:opacity-70">
                <Heart
                  size={22}
                  className={
                    liked ? "text-red-500 fill-red-500" : "text-black"
                  }
                />
              </button>
              <button className="hover:opacity-70">
                <MessageCircle size={22} />
              </button>
              <button className="hover:opacity-70">
                <Send size={22} />
              </button>
            </div>
            <button
              onClick={handleToggleBookmark}
              className="hover:opacity-70"
            >
              <Bookmark
                size={22}
                className={bookmarked ? "fill-black text-black" : "text-black"}
              />
            </button>
          </div>

          <div className="text-sm font-semibold">
            {post.likes?.length || 0} likes
          </div>

          <div className="text-[11px] text-gray-400 uppercase tracking-wide">
            {createdAtShort}
          </div>

          {/* add comment input */}
          <form
            onSubmit={handleAddComment}
            className="flex items-center gap-2 border-t pt-2 mt-2"
          >
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 text-sm outline-none border-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`text-sm font-semibold ${
                commentText.trim()
                  ? "text-[#0095F6]"
                  : "text-[#0095F6]/40 cursor-default"
              }`}
            >
              Post
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePost}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* -------------------------- Profile --------------------------- */

function Profile() {
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetUserProfile(userId);

  const { userProfile, user } = useSelector((store) => store.auth);

  const [activeTab, setActiveTab] = useState("posts");
  const [modalPostId, setModalPostId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [taggedPosts, setTaggedPosts] = useState([]);

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  useEffect(() => {
    if (userProfile && user) {
      setIsFollowing(userProfile.followers?.includes(user._id));
    }
  }, [userProfile, user]);

  useEffect(() => {
    const fetchTaggedPosts = async () => {
      if (!userProfile?._id) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/user/${userProfile._id}/profile`,
          { withCredentials: true }
        );
        if (res.data.success && res.data.taggedPosts) {
          setTaggedPosts(res.data.taggedPosts);
        }
      } catch (error) {
        console.log("Failed to fetch tagged posts", error);
      }
    };
    fetchTaggedPosts();
  }, [userProfile?._id]);

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleFollowUnfollow = async () => {
    if (!userProfile?._id) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data?.message) toast.success(res.data.message);
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to follow/unfollow"
      );
    }
  };

  const handleMessage = () => {
    if (!userProfile?._id) return;
    navigate(`/chat/${userProfile._id}`);
  };

  const handlePostDeleted = (deletedPostId) => {
    setModalPostId(null);
    window.location.reload();
  };

  const displayedPost =
    activeTab === "posts"
      ? userProfile?.posts
      : activeTab === "saved" && isLoggedInUserProfile
      ? userProfile?.bookmarks
      : activeTab === "reels"
      ? userProfile?.posts?.filter(
          (post) => post.type === "video" || post.video
        )
      : activeTab === "tags"
      ? taggedPosts
      : [];

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        {/* Top profile header */}
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture || DEFAULT_AVATAR}
                alt="profilephoto"
              />
              <AvatarFallback>
                <img
                  src={DEFAULT_AVATAR}
                  alt="default avatar"
                  className="w-full h-full rounded-full"
                />
              </AvatarFallback>
            </Avatar>
          </section>

          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={isFollowing ? "secondary" : undefined}
                      className={`h-8 ${
                        !isFollowing
                          ? "bg-[#0095F6] hover:bg-[#3192d2]"
                          : ""
                      }`}
                      onClick={handleFollowUnfollow}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8"
                      onClick={handleMessage}
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length || 0}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length || 0}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length || 0}{" "}
                  </span>
                  following
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>

        {/* Tabs + posts grid */}
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            {isLoggedInUserProfile && (
              <span
                className={`py-3 cursor-pointer ${
                  activeTab === "saved" ? "font-bold" : ""
                }`}
                onClick={() => handleTabChange("saved")}
              >
                SAVED
              </span>
            )}
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "reels" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("reels")}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "tags" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("tags")}
            >
              TAGS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              const isVideo = post.type === "video" || post.video;
              return (
                <div
                  key={post?._id}
                  className="relative group cursor-pointer w-full h-full aspect-square"
                  onClick={() => setModalPostId(post._id)}
                >
                  {isVideo ? (
                    <>
                      <video
                        src={post.video || post.url || post.src}
                        poster={
                          post.postThumbnail || post.thumbnail || undefined
                        }
                        className="rounded-sm w-full h-full aspect-square object-cover bg-black"
                        muted
                        playsInline
                        preload="metadata"
                        onMouseOver={(e) => e.currentTarget.play()}
                        onMouseOut={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      {/* Instagram style play icon */}
                      <div className="absolute top-3 right-3 z-10 flex items-center justify-center">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="28"
                            height="28"
                            rx="8"
                            fill="white"
                          />
                          <polygon
                            points="13,10 22,16 13,22"
                            fill="#222"
                          />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <img
                      src={post.image || post.url || post.src}
                      alt="postimage"
                      className="rounded-sm w-full h-full aspect-square object-cover"
                    />
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal for post details */}
          {modalPostId && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
              onClick={() => setModalPostId(null)}
            >
              <div
                className="max-w-5xl w-full px-4 md:px-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    className="absolute -top-8 right-0 text-3xl font-bold text-white z-10"
                    onClick={() => setModalPostId(null)}
                  >
                    &times;
                  </button>
                  <PostDetailsModal 
                    postId={modalPostId} 
                    onPostDeleted={handlePostDeleted}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
