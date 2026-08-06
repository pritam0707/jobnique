const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const { sequelize, connectDB } = require("./config/database");
require("./models"); // registers associations

const path = require("path");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Jobnique API is running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  // sync() is fine for local dev; use migrations for production
  if (process.env.NODE_ENV !== "production") {
    await sequelize.sync();
  }
  app.listen(PORT, () => {
    console.log(`Jobnique server running on port ${PORT}`);
  });
};

startServer();
