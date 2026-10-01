import React from 'react';
import { useApp } from '../context/AppContext';

export const Card = ({ item, index = 0, onSelect }) => {
  const { myList, addItem, removeItem } = useApp();

  const inList = myList.find((x) => x.key === item.key);

  const getGradient = (hue) => {
    if (!hue || !hue.length) return 'linear-gradient(150deg, #7C5CFF, #FF5C8A)';
    return `linear-gradient(150deg, hsl(${hue[0]} 80% 55%), hsl(${hue[1]} 85% 45%))`;
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
      onClick={() => onSelect(item)}
      style={{ '--stagger-delay': `${index * 60}ms` }}
    >
      <div className="poster" style={{ background: getGradient(item.hue) }}>
        <b>{item.title[0]}</b>
        <span>{item.title}</span>
      </div>

      <div className="score">★ {item.score}</div>

      {inList && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--acc)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '0.68rem',
            fontWeight: '700',
            zIndex: 6,
          }}
        >
          {inList.status === 'w' ? '✓ Watched' : '🕒 Queued'}
        </div>
      )}

      <div className="card-body" style={{ padding: '12px 14px 14px', fontSize: '0.78rem', color: 'var(--muted)' }}>
        <h3
          style={{
            fontSize: '0.95rem',
            color: 'var(--text)',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.title}
        </h3>

        <div style={{ marginBottom: '10px' }}>
          {item.year} · {item.episodes} eps · {item.genre}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
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