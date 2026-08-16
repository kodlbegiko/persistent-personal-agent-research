import React from 'react';
import ReactDOM from 'react-dom/client';
import './data/recoveryOverlay.js';
import App from './App.jsx';
import PolishedAchievementSystem from './components/PolishedAchievementSystem.jsx';
import { LanguageProvider } from './i18n.jsx';
import './styles.css';
import './achievements.css';
import './research-lines.css';
import './roadmap-interactions.css';
import './macbook.css';
import './i18n.css';
import './polish.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
      <PolishedAchievementSystem />
    </LanguageProvider>
  </React.StrictMode>,
);
