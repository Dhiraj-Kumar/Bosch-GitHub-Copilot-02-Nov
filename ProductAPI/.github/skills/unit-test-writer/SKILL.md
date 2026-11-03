---
name: unit-test-writer
description: How to write and run Jest and Supertest tests for this Express API. Use only when writing, fixing, or running tests for endpoint code that already exists.
---

# Unit Test Writer

## When to Use

- Write tests only **after** the endpoint implementation is complete.
- Do not create test files or run tests while an endpoint is still being built.

## Tools

- Jest as the test runner
- Supertest for HTTP calls against `src/app.js` (never start `server.js` in tests)

## File and Naming Rules

| Rule | Example |
|---|---|
| One test file per resource | `tests/products.test.js` |
| One `describe` block per endpoint | `describe("PUT /products/:id", ...)` |
| Test name pattern: `returns <status> <when/and ...>` | `returns 404 when product does not exist` |

## Structure

- Call `resetData()` in `beforeEach` so every test starts from the seed data.
- Follow Arrange / Act / Assert, with a comment for each section.
- Use `async function` and `await request(app)...`.

## Required Test Cases per Endpoint

| Case | Applies to |
|---|---|
| Happy path (correct status and data) | All endpoints |
| 404 when the resource does not exist | Endpoints with `:id` |
| 400 `INVALID_ID` when the id is not a number | Endpoints with `:id` |
| 400 `VALIDATION_ERROR`, one test per invalid field | Endpoints with a body |
| Data actually changed (verify with a follow-up GET) | POST, PUT, DELETE |
| 409 `DUPLICATE_NAME` when the name already exists | POST, PUT |

## Assertion Rules

- Always assert `response.status`.
- Always assert `response.body.success`.
- On errors, assert `response.body.error.code`, not the message text.
- Do not mock the data module, and do not use snapshot tests.

## Running Tests

| Command | Purpose |
|---|---|
| `npm test` | Run all tests |
| `npm run test:coverage` | Run the tests with a coverage report |

- If a test fails, fix the test when the test itself is wrong.
- If the source code has a bug, report it before changing the source.
- Never weaken an existing assertion just to make a test pass.

## Example

```js
describe("DELETE /products/:id", function () {
  test("returns 200 and removes the product", async function () {
    // Arrange - product with id 1 exists in seed data

    // Act
    const response = await request(app).delete("/products/1");
    const check = await request(app).get("/products/1");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(check.status).toBe(404);
  });
});
```