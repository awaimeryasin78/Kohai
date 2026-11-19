import React, { useEffect, useId, useRef, useState } from 'react';

export const FilterSelect = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    options.findIndex((option) => option.value === value)
  );
  const containerRef = useRef(null);
  const listId = useId();
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(Math.max(selectedIndex, 0));
    setOpen(true);
  };

  const chooseOption = (index) => {
    onChange(options[index].value);
    setActiveIndex(index);
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }

      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => (index + direction + options.length) % options.length);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!open) {
        openMenu();
      } else {
        chooseOption(activeIndex);
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      className="filter-select"
      ref={containerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="filter-select-trigger"
        role="combobox"
        aria-label={label}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${listId}-option-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption?.label ?? label}</span>
        <span className="filter-select-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="filter-select-menu" id={listId} role="listbox" aria-label={label}>
          {options.map((option, index) => (
            <button
              type="button"
              className={`filter-select-option${value === option.value ? ' selected' : ''}${activeIndex === index ? ' active' : ''}`}
              id={`${listId}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => chooseOption(index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
