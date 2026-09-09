// Frontend API Client for Bro-Stop Backend Server
const API_BASE = '/api';

export const api = {
  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth: Login
  async login({ identifier, name }) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, name })
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch (err) {
      console.warn('API login failed, using local auth:', err);
      return null;
    }
  },

  // Expenses: Fetch
  async getExpenses(userId = 'user_aaryan') {
    try {
      const res = await fetch(`${API_BASE}/expenses?userId=${userId}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      return data.expenses || [];
    } catch (err) {
      console.warn('API getExpenses failed:', err);
      return null;
    }
  },

  // Expenses: Add
  async addExpense(expenseData) {
    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
      if (!res.ok) throw new Error('Add expense failed');
      const data = await res.json();
      return data.expense;
    } catch (err) {
      console.warn('API addExpense failed:', err);
      return null;
    }
  },

  // Expenses: Delete
  async deleteExpense(id, userId = 'user_aaryan') {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}?userId=${userId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.warn('API deleteExpense failed:', err);
      return false;
    }
  },

  // Receipt Upload & Scan
  async uploadReceipt(file) {
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const res = await fetch(`${API_BASE}/expenses/upload-receipt`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Receipt upload failed');
      return await res.json();
    } catch (err) {
      console.warn('API uploadReceipt failed:', err);
      return null;
    }
  },

  // Weekly Report
  async getWeeklyReport(userId = 'user_aaryan') {
    try {
      const res = await fetch(`${API_BASE}/reports/weekly?userId=${userId}`);
      if (!res.ok) throw new Error('Report fetch failed');
      return await res.json();
    } catch (err) {
      console.warn('API getWeeklyReport failed:', err);
      return null;
    }
  }
};
