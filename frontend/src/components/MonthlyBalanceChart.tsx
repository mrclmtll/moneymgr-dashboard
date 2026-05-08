import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { MonthlySummary } from '../types';
import { api } from '../services/api';
import './Charts.css';

export function MonthlyBalanceChart() {
  const [data, setData] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMonthlySummaries().then((summaries) => {
      setData(summaries);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="chart-loading">Loading monthly balance...⏳</div>;
  }

  // Calculate average net balance
  const avgBalance = data.reduce((sum, item) => sum + item.netBalance, 0) / data.length;

  return (
    <div className="chart-container">
      <h3 className="chart-title">📊 Monthly Net Balance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => `€${(value / 1000).toFixed(1)}k`}
            stroke="#666"
            fontSize={12}
          />
          <Tooltip
            formatter={(value: number) => [`€${value.toFixed(2)}`, 'Net Balance']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <ReferenceLine
            y={0}
            stroke="#999"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={avgBalance}
            stroke="#22c55e"
            strokeDasharray="5 5"
            label={{
              value: `Avg: €${avgBalance.toFixed(0)}`,
              position: 'right',
              fill: '#22c55e',
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="netBalance"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
