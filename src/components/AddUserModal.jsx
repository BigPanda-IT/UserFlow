import React, { useState } from 'react';

export function AddUserModal({ isOpen, onClose, onAdd, existingGroups, actionLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    group: '',
    phone: '+7 (9',
  });

  // Функция форматирования телефона
  const formatPhone = (value) => {
    // Удаляем все не-цифры
    const numbers = value.replace(/\D/g, '');
    
    // Ограничиваем 11 цифрами (код страны 7 + 10 цифр)
    const limited = numbers.slice(0, 11);
    
    if (limited.length === 0) return '';
    
    let formatted = '+7';
    
    if (limited.length > 1) {
      formatted += ` (${limited.slice(1, 4)}`;
    } else if (limited.length === 1) {
      formatted += ' (';
    }
    
    if (limited.length > 4) {
      formatted += `) ${limited.slice(4, 7)}`;
    } else if (limited.length > 1 && limited.length <= 4) {
      formatted += ')';
    }
    
    if (limited.length > 7) {
      formatted += `-${limited.slice(7, 9)}`;
    }
    
    if (limited.length > 9) {
      formatted += `-${limited.slice(9, 11)}`;
    }
    
    return formatted;
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    // Если поле пустое, возвращаем +7 (9
    if (!rawValue.replace(/\D/g, '')) {
      setFormData({ ...formData, phone: '+7 (9' });
      return;
    }
    const formatted = formatPhone(rawValue);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.username) {
        const group = formData.group || 'Unmanaged';
        const cleanPhone = formData.phone.replace(/\D/g, '');
        onAdd({ ...formData, phone: cleanPhone, group });
        
        // Сначала сбрасываем форму
        setFormData({ 
        name: '', 
        username: '', 
        email: '', 
        group: '', 
        phone: '+7 (9'
        });
        
        // Затем закрываем модалку
        setTimeout(() => {
        onClose();
        }, 0);
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
            <label>Username *</label>
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              required
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
              onChange={handlePhoneChange}
              className="phone-input"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel" onClick={onClose}>Отмена</button>
            <button type="submit" className="submit" disabled={actionLoading}>
                {actionLoading ? 'Добавление' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}