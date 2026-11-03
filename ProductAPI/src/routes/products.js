const express = require("express");
const { products, getNextId } = require("../data/products");
const { sendSuccess, sendError } = require("../utils/response");

const router = express.Router();

// GET /products - List all products
router.get("/", function (req, res) {
  return sendSuccess(res, 200, products);
});

// GET /products/:id - Get a single product
router.get("/:id", function (req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return sendError(res, 400, "INVALID_ID", "id must be a number");
  }

  const product = products.find(function (item) {
    return item.id === id;
  });
  if (!product) {
    return sendError(res, 404, "NOT_FOUND", "Product " + id + " not found");
  }

  return sendSuccess(res, 200, product);
});

// DELETE /products/:id - Delete a product
router.delete("/:id", function (req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return sendError(res, 400, "INVALID_ID", "id must be a number");
  }

  const index = products.findIndex(function (item) {
    return item.id === id;
  });
  if (index === -1) {
    return sendError(res, 404, "NOT_FOUND", "Product " + id + " not found");
  }

  const product = products[index];
  products.splice(index, 1);

  return sendSuccess(res, 200, product);
});

// POST /products - Create a product
router.post("/", function (req, res) {
  const body = req.body || {};
  const name = body.name;
  const price = body.price;

  if (typeof name !== "string" || name.trim() === "") {
    return sendError(res, 400, "VALIDATION_ERROR", "name is required");
  }
  if (typeof price !== "number" || price <= 0) {
    return sendError(res, 400, "VALIDATION_ERROR", "price must be a positive number");
  }

  const duplicate = products.find(function (item) {
    return item.name.toLowerCase() === name.trim().toLowerCase();
  });
  if (duplicate) {
    return sendError(res, 409, "DUPLICATE_NAME", "Product name already exists");
  }

  const product = { id: getNextId(), name: name.trim(), price: price };
  products.push(product);

  return sendSuccess(res, 201, product);
});

// PUT /products/:id - Replace a product
router.put("/:id", function (req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return sendError(res, 400, "INVALID_ID", "id must be a number");
  }

  const body = req.body || {};
  const name = body.name;
  const price = body.price;

  if (typeof name !== "string" || name.trim() === "") {
    return sendError(res, 400, "VALIDATION_ERROR", "name is required");
  }
  if (typeof price !== "number" || price <= 0) {
    return sendError(res, 400, "VALIDATION_ERROR", "price must be a positive number");
  }

  const index = products.findIndex(function (item) {
    return item.id === id;
  });
  if (index === -1) {
    return sendError(res, 404, "NOT_FOUND", "Product " + id + " not found");
  }

  const duplicate = products.find(function (item) {
    return item.name.toLowerCase() === name.trim().toLowerCase() && item.id !== id;
  });
  if (duplicate) {
    return sendError(res, 409, "DUPLICATE_NAME", "Product name already exists");
  }

  const product = { id: id, name: name.trim(), price: price };
  products[index] = product;

  return sendSuccess(res, 200, product);
});

module.exports = router;