import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export function Welcome() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: '🔍',
      title: 'Умный поиск',
      description: 'Мгновенный поиск по всем полям',
      tooltip: '🎯 Поиск по имени, email, группе или телефону\n⏱️ Задержка поиска на 500мс для оптимизации\n📋 Копирование данных при наведении на текст',
      details: 'Поиск работает по всем полям: имя, email, username, группа, телефон. Регистр не важен. Результаты обновляются автоматически.'
    },
    {
      icon: '📊',
      title: 'Сортировка',
      description: 'Сортировка по любому столбцу',
      tooltip: '⬆️ Сортировка по возрастанию (А→Я, 1→9)\n⬇️ Сортировка по убыванию (Я→А, 9→1)\n🖱️ Срабатывает при клике по заголовку таблицы',
      details: 'Кликните на заголовок таблицы для сортировки. Повторный клик меняет направление. Иконка ↑ или ↓ показывает текущий порядок.'
    },
    {
      icon: '➕',
      title: 'Управление',
      description: 'Добавление и удаление пользователей',
      tooltip: '➕ Добавление нового пользователя через форму\n🗑️ Удаление пользователя с подтверждением\n📱 Все данные сохраняются локально',
      details: 'Добавляйте пользователей через модальное окно. Удаление требует подтверждения — случайное удаление невозможно.'
    },
    {
      icon: '📁',
      title: 'Группы',
      description: 'Автоматическая группировка по отделам',
      tooltip: '🏢 Несколько отделов компании\n👥 Пользователи без группы в отдельном списке\n🎨 Каждая группа имеет уникальную иконку и цвет',
      details: 'Пользователи автоматически группируются по отделам. Раскройте группу, чтобы увидеть всех участников. У каждой группы свой цвет и иконка.'
    }
  ];

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
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-item"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              
              {/* Всплывающая подсказка */}
              {hoveredFeature === index && (
                <div className="feature-tooltip">
                  <div className="tooltip-content">
                    {feature.tooltip.split('\n').map((line, i) => (
                      <div key={i} className="tooltip-line">{line}</div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}