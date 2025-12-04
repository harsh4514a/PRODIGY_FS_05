// // import { createSlice } from "@reduxjs/toolkit";

// // const chatSlice = createSlice({
// //     name:"chat",
// //     initialState:{
// //         onlineUsers:[],
// //         messages:[],
// //     },
// //     reducers:{
// //         // actions
// //         setOnlineUsers:(state,action) => {
// //             state.onlineUsers = action.payload;
// //         },
// //         setMessages:(state,action) => {
// //             state.messages = action.payload;
// //         }
// //     }
// // });
// // export const {setOnlineUsers, setMessages} = chatSlice.actions;
// // export default chatSlice.reducer;


// // redux/chatSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const chatSlice = createSlice({
//   name: "chat",
//   initialState: {
//     onlineUsers: [],
//     messages: [],
//   },
//   reducers: {
//     setOnlineUsers: (state, action) => {
//       state.onlineUsers = action.payload;
//     },
//     setMessages: (state, action) => {
//       state.messages = action.payload;
//     },
//     // ✅ new reducer
//     addMessage: (state, action) => {
//       state.messages.push(action.payload);
//     },
//   },
// });

// export const { setOnlineUsers, setMessages, addMessage } = chatSlice.actions;
// export default chatSlice.reducer;


// frontend/src/redux/chatSlice.js
// frontend/src/redux/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [], // messages for currently selected chat
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
    addMessage: (state, action) => {
      if (!action.payload) return;
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setOnlineUsers, setMessages, addMessage, clearMessages } =
  chatSlice.actions;

export default chatSlice.reducer;

