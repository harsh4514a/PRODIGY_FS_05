import React, { useRef, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreatePost = ({ open, setOpen }) => {
  const fileRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showTagInput) {
      fetchSuggestedUsers();
    }
  }, [showTagInput]);

  const fetchSuggestedUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/suggested`, {
        withCredentials: true
      });
      if (res.data.success) {
        setSuggestedUsers(res.data.users);
      }
    } catch (error) {
      console.log("Failed to fetch users", error);
    }
  };

  const handleTagUser = (selectedUser) => {
    if (!taggedUsers.find(u => u._id === selectedUser._id)) {
      setTaggedUsers([...taggedUsers, selectedUser]);
      setSearchQuery("");
    }
  };

  const handleRemoveTag = (userId) => {
    setTaggedUsers(taggedUsers.filter(u => u._id !== userId));
  };

  const filteredUsers = suggestedUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !taggedUsers.find(tagged => tagged._id === u._id)
  );

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
      const dataUrl = await readFileAsDataURL(file);
      setFilePreview(dataUrl);
    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("file", file);
    
    // Add tagged users as JSON string
    if (taggedUsers.length > 0) {
      formData.append("taggedUsers", JSON.stringify(taggedUsers.map(u => u._id)));
    }
    
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/v1/post/addpost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        // Reset state
        setFile("");
        setCaption("");
        setFilePreview("");
        setTaggedUsers([]);
        setShowTagInput(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>Bio here...</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
        {
          filePreview && (
            <div className='w-full h-64 flex items-center justify-center'>
              {fileType === 'video' ? (
                <video src={filePreview} controls className='object-cover h-full w-full rounded-md' />
              ) : (
                <img src={filePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
              )}
            </div>
          )
        }
        
        {/* Tag People Section */}
        <div className='space-y-2'>
          <Button 
            onClick={() => setShowTagInput(!showTagInput)} 
            variant="outline" 
            className='w-full flex items-center gap-2'
          >
            <UserPlus size={16} />
            Tag People
          </Button>
          
          {showTagInput && (
            <div className='space-y-2'>
              <Input 
                placeholder="Search users to tag..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus-visible:ring-transparent"
              />
              
              {/* Tagged Users Display */}
              {taggedUsers.length > 0 && (
                <div className='flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md'>
                  {taggedUsers.map(taggedUser => (
                    <div key={taggedUser._id} className='flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'>
                      <span>{taggedUser.username}</span>
                      <button onClick={() => handleRemoveTag(taggedUser._id)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* User Search Results */}
              {searchQuery && filteredUsers.length > 0 && (
                <div className='max-h-40 overflow-y-auto border rounded-md'>
                  {filteredUsers.slice(0, 5).map(suggestedUser => (
                    <div 
                      key={suggestedUser._id}
                      onClick={() => handleTagUser(suggestedUser)}
                      className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={suggestedUser.profilePicture} />
                        <AvatarFallback>{suggestedUser.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className='text-sm'>{suggestedUser.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <input ref={fileRef} type='file' accept='image/*,video/*' className='hidden' onChange={fileChangeHandler} />
        <Button onClick={() => fileRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>Select from computer</Button>
        {
          filePreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
            )
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost