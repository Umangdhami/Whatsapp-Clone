// socket.js (Socket.io server)
const { Server } = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const loginModel = require("../model/LoginModel");
const registerModel = require("../model/registerModel");
const secretKey = process.env.SECRET_KEY;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const usp = io.of("/user-namespace");

usp.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
    } else {
      console.log("Token verified:", decoded.user._id);

      try {
        const id = user.id;
        const user = await registerModel.findByIdAndUpdate(id, {
          is_online: "1",
        });

        socket.broadcast.emit("getOnlineUser", { id });

        console.log("A user connected");
      } catch (error) {
        console.error("Error updating user's online status:", error);
      }
    }
  });

  socket.on("disconnect", async () => {
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
      } else {
        console.log("Token verified:", decoded.user._id);

        try {
          // Update user's online status
          const id = user.id;
          const user = await registerModel.findByIdAndUpdate(id, {
            is_online: "1",
          });

          socket.broadcast.emit("getOflineUser", { id });
          console.log("A user disconnected");
        } catch (error) {
          console.error("Error updating user's online status:", error);
        }
      }
    });
  });
});



module.exports = server; // Export Socket.io namespace
