const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kohai-eiys.onrender.com';

export const fetchAnimeList = async (query = '') => {
  const url = query
    ? `${API_BASE_URL}/api/anime?q=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/api/anime`;
  const res = await fetch(url);
  return res.json();
};

export const fetchDramaList = async (query = '') => {
  const url = query
    ? `${API_BASE_URL}/api/drama?q=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/api/drama`;
  const res = await fetch(url);
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