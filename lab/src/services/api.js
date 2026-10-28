const BASE_URL = 'https://dummyjson.com';

export async function getProducts(limit = 12, skip = 0, signal) {
  const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


export async function getProduct(id, signal) {
  const res = await fetch(`${BASE_URL}/products/${id}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}