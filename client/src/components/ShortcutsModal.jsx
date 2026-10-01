import React from 'react';

export const ShortcutsModal = ({ onClose }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmdKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { keys: [cmdKey, 'K'], label: 'Focus global search input' },
    { keys: ['Esc'], label: 'Close detail or shortcuts modal' },
    { keys: ['?'], label: 'Toggle this keyboard guide' },
    { keys: ['1'], label: 'Switch to Anime tab' },
    { keys: ['2'], label: 'Switch to Drama tab' },
    { keys: ['3'], label: 'Switch to My List tab' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="shortcuts-grid">
          {shortcuts.map((item, idx) => (
            <div className="shortcut-row" key={idx}>
              <span className="shortcut-label">{item.label}</span>
              <div className="shortcut-keys">
                {item.keys.map((k, kIdx) => (
                  <kbd key={kIdx}>{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <small style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
            Press <kbd>Esc</kbd> anytime to exit active overlays
          </small>
        </div>
      </div>
    </div>
  );
};