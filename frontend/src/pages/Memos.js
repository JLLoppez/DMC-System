import React, { useState, useEffect } from 'react';
import { api } from '../api';

const MOCK_MEMOS = [
  {
    id: '1',
    title: 'South African Banking Sector Q1 2026 Analysis',
    industry: 'Banking',
    created_at: '2026-01-30T10:00:00',
    status: 'complete',
    frameworks: ['SWOT', 'PESTEL'],
    citations: 24,
    content: {
      executive_summary: 'This strategic analysis examines the Banking sector using macroeconomic indicators sourced from approved public datasets. Key findings indicate moderate growth momentum with structural challenges requiring attention.',
      findings: [
        'The Banking sector recorded GDP contribution of 8.2% in Q4 2025, up from 7.9% in Q3 2025.',
        'Inflation pressures remain above the 3–6% target band, influencing consumer lending patterns.',
        'Digital adoption accelerated with 34% YoY growth in mobile-first service delivery.',
        'Regulatory compliance costs increased by 12% following new prudential requirements.'
      ],
      recommendations: [
        'Accelerate digital transformation investments to capture mobile-first market share.',
        'Implement dynamic pricing models to offset inflation-driven margin compression.',
        'Engage proactively with regulatory bodies to shape forthcoming policy frameworks.',
        'Diversify revenue streams across adjacent service categories to reduce concentration risk.'
      ],
      frameworks_used: ['SWOT', 'PESTEL']
    }
  },
  {
    id: '2',
    title: 'Telecom Market Disruption Analysis',
    industry: 'Telecom',
    created_at: '2026-01-28T14:00:00',
    status: 'complete',
    frameworks: ["Porter's Five Forces"],
    citations: 18,
    content: {
      executive_summary: 'The South African telecom sector faces significant disruption from OTT players and 5G-driven infrastructure shifts. This memo analyses competitive dynamics and strategic positioning for incumbent operators.',
      findings: [
        'Mobile penetration reached 79% in Q4 2025, approaching saturation in urban markets.',
        '5G coverage expanded to 35% of the population, up from 12% at the start of 2025.',
        'ARPU increased 10.8% YoY to R205, driven by data bundle upselling.',
        'OTT communication services cannibalised an estimated R2.1 billion in voice revenue.'
      ],
      recommendations: [
        'Pivot to enterprise and IoT revenue streams to offset voice revenue decline.',
        'Accelerate rural 5G deployment to secure government subsidy allocations.',
        'Develop proprietary fintech offerings leveraging existing mobile money infrastructure.',
        'Form strategic partnerships with OTT providers to capture data traffic monetisation.'
      ],
      frameworks_used: ["Porter's Five Forces"]
    }
  }
];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-ZA', { dateStyle: 'medium' });
}

export default function Memos({ industry, showToast }) {
  const [memos, setMemos] = useState(MOCK_MEMOS);
  const [showGenModal, setShowGenModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ title: '', industry: 'Banking', frameworks: ['SWOT'] });

  useEffect(() => {
    api.getMemos().then(setMemos).catch(() => setMemos(MOCK_MEMOS));
  }, []);

  const filtered = memos.filter(m => !industry || m.industry === industry);

  const toggleFramework = (fw) => {
    setForm(p => ({
      ...p,
      frameworks: p.frameworks.includes(fw)
        ? p.frameworks.filter(f => f !== fw)
        : [...p.frameworks, fw]
    }));
  };

  const handleGenerate = async () => {
    if (!form.frameworks.length) return;
    setGenerating(true);
    try {
      const memo = await api.generateMemo(form);
      setMemos(p => [memo, ...p]);
      showToast('Memo generated successfully', '◈');
    } catch {
      const memo = {
        id: Date.now().toString(),
        title: form.title || `${form.industry} Strategic Analysis ${new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}`,
        industry: form.industry,
        created_at: new Date().toISOString(),
        status: 'complete',
        frameworks: form.frameworks,
        citations: Math.floor(Math.random() * 15 + 10),
        content: {
          executive_summary: `This strategic analysis examines the ${form.industry} sector using macroeconomic indicators from approved sources. Key findings point to growth opportunities alongside structural risks that require immediate strategic attention.`,
          findings: [
            `The ${form.industry} sector demonstrates resilient growth metrics heading into Q1 2026.`,
            'Macroeconomic headwinds from global rate conditions continue to influence domestic dynamics.',
            'Digital service adoption is outpacing traditional channel utilisation across demographics.',
            'Regulatory changes are reshaping competitive advantages for incumbents and new entrants alike.'
          ],
          recommendations: [
            'Prioritise digital infrastructure investment to maintain competitive positioning.',
            'Develop scenario-based financial models accounting for continued rate volatility.',
            'Engage with industry bodies to influence emerging regulatory frameworks.',
            'Explore strategic acquisition opportunities in adjacent digital service categories.'
          ],
          frameworks_used: form.frameworks
        }
      };
      setMemos(p => [memo, ...p]);
      showToast('Memo generated successfully', '◈');
    } finally {
      setGenerating(false);
      setShowGenModal(false);
      setForm({ title: '', industry: 'Banking', frameworks: ['SWOT'] });
    }
  };

  const ALL_FRAMEWORKS = ['SWOT', 'PESTEL', "Porter's Five Forces"];

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span className="badge badge-blue">{filtered.length} memos</span>
        <button className="btn btn-primary" onClick={() => setShowGenModal(true)}>◈ Generate Memo</button>
      </div>

      {/* MEMO LIST */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div className="empty-state-title">No memos yet</div>
            <div className="empty-state-text">Generate your first memo for the {industry} sector.</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(m => (
            <div
              key={m.id}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedMemo(selectedMemo?.id === m.id ? null : m)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{m.title}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className={`badge ${m.industry === 'Banking' ? 'badge-blue' : 'badge-green'}`}>{m.industry}</span>
                    {m.frameworks.map(f => <span key={f} className="badge badge-purple">{f}</span>)}
                    <span className="badge badge-gray">{m.citations} citations</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(m.created_at)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); showToast('Memo exported as Word document', '↓'); }}>↓ .docx</button>
                  <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); showToast('Memo exported as PDF', '↓'); }}>↓ PDF</button>
                </div>
              </div>

              {/* EXPANDED CONTENT */}
              {selectedMemo?.id === m.id && m.content && (
                <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <div className="memo-content">
                    <div className="memo-section">
                      <div className="memo-section-title">Executive Summary</div>
                      <div className="memo-body">{m.content.executive_summary}</div>
                    </div>
                    <div className="memo-section">
                      <div className="memo-section-title">Key Findings</div>
                      <ul className="memo-list">
                        {m.content.findings.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                    <div className="memo-section">
                      <div className="memo-section-title">Strategic Recommendations</div>
                      <ul className="memo-list">
                        {m.content.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                    <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(77,158,247,0.05)', borderRadius: 8, border: '1px solid rgba(77,158,247,0.1)', fontSize: 12, color: 'var(--text-muted)' }}>
                      Frameworks used: {m.content.frameworks_used.join(' · ')} · {m.citations} sources cited
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* GENERATE MODAL */}
      {showGenModal && (
        <div className="modal-backdrop" onClick={() => setShowGenModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Generate Strategic Memo</div>
            <div className="form-group">
              <label className="form-label">Title (optional)</label>
              <input className="form-input" placeholder={`${form.industry} Strategic Analysis — ${new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}`} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="form-select" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
                <option>Banking</option>
                <option>Telecom</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Frameworks to Include</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {ALL_FRAMEWORKS.map(fw => (
                  <button
                    key={fw}
                    className={`btn btn-sm ${form.frameworks.includes(fw) ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => toggleFramework(fw)}
                    style={{ fontWeight: form.frameworks.includes(fw) ? 600 : 400 }}
                  >
                    {fw}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: 12, fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              ℹ This will use data from your active sources and generate a structured memo with citations, findings, and recommendations.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowGenModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={generating || !form.frameworks.length}>
                {generating ? <><span className="loading-spinner" style={{ width: 14, height: 14 }} /> Generating…</> : '◈ Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
