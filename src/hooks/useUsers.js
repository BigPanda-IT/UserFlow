import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE = '/api/employees';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/`);

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = useCallback(async (newUser) => {
    try {
      const response = await fetch(`${API_BASE}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(`Ошибка создания пользователя: ${response.status}`);
      }

      const created = await response.json();
      setUsers(prev => [...prev, created]);
      return { success: true, user: created };
    } catch (err) {
      console.error('Ошибка добавления:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления пользователя: ${response.status}`);
      }

      setUsers(prev => prev.filter(user => user.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Ошибка удаления:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const groups = useMemo(() => {
    const groupMap = new Map();

    users.forEach(user => {
      if (user.group && user.group !== 'Unmanaged') {
        if (!groupMap.has(user.group)) {
          groupMap.set(user.group, {
            name: user.group,
            count: 0,
            users: []
          });
        }
        groupMap.get(user.group).count++;
        groupMap.get(user.group).users.push(user);
      }
    });

    return Array.from(groupMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const unmanagedUsers = useMemo(() => {
    return users.filter(user => !user.group || user.group === 'Unmanaged');
  }, [users]);

  return {
    users,
    loading,
    error,
    addUser,
    deleteUser,
    groups,
    unmanagedUsers,
    refetch: fetchUsers,
  };
}
