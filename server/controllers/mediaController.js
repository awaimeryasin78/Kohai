const { fetchTrendingAnime, fetchTrendingDrama } = require('../services/mediaService');

// Get Anime List
const getAnime = async (req, res) => {
  const animeList = await fetchTrendingAnime();
  res.json({ success: true, data: animeList });
};

// Get Drama List
const getDrama = async (req, res) => {
  const dramaList = await fetchTrendingDrama();
  res.json({ success: true, data: dramaList });
};

module.exports = { getAnime, getDrama };