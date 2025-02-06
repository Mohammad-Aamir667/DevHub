const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const socketManager =   require('./sockets/index');
require("dotenv").config()
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5174", 
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"], 
  },
});
socketManager(io);
app.use(express.json());
app.use(cors({
  origin:"http://localhost:5174",
  credentials:true,
}));
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");
const fileRouter = require("./routes/files");
const expertRouter = require("./routes/expert");
const adminRouter = require("./routes/admin");
const interactionRouter = require("./routes/interaction");
const PORT = process.env.PORT || 10000
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",messageRouter);
app.use("/",fileRouter);
app.use("/",expertRouter);
app.use("/",adminRouter);
app.use("/",interactionRouter);
connectDB().then(()=>{
    console.log("connected successfully")
    server.listen(PORT,()=>{
        console.log("server is successfully connected");
    })
  }).catch((err)=>{
    console.log(err);
    console.log("could not connect")
  });
