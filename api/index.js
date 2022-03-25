const express = require("express"); // Framework JS
const mongoose = require("mongoose"); // MongoDB
const dotenv = require("dotenv"); // Pour stocker les variables d'environnements
const helmet = require("helmet"); // Pour la sécurité HHTPS
const morgan = require("morgan"); // Pour les logs et résultats des requêtes
const multer = require("multer"); // Pour l'upload d'images
const path = require("path");

// SOCKETS :
const portSocket = 9000;
//const URL = 'http://localhost:3000';
const io = require('socket.io')(portSocket, { cors: { origin: "*" }}); // Remplacer "*" par URL ?
const messenger = require('./messenger');
const notifications = require('./notifications');

const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const commentRoute = require("./routes/comments")
const conversationRoute = require("./routes/chatConversations")
const messageRoute = require("./routes/chatMessages")
const categoryRoute = require("./routes/categories")
const uploadRoute = require("./routes/upload")

dotenv.config();

const app = express();

// Connection à MongoDB :
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✔️  Connected to MongoDB."))
    .catch((err) => console.log(err));

app.use(express.static('public')); 
app.use('/assets', express.static('assets'));
app.use('/media', express.static('media'));

// Middleware :
app.use(express.json()); // Body parser for POST requests
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/upload", uploadRoute);

// SOCKETS :
messenger.start(io);
notifications.start(io);

// const port = 8000
app.listen(process.env.PORT || 8000, () => {
    console.log("✔️  Server listening on port " + process.env.PORT || 8000 + "...")
})