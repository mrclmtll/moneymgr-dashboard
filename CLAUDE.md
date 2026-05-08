# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoneyMgr Dashboard is a full-stack web application for analyzing and visualizing personal financial data exported from the MoneyMgr iOS app. The application reads `.xlsx` export files and displays charts for account balance history, income vs expenses, and monthly balance tracking.

**Note:** This project is currently in the planning/setup phase. The frontend and backend directories do not exist yet and need to be created.

## Tech Stack

- **Frontend:** React with Vite
- **Backend:** Python with FastAPI
- **Data Processing:** pandas for `.xlsx` file handling
- **Package Management:** Likely npm/yarn for frontend, pip/uv/poetry for backend

## Project Structure (Intended)

```
/
├── frontend/          # React + Vite application
│   ├── package.json
│   └── ...
├── backend/           # FastAPI Python application
│   ├── data/          # Place `.xlsx` export files here
│   ├── main.py
│   └── requirements.txt or pyproject.toml
├── start.sh           # Script to run both frontend and backend
└── README.md
```

## Data Format

The application expects Excel (`.xlsx`) exports with these columns:
`Zeitraum` | `Konten` | `Kategorie` | `Unterkategorie` | `Notiz` | `EUR` | `Einnahmen/Ausgaben` | `Beschreibung` | `Betrag` | `Währung` | `Konten`

## Common Commands (To Be Verified After Setup)

**Development (after start.sh is created):**
```bash
./start.sh           # Start both frontend and backend simultaneously
```

**Frontend (once created):**
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server (usually http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend (once created):**
```bash
cd backend
# For pip:
pip install -r requirements.txt
uvicorn main:app --reload   # Start FastAPI dev server

# Or for uv:
uv pip install -r pyproject.toml
uv run uvicorn main:app --reload
```

## Prerequisites

- Node.js (for frontend)
- Python 3.10+ (for backend)
- MoneyMgr `.xlsx` export file placed in `/backend/data/`

## Features (Planned)

- **Current:** Account balance history line chart, income vs expenses diverging bar chart, monthly balance tracking, account usage insights
- **Future:** Frontend file upload, file history/selection, SQLite database migration, generic dataset support

## Git Ignore Notes

The `.gitignore` already configured for:
- Python: `__pycache__/`, `.venv/`, `.env`, `.tox/`, `.pytest_cache/`
- Node: `node_modules/` should be added once frontend is initialized
- IDE: `.vscode/`, `.idea/`, `.cursor/`
- Data: Never commit `.xlsx` files or local databases to git
