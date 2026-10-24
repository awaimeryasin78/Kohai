const axios = require('axios');

// 1. Fetch Trending Anime from Jikan (Free public MyAnimeList API)
const fetchTrendingAnime = async () => {
  try {
    const response = await axios.get('https://api.jikan.moe/v4/top/anime');
    return response.data.data.map((item, index) => ({
      key: `anime:${item.title}`,
      title: item.title,
      year: item.year || 2023,
      score: item.score || 8.5,
      episodes: item.episodes || 12,
      genre: item.genres[0]?.name || 'Animation',
      synopsis: item.synopsis || 'No synopsis available.',
      studioOrNetwork: item.studios[0]?.name || 'Unknown Studio',
      posterUrl: item.images?.jpg?.large_image_url || '',
      hue: [270 + (index * 15) % 90, 330 + (index * 10) % 30], // Gradient colors
    }));
  } catch (error) {
    console.error('Error fetching anime from Jikan:', error.message);
    return [];
  }
};

// 2. Fetch Popular Dramas from TMDB (or fallback if no key is set yet)
const fetchTrendingDrama = async () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
    // Return sample data so app works even without an external key
    return [
      {
        key: 'drama:Crash Landing on You',
        title: 'Crash Landing on You',
        year: 2019,
        score: 8.7,
        episodes: 16,
        genre: 'Romance',
        synopsis: 'A South Korean heiress paraglides into North Korea and meets an officer.',
        studioOrNetwork: 'tvN',
        hue: [160, 200],
      },
      {
        key: 'drama:Goblin',
        title: 'Goblin',
        year: 2016,
        score: 8.7,
        episodes: 16,
        genre: 'Fantasy',
        synopsis: 'An immortal goblin seeks a bride to end his endless life.',
        studioOrNetwork: 'tvN',
        hue: [200, 260],
      },
    ];
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
    );
    return response.data.results.map((item, index) => ({
      key: `drama:${item.name}`,
      title: item.name,
      year: parseInt(item.first_air_date?.split('-')[0]) || 2022,
      score: Math.round(item.vote_average * 10) / 10 || 8.0,
      episodes: 16,
      genre: 'Drama',
      synopsis: item.overview || 'No synopsis available.',
      studioOrNetwork: 'Asian Drama',
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      hue: [160 + (index * 15) % 90, 220 + (index * 10) % 30],
    }));
  } catch (error) {
    console.error('Error fetching drama from TMDB:', error.message);
    return [];
  }
};

module.exports = { fetchTrendingAnime, fetchTrendingDrama };