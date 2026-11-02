import sqlite3
import pytest
from fastapi.testclient import TestClient

import main


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(main, "DB", str(tmp_path / "test.db"))
    conn = sqlite3.connect(main.DB)
    conn.execute(
        "CREATE TABLE transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "description TEXT, amount REAL, dateoftransaction TEXT, transactiontype TEXT)"
    )
    conn.commit()
    conn.close()
    return TestClient(main.app)


@pytest.fixture
def sample():
    return {
        "description": "Lunch",
        "amount": 12.5,
        "dateoftransaction": "2026-11-02",
        "transactiontype": "expense",
    }
