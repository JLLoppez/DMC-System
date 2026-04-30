# DMC System — Digital Management Consultant MVP

**Version:** 1.0.0  
**Developer:** Jose Lopes  
**Budget:** R145,000 ZAR  

---

## Overview

A web-based strategic analysis system that:
- Collects macroeconomic data from approved sources (automated scraping + manual upload)
- Stores all data with full audit trail in PostgreSQL
- Generates AI-powered strategic memos with citations
- Produces analytics tables and visualisations
- Runs Porter's Five Forces, SWOT, and PESTEL frameworks

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+ (optional for MVP — uses in-memory store by default)

### 1. Start the Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python app.py
# Runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

---

## Project Structure

```
dmc-system/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment config template
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Root component + navigation
│   │   ├── api.js          # API service layer
│   │   ├── styles/
│   │   │   └── global.css  # Design system + all styles
│   │   └── pages/
│   │       ├── Dashboard.js    # Overview + activity
│   │       ├── DataSources.js  # Source management + upload
│   │       ├── Analytics.js    # Tables + charts
│   │       ├── Memos.js        # Memo generation + viewer
│   │       └── Frameworks.js   # SWOT + PESTEL + Porter's
│   └── package.json
└── README.md
```

---

## Features (MVP)

| Feature | Status |
|---|---|
| Data source management | ✅ |
| Web scraping trigger | ✅ |
| CSV/Excel upload | ✅ |
| Source tracking + audit | ✅ |
| Analytics comparison tables | ✅ |
| Trend charts | ✅ |
| Market share charts | ✅ |
| SWOT Analysis | ✅ |
| PESTEL Analysis | ✅ |
| Porter's Five Forces | ✅ |
| Memo generation | ✅ |
| Memo export (Word/PDF) | ✅ (backend hooks ready) |
| Industry switching | ✅ |
| ROI dashboard | ✅ |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard` | Dashboard stats + activity |
| GET | `/api/sources` | List all data sources |
| POST | `/api/sources` | Add new source |
| POST | `/api/sources/:id/scrape` | Trigger scrape job |
| POST | `/api/upload` | Upload CSV/Excel |
| GET | `/api/memos` | List all memos |
| GET | `/api/memos/:id` | Get memo detail |
| POST | `/api/memos/generate` | Generate new memo |
| GET | `/api/analytics/:industry` | Get analytics data |
| GET | `/api/frameworks/:industry/:fw` | Get framework data |
| GET | `/api/health` | Health check |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Python + Flask |
| Database | PostgreSQL (in-memory for MVP) |
| Frontend | React 18 |
| Charts | Recharts |
| AI Integration | Claude API (Anthropic) |
| Styling | Custom CSS Design System |
| Document Export | python-docx + ReportLab |

---

## Monthly Operating Costs (Estimated)

| Item | Cost (ZAR) |
|---|---|
| Hosting (VPS) | R300–500 |
| Claude API usage | R500–1,500 |
| Database backup | R200 |
| Domain + SSL | R100 |
| Monitoring | R200 |
| **Total** | **R2,500–4,000** |

---

## Future Expansion

- Multi-user access with roles: R20,000
- Automated scheduled reports: R15,000
- Advanced scraping (JS-heavy sites): R25,000
- Additional industries: R8,000–12,000 each
- Mobile app: R60,000–80,000
- Predictive analytics: R30,000–50,000

---

# DMC-System
