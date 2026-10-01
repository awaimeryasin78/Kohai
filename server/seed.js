const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const ListItem = require('./models/ListItem');

dotenv.config();
connectDB();

const sampleData = [
  {
    key: 'anime:Frieren: Beyond Journey\'s End',
    mediaType: 'anime',
    status: 'w',
    rating: 10,
    priority: 0,
    watchedDate: new Date().toISOString(),
    titleSnapshot: {
      title: "Frieren: Beyond Journey's End",
      year: 2023,
      score: 9.3,
      episodes: 28,
      genre: "Fantasy",
      synopsis: "An elf mage reflects on time and friendship after the hero party's quest ends.",
      studioOrNetwork: "Madhouse",
      hue: [270, 330]
    }
  },
  {
    key: 'anime:Steins;Gate',
    mediaType: 'anime',
    status: 'w',
    rating: 9,
    priority: 1,
    watchedDate: new Date().toISOString(),
    titleSnapshot: {
      title: "Steins;Gate",
      year: 2011,
      score: 9.1,
      episodes: 24,
      genre: "Sci-Fi",
      synopsis: "A self-proclaimed mad scientist discovers a way to send messages to the past.",
      studioOrNetwork: "White Fox",
      hue: [330, 20]
    }
  },
  {
    key: 'drama:Crash Landing on You',
    mediaType: 'drama',
    status: 't',
    rating: null,
    priority: 0,
    titleSnapshot: {
      title: "Crash Landing on You",
      year: 2019,
      score: 8.7,
      episodes: 16,
      genre: "Romance",
      synopsis: "A South Korean heiress paraglides into North Korea and meets an officer.",
      studioOrNetwork: "tvN",
      hue: [160, 200]
    }
  },
  {
    key: 'drama:Reply 1988',
    mediaType: 'drama',
    status: 't',
    rating: null,
    priority: 1,
    titleSnapshot: {
      title: "Reply 1988",
      year: 2015,
      score: 9.2,
      episodes: 20,
      genre: "Family",
      synopsis: "Neighbors in a Seoul alley share joys and sorrows in 1988.",
      studioOrNetwork: "tvN",
      hue: [20, 50]
    }
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing items just in case
    await ListItem.deleteMany();
    console.log('🧹 Cleared old data');

    // Insert sample items
    await ListItem.insertMany(sampleData);
    console.log('🌱 Successfully planted seeds! Added sample titles to MongoDB.');
    process.exit();
  } catch (error) {
    console.error('❌ Error planting seeds:', error);
    process.exit(1);
  }
};

seedDatabase();