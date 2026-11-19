const API_BASE_URL = 'https://kohai-1moe.vercel.app';

const request = async (path, options) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Backend request failed (${response.status})`);
  }
  return response.json();
};

export const fetchAnimeList = async (query = '') => {
  const queryString = query ? `?q=${encodeURIComponent(query)}` : '';
  return request(`/api/anime${queryString}`);
};

export const fetchDramaList = async (query = '') => {
  const queryString = query ? `?q=${encodeURIComponent(query)}` : '';
  return request(`/api/drama${queryString}`);
};

export const fetchMyList = async () => {
  return request('/api/list');
};

export const saveToMyList = async (item) => {
  return request('/api/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
};

export const removeFromMyList = async (key) => {
  return request(`/api/list/${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
};