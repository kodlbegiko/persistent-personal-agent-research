import React from 'react';
import ReactDOM from 'react-dom/client';
import './data/recoveryOverlay.js';
import App from './App.jsx';
import AchievementSystem from './components/AchievementSystem.jsx';
import { LanguageProvider } from './i18n.jsx';
import './styles.css';
import './achievements.css';
import './macbook.css';
import './i18n.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
      <AchievementSystem />
    </LanguageProvider>
  </React.StrictMode>,
);
