import cors from "cors";
import express, { Router } from "express";
import db from "./config/mongo";
// import { router } from "./routes";
import "dotenv/config";
import { router as userRouter } from "./routes/user";
// import { postRouter } from "./routes/post";
import { router as postRouter } from "./routes/post";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
// app.use(cors({ credentials: true, origin: process.env.URL }));
app.use(express.json());
// app.use(router);
// app.use("/", router);
app.use("/", userRouter);
app.use("/", postRouter);

db().then(() => console.log("Connection is ready..."));
app.listen(PORT, () => console.log(`Hey! Listening by the port ${PORT}.`));

app.get("/", (_, res) => res.send(`Server is up and running`));
