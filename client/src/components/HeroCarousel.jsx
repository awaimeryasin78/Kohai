import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const HeroCarousel = ({ items, onSelect }) => {
  const [index, setIndex] = useState(0);
  const { page, addItem } = useApp();

  if (!items || !items.length) return null;

  const activeItem = items[index % items.length];

  const getGradient = (hue) => {
    if (!hue || !hue.length) return 'linear-gradient(150deg, #7C5CFF, #FF5C8A)';
    return `linear-gradient(150deg, hsl(${hue[0]} 80% 55%), hsl(${hue[1]} 85% 45%))`;
  };

  return (
    <div className={`hero ${page}`}>
      <div className="hp" style={{ background: getGradient(activeItem.hue) }}>
        <b>{activeItem.title[0]}</b>
      </div>

      <div className="ht">
        <small>🔥 #{ (index % 5) + 1 } Trending {page}</small>
        <h1>{activeItem.title}</h1>
        <p>{activeItem.synopsis?.slice(0, 160)}...</p>

        <div className="meta">
          ★ {activeItem.score} · {activeItem.year} · {activeItem.genre} · {activeItem.episodes} eps
        </div>

        <div className="acts">
          <button className="btn big" onClick={() => addItem(activeItem, 'w', 9)}>
            ✓ Watched
          </button>
          <button className="btn alt big" onClick={() => addItem(activeItem, 't')}>
            ＋ To-Watch
          </button>
          <button className="btn alt big" onClick={() => onSelect(activeItem)}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};