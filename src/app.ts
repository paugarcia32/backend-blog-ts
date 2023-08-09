import cors from "cors";
import express from "express";
import db from "./config/mongo";
import "dotenv/config";
import { router as userRouter } from "./routes/user";
import { router as postRouter } from "./routes/post";
import { router as tagRouter } from "./routes/tag";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Registra los modelos antes de usar los routers
import "./models/User"; // Asegúrate de que la ruta sea correcta
import "./models/Post"; // Asegúrate de que la ruta sea correcta
import "./models/Tag"; // Asegúrate de que la ruta sea correcta

app.use("/", userRouter);
app.use("/", postRouter);
app.use("/", tagRouter);

db().then(() => {
  console.log("Connection is ready...");
  app.listen(PORT, () => {
    console.log(`Hey! Listening by the port ${PORT}.`);
  });
});

app.get("/", (_, res) => res.send("Server is up and running"));
