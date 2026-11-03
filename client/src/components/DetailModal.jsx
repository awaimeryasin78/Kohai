import React from 'react';
import { useApp } from '../context/AppContext';

export const DetailModal = ({ item, onClose }) => {
  const { myList, addItem, removeItem } = useApp();

  if (!item) return null;

  const inList = myList?.find((x) => x.key === item.key);

  const title = item.title || item.titleSnapshot?.title || 'Untitled';
  const poster = item.posterUrl || item.titleSnapshot?.posterUrl;
  const score = item.score ?? item.titleSnapshot?.score ?? 'N/A';
  const studioOrNetwork = item.studioOrNetwork || item.titleSnapshot?.studioOrNetwork || 'N/A';
  const episodes = item.episodes ?? item.titleSnapshot?.episodes ?? 12;
  const year = item.year || item.titleSnapshot?.year || '';
  const genre = item.genre || item.titleSnapshot?.genre || '';
  const synopsis = item.synopsis || item.titleSnapshot?.synopsis || 'No synopsis available.';
  const hue = item.hue || item.titleSnapshot?.hue;

  const getGradient = (h) => {
    if (!h || !h.length) return 'linear-gradient(150deg, #7C5CFF, #FF5C8A)';
    return `linear-gradient(150deg, hsl(${h[0]} 80% 55%), hsl(${h[1]} 85% 45%))`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div
            className="modal-poster"
            style={{ background: getGradient(hue) }}
          >
            {poster ? (
              <img
                src={poster}
                alt={title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <b>{title?.[0] || '?'}</b>
            )}
          </div>

          <div className="modal-info">
            <h2>{title}</h2>
            <div className="modal-meta">
              <p><span>Score:</span> ★ <b>{score}</b></p>
              <p><span>Studio / Network:</span> <b>{studioOrNetwork}</b></p>
              <p><span>Episodes:</span> <b>{episodes}</b></p>
              <p><span>Year & Genre:</span> <b>{year} · {genre}</b></p>
            </div>
          </div>
        </div>

        <p className="modal-synopsis">{synopsis}</p>

        <div className="modal-actions">
          {!inList ? (
            <>
              <button
                className="btn"
                onClick={() => {
                  addItem(item, 'w', 9);
                  onClose();
                }}
              >
                ✓ Watched
              </button>
              <button
                className="btn alt"
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
              className="btn alt danger"
              onClick={() => {
                removeItem(item.key);
                onClose();
              }}
            >
              ✕ Remove from Library
            </button>
          )}

          <button className="btn close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};