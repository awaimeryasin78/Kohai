import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { Card } from './components/Card';
import { MyListPage } from './components/MyListPage';
import { DetailModal } from './components/DetailModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { fetchAnimeList, fetchDramaList } from './services/api';

function MainContent() {
  const { page, setPage, searchQuery } = useApp();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('score');
  const [loading, setLoading] = useState(true);

  // Load Data on Page Switch
  useEffect(() => {
    if (page !== 'list') {
      loadData();
    }
  }, [page]);

const loadData = async () => {
    setLoading(true);
    try {
      let data = [];
      if (page === 'anime') data = await fetchAnimeList();
      else if (page === 'drama') data = await fetchDramaList();
      
      // Safely extract the array from the backend response object
      // If data.data exists, use it. Otherwise fallback to data or an empty array.
      setItems(data.data || data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Global Keyboard Shortcuts Event Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      // ⌘K or Ctrl+K: Focus Search Input
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // Escape: Dismiss Open Modals or Blur Search Input
      if (e.key === 'Escape') {
        if (selectedItem) setSelectedItem(null);
        if (showShortcuts) setShowShortcuts(false);
        if (isInputActive) document.activeElement.blur();
        return;
      }

      // Skip navigation hotkeys if typing in input
      if (isInputActive) return;

      // '?' Hotkey: Toggle Shortcuts Guide Modal
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      // 1, 2, 3 Hotkeys: Page Navigation
      if (e.key === '1') setPage('anime');
      if (e.key === '2') setPage('drama');
      if (e.key === '3') setPage('list');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, showShortcuts, setPage]);

  const genres = ['All', ...new Set(items.map((x) => x.genre))];

  const filteredItems = items
    .filter(
      (x) =>
        x.title &&
        x.title.toLowerCase().includes((searchQuery || '').toLowerCase()) &&
        (genre === 'All' || x.genre === genre)
    )
    .sort((a, b) =>
      sort === 'score' ? b.score - a.score : sort === 'year' ? b.year - a.year : a.title.localeCompare(b.title)
    );

  return (
    <>
      <Navbar onOpenShortcuts={() => setShowShortcuts(true)} />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '22px 14px 70px' }}>
        {page === 'list' ? (
          <MyListPage onSelect={(x) => setSelectedItem(x)} />
        ) : (
          <>
            <HeroCarousel items={items} onSelect={(x) => setSelectedItem(x)} />

            <div className="bar">
              <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="score">Top rated</option>
                <option value="year">Newest</option>
                <option value="title">A–Z</option>
              </select>
            </div>

            {loading ? (
              <p style={{ color: 'var(--muted)', marginTop: '20px' }}>Loading titles from backend...</p>
            ) : (
              <div className="grid">
                {filteredItems.map((item, index) => (
                  <Card
                    key={item.key}
                    item={item}
                    index={index}
                    onSelect={(x) => setSelectedItem(x)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {selectedItem && (
          <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}

        {showShortcuts && (
          <ShortcutsModal onClose={() => setShowShortcuts(false)} />
        )}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="orbs">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <MainContent />
    </AppProvider>
  );
}