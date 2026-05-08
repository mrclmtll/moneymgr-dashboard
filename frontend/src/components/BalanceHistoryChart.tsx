import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { api } from '../services/api';
import type { AccountBalance } from '../types';
import './Charts.css';

export function BalanceHistoryChart() {
  const [data, setData] = useState<AccountBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAccountBalances().then((balances) => {
      setData(balances);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="chart-loading">Loading balance history...⏳</div>;
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">📈 Account Balance History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(parseISO(value), 'MMM d')}
            stroke="#666"
            fontSize={12}
          />
          <YAxis
            tickFormatter={(value) => `€${(value / 1000).toFixed(1)}k`}
            stroke="#666"
            fontSize={12}
          />
          <Tooltip
            formatter={(value: number) => [`€${value.toFixed(2)}`, 'Balance']}
            labelFormatter={(label) => format(parseISO(label as string), 'MMM d, yyyy')}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
            fill="#4f46e5"
            fillOpacity={0.1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
