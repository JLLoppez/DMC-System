import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';

const MOCK = {
  stats: { total_sources: 5, total_records: 565, memos_generated: 2, frameworks_run: 5, time_saved_hours: 34 },
  recent_activity: [
    { type: 'scrape', message: 'World Bank data collected — 142 records', time: '2 hours ago' },
    { type: 'memo', message: 'Banking Q1 memo generated successfully', time: '4 hours ago' },
    { type: 'framework', message: 'PESTEL analysis completed for Banking', time: '5 hours ago' },
    { type: 'scrape', message: 'StatsSA data collected — 203 records', time: '6 hours ago' },
    { type: 'upload', message: 'IMF CSV file uploaded and validated', time: '1 day ago' },
  ],
  chart_data: {
    scraping_trend: [
      { date: 'Jan 24', records: 120 }, { date: 'Jan 25', records: 189 },
      { date: 'Jan 26', records: 95 }, { date: 'Jan 27', records: 210 },
      { date: 'Jan 28', records: 167 }, { date: 'Jan 29', records: 250 },
      { date: 'Jan 30', records: 443 },
    ],
    records_by_industry: [
      { industry: 'Banking', records: 443 },
      { industry: 'Telecom', records: 122 },
    ]
  }
};

const STATS = [
  { key: 'total_sources', label: 'Data Sources', icon: '⊞', color: 'blue', change: '+1 this week', dir: 'up' },
  { key: 'total_records', label: 'Total Records', icon: '◳', color: 'cyan', change: '+203 today', dir: 'up' },
  { key: 'memos_generated', label: 'Memos Generated', icon: '◈', color: 'green', change: 'All complete', dir: 'up' },
  { key: 'frameworks_run', label: 'Frameworks Run', icon: '◉', color: 'purple', change: 'Across 2 industries', dir: 'up' },
  { key: 'time_saved_hours', label: 'Hours Saved', icon: '⏱', color: 'amber', change: 'vs manual process', dir: 'up' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
        <div style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{payload[0].value} records</div>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ industry }) {
  const [data, setData] = useState(MOCK);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.dashboard().then(setData).catch(() => setData(MOCK));
  }, []);

  const { stats, recent_activity, chart_data } = data;

  return (
    <div>
      {/* STATS */}
      <div className="stats-grid">
        {STATS.map(s => (
          <div key={s.key} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-value">{stats[s.key]?.toLocaleString()}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-change ${s.dir}`}>
              {s.dir === 'up' ? '↑' : '↓'} {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid-2-1" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Records Collected Over Time</div>
              <div className="card-subtitle">Daily accumulation across all sources</div>
            </div>
            <span className="badge badge-blue">7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chart_data.scraping_trend}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4d9ef7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4d9ef7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="records" stroke="#4d9ef7" strokeWidth={2} fill="url(#blueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">By Industry</div>
              <div className="card-subtitle">Record distribution</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chart_data.records_by_industry} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="industry" tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} />
              <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                  <div style={{ color: 'var(--text-muted)' }}>{label}</div>
                  <div style={{ color: '#00e5a0', fontWeight: 600 }}>{payload[0].value} records</div>
                </div>
              ) : null} />
              <Bar dataKey="records" fill="#00e5a0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIVITY + ROI */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
            <span className="badge badge-gray">Live</span>
          </div>
          {recent_activity.map((a, i) => (
            <div key={i} className="activity-item">
              <div className={`activity-dot ${a.type}`} />
              <div>
                <div className="activity-text">{a.message}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">ROI Summary</div>
            <span className="badge badge-green">+ve</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Time per report (manual)', value: '22–38 hrs', color: 'var(--accent-red)' },
              { label: 'Time per report (system)', value: '3–4 hrs', color: 'var(--accent-green)' },
              { label: 'Hours saved (this month)', value: '34 hrs', color: 'var(--accent-blue)' },
              { label: 'Value at R1,500/hr rate', value: 'R51,000+', color: 'var(--accent-amber)' },
              { label: 'Payback period', value: '1.5–3 months', color: 'var(--accent-purple)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
