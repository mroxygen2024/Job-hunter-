import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.use("/", resumeRoutes);
app.use("/", chatRoutes);

export default app;
