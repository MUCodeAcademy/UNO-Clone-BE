const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 3001;
const io = require(`socket.io`)(server, {
    cors: {
        origin: "*",
    },
})


io.on(`connection`, (socket) =>{
    console.log("connected?")
    socket.on(`join room`, ({username, room}) =>{
        console.log("room socket")
        socket.join(room)
        io.in(room).emit('enter room', {username: username, playerHand: []})
    })
    socket.on("message",(msg) =>{
        io.in(msg.room).emit(`message`,{
            username: msg.username,
            body: msg.body 
        })
    })

    socket.on("send player data",(data) =>{
        io.in(data.room).emit(`host data`, {data})
    })
    
    socket.on("host data send", (data) =>{
        io.in(data.room).emit(`update game`, {data})
    })
    
        // io.in(socket.room).emit("enter room", {
        //     username: "SYSTEM", 
        //     body: `${username} has entered the chat`})
    


    socket.on("disconnect", (name)=>{
        io.in(socket.room).emit("leave chat", {
            username: "SYSTEM",
            body: `${name} has left the chat`})
    })
})





app.use(express.static(__dirname + "/build"));

app.get("/", (req, res) =>
  res.sendFile("/build/index.html", { root: __dirname + "/" })
);

server.listen(PORT, ()=>{console.log(`Listening on port: ${PORT}`)})