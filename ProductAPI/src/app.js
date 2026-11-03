const express = require("express");
const productRoutes = require("./routes/products");
const { sendError } = require("./utils/response");

const app = express();

app.use(express.json());
app.use("/products", productRoutes);

// Fallback for unknown routes
app.use(function (req, res) {
  return sendError(res, 404, "NOT_FOUND", "Route not found");
});

module.exports = app;