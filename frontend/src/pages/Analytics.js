import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../api';

const BANKING = {
  comparison_table: {
    headers: ['Metric', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Trend'],
    rows: [
      ['GDP Contribution (%)', '7.4', '7.6', '7.9', '8.2', '↑'],
      ['NPL Ratio (%)', '4.2', '4.0', '3.8', '3.6', '↓'],
      ['ROE (%)', '14.1', '14.8', '15.2', '15.7', '↑'],
      ['Capital Adequacy (%)', '16.2', '16.5', '16.8', '17.1', '↑'],
      ['Net Interest Margin (%)', '3.8', '3.7', '3.6', '3.5', '↓'],
      ['Cost-to-Income Ratio (%)', '56.1', '54.3', '53.0', '51.8', '↓'],
    ]
  },
  market_share: [
    { name: 'Standard Bank', value: 28 },
    { name: 'FirstRand', value: 25 },
    { name: 'Absa Group', value: 22 },
    { name: 'Nedbank', value: 17 },
    { name: 'Other', value: 8 },
  ],
  trend_data: {
    labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
    datasets: [
      { label: 'ROE (%)', data: [14.1, 14.8, 15.2, 15.7] },
      { label: 'NPL Ratio (%)', data: [4.2, 4.0, 3.8, 3.6] },
    ]
  }
};

const TELECOM = {
  comparison_table: {
    headers: ['Metric', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Trend'],
    rows: [
      ['Mobile Penetration (%)', '68', '71', '75', '79', '↑'],
      ['ARPU (ZAR)', '185', '192', '198', '205', '↑'],
      ['Churn Rate (%)', '3.2', '2.9', '2.6', '2.4', '↓'],
      ['Data Usage (GB/user)', '6.2', '7.1', '8.4', '9.8', '↑'],
      ['5G Coverage (%)', '12', '18', '26', '35', '↑'],
      ['EBITDA Margin (%)', '31', '32', '33', '34', '↑'],
    ]
  },
  market_share: [
    { name: 'Vodacom', value: 35 },
    { name: 'MTN', value: 30 },
    { name: 'Cell C', value: 20 },
    { name: 'Telkom', value: 12 },
    { name: 'Other', value: 3 },
  ],
  trend_data: {
    labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
    datasets: [
      { label: 'Mobile Penetration (%)', data: [68, 71, 75, 79] },
      { label: '5G Coverage (%)', data: [12, 18, 26, 35] },
    ]
  }
};

const COLORS = ['#4d9ef7', '#00e5a0', '#a78bfa', '#f59e0b', '#f56565'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function Analytics({ industry, showToast }) {
  const data = industry === 'Banking' ? BANKING : TELECOM;
  const [tab, setTab] = useState('table');

  const trendChartData = data.trend_data.labels.map((label, i) => ({
    label,
    ...Object.fromEntries(data.trend_data.datasets.map(d => [d.label, d.data[i]]))
  }));

  return (
    <div>
      {/* INDUSTRY TAG */}
      <div style={{ marginBottom: 20 }}>
        <span className={`badge ${industry === 'Banking' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: 12, padding: '5px 12px' }}>
          {industry} Sector · Q4 2025 Data
        </span>
      </div>

      {/* TABS */}
      <div className="tabs" style={{ marginBottom: 20, width: 'fit-content' }}>
        {['table', 'trends', 'market'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'table' ? 'Comparison Table' : t === 'trends' ? 'Trend Chart' : 'Market Share'}
          </button>
        ))}
      </div>

      {/* COMPARISON TABLE */}
      {tab === 'table' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{industry} — Key Performance Metrics</div>
              <div className="card-subtitle">Quarterly comparison · Source: World Bank, IMF, StatsSA</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('Table exported to Excel', '↓')}>
              ↓ Export
            </button>
          </div>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="data-table" style={{ minWidth: 520 }}>
              <thead>
                <tr>{data.comparison_table.headers.map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.comparison_table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        fontWeight: j === 0 ? 500 : 400,
                        color: j === 0 ? 'var(--text-primary)' : j === row.length - 1 ? 'inherit' : 'var(--text-secondary)'
                      }}>
                        {j === row.length - 1
                          ? <span className={cell === '↑' ? 'trend-up' : 'trend-down'}>{cell}</span>
                          : cell
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TREND CHART */}
      {tab === 'trends' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{industry} — Trend Analysis</div>
              <div className="card-subtitle">Key metrics over time · 2025</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('Chart exported as PNG', '↓')}>
              ↓ Export PNG
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#4a5568' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#4a5568' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
              {data.trend_data.datasets.map((d, i) => (
                <Line key={d.label} type="monotone" dataKey={d.label} stroke={COLORS[i]} strokeWidth={2} dot={{ fill: COLORS[i], r: 4 }} activeDot={{ r: 6 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MARKET SHARE */}
      {tab === 'market' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Market Share</div>
                <div className="card-subtitle">{industry} · Q4 2025</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.market_share} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" paddingAngle={3}>
                  {data.market_share.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Breakdown</div>
            </div>
            <div>
              {data.market_share.map((item, i) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i], flexShrink: 0, boxShadow: `0 0 8px ${COLORS[i]}` }} />
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{item.name}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: 16 }}>{item.value}%</div>
                  <div style={{ width: 80, height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${item.value}%`, height: '100%', background: COLORS[i], borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
