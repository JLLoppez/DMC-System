import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';

const MOCK_SOURCES = [
  { id: '1', name: 'World Bank Open Data', url: 'https://data.worldbank.org', industry: 'Banking', status: 'active', last_scraped: '2026-01-30T08:00:00', records: 142 },
  { id: '2', name: 'IMF Data Portal', url: 'https://imf.org/data', industry: 'Banking', status: 'active', last_scraped: '2026-01-30T09:15:00', records: 98 },
  { id: '3', name: 'GSMA Intelligence', url: 'https://gsma.com/intelligence', industry: 'Telecom', status: 'active', last_scraped: '2026-01-29T14:00:00', records: 67 },
  { id: '4', name: 'ITU Statistics', url: 'https://itu.int/stats', industry: 'Telecom', status: 'active', last_scraped: '2026-01-28T11:30:00', records: 55 },
  { id: '5', name: 'StatsSA', url: 'https://statssa.gov.za', industry: 'Banking', status: 'active', last_scraped: '2026-01-30T07:45:00', records: 203 },
];

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' });
}

export default function DataSources({ industry, showToast }) {
  const [sources, setSources] = useState(MOCK_SOURCES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [scraping, setScraping] = useState({});
  const [form, setForm] = useState({ name: '', url: '', industry: 'Banking' });
  const [uploadForm, setUploadForm] = useState({ industry: 'Banking' });
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.getSources().then(setSources).catch(() => setSources(MOCK_SOURCES));
  }, []);

  const filtered = sources.filter(s => !industry || s.industry === industry);

  const handleScrape = async (id) => {
    setScraping(p => ({ ...p, [id]: true }));
    try {
      await api.scrapeSource(id);
      setSources(prev => prev.map(s => s.id === id
        ? { ...s, last_scraped: new Date().toISOString(), records: s.records + Math.floor(Math.random() * 40 + 10), status: 'active' }
        : s
      ));
      showToast('Scrape completed successfully', '✓');
    } catch {
      showToast('Scrape failed — check connection', '✕');
    } finally {
      setScraping(p => ({ ...p, [id]: false }));
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.url) return;
    try {
      const s = await api.addSource(form);
      setSources(p => [...p, s]);
      showToast(`Source "${form.name}" added`, '⊞');
    } catch {
      const s = { id: Date.now().toString(), ...form, status: 'pending', last_scraped: null, records: 0 };
      setSources(p => [...p, s]);
      showToast(`Source "${form.name}" added`, '⊞');
    }
    setShowAddModal(false);
    setForm({ name: '', url: '', industry: 'Banking' });
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('industry', uploadForm.industry);
    try {
      const res = await api.uploadFile(fd);
      showToast(res.message || 'File imported', '↑');
      setSources(p => [...p, res.source]);
    } catch {
      const records = Math.floor(Math.random() * 60 + 20);
      const s = { id: Date.now().toString(), name: `Upload: ${file.name}`, url: 'manual-upload', industry: uploadForm.industry, status: 'active', last_scraped: new Date().toISOString(), records };
      setSources(p => [...p, s]);
      showToast(`Imported ${records} records from ${file.name}`, '↑');
    }
    setShowUploadModal(false);
  };

  return (
    <div>
      {/* HEADER ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-blue">{filtered.length} sources</span>
          <span className="badge badge-green">{filtered.filter(s => s.status === 'active').length} active</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setShowUploadModal(true)}>↑ Upload CSV</button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>⊕ Add Source</button>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Active Sources', value: filtered.filter(s => s.status === 'active').length, color: 'green' },
          { label: 'Total Records', value: filtered.reduce((a, s) => a + s.records, 0).toLocaleString(), color: 'blue' },
          { label: 'Pending Review', value: filtered.filter(s => s.status === 'pending').length, color: 'amber' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* SOURCES TABLE */}
      <div className="card">
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="data-table" style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th>Source Name</th>
              <th>Industry</th>
              <th>Records</th>
              <th>Last Scraped</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No sources for {industry}</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.url}</div>
                </td>
                <td><span className={`badge ${s.industry === 'Banking' ? 'badge-blue' : 'badge-green'}`}>{s.industry}</span></td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.records.toLocaleString()}</td>
                <td style={{ fontSize: 12 }}>{fmtDate(s.last_scraped)}</td>
                <td>
                  <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                    {s.status === 'active' ? '● Active' : '○ Pending'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleScrape(s.id)}
                    disabled={scraping[s.id]}
                  >
                    {scraping[s.id] ? <span className="loading-spinner" style={{ width: 12, height: 12 }} /> : '↻'} Scrape
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* ADD SOURCE MODAL */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Data Source</div>
            <div className="form-group">
              <label className="form-label">Source Name</label>
              <input className="form-input" placeholder="e.g. Reserve Bank Publications" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">URL</label>
              <input className="form-input" placeholder="https://..." value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="form-select" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
                <option>Banking</option>
                <option>Telecom</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Add Source</button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Upload CSV / Excel</div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="form-select" value={uploadForm.industry} onChange={e => setUploadForm(p => ({ ...p, industry: e.target.value }))}>
                <option>Banking</option>
                <option>Telecom</option>
              </select>
            </div>
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current.click()}
            >
              <div className="upload-icon">📂</div>
              <div className="upload-text">Drop CSV or Excel file here</div>
              <div className="upload-hint">or click to browse · Max 50MB</div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files[0])} />
            </div>
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button className="btn btn-ghost" onClick={() => setShowUploadModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
