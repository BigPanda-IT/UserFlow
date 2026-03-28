import React from 'react';

export function UsersTable({ users, sortField, sortDirection, onSort, onDelete }) {
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
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
                <td>{user.id}</td>
                <td className="user-name">{user.name}</td>
                <td className="username">@{user.username?.split('/').pop()}</td>
                <td className="email">{user.email}</td>
                <td>
                  <span className={`badge ${user.group === 'Unmanaged' ? 'badge-warning' : 'badge-default'}`}>
                    {user.group === 'Unmanaged' ? 'Unmanaged' : user.group || '—'}
                  </span>
                </td>
                <td>{user.phone}</td>
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