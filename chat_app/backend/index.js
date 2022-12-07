require("dotenv").config()

/**FIXME */
const cloudinary = require("cloudinary").v2.config({
    api_key: "",
    api_secret: ""
})
const express = require("express")
const app = require("./App")
const fileupload = require("express-fileupload")
const cookieParser = require("cookie-parser")
const connect = require("./utils/database")
//DB connection

// connect()

//Middleware

app.use(fileupload({
    tempFileDir: "/tmp/",
    useTempFiles: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true,
}))

let { PORT } = process.env

PORT = PORT ? PORT : 5000




const server = app.listen(PORT, () => {

    console.log(`Application Start's In ${PORT}`);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
})

//logic for the realtime message


io.on("connection", (socket) => {

    socket.on("setup", (userData) => {
        console.log("user Data : ", userData);
        socket.emit("connected")
        socket.join(userData._id)
    })
    socket.on("join_room", (room) => {
        socket.join(room)
        console.log("User Joined Room: " + room);
    })

    socket.on("new message",(data)=>{

        if(data.)
    })

})




