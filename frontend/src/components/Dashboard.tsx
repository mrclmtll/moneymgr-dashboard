import { useEffect, useState } from 'react';
import { BalanceHistoryChart } from './BalanceHistoryChart';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { MonthlyBalanceChart } from './MonthlyBalanceChart';
import { AccountUsage } from './AccountUsage';
import { api, isMockApi } from '../services/api';
import type { DashboardData } from '../types';
import './Dashboard.css';

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardData['summary'] | null>(null);

  useEffect(() => {
    api.getDashboardData().then((data) => {
      setSummary(data.summary);
    });
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>💰 MoneyMgr Dashboard</h1>
        {isMockApi && (
          <span className="mock-badge">🧪 Using Mock Data</span>
        )}
      </header>

      {summary && (
        <div className="summary-cards">
          <div className="summary-card income">
            <div className="summary-label">Total Income</div>
            <div className="summary-value">{formatCurrency(summary.totalIncome)}</div>
          </div>
          <div className="summary-card expenses">
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value">{formatCurrency(summary.totalExpenses)}</div>
          </div>
          <div className="summary-card balance">
            <div className="summary-label">Current Balance</div>
            <div className="summary-value">{formatCurrency(summary.currentBalance)}</div>
          </div>
          <div className="summary-card transactions">
            <div className="summary-label">Transactions</div>
            <div className="summary-value">{summary.transactionCount}</div>
          </div>
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-row">
          <div className="chart-col-2">
            <BalanceHistoryChart />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-col-1">
            <IncomeExpenseChart />
          </div>
          <div className="chart-col-1">
            <MonthlyBalanceChart />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-col-2">
            <AccountUsage />
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>
          MoneyMgr Dashboard • Built with React + Vite + Recharts
          {isMockApi && (
            <>
              {' '}<br />
              <small>
                To switch to real API, set <code>VITE_USE_MOCK_API=false</code> in your{' '}
                <code>.env</code> file and restart the dev server.
              </small>
            </>
          )}
        </p>
      </footer>
    </div>
  );
}
