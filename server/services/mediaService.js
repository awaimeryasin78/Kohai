const axios = require('axios');

const EPISODE_COUNT_CACHE_TTL = 6 * 60 * 60 * 1000;
const episodeCountCache = new Map();
const pendingEpisodeCounts = new Map();

const fetchEpisodeCount = (id, apiKey) => {
  const mediaId = String(id ?? '');
  if (!/^\d+$/.test(mediaId) || !apiKey) return Promise.resolve(null);

  const cached = episodeCountCache.get(mediaId);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.count);

  const pending = pendingEpisodeCounts.get(mediaId);
  if (pending) return pending;

  const request = axios
    .get(`https://api.themoviedb.org/3/tv/${mediaId}`, {
      params: { api_key: apiKey },
      timeout: 8000,
    })
    .then((response) => {
      const count = response.data?.number_of_episodes;
      if (!Number.isInteger(count) || count < 0) {
        console.error(`TMDB did not provide an episode count for series ${mediaId}.`);
        return null;
      }

      episodeCountCache.set(mediaId, {
        count,
        expiresAt: Date.now() + EPISODE_COUNT_CACHE_TTL,
      });
      return count;
    })
    .catch((error) => {
      console.error(`Error fetching episode count for TMDB series ${mediaId}: ${error.message}`);
      return null;
    })
    .finally(() => pendingEpisodeCounts.delete(mediaId));

  pendingEpisodeCounts.set(mediaId, request);
  return request;
};

const getEpisodeCounts = async (ids, apiKey = process.env.TMDB_API_KEY) => {
  const mediaIds = ids.map((id) => String(id ?? ''));
  const counts = new Map();
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < mediaIds.length) {
      const id = mediaIds[nextIndex++];
      counts.set(id, await fetchEpisodeCount(id, apiKey));
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(5, mediaIds.length) }, () => worker())
  );
  return counts;
};

const addEpisodeCounts = async (items, apiKey) => {
  const ids = items.map((item) => String(item.key).split(':').pop());
  const counts = await getEpisodeCounts(ids, apiKey);
  return items.map((item, index) => ({
    ...item,
    episodes: counts.get(ids[index]) ?? null,
  }));
};

// 1. Fetch Anime using TMDB
const fetchTrendingAnime = async () => {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_original_language=ja&with_genres=16&sort_by=popularity.desc`
    );
    const items = response.data.results.map((item, index) => ({
      key: `anime:${item.id}`,
      title: item.name,
      year: parseInt(item.first_air_date?.split('-')[0]) || 2023,
      score: Math.round(item.vote_average * 10) / 10 || 8.5,
      genre: 'Anime',
      synopsis: item.overview || 'No synopsis available.',
      studioOrNetwork: 'Japanese Studio',
      posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
      hue: [270 + (index * 15) % 90, 330 + (index * 10) % 30],
    }));
    return addEpisodeCounts(items, apiKey);
  } catch (error) {
    console.error('Error fetching anime from TMDB:', error.message);
    return [];
  }
};

// 2. Fetch K-Dramas using TMDB
const fetchTrendingDrama = async () => {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_original_language=ko&sort_by=popularity.desc`
    );
    const items = response.data.results.map((item, index) => ({
      key: `drama:${item.id}`,
      title: item.name,
      year: parseInt(item.first_air_date?.split('-')[0]) || 2022,
      score: Math.round(item.vote_average * 10) / 10 || 8.0,
      genre: 'Drama',
      synopsis: item.overview || 'No synopsis available.',
      studioOrNetwork: 'K-Drama',
      posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
      hue: [160 + (index * 15) % 90, 220 + (index * 10) % 30],
    }));
    return addEpisodeCounts(items, apiKey);
  } catch (error) {
    console.error('Error fetching drama from TMDB:', error.message);
    return [];
  }
};

// 3. Live TMDB Global Search
const searchMedia = async (query, type = 'anime') => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || !query || !query.trim()) return [];
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );
    const results = response.data.results || [];
    
    // Filter results by target category language, fallback to all results if strict filter is empty
    const filtered = results.filter((item) =>
      type === 'anime'
        ? item.original_language === 'ja' || item.genre_ids?.includes(16)
        : item.original_language === 'ko'
    );
    const list = filtered.length > 0 ? filtered : results;

    const items = list.map((item, index) => ({
      key: `${type}:${item.id}`,
      title: item.name,
      year: parseInt(item.first_air_date?.split('-')[0]) || 2023,
      score: Math.round(item.vote_average * 10) / 10 || 7.5,
      genre: type === 'anime' ? 'Anime' : 'Drama',
      synopsis: item.overview || 'No synopsis available.',
      studioOrNetwork: type === 'anime' ? 'Japanese Studio' : 'K-Drama',
      posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
      hue: [200 + (index * 15) % 90, 260 + (index * 10) % 30],
    }));
    return addEpisodeCounts(items, apiKey);
  } catch (error) {
    console.error('Error searching TMDB:', error.message);
    return [];
  }
};

module.exports = { fetchTrendingAnime, fetchTrendingDrama, searchMedia, getEpisodeCounts };