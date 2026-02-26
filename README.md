# MoneyMgr Dashboard 📊

A full-stack web application designed to analyze and visualize personal financial data exported from the [MoneyMgr app](https://apps.apple.com/de/app/haushaltsbuch-money-manager/id560481810). 

## 🚀 Tech Stack

* **Frontend:** React (Vite) - Lightweight, fast, and perfect for generating AI-assisted UI components.
* **Backend:** Python with FastAPI - High performance, easy to read, and great for data manipulation.
* **Data Processing:** `pandas` (Python) for handling `.xlsx` files.

## 📈 Features & Dashboards

### Current Capabilities (MVP)
* **Local File Reading:** Automatically loads the `.xlsx` export file from a dedicated local backend folder.
* **Account Balance History:** A line chart visualizing the balance over time.
* **Income vs. Expenses:** A diverging bar chart (green bars above the x-axis for income, red bars below for expenses) for quick visual comparison.
* **Monthly Balance:** A line chart tracking the monthly net balance.
* **Account Usage:** Insights into which accounts are utilized the most.

### 🔮 Planned / Future Features
* **Frontend File Upload:** Allow users to upload new `.xlsx` files directly via the UI.
* **File History & Selection:** Keep track of previously uploaded files and allow switching between different datasets.
* **Lightweight Database:** Migrate from reading raw Excel files on every start to a single-file database approach (e.g., SQLite) for better performance and history management.
* **Universal Data Mode:** Abstract the visualization logic to accept and plot generic datasets beyond just MoneyMgr exports.

## 🗂️ Data Structure

The application expects an Excel (`.xlsx`) export with the following column structure:
`Zeitraum` | `Konten` | `Kategorie` | `Unterkategorie` | `Notiz` | `EUR` | `Einnahmen/Ausgaben` | `Beschreibung` | `Betrag` | `Währung` | `Konten`

## 🛠️ Getting Started (Local Development)

The application is split into two separate services but can be started easily using a provided bash script.

### Prerequisites
* Node.js (for the React Frontend)
* Python 3.10+ (for the FastAPI Backend)

### Setup & Run
1. Clone the repository.
2. Place your MoneyMgr `.xlsx` export file into the `/backend/data/` folder.
3. Run the startup script to initialize both the frontend and backend servers simultaneously:
   ```bash
   ./start.sh
   ```
4. Open your browser and navigate to the local frontend URL (usually http://localhost:5173).
