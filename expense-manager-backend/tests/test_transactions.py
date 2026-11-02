def test_create(client, sample):
    r = client.post("/transactions", json=sample)
    assert r.status_code == 201
    assert r.json() == {"id": 1, **sample}


def test_create_invalid_type(client, sample):
    sample["transactiontype"] = "gift"
    assert client.post("/transactions", json=sample).status_code == 422


def test_list(client, sample):
    assert client.get("/transactions").json() == []
    client.post("/transactions", json=sample)
    assert len(client.get("/transactions").json()) == 1


def test_read(client, sample):
    id_ = client.post("/transactions", json=sample).json()["id"]
    assert client.get(f"/transactions/{id_}").json()["description"] == "Lunch"


def test_read_not_found(client):
    r = client.get("/transactions/999")
    assert r.status_code == 404
    assert r.json()["detail"] == "Transaction not found"


def test_update(client, sample):
    id_ = client.post("/transactions", json=sample).json()["id"]
    r = client.put(f"/transactions/{id_}", json={**sample, "amount": 99.0})
    assert r.status_code == 200
    assert r.json()["amount"] == 99.0


def test_update_not_found(client, sample):
    assert client.put("/transactions/999", json=sample).status_code == 404


def test_delete(client, sample):
    id_ = client.post("/transactions", json=sample).json()["id"]
    assert client.delete(f"/transactions/{id_}").status_code == 204
    assert client.get(f"/transactions/{id_}").status_code == 404


def test_delete_not_found(client):
    assert client.delete("/transactions/999").status_code == 404
