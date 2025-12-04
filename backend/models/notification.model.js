import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who receives the notification
  type: { type: String, enum: ['follow', 'like', 'comment'], required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who triggered the notification
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Optional, for like/comment
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
// export const Notification = mongoose.model('Notification', notificationSchema);

export const Notification = mongoose.model('Notification', notificationSchema);
