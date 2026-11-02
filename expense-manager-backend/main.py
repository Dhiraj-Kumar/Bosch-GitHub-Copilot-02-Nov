import sqlite3
from datetime import date
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB = "expenses.db"

app = FastAPI(title="Expense Manager")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class TransactionIn(BaseModel):
    description: str
    amount: float
    dateoftransaction: date
    transactiontype: Literal["income", "expense"]


class Transaction(TransactionIn):
    id: int


def db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


with db() as c:
    c.execute(
        "CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "description TEXT, amount REAL, dateoftransaction TEXT, transactiontype TEXT)"
    )


def get_or_404(c, id: int):
    row = c.execute("SELECT * FROM transactions WHERE id=?", (id,)).fetchone()
    if not row:
        raise HTTPException(404, "Transaction not found")
    return dict(row)


@app.post("/transactions", response_model=Transaction, status_code=201)
def create(t: TransactionIn):
    with db() as c:
        cur = c.execute(
            "INSERT INTO transactions (description, amount, dateoftransaction, transactiontype) VALUES (?,?,?,?)",
            (t.description, t.amount, t.dateoftransaction.isoformat(), t.transactiontype),
        )
        return get_or_404(c, cur.lastrowid)


@app.get("/transactions", response_model=list[Transaction])
def list_all():
    with db() as c:
        return [dict(r) for r in c.execute("SELECT * FROM transactions")]


@app.get("/transactions/{id}", response_model=Transaction)
def read(id: int):
    with db() as c:
        return get_or_404(c, id)


@app.put("/transactions/{id}", response_model=Transaction)
def update(id: int, t: TransactionIn):
    with db() as c:
        get_or_404(c, id)
        c.execute(
            "UPDATE transactions SET description=?, amount=?, dateoftransaction=?, transactiontype=? WHERE id=?",
            (t.description, t.amount, t.dateoftransaction.isoformat(), t.transactiontype, id),
        )
        return get_or_404(c, id)


@app.delete("/transactions/{id}", status_code=204)
def delete(id: int):
    with db() as c:
        get_or_404(c, id)
        c.execute("DELETE FROM transactions WHERE id=?", (id,))
