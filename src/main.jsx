import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AchievementSystem from './components/AchievementSystem.jsx';
import './styles.css';
import './achievements.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <AchievementSystem />
  </React.StrictMode>,
);
