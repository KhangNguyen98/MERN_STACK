let io;
exports.socketServer = {
 init: httpServer => {
  io = require("socket.io")(httpServer, {
   cors: {
    origins: "*",
    // origins: "*",
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["my-custom-header"],
    // credentials: true,
    // credentials: false,
   }
  });
  return io;
 },
 getIO: () => {
  if (!io) {
   throw new Error("Uninitialized Connection !");
  }
  return io;
 }
};