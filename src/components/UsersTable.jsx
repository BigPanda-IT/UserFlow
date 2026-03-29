import React, { useState } from 'react';
import './UsersTable.css';

export function UsersTable({ users, sortField, sortDirection, onSort, onDelete }) {

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
                <td>
                  <div className="copyable-cell">
                    <span>{user.id}</span>
                    <span
                      className="copy-icon"
                      onClick={() => copyToClipboard(user.id)}
                    >
                      📋
                    </span>
                  </div>
                </td>

                {/* Имя */}
                <td>
                  <div className="copyable-cell">
                    <span>{user.name}</span>
                    <span
                      className="copy-icon"
                      onClick={() => copyToClipboard(user.name)}
                    >
                      📋
                    </span>
                  </div>
                </td>

                {/* Username */}
                <td>
                  <div className="copyable-cell">
                    <span>@{user.username?.split('/').pop()}</span>
                    <span
                      className="copy-icon"
                      onClick={() => copyToClipboard(user.username?.split('/').pop() || user.username)}
                    >
                      📋
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td>
                  <div className="copyable-cell">
                    <span>{user.email}</span>
                    <span
                      className="copy-icon"
                      onClick={() => copyToClipboard(user.email)}
                    >
                      📋
                    </span>
                  </div>
                </td>

                {/* Группа */}
                <td>
                  <div className="copyable-cell">
                    <span className={`badge ${!user.group || user.group === 'Unmanaged' ? 'badge-warning' : 'badge-default'}`}>
                      {!user.group || user.group === 'Unmanaged' ? 'Unmanaged' : user.group}
                    </span>
                    <span
                      className="copy-icon"
                      onClick={() => copyToClipboard(user.group || 'Unmanaged')}
                    >
                      📋
                    </span>
                  </div>
                </td>

                {/* Телефон */}
                <td>
                  <div className="copyable-cell">
                    <span>{user.phone}</span>
                    <span
                      className="copy-icon"
                      onClick={() => copyToClipboard(user.phone)}
                    >
                      📋
                    </span>
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