import React, { useState, useEffect } from 'react';
import { api } from '../api';

const BANKING_SWOT = {
  type: 'SWOT', industry: 'Banking',
  quadrants: {
    strengths: ['Strong capital adequacy ratios above regulatory minimums', 'Established digital banking infrastructure', 'Diversified revenue streams across retail and corporate'],
    weaknesses: ['Rising cost-to-income ratio pressuring margins', 'Legacy core banking systems limiting agility', 'Exposure to unsecured consumer credit risk'],
    opportunities: ['Financial inclusion driving new customer segments', 'Open banking regulation enabling ecosystem plays', 'Cross-border payment corridors in SADC region'],
    threats: ['Fintech disruption in payments and lending', 'Interest rate volatility impacting NIM', 'Cybersecurity threats and data breach risk']
  }
};

const TELECOM_SWOT = {
  type: 'SWOT', industry: 'Telecom',
  quadrants: {
    strengths: ['High mobile penetration driving subscriber growth', 'Robust 4G/LTE network infrastructure', 'Strong brand recognition across sub-Saharan Africa'],
    weaknesses: ['Slow 5G rollout compared to global peers', 'High spectrum acquisition costs', 'Customer satisfaction scores below global benchmarks'],
    opportunities: ['IoT and enterprise connectivity demand acceleration', 'Rural connectivity subsidies from government', 'Mobile money and fintech partnership opportunities'],
    threats: ['OTT players reducing voice and SMS revenue', 'Price wars compressing ARPU', 'Regulatory uncertainty on spectrum allocation']
  }
};

const BANKING_PESTEL = {
  Political: 'Stable regulatory environment under SARB oversight; policy continuity post-2024 elections supports sector confidence.',
  Economic: 'GDP growth of 1.8% in 2025; inflation moderating toward 4.5% target; repo rate at 7.25% influencing lending activity.',
  Social: 'Growing middle class demanding digital-first banking; financial literacy initiatives broadening addressable market.',
  Technological: 'Cloud adoption accelerating; AI-driven credit scoring improving risk management; blockchain pilots underway.',
  Environmental: 'ESG mandates requiring green finance disclosure; climate risk stress testing now regulatory requirement.',
  Legal: 'POPIA compliance requiring significant data governance investment; Basel III finalisation impacts capital planning.'
};

const TELECOM_PESTEL = {
  Political: 'Government prioritising digital inclusion; ICT White Paper signals supportive regulatory intent.',
  Economic: 'Consumer spending constrained by inflation; enterprise digitisation budgets expanding; ZAR volatility affects capex.',
  Social: 'Youth-dominant population driving mobile-first services; remote work normalising data consumption.',
  Technological: '5G deployment accelerating; edge computing enabling new B2B services; eSIM adoption growing.',
  Environmental: 'Tower electrification targets; carbon footprint reporting mandatory for JSE-listed entities.',
  Legal: 'ICASA licensing reforms; data localisation requirements under consideration; POPIA enforcement active.'
};

const BANKING_PORTER = {
  'Competitive Rivalry': { rating: 4, description: 'High concentration among Big 4 banks; price competition intensifying in retail banking; differentiation shifting to digital experience.' },
  'Threat of New Entrants': { rating: 2, description: 'High capital requirements and regulatory barriers limit traditional entry; however, neobanks and fintechs face lower barriers.' },
  'Threat of Substitutes': { rating: 4, description: 'Mobile money platforms, crypto, and buy-now-pay-later services substituting traditional banking products.' },
  'Buyer Power': { rating: 3, description: 'Retail customers have moderate switching capability; corporate clients leverage scale for preferential pricing.' },
  'Supplier Power': { rating: 2, description: 'Core banking vendors have leverage; cloud providers increasing competition reduces dependency on single suppliers.' }
};

const TELECOM_PORTER = {
  'Competitive Rivalry': { rating: 4, description: 'Three major operators dominate; aggressive price competition on data bundles; brand loyalty eroding.' },
  'Threat of New Entrants': { rating: 2, description: 'Spectrum scarcity and infrastructure costs create high barriers; MVNOs present lower-cost entry points.' },
  'Threat of Substitutes': { rating: 5, description: 'OTT communication apps (WhatsApp, Zoom) substituting voice and SMS revenue streams significantly.' },
  'Buyer Power': { rating: 3, description: 'Consumers increasingly price-sensitive; low switching costs between operators; MVNO options expanding choice.' },
  'Supplier Power': { rating: 2, description: 'Network equipment vendors consolidated (Huawei, Ericsson, Nokia); tower companies gaining bargaining power.' }
};

const PESTEL_COLORS = ['blue', 'green', 'amber', 'cyan', 'purple', 'red'];
const PESTEL_LETTERS = { Political: 'P', Economic: 'E', Social: 'S', Technological: 'T', Environmental: 'E2', Legal: 'L' };

function PorterBar({ rating, max = 5 }) {
  const pct = (rating / max) * 100;
  const cls = pct >= 70 ? 'high' : pct >= 40 ? 'medium' : 'low';
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div className="force-bar-track" style={{ flex: 1, marginRight: 8 }}>
          <div className={`force-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 28 }}>{rating}/{max}</span>
      </div>
    </div>
  );
}

export default function Frameworks({ industry, showToast }) {
  const [active, setActive] = useState('SWOT');
  const [running, setRunning] = useState(false);

  const swot = industry === 'Banking' ? BANKING_SWOT : TELECOM_SWOT;
  const pestel = industry === 'Banking' ? BANKING_PESTEL : TELECOM_PESTEL;
  const porter = industry === 'Banking' ? BANKING_PORTER : TELECOM_PORTER;

  const handleRun = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 1200));
    setRunning(false);
    showToast(`${active} analysis complete`, '◉');
  };

  return (
    <div>
      {/* TABS + RUN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="tabs">
          {['SWOT', 'PESTEL', "Porter's Five Forces"].map(fw => (
            <button key={fw} className={`tab ${active === fw ? 'active' : ''}`} onClick={() => setActive(fw)}>{fw}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => showToast('Framework exported as PDF', '↓')}>↓ Export</button>
          <button className="btn btn-primary btn-sm" onClick={handleRun} disabled={running}>
            {running ? <><span className="loading-spinner" style={{ width: 12, height: 12 }} /> Running…</> : '▶ Run Analysis'}
          </button>
        </div>
      </div>

      {/* HEADER */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className={`badge ${industry === 'Banking' ? 'badge-blue' : 'badge-green'}`}>{industry}</span>
        <span className="badge badge-purple">{active}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Based on collected data · {new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</span>
      </div>

      {/* SWOT */}
      {active === 'SWOT' && (
        <div>
          <div className="swot-grid">
            {[
              { key: 'strengths', label: 'Strengths', icon: '↑' },
              { key: 'weaknesses', label: 'Weaknesses', icon: '↓' },
              { key: 'opportunities', label: 'Opportunities', icon: '◎' },
              { key: 'threats', label: 'Threats', icon: '⚠' },
            ].map(({ key, label, icon }) => (
              <div key={key} className={`swot-cell ${key}`} style={{ border: '1px solid var(--border)' }}>
                <div className="swot-label">{icon} {label}</div>
                {swot.quadrants[key].map((item, i) => (
                  <div key={i} className="swot-item">{item}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
            Assumptions editable · Data sourced from active collection modules
          </div>
        </div>
      )}

      {/* PESTEL */}
      {active === 'PESTEL' && (
        <div className="pestel-grid">
          {Object.entries(pestel).map(([key, text], i) => (
            <div key={key} className="pestel-cell">
              <div className="pestel-letter">{key[0]}</div>
              <div className="pestel-title">{key}</div>
              <div className="pestel-text">{text}</div>
            </div>
          ))}
        </div>
      )}

      {/* PORTER */}
      {active === "Porter's Five Forces" && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Porter's Five Forces — {industry}</div>
              <div className="card-subtitle">Competitive intensity analysis · Scale: 1 (Low) → 5 (High)</div>
            </div>
          </div>
          <div>
            {Object.entries(porter).map(([name, force]) => {
              const pct = (force.rating / 5) * 100;
              const cls = pct >= 70 ? 'high' : pct >= 40 ? 'medium' : 'low';
              const clrMap = { high: 'var(--accent-red)', medium: 'var(--accent-amber)', low: 'var(--accent-green)' };
              return (
                <div key={name} className="force-item">
                  <div className="force-name">{name}</div>
                  <div className="force-bar-wrap">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div className="force-bar-track" style={{ flex: 1 }}>
                        <div className={`force-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: clrMap[cls], width: 32 }}>{force.rating}/5</span>
                      <span className={`badge ${cls === 'high' ? 'badge-amber' : cls === 'medium' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: 10 }}>
                        {cls === 'high' ? 'High' : cls === 'medium' ? 'Moderate' : 'Low'}
                      </span>
                    </div>
                    <div className="force-desc">{force.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(77,158,247,0.04)', borderRadius: 8, border: '1px solid rgba(77,158,247,0.08)', fontSize: 12, color: 'var(--text-muted)' }}>
            Overall competitive intensity for {industry}:&nbsp;
            <strong style={{ color: 'var(--accent-amber)' }}>
              {Math.round(Object.values(porter).reduce((a, f) => a + f.rating, 0) / Object.values(porter).length * 10) / 10}/5
            </strong>
            &nbsp;— Moderately competitive environment with selective high-intensity forces.
          </div>
        </div>
      )}
    </div>
  );
}
