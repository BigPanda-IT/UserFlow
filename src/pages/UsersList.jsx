import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { UsersTable } from '../components/UsersTable';
import { AddUserModal } from '../components/AddUserModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import './UsersList.css';

export function UsersList() {
  const { users, loading, error, addUser, deleteUser, existingGroups } = useUsers();
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
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Фильтрация
  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return users;
    const term = debouncedSearchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term) ||
      (
        user.group && user.group.toLowerCase().includes(term) 
      ) ||
      (
        !user.group && 'Unmanaged'.toLowerCase().includes(term)
      ) ||
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

      if (sortField === 'group') {
        aVal = aVal ? aVal.group : 'Unmanaged';
        bVal = bVal ? bVal.group : 'Unmanaged';
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

  // Текущие пользователи (пагинация)
  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [sortedUsers, currentPage, usersPerPage]);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Сброс на первую страницу при поиске или сортировке
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

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

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setActionLoading(true);
      setActionError(null);
      const result = await deleteUser(userToDelete.id);
      setActionLoading(false);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        setActionError(result.error || 'Не удалось удалить пользователя');
      }
    }
  };


  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (formData.name) {
      setActionLoading(true);
      setActionError(null);
      const username = formData.username || `companydamian/${formData.name.replace(/\s/g, '')}`;
      const group = formData.group || 'Unmanaged';
      const result = await addUser({ ...formData, username, group });
      setActionLoading(false);
      if (result.success) {
        setFormData({ name: '', username: '', email: '', group: '', phone: '' });
        setIsAddModalOpen(false);
      } else {
        setActionError(result.error || 'Не удалось добавить пользователя');
      }
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
            Страница: {currentPage} из {totalPages || 1}
          </p>
        </div>
        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          + Добавить
        </button>
      </div>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <UsersTable
        users={currentUsers}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onDelete={handleDeleteClick}
      />

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
                return page === 1 || 
                       page === totalPages || 
                       (page >= currentPage - 2 && page <= currentPage + 2);
              })
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="pagination-dots">...</span>
                  )}
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


      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); }}
        onAdd={addUser}
        existingGroups={existingGroups}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name}
      />
    </div>
  );
}
