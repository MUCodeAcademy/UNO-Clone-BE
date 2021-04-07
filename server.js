const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 3001;
const io = require(`socket.io`)(server, {
  cors: {
    origin: "*",
  },
});

io.on(`connection`, (socket) => {
  const { room } = socket.handshake.query;

  socket.on(`join room`, ({ username }) => {
    socket.join(room);
    io.in(room).emit("message", {
      username: "SYSTEM",
      body: `${username} has entered the chat`,
    });
  });
  socket.on("message", (msg) => {
    io.in(room).emit(`message`, {
      username: msg.username,
      body: msg.body,
    });
  });

  socket.on("send player data", (data) => {
    io.in(room).emit(`host data`, { ...data });
  });

  socket.on("host data send", (data) => {
    io.in(room).emit(`update game`, { ...data });
  });

  socket.on("send enter room to host", (data) => {
    io.emit(`update players on join`, { user: { ...data }, room: room });
  });

  // io.in(socket.room).emit("enter room", {
  //     username: "SYSTEM",
  //     body: `${username} has entered the chat`})

  socket.on("disconnect", (name) => {
    io.in(room).emit("leave chat", {
      username: "SYSTEM",
      body: `${name} has left the chat`,
    });
  });
});

app.use(express.static(__dirname + "/build"));

app.get("/", (req, res) =>
  res.sendFile("/build/index.html", { root: __dirname + "/" })
);

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
