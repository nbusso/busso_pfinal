import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";

import path from "path";
import __dirname from "./utils/utils.js";
import { Server } from "socket.io";
import { sortHelp } from "./utils/utils.js";

import cartRouter from "./router/cart.router.js";
import productsRouter from "./router/products.router.js";
import viewsRouter from "./router/views.router.js";

import productsModel from "./models/products.model.js";
// variables conexión
const app = express();
const PORT = 8080;

// MW
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// DB
mongoose
  .connect(
    "mongodb+srv://nicobusso:Fuckthewhat.11@clusternico.gauyrqd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterNico"
  )
  .then(() => {
    console.log("DB: Conexión exitosa.");
  })
  .catch((error) => console.error("DB: ERROR al intentar conectar.", error));

// Routes
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

// Instancia andlebars + helpers
const hbs = handlebars.create({
  helpers: sortHelp,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

// Config Sockets
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto: ${PORT}`);
});

// server socket config
const configureSocketServer = (httpServer) => {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado.");

    socket.on("disconnect", () => {
      console.log("Un cliente se ha desconectado.");
    });
  });

  return io;
};

export const socketServer = configureSocketServer(httpServer);

await productsModel.insertMany([
  {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    code: 1403,
    price: 9.99,
    status: true,
    stock: 5,
    category: "Beauty",
    thumbnails: "",
  },
  {
    id: 2,
    title: "Chanel Coco Noir Eau De",
    description:
      "Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.",
    code: 8877,
    price: 129.99,
    status: true,
    stock: 41,
    category: "Fragrances",
    thumbnails: "",
  },
  {
    id: 3,
    title: "Annibale Colombo Bed",
    description:
      "The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.",
    code: 1574,
    price: 1899.99,
    status: true,
    stock: 31,
    category: "Furniture",
    thumbnails: "",
  },
  {
    id: 4,
    title: "Annibale Colombo Sofa",
    description:
      "The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.",
    code: 8779,
    price: 2499.99,
    status: true,
    stock: 16,
    category: "Furniture",
    thumbnails: "",
  },
  {
    id: 5,
    title: "Cooking Oil",
    description:
      "Versatile cooking oil suitable for frying, sautéing, and various culinary applications.",
    code: 8794,
    price: 4.99,
    status: true,
    stock: 22,
    category: "Groceries",
    thumbnails: "",
  },
]);
