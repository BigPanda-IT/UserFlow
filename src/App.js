import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { Welcome } from './pages/Welcome';
import { UsersList } from './pages/UsersList';
import { Groups } from './pages/Groups';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <img src="https://cdn3.iconfinder.com/data/icons/ux-ui/512/user_flow-1024.png" alt="picture-logo" className="logo-icon"/>
          <span className="logo-text">UserFlow</span>
        </div>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Главная
          </Link>
          <Link to="/users" className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}>
            Пользователи
          </Link>
          <Link to="/groups" className={`nav-link ${location.pathname === '/groups' ? 'active' : ''}`}>
            Группы
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/groups" element={<Groups />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;