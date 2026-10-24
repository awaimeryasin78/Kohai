const ListItem = require('../models/ListItem');

// 1. Get all saved items in My List
const getMyList = async (req, res) => {
  try {
    const items = await ListItem.find().sort({ updatedAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Add or Update item in My List
const addOrUpdateItem = async (req, res) => {
  const { key, mediaType, status, rating, priority, titleSnapshot } = req.body;

  try {
    const updatedItem = await ListItem.findOneAndUpdate(
      { key },
      {
        key,
        mediaType,
        status,
        rating: rating || null,
        priority: priority !== undefined ? priority : 1,
        titleSnapshot,
        watchedDate: status === 'w' ? new Date().toISOString().slice(0, 10) : null,
      },
      { upsert: true, new: true } // Creates new item if it doesn't exist
    );

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Remove an item from My List
const removeItem = async (req, res) => {
  const { key } = req.params;

  try {
    await ListItem.findOneAndDelete({ key });
    res.json({ success: true, message: 'Item removed from list' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyList, addOrUpdateItem, removeItem };