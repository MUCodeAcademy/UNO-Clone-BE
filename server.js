const express = require("express");
const app = express();

const server = require("http").createServer(app);
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
    })
    socket.on("message",(msg) =>{
        // console.log(msg)
        io.in(msg.room).emit(`message`,{
            username: msg.username,
            body: msg.body 
        })
    })

        // io.in(socket.room).emit("enter room", {
        //     username: "SYSTEM", 
        //     body: `${name} has entered the chat`})
    


    socket.on("disconnect", (name)=>{
        io.in(socket.room).emit("leave chat", {
            username: "SYSTEM",
            body: `${name} has left the chat`})
    })
})

server.listen(3001, ()=>{console.log("yeehaw")})