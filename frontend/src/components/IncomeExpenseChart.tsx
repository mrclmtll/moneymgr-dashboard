import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MonthlySummary } from '../types';
import { api } from '../services/api';
import './Charts.css';

export function IncomeExpenseChart() {
  const [data, setData] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMonthlySummaries().then((summaries) => {
      // Transform data: income positive, expenses negative for diverging effect
      const transformed = summaries.map((s) => ({
        ...s,
        expenses: -s.expenses, // Make expenses negative
      }));
      setData(transformed);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="chart-loading">Loading income/expenses...⏳</div>;
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">💰 Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="monthLabel"
            stroke="#666"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={(value) => `€${(Math.abs(value) / 1000).toFixed(1)}k`}
            stroke="#666"
            fontSize={12}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `€${Math.abs(value).toFixed(2)}`,
              name === 'expenses' ? 'Expenses' : 'Income',
            ]}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
