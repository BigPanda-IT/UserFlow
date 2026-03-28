import React, { useState } from 'react';
import './UsersTable.css';

export function UsersTable({ users, sortField, sortDirection, onSort, onDelete }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    
    // Удаляем все старые уведомления
    const oldNotifications = document.querySelectorAll('.copy-notification');
    oldNotifications.forEach(notif => notif.remove());
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `
      <span class="copy-notification-icon">✅</span>
      <span>Скопировано: ${text.length > 25 ? text.slice(0, 25) + '...' : text}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 2 секунды с анимацией
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  return (
    <div className="table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th onClick={() => onSort('id')} className="sortable">ID {getSortIcon('id')}</th>
            <th onClick={() => onSort('name')} className="sortable">Имя {getSortIcon('name')}</th>
            <th onClick={() => onSort('username')} className="sortable">Username {getSortIcon('username')}</th>
            <th onClick={() => onSort('email')} className="sortable">Email {getSortIcon('email')}</th>
            <th onClick={() => onSort('group')} className="sortable">Группа {getSortIcon('group')}</th>
            <th onClick={() => onSort('phone')} className="sortable">Телефон {getSortIcon('phone')}</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty">
                <div>📭</div>
                <p>Пользователи не найдены</p>
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                {/* ID */}
                <td 
                  onMouseEnter={() => { setHoveredId(user.id); setHoveredField('id'); }}
                  onMouseLeave={() => { setHoveredId(null); setHoveredField(null); }}
                >
                  <div className="copyable-cell">
                    <span>{user.id}</span>
                    {hoveredId === user.id && hoveredField === 'id' && (
                      <span 
                        className="copy-icon"
                        onClick={() => copyToClipboard(user.id)}
                      >
                        📋
                      </span>
                    )}
                  </div>
                </td>

                {/* Имя */}
                <td 
                  onMouseEnter={() => { setHoveredId(user.id); setHoveredField('name'); }}
                  onMouseLeave={() => { setHoveredId(null); setHoveredField(null); }}
                >
                  <div className="copyable-cell">
                    <span>{user.name}</span>
                    {hoveredId === user.id && hoveredField === 'name' && (
                      <span 
                        className="copy-icon"
                        onClick={() => copyToClipboard(user.name)}
                      >
                        📋
                      </span>
                    )}
                  </div>
                </td>

                {/* Username */}
                <td 
                  onMouseEnter={() => { setHoveredId(user.id); setHoveredField('username'); }}
                  onMouseLeave={() => { setHoveredId(null); setHoveredField(null); }}
                >
                  <div className="copyable-cell">
                    <span>@{user.username?.split('/').pop()}</span>
                    {hoveredId === user.id && hoveredField === 'username' && (
                      <span 
                        className="copy-icon"
                        onClick={() => copyToClipboard(user.username?.split('/').pop() || user.username)}
                      >
                        📋
                      </span>
                    )}
                  </div>
                </td>

                {/* Email */}
                <td 
                  onMouseEnter={() => { setHoveredId(user.id); setHoveredField('email'); }}
                  onMouseLeave={() => { setHoveredId(null); setHoveredField(null); }}
                >
                  <div className="copyable-cell">
                    <span>{user.email}</span>
                    {hoveredId === user.id && hoveredField === 'email' && (
                      <span 
                        className="copy-icon"
                        onClick={() => copyToClipboard(user.email)}
                      >
                        📋
                      </span>
                    )}
                  </div>
                </td>

                {/* Группа */}
                <td 
                  onMouseEnter={() => { setHoveredId(user.id); setHoveredField('group'); }}
                  onMouseLeave={() => { setHoveredId(null); setHoveredField(null); }}
                >
                  <div className="copyable-cell">
                    <span className={`badge ${!user.group || user.group === 'Unmanaged' ? 'badge-warning' : 'badge-default'}`}>
                      {!user.group || user.group === 'Unmanaged' ? 'Unmanaged' : user.group}
                    </span>
                    {hoveredId === user.id && hoveredField === 'group' && (
                      <span 
                        className="copy-icon"
                        onClick={() => copyToClipboard(user.group || 'Unmanaged')}
                      >
                        📋
                      </span>
                    )}
                  </div>
                </td>

                {/* Телефон */}
                <td 
                  onMouseEnter={() => { setHoveredId(user.id); setHoveredField('phone'); }}
                  onMouseLeave={() => { setHoveredId(null); setHoveredField(null); }}
                >
                  <div className="copyable-cell">
                    <span>{user.phone}</span>
                    {hoveredId === user.id && hoveredField === 'phone' && (
                      <span 
                        className="copy-icon"
                        onClick={() => copyToClipboard(user.phone)}
                      >
                        📋
                      </span>
                    )}
                  </div>
                </td>

                {/* Кнопка удаления */}
                <td>
                  <button className="delete-btn" onClick={() => onDelete(user)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}