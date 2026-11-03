---
name: express-endpoint
description: Team conventions for adding or modifying REST endpoints in this Express Product API. Use when creating a new route, changing an existing route, or adding validation or error handling to an endpoint.
---

# Express Endpoint Conventions

## File Placement

| What | Where |
|---|---|
| Route handlers | `src/routes/<resource>.js` |
| Data access | `src/data/<resource>.js` |
| Response helpers | `src/utils/response.js` (already exists, reuse it) |
| Tests | `tests/<resource>.test.js` |

## Response Format

- Always use `sendSuccess` and `sendError` from `src/utils/response.js`.
- Never call `res.json()` or `res.send()` directly in a route.

Success:
```json
{ "success": true, "data": { "id": 1, "name": "Laptop", "price": 75000 } }
```

Error:
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Product 5 not found" } }
```

## Status Codes and Error Codes

| Situation | Status | Error Code |
|---|---|---|
| Read or update success | 200 | - |
| Create success | 201 | - |
| Delete success | 200 (return the deleted item) | - |
| `:id` is not a number | 400 | `INVALID_ID` |
| Body field missing or invalid | 400 | `VALIDATION_ERROR` |
| Resource not found | 404 | `NOT_FOUND` |
| Name already used by another product | 409 | `DUPLICATE_NAME` |

## Validation Rules

- Validate manually. Do not add libraries such as Joi or express-validator.
- Read the body as `const body = req.body || {};`
- Convert `:id` with `Number()` and check it with `Number.isNaN()` first.
- Validate each field with its own `if` block and return on the first failure.
- Product rules: `name` is a non-empty string; `price` is a number greater than 0.

## Business Rules (not visible in existing code)

| Rule | Applies to | Response |
|---|---|---|
| PUT is a **full replacement**: both `name` and `price` are required | PUT | 400 `VALIDATION_ERROR` if either is missing |
| Product names must be unique (case-insensitive, ignoring the product being updated) | POST, PUT | 409 `DUPLICATE_NAME` |

Duplicate check pattern:
```js
const duplicate = products.find(function (item) {
  return item.name.toLowerCase() === name.trim().toLowerCase() && item.id !== id;
});
if (duplicate) {
  return sendError(res, 409, "DUPLICATE_NAME", "Product name already exists");
}
```

## Code Style

- Use `function` keyword callbacks, not arrow functions.
- Add one comment above each route: `// METHOD /path - Short purpose`
- Keep the logic explicit and readable. No clever one-liners.
- Do not add new npm dependencies.

## Template

Start new routes from [endpoint-template.js](./endpoint-template.js).

## Definition of Done

1. The route is added in the correct file, following the template.
2. It uses the response helpers and the correct status and error codes.
3. Validation covers every field.
4. Tests are added following the `unit-test-writer` skill.
5. `npm test` passes.