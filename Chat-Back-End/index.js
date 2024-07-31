const express = require("express");
const app = express();
const port = 5011;
const bodyParser = require("body-parser");
const path = require("path");
const route = require("./routes/route");
const mongoose = require("./db/db");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const loginModel = require("./model/LoginModel");
const registerModel = require("./model/registerModel");
const chatModel = require("./model/chatModel");
const secretKey = process.env.SECRET_KEY;
const moment = require("moment");
const getCurrentTime = () => moment().format("HH:mm");
// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server with CORS options
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['"GET", "POST", "PUT", "DELETE"'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Static file serving
app.use(express.static(path.join(__dirname, "./public/")));
app.use(
  `${process.env.IMAGE_FILE}`,
  express.static(`.${process.env.IMAGE_FILE}`)
);

// Set view engine to EJS
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Socket.IO namespace for users
const usp = io.of("/user-namespace");

usp.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      socket.disconnect();
    } else {
      try {
        const id = decoded.user._id;
        await registerModel.findByIdAndUpdate(id, { is_online: "1" });

        socket.broadcast.emit("getOnlineUser", id);
        // console.log("A user connected");

        socket.on("disconnect", async () => {
          try {
            await registerModel.findByIdAndUpdate(id, { is_online: "0" });
            socket.broadcast.emit("getOfflineUser", id);
            ///   console.log("A user disconnected");
          } catch (error) {
            console.error("Error updating user's online status:", error);
          }
        });

        socket.on("chatRead", async (data) => {
          //  console.log('chatRead', data.length)

          if (data.length != 0) {
            const unreadChats = data.filter((chat) => chat.is_read == 0);

            unreadChats.filter(async (chat) => {
              await chatModel.findByIdAndUpdate(chat._id, { is_read: 1 });
            });
            socket.broadcast.emit("chatReadSuccess", unreadChats);
          }
        });

        socket.on("chatReciveNotification", async (data) => {
          socket.broadcast.emit("chatReciveNotificationSuccess", data);
        });

        socket.on("newChat", async (data) => {
          // const { _id } = req.user.user;
          const { token } = data;

          jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
              console.error("Token verification failed:", err);
              socket.disconnect();
            } else {
              // console.log(decoded.user);
              const {
                sender_id,
                reciver_id,
                sent_time,
                message,
                username,
                token,
                _id,
              } = data;
              // const { _id } = decoded.user;
              let chat = await chatModel({
                _id: _id,
                reciver_username: username,
                sender_username: decoded.user.username,
                sender_id,
                reciver_id,
                is_send: 1,
                sent_time,
                message,
              });
              chat.save();
              socket.broadcast.emit("loadNewChat", chat);
            }
          });
        });

        

        socket.on("chatSend", async (data) => {
          socket.broadcast.emit("chatSendSuccess", data);
          socket.broadcast.emit("chatSendSuccess2", data);
        });

        socket.on("delete-chat", async (id, senderId) => {
          const chat = await chatModel.findById(id);

          if (chat) {
            socket.broadcast.emit("chatMessageDeleted", chat, senderId);
          } else {
            socket.broadcast.emit("chatMessageDeleted", id, senderId);
          }
        });

        socket.on("chatRecived", async (id) => {
          const chat = await chatModel.findByIdAndUpdate(
            id,
            {
              is_recived: 1,
            },
            { new: true }
          );
          console.log("recived");
          socket.broadcast.emit("chatRecivedSuccess", chat);
        });

        socket.on("editChat", async (data) => {
          //    console.log("edittttttttttt");
          socket.broadcast.emit("updateChat", data);
        });
      } catch (error) {
        console.error("Error updating user's online status:", error);
        socket.disconnect();
      }
    }
  });
});

// Route handling
app.use("/", route);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
