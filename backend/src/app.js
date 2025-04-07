require("dotenv").config()
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const socketManager =   require('./sockets/index');

const allowedOrigins = [
  "https://dev-hub-one.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

socketManager(io);
app.use(express.json());
app.use(cors({
  origin: allowedOrigins, 
  credentials:true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
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
const PORT = process.env.PORT 
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
    server.listen(PORT,"0.0.0.0",()=>{
        console.log("server is successfully connected");
    })
  }).catch((err)=>{
    console.log(err);
    console.log("could not connect")
  });
