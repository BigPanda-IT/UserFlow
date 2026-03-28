import React from 'react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content small" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Подтверждение</h2>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="warning-icon">⚠️</div>
          <p>Удалить пользователя <strong>{userName}</strong>?</p>
          <p className="warning-text">Это действие нельзя отменить</p>
        </div>
        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>Отмена</button>
          <button className="danger" onClick={onConfirm}>Удалить</button>
        </div>
      </div>
    </div>
  );
}