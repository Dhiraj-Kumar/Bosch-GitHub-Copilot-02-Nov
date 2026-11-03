const request = require("supertest");
const app = require("../src/app");
const { resetData } = require("../src/data/products");

beforeEach(function () {
  resetData();
});

describe("GET /products", function () {
  test("returns 200 and all products", async function () {
    // Arrange - seed data loaded by resetData()

    // Act
    const response = await request(app).get("/products");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(2);
  });
});

describe("GET /products/:id", function () {
  test("returns 200 and the product when id exists", async function () {
    // Act
    const response = await request(app).get("/products/1");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Laptop");
  });

  test("returns 404 when product does not exist", async function () {
    // Act
    const response = await request(app).get("/products/99");

    // Assert
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  test("returns 400 when id is not a number", async function () {
    // Act
    const response = await request(app).get("/products/abc");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_ID");
  });
});

describe("DELETE /products/:id", function () {
  test("returns 200, the deleted product, and removes it from the catalog", async function () {
    // Arrange - product with id 1 exists in seed data

    // Act
    const response = await request(app).delete("/products/1");
    const detailCheck = await request(app).get("/products/1");
    const listCheck = await request(app).get("/products");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({ id: 1, name: "Laptop", price: 75000 });
    expect(detailCheck.status).toBe(404);
    expect(listCheck.body.data).toHaveLength(1);
    expect(listCheck.body.data).not.toContainEqual(response.body.data);
  });

  test("returns 404 when product does not exist", async function () {
    // Arrange - no product with id 99 exists

    // Act
    const response = await request(app).delete("/products/99");

    // Assert
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  test("returns 400 when id is not a number", async function () {
    // Arrange - id is not numeric

    // Act
    const response = await request(app).delete("/products/abc");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_ID");
  });
});

describe("PUT /products/:id", function () {
  test("returns 200 and replaces the product", async function () {
    // Arrange - product with id 1 exists in seed data

    // Act
    const response = await request(app)
      .put("/products/1")
      .send({ name: "Workstation", price: 120000 });
    const check = await request(app).get("/products/1");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({ id: 1, name: "Workstation", price: 120000 });
    expect(check.status).toBe(200);
    expect(check.body.data).toEqual(response.body.data);
  });

  test("returns 404 when product does not exist", async function () {
    // Arrange - no product with id 99 exists

    // Act
    const response = await request(app)
      .put("/products/99")
      .send({ name: "Camera", price: 1800 });

    // Assert
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  test("returns 400 when id is not a number", async function () {
    // Arrange - id is not numeric

    // Act
    const response = await request(app)
      .put("/products/abc")
      .send({ name: "Camera", price: 1800 });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_ID");
  });

  test("returns 400 when name is missing or invalid", async function () {
    // Arrange - name is empty

    // Act
    const response = await request(app)
      .put("/products/1")
      .send({ name: " ", price: 1800 });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("returns 400 when price is missing or invalid", async function () {
    // Arrange - price is zero

    // Act
    const response = await request(app)
      .put("/products/1")
      .send({ name: "Camera", price: 0 });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("returns 409 when another product already uses the name", async function () {
    // Arrange - product with id 2 already uses the name Headphones

    // Act
    const response = await request(app)
      .put("/products/1")
      .send({ name: "headphones", price: 1800 });

    // Assert
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("DUPLICATE_NAME");
  });
});

describe("POST /products duplicate names", function () {
  test("returns 409 when the name already exists, ignoring case", async function () {
    // Arrange - product with id 1 already uses the name Laptop

    // Act
    const response = await request(app)
      .post("/products")
      .send({ name: "laptop", price: 1800 });

    // Assert
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("DUPLICATE_NAME");
  });
});