// METHOD /resource/:id - Short purpose
router.method("/:id", function (req, res) {
    // 1. Parse and validate id
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return sendError(res, 400, "INVALID_ID", "id must be a number");
    }

    // 2. Validate body (only if the endpoint accepts a body)
    const body = req.body || {};

    // 3. Find the resource
    const index = products.findIndex(function (item) {
        return item.id === id;
    });
    if (index === -1) {
        return sendError(res, 404, "NOT_FOUND", "Product " + id + " not found");
    }

    // 4. Perform the operation and respond
    return sendSuccess(res, 200, products[index]);
});