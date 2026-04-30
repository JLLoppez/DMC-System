from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import json
import os
import uuid
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# ── In-memory store (replace with PostgreSQL in production) ──────────────────
DATA_STORE = {
    "data_sources": [
        {"id": "1", "name": "World Bank Open Data", "url": "https://data.worldbank.org", "industry": "Banking", "status": "active", "last_scraped": "2026-01-30T08:00:00", "records": 142},
        {"id": "2", "name": "IMF Data Portal", "url": "https://imf.org/data", "industry": "Banking", "status": "active", "last_scraped": "2026-01-30T09:15:00", "records": 98},
        {"id": "3", "name": "GSMA Intelligence", "url": "https://gsma.com/intelligence", "industry": "Telecom", "status": "active", "last_scraped": "2026-01-29T14:00:00", "records": 67},
        {"id": "4", "name": "ITU Statistics", "url": "https://itu.int/stats", "industry": "Telecom", "status": "active", "last_scraped": "2026-01-28T11:30:00", "records": 55},
        {"id": "5", "name": "StatsSA", "url": "https://statssa.gov.za", "industry": "Banking", "status": "active", "last_scraped": "2026-01-30T07:45:00", "records": 203},
    ],
    "memos": [
        {"id": "1", "title": "South African Banking Sector Q1 2026 Analysis", "industry": "Banking", "created_at": "2026-01-30T10:00:00", "status": "complete", "frameworks": ["SWOT", "PESTEL"], "citations": 24},
        {"id": "2", "title": "Telecom Market Disruption Analysis", "industry": "Telecom", "created_at": "2026-01-28T14:00:00", "status": "complete", "frameworks": ["Porter's Five Forces"], "citations": 18},
    ],
    "data_records": [],
    "jobs": {}
}

# ── DASHBOARD ─────────────────────────────────────────────────────────────────
@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    return jsonify({
        "stats": {
            "total_sources": len(DATA_STORE["data_sources"]),
            "total_records": sum(s["records"] for s in DATA_STORE["data_sources"]),
            "memos_generated": len(DATA_STORE["memos"]),
            "frameworks_run": 5,
            "time_saved_hours": 34,
            "last_updated": datetime.now().isoformat()
        },
        "recent_activity": [
            {"type": "scrape", "message": "World Bank data collected — 142 records", "time": "2 hours ago"},
            {"type": "memo", "message": "Banking Q1 memo generated successfully", "time": "4 hours ago"},
            {"type": "framework", "message": "PESTEL analysis completed for Banking", "time": "5 hours ago"},
            {"type": "scrape", "message": "StatsSA data collected — 203 records", "time": "6 hours ago"},
            {"type": "upload", "message": "IMF CSV file uploaded and validated", "time": "1 day ago"},
        ],
        "chart_data": {
            "records_by_industry": [
                {"industry": "Banking", "records": 443},
                {"industry": "Telecom", "records": 122},
            ],
            "scraping_trend": [
                {"date": "Jan 24", "records": 120},
                {"date": "Jan 25", "records": 189},
                {"date": "Jan 26", "records": 95},
                {"date": "Jan 27", "records": 210},
                {"date": "Jan 28", "records": 167},
                {"date": "Jan 29", "records": 250},
                {"date": "Jan 30", "records": 443},
            ]
        }
    })

# ── DATA SOURCES ──────────────────────────────────────────────────────────────
@app.route("/api/sources", methods=["GET"])
def get_sources():
    return jsonify(DATA_STORE["data_sources"])

@app.route("/api/sources", methods=["POST"])
def add_source():
    data = request.json
    source = {
        "id": str(uuid.uuid4())[:8],
        "name": data.get("name"),
        "url": data.get("url"),
        "industry": data.get("industry"),
        "status": "pending",
        "last_scraped": None,
        "records": 0
    }
    DATA_STORE["data_sources"].append(source)
    return jsonify(source), 201

@app.route("/api/sources/<source_id>/scrape", methods=["POST"])
def trigger_scrape(source_id):
    job_id = str(uuid.uuid4())[:8]
    DATA_STORE["jobs"][job_id] = {"status": "running", "source_id": source_id, "progress": 0}
    # Simulate completion
    for s in DATA_STORE["data_sources"]:
        if s["id"] == source_id:
            s["last_scraped"] = datetime.now().isoformat()
            s["records"] += random.randint(10, 50)
            s["status"] = "active"
    DATA_STORE["jobs"][job_id] = {"status": "complete", "source_id": source_id, "progress": 100}
    return jsonify({"job_id": job_id, "status": "complete"})

@app.route("/api/upload", methods=["POST"])
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    industry = request.form.get("industry", "Banking")
    # Simulate processing
    records_added = random.randint(20, 80)
    source = {
        "id": str(uuid.uuid4())[:8],
        "name": f"Upload: {file.filename}",
        "url": "manual-upload",
        "industry": industry,
        "status": "active",
        "last_scraped": datetime.now().isoformat(),
        "records": records_added
    }
    DATA_STORE["data_sources"].append(source)
    return jsonify({"message": f"Imported {records_added} records", "source": source})

# ── MEMOS ─────────────────────────────────────────────────────────────────────
@app.route("/api/memos", methods=["GET"])
def get_memos():
    return jsonify(DATA_STORE["memos"])

@app.route("/api/memos/generate", methods=["POST"])
def generate_memo():
    data = request.json
    industry = data.get("industry", "Banking")
    frameworks = data.get("frameworks", ["SWOT"])
    title = data.get("title", f"{industry} Strategic Analysis {datetime.now().strftime('%B %Y')}")

    memo_id = str(uuid.uuid4())[:8]
    memo = {
        "id": memo_id,
        "title": title,
        "industry": industry,
        "created_at": datetime.now().isoformat(),
        "status": "complete",
        "frameworks": frameworks,
        "citations": random.randint(12, 28),
        "content": generate_memo_content(industry, frameworks)
    }
    DATA_STORE["memos"].append(memo)
    return jsonify(memo), 201

def generate_memo_content(industry, frameworks):
    return {
        "executive_summary": f"This strategic analysis examines the {industry} sector using macroeconomic indicators sourced from approved public datasets. Key findings indicate moderate growth momentum with structural challenges requiring attention.",
        "findings": [
            f"The {industry} sector recorded GDP contribution of 8.2% in Q4 2025, up from 7.9% in Q3 2025.",
            "Inflation pressures remain above the 3–6% target band, influencing consumer lending patterns.",
            "Digital adoption accelerated with 34% YoY growth in mobile-first service delivery.",
            "Regulatory compliance costs increased by 12% following new prudential requirements."
        ],
        "recommendations": [
            "Accelerate digital transformation investments to capture mobile-first market share.",
            "Implement dynamic pricing models to offset inflation-driven margin compression.",
            "Engage proactively with regulatory bodies to shape forthcoming policy frameworks.",
            "Diversify revenue streams across adjacent service categories to reduce concentration risk."
        ],
        "frameworks_used": frameworks
    }

@app.route("/api/memos/<memo_id>", methods=["GET"])
def get_memo(memo_id):
    for m in DATA_STORE["memos"]:
        if m["id"] == memo_id:
            if "content" not in m:
                m["content"] = generate_memo_content(m["industry"], m.get("frameworks", ["SWOT"]))
            return jsonify(m)
    return jsonify({"error": "Not found"}), 404

# ── ANALYTICS ─────────────────────────────────────────────────────────────────
@app.route("/api/analytics/<industry>", methods=["GET"])
def get_analytics(industry):
    if industry == "Banking":
        return jsonify({
            "industry": industry,
            "comparison_table": {
                "headers": ["Metric", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Trend"],
                "rows": [
                    ["GDP Contribution (%)", "7.4", "7.6", "7.9", "8.2", "↑"],
                    ["NPL Ratio (%)", "4.2", "4.0", "3.8", "3.6", "↓"],
                    ["ROE (%)", "14.1", "14.8", "15.2", "15.7", "↑"],
                    ["Capital Adequacy (%)", "16.2", "16.5", "16.8", "17.1", "↑"],
                    ["Net Interest Margin (%)", "3.8", "3.7", "3.6", "3.5", "↓"],
                    ["Cost-to-Income Ratio (%)", "56.1", "54.3", "53.0", "51.8", "↓"],
                ]
            },
            "market_share": [
                {"name": "Standard Bank", "value": 28},
                {"name": "FirstRand", "value": 25},
                {"name": "Absa Group", "value": 22},
                {"name": "Nedbank", "value": 17},
                {"name": "Other", "value": 8},
            ],
            "trend_data": {
                "labels": ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"],
                "datasets": [
                    {"label": "ROE (%)", "data": [14.1, 14.8, 15.2, 15.7]},
                    {"label": "NPL Ratio (%)", "data": [4.2, 4.0, 3.8, 3.6]},
                ]
            }
        })
    else:
        return jsonify({
            "industry": industry,
            "comparison_table": {
                "headers": ["Metric", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Trend"],
                "rows": [
                    ["Mobile Penetration (%)", "68", "71", "75", "79", "↑"],
                    ["ARPU (ZAR)", "185", "192", "198", "205", "↑"],
                    ["Churn Rate (%)", "3.2", "2.9", "2.6", "2.4", "↓"],
                    ["Data Usage (GB/user)", "6.2", "7.1", "8.4", "9.8", "↑"],
                    ["5G Coverage (%)", "12", "18", "26", "35", "↑"],
                    ["EBITDA Margin (%)", "31", "32", "33", "34", "↑"],
                ]
            },
            "market_share": [
                {"name": "Vodacom", "value": 35},
                {"name": "MTN", "value": 30},
                {"name": "Cell C", "value": 20},
                {"name": "Telkom", "value": 12},
                {"name": "Other", "value": 3},
            ],
            "trend_data": {
                "labels": ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"],
                "datasets": [
                    {"label": "Mobile Penetration (%)", "data": [68, 71, 75, 79]},
                    {"label": "5G Coverage (%)", "data": [12, 18, 26, 35]},
                ]
            }
        })

# ── STRATEGY FRAMEWORKS ───────────────────────────────────────────────────────
@app.route("/api/frameworks/<industry>/<framework>", methods=["GET"])
def get_framework(industry, framework):
    framework = framework.upper().replace("-", " ")
    data = {}

    if framework == "SWOT":
        data = {
            "type": "SWOT",
            "industry": industry,
            "quadrants": {
                "strengths": [
                    "Strong capital adequacy ratios above regulatory minimums",
                    "Established digital banking infrastructure",
                    "Diversified revenue streams across retail and corporate"
                ] if industry == "Banking" else [
                    "High mobile penetration driving subscriber growth",
                    "Robust 4G/LTE network infrastructure",
                    "Strong brand recognition across sub-Saharan Africa"
                ],
                "weaknesses": [
                    "Rising cost-to-income ratio pressuring margins",
                    "Legacy core banking systems limiting agility",
                    "Exposure to unsecured consumer credit risk"
                ] if industry == "Banking" else [
                    "Slow 5G rollout compared to global peers",
                    "High spectrum acquisition costs",
                    "Customer satisfaction scores below global benchmarks"
                ],
                "opportunities": [
                    "Financial inclusion driving new customer segments",
                    "Open banking regulation enabling ecosystem plays",
                    "Cross-border payment corridors in SADC region"
                ] if industry == "Banking" else [
                    "IoT and enterprise connectivity demand acceleration",
                    "Rural connectivity subsidies from government",
                    "Mobile money and fintech partnership opportunities"
                ],
                "threats": [
                    "Fintech disruption in payments and lending",
                    "Interest rate volatility impacting NIM",
                    "Cybersecurity threats and data breach risk"
                ] if industry == "Banking" else [
                    "OTT players reducing voice and SMS revenue",
                    "Price wars compressing ARPU",
                    "Regulatory uncertainty on spectrum allocation"
                ]
            }
        }
    elif framework == "PESTEL":
        data = {
            "type": "PESTEL",
            "industry": industry,
            "factors": {
                "Political": "Stable regulatory environment under SARB oversight; policy continuity post-2024 elections supports sector confidence." if industry == "Banking" else "Government prioritising digital inclusion; ICT White Paper signals supportive regulatory intent.",
                "Economic": "GDP growth of 1.8% in 2025; inflation moderating toward 4.5% target; repo rate at 7.25% influencing lending activity." if industry == "Banking" else "Consumer spending constrained by inflation; enterprise digitisation budgets expanding; ZAR volatility affects capex.",
                "Social": "Growing middle class demanding digital-first banking; financial literacy initiatives broadening addressable market." if industry == "Banking" else "Youth-dominant population driving mobile-first services; remote work normalising data consumption.",
                "Technological": "Cloud adoption accelerating; AI-driven credit scoring improving risk management; blockchain pilots underway." if industry == "Banking" else "5G deployment accelerating; edge computing enabling new B2B services; eSIM adoption growing.",
                "Environmental": "ESG mandates requiring green finance disclosure; climate risk stress testing now regulatory requirement." if industry == "Banking" else "Tower electrification targets; carbon footprint reporting mandatory for JSE-listed entities.",
                "Legal": "POPIA compliance requiring significant data governance investment; Basel III finalisation impacts capital planning." if industry == "Banking" else "ICASA licensing reforms; data localisation requirements under consideration; POPIA enforcement active."
            }
        }
    elif "PORTER" in framework or "FIVE" in framework:
        data = {
            "type": "Porter's Five Forces",
            "industry": industry,
            "forces": {
                "Competitive Rivalry": {"rating": 4, "max": 5, "description": "High concentration among Big 4 banks; price competition intensifying in retail banking; differentiation shifting to digital experience." if industry == "Banking" else "Three major operators dominate; aggressive price competition on data bundles; brand loyalty eroding."},
                "Threat of New Entrants": {"rating": 2, "max": 5, "description": "High capital requirements and regulatory barriers limit traditional entry; however, neobanks and fintechs face lower barriers." if industry == "Banking" else "Spectrum scarcity and infrastructure costs create high barriers; MVNOs present lower-cost entry points."},
                "Threat of Substitutes": {"rating": 4, "max": 5, "description": "Mobile money platforms, crypto, and buy-now-pay-later services substituting traditional banking products." if industry == "Banking" else "OTT communication apps (WhatsApp, Zoom) substituting voice and SMS revenue streams."},
                "Buyer Power": {"rating": 3, "max": 5, "description": "Retail customers have moderate switching capability; corporate clients leverage scale for preferential pricing." if industry == "Banking" else "Consumers increasingly price-sensitive; low switching costs between operators; MVNO options expanding choice."},
                "Supplier Power": {"rating": 2, "max": 5, "description": "Core banking vendors have leverage; cloud providers increasing competition reduces dependency on single suppliers." if industry == "Banking" else "Network equipment vendors consolidated (Huawei, Ericsson, Nokia); tower companies gaining bargaining power."}
            }
        }

    return jsonify(data)

# ── HEALTH ────────────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "version": "1.0.0", "timestamp": datetime.now().isoformat()})

if __name__ == "__main__":
    app.run(debug=True, port=5000)



# ── HOME ────────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({
        "message": "DMC API running 🚀",
        "available_endpoints": ["/api/health", "/api/dashboard", "/api/sources", "/api/memos"]
    })
