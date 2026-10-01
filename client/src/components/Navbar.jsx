import React from 'react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ onOpenShortcuts }) => {
  const { page, setPage, theme, toggleTheme, searchQuery, setSearchQuery, myList } = useApp();
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <nav>
      <div className="logo-container">
        <div className="logo">Kōhai</div>
        <span className="developer-tooltip">Developed by Awaimer Yasin ✨</span>
      </div>

      <div className="tabs">
        <button
          className={`tab ${page === 'anime' ? 'on' : ''}`}
          onClick={() => setPage('anime')}
        >
          Anime
        </button>
        <button
          className={`tab ${page === 'drama' ? 'on' : ''}`}
          onClick={() => setPage('drama')}
        >
          Drama
        </button>
        <button
          className={`tab ${page === 'list' ? 'on' : ''}`}
          onClick={() => setPage('list')}
        >
          My List <span className="cnt">{myList.length}</span>
        </button>
      </div>

      <div className="sp"></div>

      <div className="search">
        <input
          id="global-search-input"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="search-badge">
          <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
          <kbd>K</kbd>
        </div>
      </div>

      <button className="ibtn" onClick={onOpenShortcuts} title="Keyboard shortcuts (?)">
        ⌨️
      </button>

      <button className="ibtn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️️' : '🌙'}
      </button>

      <div className="av">K</div>
    </nav>
  );
};