const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const fetchAnimeList = async () => {
  const res = await fetch(`${API_BASE_URL}/api/anime`);
  return res.json();
};

export const fetchDramaList = async () => {
  const res = await fetch(`${API_BASE_URL}/api/drama`);
  return res.json();
};

export const fetchMyList = async () => {
  const res = await fetch(`${API_BASE_URL}/api/list`);
  return res.json();
};

export const saveToMyList = async (item) => {
  const res = await fetch(`${API_BASE_URL}/api/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const removeFromMyList = async (key) => {
  const res = await fetch(`${API_BASE_URL}/api/list/${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
  return res.json();
};