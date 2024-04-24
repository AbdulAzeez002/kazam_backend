import { Server } from "socket.io";
import http from "http";
import express from "express";
import { addTodo } from "../controller/controller";

const app = express();

const server = http.createServer(app);
const frontendUrl=process.env.FRONTEND_URL??''
const io = new Server(server, {

  cors: {
    origin: [frontendUrl],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
 
 // listening to add event 
  socket.on("add", (newTodo: {data:string}) => {
    addTodo(newTodo.data).then((todoObj:any)=>{
        // firing and event with todoObj
        socket.emit("todoadded",todoObj)
    }).catch((err:any)=>{
        console.log(err)
    })
  });

  
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    
  });
});

export { app, io, server };
