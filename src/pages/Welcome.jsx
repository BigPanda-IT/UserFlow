import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <h1 className="welcome-title">
          <span className="gradient"> Система управления пользователями</span>
        </h1>
        <p className="welcome-description">
          Удобный инструмент для управления пользователями и группами.
          Поиск, сортировка, добавление и удаление — всё в одном месте.
        </p>
        <div className="welcome-buttons">
          <button className="btn-primary-lg" onClick={() => navigate('/users')}>
            Перейти к пользователям →
          </button>
          <button className="btn-secondary-lg" onClick={() => navigate('/groups')}>
            Просмотреть группы
          </button>
        </div>
      </div>

      <div className="welcome-features">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <h3>Умный поиск</h3>
            <p>Мгновенный поиск по всем полям</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Сортировка</h3>
            <p>Сортировка по любому столбцу</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">➕</div>
            <h3>Управление</h3>
            <p>Добавление и удаление пользователей</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📁</div>
            <h3>Группы</h3>
            <p>Автоматическая группировка по отделам</p>
          </div>
        </div>
      </div>
    </div>
  );
}