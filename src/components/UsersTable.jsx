import React, { useState } from 'react';
import './UsersTable.css';

export function UsersTable({ users, sortField, sortDirection, onSort, onDelete }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [copyIconPosition, setCopyIconPosition] = useState({ x: 0, y: 0, visible: false });

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const copyToClipboard = (text) => {
    
    // Для HTTP-серверов сразу используем fallback метод
    // Clipboard API не работает в небезопасном контексте
    const fallbackCopy = () => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0'; // Скрываем элемент
      document.body.appendChild(textArea);
      
      try {
        // Выбираем текст и копируем
        textArea.select();
        textArea.setSelectionRange(0, 99999); // Для мобильных устройств
        
        const successful = document.execCommand('copy');
        
        if (successful) {
          // Показываем уведомление об успешном копировании
          showCopyNotification(text);
        } else {
          throw new Error('Fallback copy failed');
        }
      } catch (err) {
        console.error('Fallback copy error:', err);
        // Предлагаем пользователю скопировать вручную
        promptManualCopy(text);
      } finally {
        document.body.removeChild(textArea);
      }
    };
    
    // Функция показа уведомления
    const showCopyNotification = (copiedText) => {
      // Удаляем все старые уведомления
      const oldNotifications = document.querySelectorAll('.copy-notification');
      oldNotifications.forEach(notif => notif.remove());
      
      // Создаем уведомление
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.innerHTML = `
        <span class="copy-notification-icon">✅</span>
        <span>Скопировано: ${copiedText.length > 25 ? copiedText.slice(0, 25) + '...' : copiedText}</span>
      `;
      
      document.body.appendChild(notification);
      
      // Удаляем через 2 секунды с анимацией
      setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    };
    
    // Функция для ручного копирования
    const promptManualCopy = (textToCopy) => {
      // Создаем модальное окно для ручного копирования
      const modal = document.createElement('div');
      modal.className = 'manual-copy-modal';
      
      modal.innerHTML = `
        <h3>Копирование текста</h3>
        <p>Выделите текст ниже и нажмите Ctrl+C (Cmd+C на Mac)</p>
        <textarea readonly>${textToCopy}</textarea>
        <button onclick="this.parentElement.remove()">Закрыть</button>
      `;
      
      document.body.appendChild(modal);
      
      const textarea = modal.querySelector('textarea');
      textarea.select();
    };

    console.log('HTTP сервер - используем fallback метод копирования');
    fallbackCopy();

    const oldNotifications = document.querySelectorAll('.copy-notification');
    oldNotifications.forEach(notif => notif.remove());
    
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

  const handleMouseEnter = (event, userId, field) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    setCopyIconPosition({
      x: rect.right + scrollX - 30,
      y: rect.top + scrollY + rect.height / 2 - 12,
      visible: true
    });
    setHoveredId(userId);
    setHoveredField(field);
  };

  const handleMouseLeave = () => {
    setCopyIconPosition(prev => ({ ...prev, visible: false }));
    setHoveredId(null);
    setHoveredField(null);
  };

  return (
    <div className="table-wrapper">
      {copyIconPosition.visible && (
        <span
          className="copy-icon"
          style={{
            left: `${copyIconPosition.x}px`,
            top: `${copyIconPosition.y}px`
          }}
          onClick={() => {
            const user = users.find(u => u.id === hoveredId);
            if (!user) return;
            
            let textToCopy = '';
            switch (hoveredField) {
              case 'id': textToCopy = user.id; break;
              case 'name': textToCopy = user.name; break;
              case 'username': textToCopy = user.username?.split('/').pop() || user.username; break;
              case 'email': textToCopy = user.email; break;
              case 'group': textToCopy = user.group || 'Unmanaged'; break;
              case 'phone': textToCopy = user.phone; break;
              default: return;
            }
            copyToClipboard(textToCopy);
          }}
        >
          📋
        </span>
      )}
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
                  onMouseEnter={(e) => handleMouseEnter(e, user.id, 'id')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="copyable-cell">
                    <span>{user.id}</span>
                  </div>
                </td>

                {/* Имя */}
                <td
                  onMouseEnter={(e) => handleMouseEnter(e, user.id, 'name')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="copyable-cell">
                    <span>{user.name}</span>
                  </div>
                </td>

                {/* Username */}
                <td
                  onMouseEnter={(e) => handleMouseEnter(e, user.id, 'username')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="copyable-cell">
                    <span>@{user.username?.split('/').pop()}</span>
                  </div>
                </td>

                {/* Email */}
                <td
                  onMouseEnter={(e) => handleMouseEnter(e, user.id, 'email')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="copyable-cell">
                    <span>{user.email}</span>
                  </div>
                </td>

                {/* Группа */}
                <td
                  onMouseEnter={(e) => handleMouseEnter(e, user.id, 'group')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="copyable-cell">
                    <span className={`badge ${!user.group || user.group === 'Unmanaged' ? 'badge-warning' : 'badge-default'}`}>
                      {!user.group || user.group === 'Unmanaged' ? 'Unmanaged' : user.group}
                    </span>
                  </div>
                </td>

                {/* Телефон */}
                <td
                  onMouseEnter={(e) => handleMouseEnter(e, user.id, 'phone')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="copyable-cell">
                    <span>{user.phone}</span>
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