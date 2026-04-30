const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  dashboard: () => request('/api/dashboard'),
  getSources: () => request('/api/sources'),
  addSource: (data) => request('/api/sources', { method: 'POST', body: JSON.stringify(data) }),
  scrapeSource: (id) => request(`/api/sources/${id}/scrape`, { method: 'POST' }),
  uploadFile: (formData) => fetch(`${BASE}/api/upload`, { method: 'POST', body: formData }).then(r => r.json()),
  getMemos: () => request('/api/memos'),
  getMemo: (id) => request(`/api/memos/${id}`),
  generateMemo: (data) => request('/api/memos/generate', { method: 'POST', body: JSON.stringify(data) }),
  getAnalytics: (industry) => request(`/api/analytics/${industry}`),
  getFramework: (industry, fw) => request(`/api/frameworks/${industry}/${fw}`),
};
