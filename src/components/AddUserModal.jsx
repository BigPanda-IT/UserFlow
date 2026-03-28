import React, { useState } from 'react';

export function AddUserModal({ isOpen, onClose, onAdd, existingGroups }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    group: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      const username = formData.username || `company/${formData.name.replace(/\s/g, '')}`;
      const group = formData.group || 'Unmanaged';
      onAdd({ ...formData, username, group });
      setFormData({ name: '', username: '', email: '', group: '', phone: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Добавить пользователя</h2>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              placeholder="company/username"
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Группа</label>
            <select
              value={formData.group}
              onChange={e => setFormData({ ...formData, group: e.target.value })}
              className="select-input"
            >
              <option value="">-- Выберите группу --</option>
              <option value="Unmanaged">Unmanaged</option>
              {existingGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel" onClick={onClose}>Отмена</button>
            <button type="submit" className="submit">Добавить</button>
          </div>
        </form>
      </div>
    </div>
  );
}