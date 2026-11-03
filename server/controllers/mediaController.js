const { fetchTrendingAnime, fetchTrendingDrama, searchMedia } = require('../services/mediaService');

// Get Anime List or Search Anime
const getAnime = async (req, res) => {
  const query = req.query.q;
  const animeList = query ? await searchMedia(query, 'anime') : await fetchTrendingAnime();
  res.json({ success: true, data: animeList });
};

// Get Drama List or Search Drama
const getDrama = async (req, res) => {
  const query = req.query.q;
  const dramaList = query ? await searchMedia(query, 'drama') : await fetchTrendingDrama();
  res.json({ success: true, data: dramaList });
};

module.exports = { getAnime, getDrama };