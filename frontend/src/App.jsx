// // import { useEffect, useRef } from "react";
// // import { io } from "socket.io-client";
// // import { useDispatch, useSelector } from "react-redux";
// // import { createBrowserRouter, RouterProvider } from "react-router-dom";

// // import ChatPage from "./components/ChatPage";
// // import EditProfile from "./components/EditProfile";
// // import Home from "./components/Home";
// // import Login from "./components/Login";
// // import MainLayout from "./components/MainLayout";
// // import Profile from "./components/Profile";
// // import Signup from "./components/Signup";
// // import ProtectedRoutes from "./components/ProtectedRoutes";
// // import Notification from "./components/Notification";
// // import PostDetails from "./components/PostDetails"; // ✅ NEW

// // import { setOnlineUsers } from "./redux/chatSlice";
// // import { setLikeNotification } from "./redux/rtnSlice";

// // // ROUTE SETUP
// // const browserRouter = createBrowserRouter([
// //   {
// //     path: "/",
// //     element: (
// //       <ProtectedRoutes>
// //         <MainLayout />
// //       </ProtectedRoutes>
// //     ),
// //     children: [
// //       {
// //         path: "/",
// //         element: (
// //           <ProtectedRoutes>
// //             <Home />
// //           </ProtectedRoutes>
// //         ),
// //       },
// //       {
// //         path: "/profile/:id",
// //         element: (
// //           <ProtectedRoutes>
// //             <Profile />
// //           </ProtectedRoutes>
// //         ),
// //       },
// //       {
// //         path: "/account/edit",
// //         element: (
// //           <ProtectedRoutes>
// //             <EditProfile />
// //           </ProtectedRoutes>
// //         ),
// //       },
// //       {
// //         path: "/chat",
// //         element: (
// //           <ProtectedRoutes>
// //             <ChatPage />
// //           </ProtectedRoutes>
// //         ),
// //       },
// //       {
// //         path: "/chat/:userId",
// //         element: (
// //           <ProtectedRoutes>
// //             <ChatPage />
// //           </ProtectedRoutes>
// //         ),
// //       },
// //       {
// //         path: "/notification",
// //         element: (
// //           <ProtectedRoutes>
// //             <Notification />
// //           </ProtectedRoutes>
// //         ),
// //       },
// //       {
// //         path: "/post/:id", // ✅ NEW ROUTE FOR POST DETAILS
// //         element: (
// //           <ProtectedRoutes>
// //             <PostDetails />
// //           </ProtectedRoutes>
// //         ),
// //       },
// //     ],
// //   },
// //   {
// //     path: "/login",
// //     element: <Login />,
// //   },
// //   {
// //     path: "/signup",
// //     element: <Signup />,
// //   },
// // ]);

// // // MAIN APP
// // function App() {
// //   const { user } = useSelector((store) => store.auth);
// //   const dispatch = useDispatch();
// //   const socketRef = useRef(null);

// //   useEffect(() => {
// //     if (!user) return;

// //     const SOCKET_URL =
// //       import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

// //     const socketio = io(SOCKET_URL, {
// //       query: { userId: user._id },
// //       withCredentials: true,
// //       // transports: ["websocket", "polling"], // optional
// //     });

// //     socketRef.current = socketio;

// //     socketio.on("getOnlineUsers", (onlineUsers) => {
// //       dispatch(setOnlineUsers(onlineUsers));
// //     });

// //     socketio.on("notification", (notification) => {
// //       dispatch(setLikeNotification(notification));
// //     });
// //     socketio.on("newMessage", (message) => {
// //       dispatch(addMessage(message));
// //     });
// //     return () => {
// //       socketio.disconnect();
// //       socketRef.current = null;
// //     };
// //   }, [user, dispatch]);

// //   return <RouterProvider router={browserRouter} />;
// // }

// // export default App;


// // frontend/src/App.jsx
// import React, { useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";

// import ChatPage from "./components/ChatPage";
// import EditProfile from "./components/EditProfile";
// import Home from "./components/Home";
// import Login from "./components/Login";
// import MainLayout from "./components/MainLayout";
// import Profile from "./components/Profile";
// import Signup from "./components/Signup";
// import ProtectedRoutes from "./components/ProtectedRoutes";
// import Notification from "./components/Notification";
// import PostDetails from "./components/PostDetails";

// import { setOnlineUsers, addMessage } from "./redux/chatSlice";
// import { setLikeNotification } from "./redux/rtnSlice";

// const browserRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <ProtectedRoutes>
//         <MainLayout />
//       </ProtectedRoutes>
//     ),
//     children: [
//       {
//         path: "/",
//         element: (
//           <ProtectedRoutes>
//             <Home />
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: "/profile/:id",
//         element: (
//           <ProtectedRoutes>
//             <Profile />
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: "/account/edit",
//         element: (
//           <ProtectedRoutes>
//             <EditProfile />
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: "/chat",
//         element: (
//           <ProtectedRoutes>
//             <ChatPage />
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: "/chat/:userId",
//         element: (
//           <ProtectedRoutes>
//             <ChatPage />
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: "/notification",
//         element: (
//           <ProtectedRoutes>
//             <Notification />
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: "/post/:id",
//         element: (
//           <ProtectedRoutes>
//             <PostDetails />
//           </ProtectedRoutes>
//         ),
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/signup",
//     element: <Signup />,
//   },
// ]);

// function App() {
//   const { user, selectedUser } = useSelector((store) => store.auth);
//   const dispatch = useDispatch();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!user) return;

//     const SOCKET_URL =
//       import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

//     const socketio = io(SOCKET_URL, {
//       query: { userId: user._id },
//       withCredentials: true,
//       // transports: ["websocket", "polling"], // optional
//     });

//     socketRef.current = socketio;

//     // online users list
//     socketio.on("getOnlineUsers", (onlineUsers) => {
//       dispatch(setOnlineUsers(onlineUsers));
//     });

//     // like / follow / comment notifications
//     socketio.on("notification", (notification) => {
//       dispatch(setLikeNotification(notification));
//     });

//     // incoming chat messages (realtime)
//     const handleNewMessage = (message) => {
//       // normalize ids because they can be populated or plain strings
//       const senderId =
//         typeof message.senderId === "string"
//           ? message.senderId
//           : message.senderId?._id;
//       const receiverId =
//         typeof message.receiverId === "string"
//           ? message.receiverId
//           : message.receiverId?._id;

//       // only push to Redux if this message belongs to the currently opened chat
//       if (
//         selectedUser &&
//         (senderId === selectedUser._id || receiverId === selectedUser._id)
//       ) {
//         dispatch(addMessage(message));
//       }
//     };

//     socketio.on("newMessage", handleNewMessage);

//     return () => {
//       socketio.off("newMessage", handleNewMessage);
//       socketio.disconnect();
//       socketRef.current = null;
//     };
//   }, [user, selectedUser, dispatch]);

//   return <RouterProvider router={browserRouter} />;
// }

// export default App;


// frontend/src/App.jsx
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Notification from "./components/Notification";
import PostDetails from "./components/PostDetails";

import { setOnlineUsers, addMessage } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat/:userId",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/notification",
        element: (
          <ProtectedRoutes>
            <Notification />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <ProtectedRoutes>
            <PostDetails />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

    const socketio = io(SOCKET_URL, {
      query: { userId: user._id },
      withCredentials: true,
      // transports: ["websocket", "polling"],
    });

    socketRef.current = socketio;

    socketio.on("getOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socketio.on("notification", (notification) => {
      dispatch(setLikeNotification(notification));
    });

    // 🔥 real-time new message
    socketio.on("newMessage", (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socketio.disconnect();
      socketRef.current = null;
    };
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;

