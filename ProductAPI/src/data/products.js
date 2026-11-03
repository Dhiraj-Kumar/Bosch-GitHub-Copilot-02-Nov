// Seed data used to reset the in-memory store
const seedProducts = [
  { id: 1, name: "Laptop", price: 75000 },
  { id: 2, name: "Headphones", price: 2500 }
];

// In-memory store (same array reference is always kept)
const products = [];
let nextId = 1;

function resetData() {
  products.length = 0;
  for (let i = 0; i < seedProducts.length; i++) {
    const seed = seedProducts[i];
    products.push({ id: seed.id, name: seed.name, price: seed.price });
  }
  nextId = seedProducts.length + 1;
}

function getNextId() {
  const id = nextId;
  nextId = nextId + 1;
  return id;
}

resetData();

module.exports = { products, getNextId, resetData };