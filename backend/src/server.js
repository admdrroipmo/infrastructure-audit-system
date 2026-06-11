const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const adminRoutes = require("./api/routes/v1/admin.routes");
const authRoutes = require("./api/routes/v1/auth.routes");
const formBuilderRoutes = require("./api/routes/v1/formBuilder.routes");
const workflowRoutes = require("./api/routes/v1/workflow.routes");
const form1Routes = require("./api/routes/v1/form1.routes");

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/formBuilder", formBuilderRoutes);
app.use("/api/v1/workflow", workflowRoutes);
app.use("/api/v1/form1", form1Routes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Infrastructure Audit System API is running",
  });
});

// ─── LOG ALL REGISTERED ROUTES ──────────────────────────────────────
console.log("📋 Registered routes:");
function printRoutes(stack, prefix = "") {
  for (const layer of stack) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
      console.log(`  ${methods} ${prefix}${layer.route.path}`);
    } else if (layer.handle?.stack) {
      printRoutes(
        layer.handle.stack,
        prefix + (layer.regexp?.source?.replace(/\\\/\?/g, "/") || ""),
      );
    }
  }
}
app._router.stack.forEach((layer) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
    console.log(`  ${methods} ${layer.route.path}`);
  } else if (layer.handle?.stack) {
    printRoutes(layer.handle.stack, "");
  }
});

// ─── LOG IF form1Routes LOADED ──────────────────────────────────────
console.log(
  `✅ form1Routes imported: ${typeof form1Routes === "function" ? "Yes" : "No"}`,
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
