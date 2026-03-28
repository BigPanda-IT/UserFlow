import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useDebounce } from '../hooks/useDebounce';
import './UsersList.css';

export function UsersList() {
  const { users, loading, error, addUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    group: '',
    phone: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // const

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Фильтрация
  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return users;
    const term = debouncedSearchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term) ||
      user.group.toLowerCase().includes(term) ||
      user.phone.includes(term)
    );
  }, [users, debouncedSearchTerm]);

  // Сортировка
  const sortedUsers = useMemo(() => {
    if (!sortField) return filteredUsers;
    
    return [...filteredUsers].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'id') {
        aVal = parseInt(aVal);
        bVal = parseInt(bVal);
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [sortedUsers, currentPage]);

  // Вычисляем количество страниц
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  // Функция для смены страницы
  const goToPage = (page) => {
    setCurrentPage(page);
    // Прокручиваем вверх страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      const username = formData.username || `companydamian/${formData.name.replace(/\s/g, '')}`;
      const group = formData.group || 'Unmanaged';
      addUser({ ...formData, username, group });
      setFormData({ name: '', username: '', email: '', group: '', phone: '' });
      setIsAddModalOpen(false);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Загрузка пользователей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
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
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1>👥 Пользователи</h1>
          <p className="stats">
            Всего: {users.length} | Найдено: {sortedUsers.length} |
            Страница: {currentPage} из {totalPages}
          </p>
        </div>
        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          + Добавить
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Поиск по имени, email, группе..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-btn" onClick={() => setSearchTerm('')}>✕</button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">ID {getSortIcon('id')}</th>
              <th onClick={() => handleSort('name')} className="sortable">Имя {getSortIcon('name')}</th>
              <th onClick={() => handleSort('username')} className="sortable">Username {getSortIcon('username')}</th>
              <th onClick={() => handleSort('email')} className="sortable">Email {getSortIcon('email')}</th>
              <th onClick={() => handleSort('group')} className="sortable">Группа {getSortIcon('group')}</th>
              <th onClick={() => handleSort('phone')} className="sortable">Телефон {getSortIcon('phone')}</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty">
                  <div>📭</div>
                  <p>Пользователи не найдены</p>
                </td>
              </tr>
            ) : (
              currentUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="user-name">{user.name}</td>
                  <td className="username">@{user.username?.split('/').pop()}</td>
                  <td className="email">{user.email}</td>
                  <td>
                    <span className={`badge ${user.group === 'Unmanaged' || !user.group ? 'badge-warning' : 'badge-default'}`}>
                      {user.group === 'Unmanaged' || !user.group ? 'Unmanaged' : user.group}
                    </span>
                  </td>
                  <td>{user.phone}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteClick(user)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {sortedUsers.length > usersPerPage && (
        <div className="pagination">
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Назад
          </button>
          
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Показываем текущую страницу, соседние и первую/последнюю
                return page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 2 && page <= currentPage + 2);
              })
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && <span className="pagination-dots">...</span>}
                  <button
                    onClick={() => goToPage(page)}
                    className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
          </div>
          
          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Вперед →
          </button>
        </div>
      )}

      {/* Модалка добавления */}
      {isAddModalOpen && (
        <div className="modal" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Добавить пользователя</h2>
              <button className="close" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Имя *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="companydamian/username" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Группа</label>
                <input type="text" value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} placeholder="CDM/Managers" />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel" onClick={() => setIsAddModalOpen(false)}>Отмена</button>
                <button type="submit" className="submit">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модалка удаления */}
      {isDeleteModalOpen && userToDelete && (
        <div className="modal" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Подтверждение</h2>
              <button className="close" onClick={() => setIsDeleteModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">⚠️</div>
              <p>Удалить пользователя <strong>{userToDelete.name}</strong>?</p>
              <p className="warning-text">Это действие нельзя отменить</p>
            </div>
            <div className="modal-actions">
              <button className="cancel" onClick={() => setIsDeleteModalOpen(false)}>Отмена</button>
              <button className="danger" onClick={handleConfirmDelete}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}