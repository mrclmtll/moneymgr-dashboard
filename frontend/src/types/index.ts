// Types matching expected backend API structure
// These mirror what the FastAPI backend would return

export interface Transaction {
  id: string;
  date: string;           // ISO date string
  account: string;        // Konten
  category: string;         // Kategorie
  subcategory: string;      // Unterkategorie
  note: string;           // Notiz
  amount: number;         // EUR
  type: 'income' | 'expense';  // Einnahmen/Ausgaben
  description: string;      // Beschreibung
  originalAmount: number; // Betrag
  currency: string;       // Währung
}

export interface AccountBalance {
  date: string;
  account: string;
  balance: number;
}

export interface MonthlySummary {
  month: string;          // Format: "2024-01"
  monthLabel: string;     // Format: "Jan 2024"
  income: number;
  expenses: number;
  netBalance: number;
}

export interface AccountUsage {
  account: string;
  transactionCount: number;
  totalVolume: number;
  lastUsed: string;
}

export interface DashboardData {
  transactions: Transaction[];
  accountBalances: AccountBalance[];
  monthlySummaries: MonthlySummary[];
  accountUsage: AccountUsage[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    transactionCount: number;
  };
}
