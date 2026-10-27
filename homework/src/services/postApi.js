const BASE_URL = 'https://dummyjson.com';

export async function getPosts(limit = 10, skip = 0, signal) {
  const res = await fetch(`${BASE_URL}/posts?limit=${limit}&skip=${skip}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function searchPosts(query, signal) {
  const res = await fetch(`${BASE_URL}/posts/search?q=${query}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getPostComments(postId, signal) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function addPost(postData) {
  const res = await fetch(`${BASE_URL}/posts/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deletePost(postId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}