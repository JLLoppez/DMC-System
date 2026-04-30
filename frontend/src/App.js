import React, { useState, useEffect } from 'react';
import './styles/global.css';
import Dashboard from './pages/Dashboard';
import DataSources from './pages/DataSources';
import Memos from './pages/Memos';
import Analytics from './pages/Analytics';
import Frameworks from './pages/Frameworks';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡', section: 'overview' },
  { id: 'sources', label: 'Data Sources', icon: '⊞', section: 'data' },
  { id: 'analytics', label: 'Analytics', icon: '◳', section: 'analysis' },
  { id: 'memos', label: 'Memos', icon: '◈', section: 'analysis' },
  { id: 'frameworks', label: 'Frameworks', icon: '◉', section: 'analysis' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [industry, setIndustry] = useState('Banking');
  const [toast, setToast] = useState(null);

  const showToast = (msg, icon = '✓') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3200);
  };

  const pages = {
    dashboard: <Dashboard industry={industry} showToast={showToast} />,
    sources: <DataSources industry={industry} showToast={showToast} />,
    analytics: <Analytics industry={industry} showToast={showToast} />,
    memos: <Memos industry={industry} showToast={showToast} />,
    frameworks: <Frameworks industry={industry} showToast={showToast} />,
  };

  const pageMeta = {
    dashboard: { title: 'Overview', sub: 'System summary and recent activity' },
    sources: { title: 'Data Sources', sub: 'Manage scrapers and manual uploads' },
    analytics: { title: 'Analytics', sub: 'Comparison tables and trend visualisations' },
    memos: { title: 'Memos', sub: 'AI-generated strategic analysis documents' },
    frameworks: { title: 'Frameworks', sub: 'SWOT · Porter\'s Five Forces · PESTEL' },
  };

  const sections = ['overview', 'data', 'analysis'];
  const sectionLabels = { overview: 'Overview', data: 'Data', analysis: 'Analysis' };

  return (
    <div className="app-shell">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">DMC</div>
          <div className="logo-text">Management</div>
          <div className="logo-sub">Consultant System</div>
        </div>

        {sections.map(sec => (
          <div key={sec}>
            <div className="nav-section-label">{sectionLabels[sec]}</div>
            {NAV.filter(n => n.section === sec).map(n => (
              <div
                key={n.id}
                className={`nav-item ${page === n.id ? 'active' : ''}`}
                onClick={() => setPage(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="system-status">
            <div className="status-dot" />
            All systems operational
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            v1.0.0 · MVP
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-content">
        <div className="top-bar">
          <div className="page-title-area">
            <h1>{pageMeta[page]?.title}</h1>
            <p>{pageMeta[page]?.sub}</p>
          </div>
          <div className="top-bar-actions">
            <div
              className="industry-badge"
              onClick={() => setIndustry(i => i === 'Banking' ? 'Telecom' : 'Banking')}
              title="Click to switch industry"
            >
              <span style={{ color: industry === 'Banking' ? 'var(--accent-blue)' : 'var(--accent-cyan)' }}>●</span>
              {industry}
              <span style={{ fontSize: 10, opacity: 0.5 }}>⇄</span>
            </div>
          </div>
        </div>

        <div className="page-content">
          {pages[page]}
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {NAV.map(n => (
            <div
              key={n.id}
              className={`mobile-nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span className="mob-icon">{n.icon}</span>
              {n.label}
            </div>
          ))}
        </div>
      </nav>

      {/* ── TOAST ── */}
      {toast && (
        <div className="toast">
          <span className="toast-icon">{toast.icon}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
