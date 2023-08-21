import cors from "cors";

const whiteList = [process.env.URL, process.env.ADMIN_URL];
// // const whiteList = ["*"];


const corsMiddleware = {
  credentials: true,
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// const corsMiddleware = {
//   credentials: true,
//   origin: "*",
// };

export default cors(corsMiddleware);
