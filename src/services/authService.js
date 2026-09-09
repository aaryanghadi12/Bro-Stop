// Authentication & Session Persistence Service for Guilt-Trap
// Supports persistent mobile-first sessions, multi-user storage, and 1-tap quick profiles

const AUTH_STORAGE_KEY = 'guilt_trap_auth_session_v1';
const USERS_INDEX_KEY = 'guilt_trap_users_v1';

export const DEMO_USERS = [
  {
    id: 'user_aaryan',
    name: 'Aaryan Sharma',
    phone: '+91 98765 43210',
    email: 'aaryan@example.com',
    avatar: '👨‍💻',
    monthlyBudget: 25000,
    joinDate: 'Jan 2026'
  },
  {
    id: 'user_neha',
    name: 'Neha Verma',
    phone: '+91 98111 22334',
    email: 'neha@example.com',
    avatar: '👩‍🎨',
    monthlyBudget: 35000,
    joinDate: 'Feb 2026'
  }
];

/**
 * Retrieves the currently active user session.
 * If user already logged in previously, returns user object so no need to log in again.
 */
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session && session.id ? session : null;
  } catch (err) {
    console.error('Failed to read auth session:', err);
    return null;
  }
}

/**
 * Saves active session into localStorage for persistent login
 */
export function setStoredSession(user) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to persist auth session:', err);
  }
}

/**
 * Clears active session (Logout)
 */
export function clearStoredSession() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

/**
 * Logs in with phone number / email / name
 */
export function authenticateUser({ identifier, name }) {
  const cleanId = identifier.trim().toLowerCase();
  
  // Check if matching a demo user
  const found = DEMO_USERS.find(
    u => u.phone.includes(cleanId) || u.email.toLowerCase() === cleanId || u.name.toLowerCase().includes(cleanId)
  );

  const user = found || {
    id: `user_${cleanId.replace(/[^a-z0-9]/g, '_') || Date.now()}`,
    name: name?.trim() || (cleanId.includes('@') ? cleanId.split('@')[0] : 'Splurger'),
    phone: cleanId.startsWith('+91') ? cleanId : `+91 ${cleanId}`,
    email: cleanId.includes('@') ? cleanId : `${cleanId}@guilttrap.app`,
    avatar: '👤',
    monthlyBudget: 25000,
    joinDate: 'Just joined'
  };

  setStoredSession(user);
  return user;
}
