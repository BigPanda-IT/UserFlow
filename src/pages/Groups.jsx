import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import './Groups.css';

export function Groups() {
  const { groups, unmanagedUsers, loading, error } = useUsers();
  const [selectedGroup, setSelectedGroup] = useState(null);

  const getGroupStyle = (groupName) => {
    const styles = {
      'CDM/Managers': { icon: '👔', color: '#a948de' },
      'CDM/Financials': { icon: '💰', color: '#10b981' },
      'CDN/Human resources': { icon: '👥', color: '#f59e0b' },
      'CDN/Kvants': { icon: '📊', color: '#bda6f3' },
      'CDN/Outsourced': { icon: '🤝', color: '#ec489a' },
      'CDN/Sales': { icon: '📈', color: '#ef4444' },
      'CDN/Top Kevins': { icon: '⭐', color: '#67f47e' },
      'CONVEO': { icon: '🚀', color: '#06b6d4' },
    };
    return styles[groupName] || { icon: '📁', color: '#3c29ba' };
  };

  if (loading) {
    return (
      <div className="groups-loading">
        <div className="spinner"></div>
        <p>Загрузка групп...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="groups-error">
        <div className="error-icon">⚠️</div>
        <h2>Ошибка загрузки</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="groups-page">
      <div className="groups-header">
        <h1>📁 Группы пользователей</h1>
        <p className="groups-stats">
          Всего групп: {groups.length} | Без группы: {unmanagedUsers.length}
        </p>
      </div>

      <div className="groups-grid">
        {groups.map((group, idx) => {
          const style = getGroupStyle(group.name);

          return (
            <div key={group.name} className="group-card">
            <div 
              className="group-card-header"
              onClick={() => setSelectedGroup(selectedGroup === group.name ? null : group.name)}
            > 
              <div className="group-icon" style={{ backgroundColor: style.color }}>
                {style.icon}
              </div>
              <div className="group-info">
                <h3>{group.name}</h3>
                <span>
                  {group.count} {group.count === 1 ? 'участник' : 'участников'}
                </span>
              </div>
              <div className="expand">
                {selectedGroup === group.name ? '▲' : '▼'}
              </div>
            </div>
            
            {selectedGroup === group.name && (
              <div className="group-members">
                {group.users.map(user => (
                  <div key={user.id} className="member">
                    <div className="member-avatar">{user.name.charAt(0)}</div>
                    <div>
                      <div className="member-name">{user.name}</div>
                      <div className="member-email">{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )
        })}
      </div>

      {unmanagedUsers.length > 0 && (
        <div className="unmanaged-section">
          <h2>👤 Пользователи без группы</h2>
          <div className="unmanaged-list">
            {unmanagedUsers.map(user => (
              <div key={user.id} className="unmanaged-card">
                <div className="unmanaged-avatar">{user.name.charAt(0)}</div>
                <div>
                  <div className="unmanaged-name">{user.name}</div>
                  <div className="unmanaged-email">{user.email}</div>
                </div>
                <div className="unmanaged-badge">Без группы</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}