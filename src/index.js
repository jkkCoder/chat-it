const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const path = require("path")
const {generateMessage,generateLocationMessage} = require("./utils/messages")
const {addUser,getUser,removeUser} = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,"../public")

app.use(express.static(publicDirectoryPath))

io.on("connection",(socket)=>{

    socket.on("join",({username,room},callback)=>{
        const {user,error} = addUser(socket.id,username,room)   //it either returns errror or user
        if(error)
        {
            return callback(error)
        }

        socket.join(user.room)      //joining separate room

        socket.emit("message",{
            message:"Welcome!",
            position:"center"
        })
    
        socket.broadcast.to(user.room).emit("message",{
            message:`${user.username} has joined`,
            position:"center"
        })
    })
    socket.on("sendMessage",(message)=>{
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit("message",generateMessage(message,"left",user.username))
    })
    socket.on("sendLocation",(position)=>{
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit("locationMessage",generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`,user.username))
    })

    socket.on("disconnect",()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit("message",{
                message:`${user.username} has left`,
                position:"center"
            })
        }
    })
})

server.listen(port,()=>{
    console.log("Server up and running at port "+port)
})