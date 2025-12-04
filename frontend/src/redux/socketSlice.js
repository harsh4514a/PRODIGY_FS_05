// import { createSlice } from "@reduxjs/toolkit";

// const socketSlice = createSlice({
//     name:"socketio",
//     initialState:{
//         socket:null
//     },
//     reducers:{
//         // actions
//         setSocket:(state,action) => {
//             state.socket = action.payload;
//         }
//     }
// });
// export const {setSocket} = socketSlice.actions;
// export default socketSlice.reducer;


// frontend/src/redux/socketSlice.js
import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    onlineUsers: [],
  },
  reducers: {
    // actions
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; // <-- array of userIds (serializable)
    },
  },
});

export const { setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;
