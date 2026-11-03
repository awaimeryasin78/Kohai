import React from 'react';
import { useApp } from '../context/AppContext';

export const Card = ({ item, index = 0, onSelect }) => {
  const { myList, addItem, removeItem } = useApp();

  if (!item) return null;

  const inList = myList?.find((x) => x.key === item.key);

  const title = item.title || item.titleSnapshot?.title || 'Untitled';
  const poster = item.posterUrl || item.titleSnapshot?.posterUrl;
  const year = item.year || item.titleSnapshot?.year || '';
  const episodes = item.episodes || item.titleSnapshot?.episodes || 12;
  const genre = item.genre || item.titleSnapshot?.genre || '';
  const score = item.score || item.titleSnapshot?.score || 8.0;
  const hue = item.hue || item.titleSnapshot?.hue;

  const getGradient = (h) => {
    if (!h || !h.length) return 'linear-gradient(150deg, #7C5CFF, #FF5C8A)';
    return `linear-gradient(150deg, hsl(${h[0]} 80% 55%), hsl(${h[1]} 85% 45%))`;
  };

  const handleWatched = (e) => {
    e.stopPropagation();
    addItem(item, 'w', 9);
  };

  const handleToWatch = (e) => {
    e.stopPropagation();
    addItem(item, 't');
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeItem(item.key);
  };

  return (
    <div
      className="card"
      onClick={() => onSelect && onSelect(item)}
      style={{ '--stagger-delay': `${index * 60}ms`, cursor: 'pointer' }}
    >
      <div 
        className="poster" 
        style={{ 
          background: getGradient(hue), 
          position: 'relative', 
          overflow: 'hidden' 
        }}
      >
        {poster ? (
          <img
            src={poster}
            alt={title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <b style={{ fontSize: '2.2rem', color: '#fff', opacity: 0.8 }}>{title?.[0] || '?'}</b>
        )}
      </div>

      <div className="score">★ {score}</div>

      {inList && (
        <div className="card-status">
          {inList.status === 'w' ? '✓ Watched' : '🕒 Queued'}
        </div>
      )}

      <div className="card-body">
        <h3 className="card-title">{title}</h3>

        <div className="card-meta">
          {year} · {episodes} eps · {genre}
        </div>

        <div className="card-actions">
          {!inList ? (
            <>
              <button className="btn" onClick={handleWatched}>
                ✓ Watched
              </button>
              <button className="btn alt" onClick={handleToWatch}>
                ＋ Later
              </button>
            </>
          ) : (
            <button className="btn alt" onClick={handleRemove}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};