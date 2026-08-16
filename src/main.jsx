
import React from 'react';
import ReactDOM from 'react-dom/client';
import './navigation-state.js';
import App from './App.jsx';
import AppErrorBoundary from './components/AppErrorBoundary.jsx';
import NorthStarRoadmap from './components/NorthStarRoadmap.jsx';
import LiveResearchPulse from './components/LiveResearchPulse.jsx';
import ControlPlaneMetaPanel from './components/ControlPlaneMetaPanel.jsx';
import { LanguageProvider } from './i18n.jsx';
import './styles.css';
import './achievements.css';
import './research-lines.css';
import './roadmap-interactions.css';
import './macbook.css';
import './i18n.css';
import './polish.css';
import './detail-fixes.css';
import './plain-progress.css';
import './research-history.css';
import './live-pulse.css';
import './control-plane.css';
import './final-polish.css';

const params = new URLSearchParams(window.location.search);
const queryLanguage = params.get('lang');
const savedLanguage = window.localStorage.getItem('jarvis-dashboard-language');
const initialLanguage = queryLanguage === 'en' || queryLanguage === 'en-US' ? 'en' : queryLanguage === 'zh-Hant' || queryLanguage === 'zh-TW' || queryLanguage === 'zh' ? 'zh-Hant' : savedLanguage === 'en' ? 'en' : 'zh-Hant';
document.documentElement.lang = initialLanguage;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><LanguageProvider>
    <AppErrorBoundary name="verified-dashboard" label="VERIFIED DASHBOARD DEGRADED"><App /></AppErrorBoundary>
    <AppErrorBoundary name="control-plane" label="CONTROL PLANE METADATA DEGRADED"><ControlPlaneMetaPanel /></AppErrorBoundary>
    <AppErrorBoundary name="live-pulse" label="DEGRADED LIVE DATA" description="Verified research dashboard remains available."><LiveResearchPulse /></AppErrorBoundary>
    <AppErrorBoundary name="north-star-roadmap" label="ROADMAP DEGRADED"><NorthStarRoadmap /></AppErrorBoundary>
  </LanguageProvider></React.StrictMode>,
);
