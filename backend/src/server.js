const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const adminRoutes = require("./api/routes/v1/admin.routes");
const authRoutes = require("./api/routes/v1/auth.routes");

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Infrastructure Audit System API is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
