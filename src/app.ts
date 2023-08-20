
import express from "express";
import db from "./config/mongo";
import "dotenv/config";
// import { router } from "./routes";
import corsMiddleware from "./utils/cors.handle";

import { router as userRouter } from "./routes/user";
import { router as postRouter } from "./routes/post";
import { router as tagRouter } from "./routes/tag";
import { router as messageRouter } from "./routes/message";
import { router as commentRouter } from "./routes/comment";

const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3001;
const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/src/uploads", express.static(__dirname + "/uploads"));

app.use("/", userRouter);
app.use("/", postRouter);
app.use("/", tagRouter);
app.use("/", messageRouter);
app.use("/", commentRouter);
// app.use(router);
db().then(() => {
  console.log("Connection is ready...");
  app.listen(PORT, () => {
    console.log(`Hey! Listening by the port ${PORT}.`);
  });
});

app.get("/", (_, res) => res.send("Server is up and running"));
