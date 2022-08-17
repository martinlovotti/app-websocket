const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 8080;
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//DB
const { options } = require("./options/sqliteDB");
const knex = require("knex")(options);

/* const { options2 } = require("./options/mariaDB");
const knex2 = require("knex")(options2); */


const addIdAndPushToArray = (array, newItem) => {
  const ids = array.map((item) => item.id);
  if (ids.length === 0) {
    newItem.id = 1;
  } else {
    let maxId = Math.max(...ids);
    newItem.id = maxId + 1;
  }
  array.push(newItem);
};

let productos = [];
let mensajes = [];

// Middlewares
app.use(express.static(__dirname + "/public"));

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Socket.io
io.on("connection", (socket) => {
  // Connected
  console.log(`${socket.id} connected.`);

  // Products
  socket.emit("products", productos);

  // Messages
  socket.emit("messages", mensajes);

  // New product
  socket.on("new-product", (newProduct) => {
    addIdAndPushToArray(productos, newProduct);
    io.sockets.emit("products", productos);
    knex("productos")
    .insert(mensajes)
    .then(() => {
    console.log("productos inserted");
    })
    .catch((err) => {
    console.log(err);
    })
    .finally(() => {
    knex.destroy();
    });
  });

  // New messages
  socket.on("new-message", (newMessage) => {
    addIdAndPushToArray(mensajes, newMessage);
    io.sockets.emit("messages", mensajes);
    knex("mensajes")
    .insert(mensajes)
    .then(() => {
    console.log("msj inserted");
    })
    .catch((err) => {
    console.log(err);
    })
    .finally(() => {
    knex.destroy();
    });
  });

  // Disconnected
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected.`);
  });
});

// Server
httpServer.listen(PORT, () => {
  console.log("Server running on port...", PORT);
});