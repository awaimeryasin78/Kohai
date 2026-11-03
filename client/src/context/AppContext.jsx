import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMyList, saveToMyList, removeFromMyList } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState('anime'); // 'anime' | 'drama' | 'list'
  const [theme, setTheme] = useState(localStorage.getItem('kohai-theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [myList, setMyList] = useState([]);

  // Sync theme attribute on document root
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('kohai-theme', theme);
  }, [theme]);

  // Sync active page attribute on document root for CSS orb transitions
  useEffect(() => {
    document.documentElement.dataset.page = page;
  }, [page]);

  const loadList = async () => {
    try {
      const data = await fetchMyList();
      // Safely extract the array from the backend response object
      setMyList(data.data || data || []);
    } catch (err) {
      console.error('Error loading list:', err);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const addItem = async (mediaItem, status, rating = null) => {
    const payload = {
      key: mediaItem.key,
      mediaType: mediaItem.key.startsWith('anime') ? 'anime' : 'drama',
      status: status,
      rating: rating,
      priority: 1,
      titleSnapshot: {
        title: mediaItem.title,
        year: mediaItem.year,
        score: mediaItem.score,
        episodes: mediaItem.episodes,
        genre: mediaItem.genre,
        synopsis: mediaItem.synopsis,
        studioOrNetwork: mediaItem.studioOrNetwork,
        hue: mediaItem.hue,
      },
    };
    await saveToMyList(payload);
    await loadList();
  };

  const removeItem = async (key) => {
    await removeFromMyList(key);
    await loadList();
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        myList,
        addItem,
        removeItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);