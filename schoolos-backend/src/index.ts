import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth";
import studentRoutes from "./routes/students";
import attendanceRoutes from "./routes/attendance";
import feesRoutes from "./routes/fees";
import assignmentRoutes from "./routes/assignments";
import messageRoutes from "./routes/messages";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SchoolOS API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/messages", messageRoutes);

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  },
);

const server = app.listen(PORT, () => {
  console.log(`SchoolOS backend running on port ${PORT}`);
});

server.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("Server error:", error);
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
