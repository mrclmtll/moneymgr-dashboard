import { useEffect, useState } from 'react';
import type { AccountUsage as AccountUsageType } from '../types';
import { api } from '../services/api';
import './Charts.css';

export function AccountUsage() {
  const [data, setData] = useState<AccountUsageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardData().then((dashboardData) => {
      setData(dashboardData.accountUsage);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="chart-loading">Loading account usage...⏳</div>;
  }

  const maxVolume = Math.max(...data.map((d) => d.totalVolume));

  return (
    <div className="chart-container">
      <h3 className="chart-title">🏦 Account Usage</h3>
      <div className="account-usage-list">
        {data.map((account) => (
          <div key={account.account} className="account-usage-item">
            <div className="account-usage-header">
              <span className="account-name">{account.account}</span>
              <span className="account-transactions">
                {account.transactionCount} transactions
              </span>
            </div>
            <div className="account-usage-bar-container">
              <div
                className="account-usage-bar"
                style={{
                  width: `${(account.totalVolume / maxVolume) * 100}%`,
                }}
              />
            </div>
            <div className="account-usage-footer">
              <span className="account-volume">
                €{account.totalVolume.toLocaleString()} volume
              </span>
              <span className="account-last-used">
                Last used: {account.lastUsed}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
