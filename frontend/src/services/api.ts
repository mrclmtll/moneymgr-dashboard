import type {
  Transaction,
  AccountBalance,
  MonthlySummary,
  AccountUsage,
  DashboardData,
} from '../types';

// ============================================
// CONFIGURATION - Toggle between mock and real API
// ============================================
// Set VITE_USE_MOCK_API=true in .env to use mock data
// Set VITE_USE_MOCK_API=false (or remove) to use real backend API
// const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
const USE_MOCK_API = true; // Default to mock for easy setup

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============================================
// MOCK DATA - Realistic financial data
// ============================================

const MOCK_ACCOUNTS = ['Girokonto', 'Sparkonto', 'Kreditkarte', 'Bargeld'];

const MOCK_CATEGORIES = [
  'Lebensmittel',
  'Transport',
  'Unterhaltung',
  'Miete',
  'Gehalt',
  'Versicherung',
  'Gesundheit',
  'Shopping',
];

// Generate transactions for the last 6 months
function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < 150; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 180));

    const isIncome = Math.random() > 0.7;
    const amount = isIncome
      ? Math.round(Math.random() * 2000 + 1000) // Income: 1000-3000
      : Math.round(Math.random() * 200 + 10); // Expense: 10-210

    transactions.push({
      id: `txn_${i}`,
      date: date.toISOString().split('T')[0],
      account: MOCK_ACCOUNTS[Math.floor(Math.random() * MOCK_ACCOUNTS.length)],
      category: MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)],
      subcategory: '',
      note: '',
      amount: isIncome ? amount : -amount,
      type: isIncome ? 'income' : 'expense',
      description: isIncome ? 'Gehalt / Einkommen' : `Ausgabe: ${MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)]}`,
      originalAmount: amount,
      currency: 'EUR',
    });
  }

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate account balance history (last 90 days)
function generateMockAccountBalances(): AccountBalance[] {
  const balances: AccountBalance[] = [];
  const now = new Date();
  let currentBalance = 5000;

  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random daily fluctuation
    const change = Math.round((Math.random() - 0.4) * 200);
    currentBalance += change;

    balances.push({
      date: date.toISOString().split('T')[0],
      account: MOCK_ACCOUNTS[0], // Primary account
      balance: currentBalance,
    });
  }

  return balances;
}

// Generate monthly summaries
function generateMockMonthlySummaries(): MonthlySummary[] {
  const summaries: MonthlySummary[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const income = Math.round(2500 + Math.random() * 1000);
    const expenses = Math.round(1500 + Math.random() * 800);

    summaries.push({
      month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      monthLabel: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
      income,
      expenses,
      netBalance: income - expenses,
    });
  }

  return summaries;
}

// Generate account usage statistics
function generateMockAccountUsage(): AccountUsage[] {
  return MOCK_ACCOUNTS.map((account) => ({
    account,
    transactionCount: Math.floor(Math.random() * 50 + 10),
    totalVolume: Math.round(Math.random() * 10000 + 2000),
    lastUsed: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString().split('T')[0],
  }));
}

// Generate complete dashboard data
function generateMockDashboardData(): DashboardData {
  const transactions = generateMockTransactions();
  const monthlySummaries = generateMockMonthlySummaries();
  const totalIncome = monthlySummaries.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = monthlySummaries.reduce((sum, m) => sum + m.expenses, 0);

  return {
    transactions,
    accountBalances: generateMockAccountBalances(),
    monthlySummaries,
    accountUsage: generateMockAccountUsage(),
    summary: {
      totalIncome,
      totalExpenses,
      currentBalance: transactions.reduce((sum, t) => sum + t.amount, 5000), // Start with 5000 base
      transactionCount: transactions.length,
    },
  };
}

// ============================================
// API SERVICE - Mock or Real
// ============================================

class MockApiService {
  async getDashboardData(): Promise<DashboardData> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateMockDashboardData();
  }

  async getTransactions(): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return generateMockTransactions();
  }

  async getAccountBalances(): Promise<AccountBalance[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return generateMockAccountBalances();
  }

  async getMonthlySummaries(): Promise<MonthlySummary[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return generateMockMonthlySummaries();
  }
}

class RealApiService {
  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getDashboardData(): Promise<DashboardData> {
    return this.fetch<DashboardData>('/api/dashboard');
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.fetch<Transaction[]>('/api/transactions');
  }

  async getAccountBalances(): Promise<AccountBalance[]> {
    return this.fetch<AccountBalance[]>('/api/balances');
  }

  async getMonthlySummaries(): Promise<MonthlySummary[]> {
    return this.fetch<MonthlySummary[]>('/api/monthly');
  }
}

// Export singleton instance
export const api = USE_MOCK_API ? new MockApiService() : new RealApiService();

// Export flag so components can check if using mock
export const isMockApi = USE_MOCK_API;
