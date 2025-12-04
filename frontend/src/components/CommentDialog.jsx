// // import React, { useEffect, useState } from 'react'
// // import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
// // import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// // import { Link } from 'react-router-dom'
// // import { MoreHorizontal } from 'lucide-react'
// // import { Button } from './ui/button'
// // import { useDispatch, useSelector } from 'react-redux'
// // import Comment from './Comment'
// // import axios from 'axios'
// // import { toast } from 'sonner'
// // import { setPosts } from '@/redux/postSlice'

// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // const CommentDialog = ({ open, setOpen }) => {
// //   const [text, setText] = useState("");
// //   const { selectedPost, posts } = useSelector(store => store.post);
// //   const [comment, setComment] = useState([]);
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     if (selectedPost) {
// //       setComment(selectedPost.comments);
// //     }
// //   }, [selectedPost]);

// //   const changeEventHandler = (e) => {
// //     const inputText = e.target.value;
// //     if (inputText.trim()) {
// //       setText(inputText);
// //     } else {
// //       setText("");
// //     }
// //   }

// //   const sendMessageHandler = async () => {

// //     try {
// //       const res = await axios.post( `${API_BASE_URL}/api/v1/post/${selectedPost?._id}/comment`, { text }, {
// //         headers: {
// //           'Content-Type': 'application/json'
// //         },
// //         withCredentials: true
// //       });

// //       if (res.data.success) {
// //         const updatedCommentData = [...comment, res.data.comment];
// //         setComment(updatedCommentData);

// //         const updatedPostData = posts.map(p =>
// //           p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
// //         );
// //         dispatch(setPosts(updatedPostData));
// //         toast.success(res.data.message);
// //         setText("");
// //       }
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   }

// //   return (
// //     <Dialog open={open}>
// //       <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
// //         <div className='flex flex-1'>
// //           <div className='w-1/2'>
// //             {
// //               selectedPost.video ?
// //                 (
// //                   <video
// //                     src={selectedPost?.video}
// //                     alt="post_video"
// //                     className='w-full h-full object-cover rounded-l-lg'
// //                     controls
// //                     autoPlay
// //                     muted
// //                   />
// //                 )
// //                 :
// //                 (
// //                   <img
// //                     src={selectedPost?.image}
// //                     alt="post_img"
// //                     className='w-full h-full object-cover rounded-l-lg'
// //                   />
// //                 )
// //             }
// //           </div>
// //           <div className='w-1/2 flex flex-col justify-between'>
// //             <div className='flex items-center justify-between p-4'>
// //               <div className='flex gap-3 items-center'>
// //                 <Link>
// //                   <Avatar>
// //                     <AvatarImage src={selectedPost?.author?.profilePicture} />
// //                     <AvatarFallback>CN</AvatarFallback>
// //                   </Avatar>
// //                 </Link>
// //                 <div>
// //                   <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
// //                   {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
// //                 </div>
// //               </div>

// //               <Dialog>
// //                 <DialogTrigger asChild>
// //                   <MoreHorizontal className='cursor-pointer' />
// //                 </DialogTrigger>
// //                 <DialogContent className="flex flex-col items-center text-sm text-center">
// //                   <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
// //                     Unfollow
// //                   </div>
// //                   <div className='cursor-pointer w-full'>
// //                     Add to favorites
// //                   </div>
// //                 </DialogContent>
// //               </Dialog>
// //             </div>
// //             <hr />
// //             <div className='flex-1 overflow-y-auto max-h-96 p-4'>
// //               {
// //                 comment.map((comment) => <Comment key={comment._id} comment={comment} />)
// //               }
// //             </div>
// //             <div className='p-4'>
// //               <div className='flex items-center gap-2'>
// //                 <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outline-none border text-sm border-gray-300 p-2 rounded' />
// //                 <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }

// // export default CommentDialog


// // frontend/src/components/CommentDialog.jsx
// import React from "react";
// import { useSelector } from "react-redux";
// import { Dialog, DialogContent } from "./ui/dialog";

// const CommentDialog = ({ open, setOpen }) => {
//   // I assume you store the clicked post here
//   const { selectedPost } = useSelector((store) => store.post);

//   // ✅ if there is no post, render nothing (or a loader)
//   if (!selectedPost) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="flex items-center justify-center">
//           Loading...
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   const isVideo = !!selectedPost.video;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="p-0 max-w-3xl w-full flex flex-col md:flex-row overflow-hidden">
//         {/* LEFT: media */}
//         <div className="flex-1 bg-black flex items-center justify-center">
//           {isVideo ? (
//             <video
//               src={selectedPost.video}
//               controls
//               className="w-full h-full object-contain bg-black"
//             />
//           ) : (
//             selectedPost.image && (
//               <img
//                 src={selectedPost.image}
//                 alt="post"
//                 className="w-full h-full object-contain"
//               />
//             )
//           )}
//         </div>

//         {/* RIGHT: whatever comment UI you already had */}
//         <div className="flex-1 p-4 overflow-y-auto">
//           {/* ... comments UI using selectedPost.comments etc.
//               always use optional chaining: selectedPost.comments?.map(...) */}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CommentDialog;


// frontend/src/components/CommentDialog.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CommentDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);

  const [commentText, setCommentText] = useState("");
  const [localPost, setLocalPost] = useState(selectedPost || null);

  // keep local copy in sync if user clicks other posts
  useEffect(() => {
    setLocalPost(selectedPost || null);
    setCommentText("");
  }, [selectedPost]);

  if (!localPost) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl w-full flex items-center justify-center">
          <p>No post selected.</p>
        </DialogContent>
      </Dialog>
    );
  }

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/${localPost._id}/comment`,
        { text: commentText.trim() },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const updatedPost = {
          ...localPost,
          comments: [...(localPost.comments || []), res.data.comment],
        };

        setLocalPost(updatedPost);
        setCommentText("");

        // update redux posts list
        const updatedPostsArr = posts.map((p) =>
          p._id === updatedPost._id ? updatedPost : p
        );
        dispatch(setPosts(updatedPostsArr));
        dispatch(setSelectedPost(updatedPost));
      }
    } catch (error) {
      console.log("add comment error:", error);
    }
  };

  const createdAt = localPost.createdAt
    ? new Date(localPost.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <div className="flex w-full h-[70vh] bg-white">
          {/* LEFT: media */}
          <div className="flex-[3] bg-black flex items-center justify-center">
            {localPost?.image && (
              <img
                src={localPost.image}
                alt={localPost.caption || "Post image"}
                className="max-h-full w-full object-contain"
              />
            )}
            {!localPost?.image && localPost?.video && (
              <video
                src={localPost.video}
                controls
                className="max-h-full w-full object-contain bg-black"
              />
            )}
          </div>

          {/* RIGHT: comments */}
          <div className="flex-[2] flex flex-col border-l bg-white min-w-[320px]">
            {/* header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={localPost.author?.profilePicture}
                  alt={localPost.author?.username}
                />
                <AvatarFallback>
                  {localPost.author?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">
                {localPost.author?.username}
              </span>
            </div>

            {/* caption + comment list */}
            <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 text-sm">
              {/* caption */}
              {localPost.caption && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage
                      src={localPost.author?.profilePicture}
                      alt={localPost.author?.username}
                    />
                    <AvatarFallback>
                      {localPost.author?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold mr-1">
                      {localPost.author?.username}
                    </span>
                    <span>{localPost.caption}</span>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {createdAt}
                    </div>
                  </div>
                </div>
              )}

              {/* comments */}
              {localPost.comments && localPost.comments.length > 0 ? (
                localPost.comments.map((c) => (
                  <div key={c._id} className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage
                        src={c.author?.profilePicture}
                        alt={c.author?.username}
                      />
                      <AvatarFallback>
                        {c.author?.username?.[0]?.toUpperCase() || "U"}
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

            {/* add comment */}
            <form
              onSubmit={handleAddComment}
              className="border-t px-4 py-3 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 text-sm outline-none border-none focus:ring-0"
              />
              <Button
                type="submit"
                variant="ghost"
                disabled={!commentText.trim()}
                className={`text-sm font-semibold px-2 ${
                  commentText.trim()
                    ? "text-[#0095F6]"
                    : "text-[#0095F6]/40 cursor-default"
                }`}
              >
                Post
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
