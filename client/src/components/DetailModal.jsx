import React from 'react';
import { useApp } from '../context/AppContext';

export const DetailModal = ({ item, onClose }) => {
  const { addItem, removeItem, myList } = useApp();

  if (!item) return null;

  const inList = myList.find((x) => x.key === item.key);

  const getGradient = (hue) => {
    if (!hue || !hue.length) return 'linear-gradient(150deg, #7C5CFF, #FF5C8A)';
    return `linear-gradient(150deg, hsl(${hue[0]} 80% 55%), hsl(${hue[1]} 85% 45%))`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(10, 8, 25, 0.65)',
        backdropFilter: 'blur(10px)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(640px, 100%)',
          maxHeight: '92vh',
          overflow: 'auto',
          background: 'var(--surface)',
          borderRadius: '28px',
          padding: '24px',
          border: '1px solid var(--line)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', gap: '18px' }}>
          <div
            style={{
              width: '130px',
              aspectRatio: '2/3',
              borderRadius: '18px',
              background: getGradient(item.hue),
              display: 'grid',
              placeItems: 'center',
              fontWeight: '800',
              fontSize: '3rem',
              color: '#fff',
              flex: 'none',
            }}
          >
            {item.title[0]}
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text)' }}>{item.title}</h2>
            <div style={{ margin: '12px 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
              <p>Score: <b style={{ color: 'var(--gold)' }}>★ {item.score}</b></p>
              <p>Studio/Network: <b style={{ color: 'var(--text)' }}>{item.studioOrNetwork}</b></p>
              <p>Episodes: <b style={{ color: 'var(--text)' }}>{item.episodes}</b></p>
              <p>Year & Genre: <b style={{ color: 'var(--text)' }}>{item.year} · {item.genre}</b></p>
            </div>
          </div>
        </div>

        <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: '16px 0' }}>
          {item.synopsis}
        </p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {!inList ? (
            <>
              <button
                className="btn big"
                onClick={() => {
                  addItem(item, 'w', 9);
                  onClose();
                }}
              >
                ✓ Mark Watched
              </button>
              <button
                className="btn alt big"
                onClick={() => {
                  addItem(item, 't');
                  onClose();
                }}
              >
                ＋ To-Watch
              </button>
            </>
          ) : (
            <button
              className="btn alt big"
              onClick={() => {
                removeItem(item.key);
                onClose();
              }}
            >
              Remove from Library
            </button>
          )}
          <button className="btn alt big" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};