const axios = require('axios');

// 1. Fetch Anime using TMDB (Guarantees data on Render!)
const fetchTrendingAnime = async () => {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    // Filter by Japanese (ja) and Animation genre (16)
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_original_language=ja&with_genres=16&sort_by=popularity.desc`
    );
    return response.data.results.map((item, index) => ({
      key: `anime:${item.name}`,
      title: item.name,
      year: parseInt(item.first_air_date?.split('-')[0]) || 2023,
      score: Math.round(item.vote_average * 10) / 10 || 8.5,
      episodes: 12, // TMDB doesn't return episode count in list view, so we use a placeholder
      genre: 'Anime',
      synopsis: item.overview || 'No synopsis available.',
      studioOrNetwork: 'Japanese Studio',
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      hue: [270 + (index * 15) % 90, 330 + (index * 10) % 30],
    }));
  } catch (error) {
    console.error('Error fetching anime from TMDB:', error.message);
    return [];
  }
};

// 2. Fetch K-Dramas using TMDB
const fetchTrendingDrama = async () => {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    // Filter strictly by Korean original language (ko)
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_original_language=ko&sort_by=popularity.desc`
    );
    return response.data.results.map((item, index) => ({
      key: `drama:${item.name}`,
      title: item.name,
      year: parseInt(item.first_air_date?.split('-')[0]) || 2022,
      score: Math.round(item.vote_average * 10) / 10 || 8.0,
      episodes: 16, 
      genre: 'Drama',
      synopsis: item.overview || 'No synopsis available.',
      studioOrNetwork: 'K-Drama',
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      hue: [160 + (index * 15) % 90, 220 + (index * 10) % 30],
    }));
  } catch (error) {
    console.error('Error fetching drama from TMDB:', error.message);
    return [];
  }
};
const searchMedia = async (query) => {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );
    return response.data.results.map((item, index) => ({
      key: `search:${item.id}`,
      title: item.name,
      year: parseInt(item.first_air_date?.split('-')[0]) || 2023,
      score: Math.round(item.vote_average * 10) / 10 || 7.5,
      episodes: 12,
      genre: 'Search Result',
      synopsis: item.overview || 'No synopsis available.',
      studioOrNetwork: 'TMDB',
      posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
      hue: [200, 260],
    }));
  } catch (error) {
    console.error('Error searching TMDB:', error.message);
    return [];
  }
};

module.exports = { fetchTrendingAnime, fetchTrendingDrama };