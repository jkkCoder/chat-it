const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,"../public")

app.use(express.static(publicDirectoryPath))

io.on("connection",(socket)=>{

    socket.emit("message",{
        message:"Welcome!",
        position:"center"
    })

    socket.broadcast.emit("message",{
        message:"A user has joined",
        position:"center"
    })

    socket.on("sendMessage",(messageObj)=>{
        socket.broadcast.emit("message",{
            message:messageObj.message,
            position:"left"
        })
    })
    socket.on("sendLocation",(position)=>{
        socket.broadcast.emit("locationMessage",`https://google.com/maps?q=${position.latitude},${position.longitude}`)
    })

    socket.on("disconnect",()=>{
        io.emit("message",{
            message:"A user has left",
            position:"center"
        })
    })
})

server.listen(port,()=>{
    console.log("Server up and running at port "+port)
})