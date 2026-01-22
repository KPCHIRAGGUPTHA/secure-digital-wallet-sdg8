'use client';

import { useMemo } from "react"

import { useState, useCallback } from 'react';

export interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  recipient: string;
  amount: number;
  status: 'completed' | 'pending' | 'blocked' | 'under_review';
  riskScore: number;
  timestamp: Date;
  note?: string;
  ip?: string;
  device?: string;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN001',
    type: 'sent',
    recipient: 'John Doe (john@example.com)',
    amount: 21000,
    status: 'completed',
    riskScore: 15,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    note: 'Lunch payment',
    ip: '192.168.1.100',
    device: 'Chrome on Windows'
  },
  {
    id: 'TXN002',
    type: 'received',
    recipient: 'Sarah Smith',
    amount: 42000,
    status: 'completed',
    riskScore: 5,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    ip: '10.0.0.50',
    device: 'Safari on iPhone'
  },
  {
    id: 'TXN003',
    type: 'sent',
    recipient: 'Unknown Account (xyz@mail.com)',
    amount: 105000,
    status: 'blocked',
    riskScore: 92,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    note: 'Fraud detected: Multiple failed attempts'
  },
  {
    id: 'TXN004',
    type: 'sent',
    recipient: 'Amazon Payments',
    amount: 7500,
    status: 'completed',
    riskScore: 20,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    ip: '192.168.1.100',
    device: 'Chrome on Windows'
  },
  {
    id: 'TXN005',
    type: 'received',
    recipient: 'Freelance Project',
    amount: 168000,
    status: 'completed',
    riskScore: 8,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    ip: '10.0.0.50',
    device: 'Safari on iPhone'
  },
  {
    id: 'TXN006',
    type: 'sent',
    recipient: 'Suspicious Account',
    amount: 294000,
    status: 'blocked',
    riskScore: 95,
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
    note: 'High-risk pattern detected. Requires OTP verification.'
  },
  {
    id: 'TXN007',
    type: 'sent',
    recipient: 'Mike Johnson',
    amount: 12500,
    status: 'pending',
    riskScore: 75,
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
    note: 'Awaiting OTP confirmation'
  },
  {
    id: 'TXN008',
    type: 'received',
    recipient: 'Project Bonus',
    amount: 126000,
    status: 'completed',
    riskScore: 10,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    ip: '10.0.0.50',
    device: 'Firefox on Mac'
  },
  {
    id: 'TXN009',
    type: 'sent',
    recipient: 'Utilities Bill',
    amount: 16800,
    status: 'completed',
    riskScore: 12,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    ip: '192.168.1.100',
    device: 'Chrome on Windows'
  },
  {
    id: 'TXN010',
    type: 'received',
    recipient: 'Tax Return',
    amount: 269000,
    status: 'under_review',
    riskScore: 45,
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
    ip: '203.0.113.50',
    device: 'Unknown Device'
  },
  {
    id: 'TXN011',
    type: 'sent',
    recipient: 'Restaurant',
    amount: 3850,
    status: 'completed',
    riskScore: 8,
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000),
    ip: '192.168.1.100',
    device: 'Chrome on Windows'
  },
  {
    id: 'TXN012',
    type: 'sent',
    recipient: 'Gym Membership',
    amount: 4200,
    status: 'completed',
    riskScore: 5,
    timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000),
    ip: '192.168.1.100',
    device: 'Chrome on Windows'
  },
  {
    id: 'TXN013',
    type: 'received',
    recipient: 'Freelance Payment',
    amount: 100800,
    status: 'completed',
    riskScore: 15,
    timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000),
    ip: '10.0.0.50',
    device: 'Safari on iPhone'
  },
  {
    id: 'TXN014',
    type: 'sent',
    recipient: 'Online Purchase',
    amount: 10550,
    status: 'completed',
    riskScore: 20,
    timestamp: new Date(Date.now() - 192 * 60 * 60 * 1000),
    ip: '192.168.1.100',
    device: 'Chrome on Windows'
  },
  {
    id: 'TXN015',
    type: 'received',
    recipient: 'Referral Bonus',
    amount: 25200,
    status: 'completed',
    riskScore: 5,
    timestamp: new Date(Date.now() - 216 * 60 * 60 * 1000),
    ip: '10.0.0.50',
    device: 'Safari on iPhone'
  },
];

export function useWalletState() {
  const [balance, setBalance] = useState(456357);
  const [showBalance, setShowBalance] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [darkMode, setDarkMode] = useState(false);
  const [accountFrozen, setAccountFrozen] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(420000);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'Unusual login attempt from new device detected',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: '2',
      type: 'error',
      message: 'High-risk transaction blocked: ₹2,94,000 transfer',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'success',
      message: 'Successful transaction: ₹21,000 sent to John Doe',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '4',
      type: 'info',
      message: 'MFA verification completed',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: '5',
      type: 'warning',
      message: 'Daily transaction limit approaching: ₹3,52,800 / ₹4,20,000',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ]);

  const lastLogin = useMemo(() => {
    const now = new Date();
    now.setHours(now.getHours() - 2);
    return now;
  }, []);

  const securityStatus = useMemo(() => {
    const riskScore = Math.max(...transactions.slice(0, 5).map(t => t.riskScore));
    if (riskScore > 75) return { level: 'High', color: 'text-destructive' };
    if (riskScore > 50) return { level: 'Medium', color: 'text-warning' };
    return { level: 'Low', color: 'text-success' };
  }, [transactions]);

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp'>) => {
    setAlerts(prev => [
      { ...alert, id: Date.now().toString(), timestamp: new Date() },
      ...prev.slice(0, 4)
    ]);
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    setTransactions(prev => [
      { ...transaction, id: `TXN${Date.now()}`, timestamp: new Date() },
      ...prev
    ]);
  }, []);

  return {
    balance,
    setBalance,
    showBalance,
    setShowBalance,
    transactions,
    addTransaction,
    setTransactions,
    darkMode,
    setDarkMode,
    accountFrozen,
    setAccountFrozen,
    mfaEnabled,
    setMfaEnabled,
    dailyLimit,
    setDailyLimit,
    alerts,
    addAlert,
    lastLogin,
    securityStatus,
  };
}
