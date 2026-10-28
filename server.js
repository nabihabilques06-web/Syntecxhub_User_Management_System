
require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const basicAuth = require("express-basic-auth");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Public home route
app.get("/", (req, res) => {
  res.json({
    message: "User Management System API is running!"
  });
});

// Authentication for all user API routes
app.use(
  "/api/users",
  basicAuth({
    users: {
      [process.env.BASIC_AUTH_USER]:
        process.env.BASIC_AUTH_PASSWORD
    },
    challenge: true
  }),
  userRoutes
);

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
