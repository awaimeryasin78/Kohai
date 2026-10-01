import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from './Card';

export const MyListPage = ({ onSelect }) => {
  const { myList, removeItem, addItem } = useApp();
  const [seg, setSeg] = useState('all');
  const [view, setView] = useState('grid');

  const watched = myList.filter((item) => item.status === 'w');
  const toWatch = myList.filter((item) => item.status === 't');

  const totalTitles = myList.length;
  const totalWatched = watched.length;

  const totalHours = Math.round(
    watched.reduce((acc, item) => {
      const ep = item.titleSnapshot?.episodes || 12;
      const factor = item.mediaType === 'anime' ? 0.4 : 1.0;
      return acc + ep * factor;
    }, 0)
  );

  const avgRating =
    watched.length > 0
      ? (
          watched.reduce((acc, item) => acc + (item.rating || 0), 0) /
          watched.length
        ).toFixed(1)
      : '–';

  const animeCount = myList.filter((item) => item.mediaType === 'anime').length;
  const animePercent = totalTitles ? Math.round((animeCount / totalTitles) * 100) : 50;

  const genreCounts = {};
  myList.forEach((item) => {
    const genre = item.titleSnapshot?.genre || 'Other';
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const maxGenreCount = topGenres[0] ? topGenres[0][1] : 1;

  const priorityLabels = ['High', 'Med', 'Low'];
  const priorityClasses = ['p0', 'p1', 'p2'];

  const handleSurpriseMe = () => {
    if (!toWatch.length) {
      alert('Add something to To-Watch first!');
      return;
    }
    const randomIndex = Math.floor(Math.random() * toWatch.length);
    const picked = toWatch[randomIndex];
    onSelect({
      key: picked.key,
      title: picked.titleSnapshot.title,
      year: picked.titleSnapshot.year,
      score: picked.titleSnapshot.score,
      episodes: picked.titleSnapshot.episodes,
      genre: picked.titleSnapshot.genre,
      synopsis: picked.titleSnapshot.synopsis,
      studioOrNetwork: picked.titleSnapshot.studioOrNetwork,
      hue: picked.titleSnapshot.hue,
    });
  };

  const filteredItems = myList.filter((item) => {
    if (seg === 'w') return item.status === 'w';
    if (seg === 't') return item.status === 't';
    return true;
  });

  const getGradient = (hue) => {
    if (!hue || !hue.length) return 'linear-gradient(150deg, #7C5CFF, #FF5C8A)';
    return `linear-gradient(150deg, hsl(${hue[0]} 80% 55%), hsl(${hue[1]} 85% 45%))`;
  };

  return (
    <div>
      <div className="hero list">
        <div className="ht">
          <small>✦ Your library</small>
          <h1 style={{ fontSize: '2.2rem', margin: '10px 0 6px', color: '#fff' }}>My List</h1>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', marginBottom: '16px' }}>
            Everything you've watched and everything waiting in your queue, together in one place.
          </p>
          <div>
            <button className="btn-surprise" onClick={handleSurpriseMe}>
              🎲 Surprise me
            </button>
          </div>
        </div>
      </div>

      <div className="dash">
        <div className="stat">
          <b>{totalTitles}</b>
          <small>Total titles</small>
        </div>
        <div className="stat">
          <b>{totalWatched}</b>
          <small>Watched</small>
        </div>
        <div className="stat">
          <b>{totalHours}</b>
          <small>Hours watched</small>
        </div>
        <div className="stat">
          <b>{avgRating}</b>
          <small>Avg rating</small>
        </div>

        <div className="panel donut">
          <div
            className="ring"
            style={{
              background: `conic-gradient(var(--anime) 0 ${animePercent}%, var(--drama) ${animePercent}% 100%)`,
            }}
          ></div>
          <div className="lg">
            <div><i style={{ background: 'var(--anime)' }}></i>Anime {totalTitles ? animePercent : 0}%</div>
            <div><i style={{ background: 'var(--drama)' }}></i>Drama {totalTitles ? 100 - animePercent : 0}%</div>
          </div>
        </div>

        <div className="panel">
          <small>Top genres</small>
          <div className="gb">
            {topGenres.length > 0 ? (
              topGenres.map(([g, count]) => (
                <div key={g} style={{ marginBottom: '6px' }}>
                  <span>{g} ({count})</span>
                  <div style={{ width: `${(count / maxGenreCount) * 100}%` }}></div>
                </div>
              ))
            ) : (
              <small>No data yet</small>
            )}
          </div>
        </div>
      </div>

      <div className="bar">
        <button
          className={`chip ${seg === 'all' ? 'on' : ''}`}
          onClick={() => setSeg('all')}
        >
          All ({totalTitles})
        </button>
        <button
          className={`chip ${seg === 'w' ? 'on' : ''}`}
          onClick={() => setSeg('w')}
        >
          Watched ({totalWatched})
        </button>
        <button
          className={`chip ${seg === 't' ? 'on' : ''}`}
          onClick={() => setSeg('t')}
        >
          To-Watch ({toWatch.length})
        </button>

        <div className="sp"></div>

        <button className="chip" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
          {view === 'grid' ? '☰ List view' : '▦ Grid view'}
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty">
          <span className="em">🍿</span>
          <p>Nothing here yet — add titles from Anime or Drama.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid">
          {filteredItems.map((item, index) => (
            <Card
              key={item.key}
              index={index}
              item={{
                key: item.key,
                title: item.titleSnapshot.title,
                year: item.titleSnapshot.year,
                score: item.titleSnapshot.score,
                episodes: item.titleSnapshot.episodes,
                genre: item.titleSnapshot.genre,
                synopsis: item.titleSnapshot.synopsis,
                studioOrNetwork: item.titleSnapshot.studioOrNetwork,
                hue: item.titleSnapshot.hue,
              }}
              onSelect={(x) => onSelect(x)}
            />
          ))}
        </div>
      ) : (
        <div className="list">
          {filteredItems.map((item, index) => (
            <div
              key={item.key}
              className="row"
              style={{ animationDelay: `${index * 40}ms` }}
              onClick={() =>
                onSelect({
                  key: item.key,
                  title: item.titleSnapshot.title,
                  year: item.titleSnapshot.year,
                  score: item.titleSnapshot.score,
                  episodes: item.titleSnapshot.episodes,
                  genre: item.titleSnapshot.genre,
                  synopsis: item.titleSnapshot.synopsis,
                  studioOrNetwork: item.titleSnapshot.studioOrNetwork,
                  hue: item.titleSnapshot.hue,
                })
              }
            >
              <div
                className="mini"
                style={{ background: getGradient(item.titleSnapshot?.hue) }}
              ></div>
              <div className="t">
                <h3>{item.titleSnapshot.title}</h3>
                <small>
                  {item.mediaType} · {item.titleSnapshot.year} · ★ {item.titleSnapshot.score}
                </small>
                <div>
                  {item.status === 'w' ? (
                    <span className="stars" style={{ color: 'var(--gold)' }}>
                      {'★'.repeat(item.rating || 0)}
                    </span>
                  ) : (
                    <span className={`prio ${priorityClasses[item.priority || 1]}`}>
                      {priorityLabels[item.priority || 1]} priority
                    </span>
                  )}
                </div>
              </div>

              {item.status === 't' && (
                <button
                  className="btn big"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(
                      {
                        key: item.key,
                        title: item.titleSnapshot.title,
                        year: item.titleSnapshot.year,
                        score: item.titleSnapshot.score,
                        episodes: item.titleSnapshot.episodes,
                        genre: item.titleSnapshot.genre,
                        synopsis: item.titleSnapshot.synopsis,
                        studioOrNetwork: item.titleSnapshot.studioOrNetwork,
                        hue: item.titleSnapshot.hue,
                      },
                      'w',
                      9
                    );
                  }}
                >
                  ✓ Watched
                </button>
              )}

              <button
                className="btn alt big"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.key);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};