import { useState, useEffect, useCallback, useMemo } from 'react';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const response = await fetch('/api/users.json');

        
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const addUser = useCallback((newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, userWithId]);
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  }, []);

  const existingGroups = useMemo(() => {
    const groupSet = new Set();
    users.forEach(user => {
      if (user.group && user.group !== 'Unmanaged') {
        groupSet.add(user.group);
      }
    });
    return Array.from(groupSet).sort();
  }, [users]);

  useEffect(() => {
  console.log('Всего пользователей:', users.length);
  console.log('Последний пользователь:', users[users.length - 1]);
}, [users]);

  const groups = useMemo(() => {
    const groupMap = new Map();
    
    users.forEach(user => {
      if (user.group !== 'Unmanaged') {
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
    return users.filter(user => user.group === 'Unmanaged');
  }, [users]);

  return {
    users,
    loading,
    error,
    addUser,
    deleteUser,
    groups,
    unmanagedUsers,
    existingGroups,
  };
}