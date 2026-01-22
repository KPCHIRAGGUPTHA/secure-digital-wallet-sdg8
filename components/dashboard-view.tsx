'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Eye, EyeOff, TrendingUp, Activity, Shield } from 'lucide-react';
import { useWalletState } from '@/hooks/use-wallet-state';
import { TransactionTable } from './transaction-table';
import { SendMoneyModal } from './send-money-modal';
import { TransactionConfirmation } from './transaction-confirmation';

interface DashboardViewProps {
  walletState: ReturnType<typeof useWalletState>;
  onFreezeDemo: () => void;
}

export function DashboardView({ walletState, onFreezeDemo }: DashboardViewProps) {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const riskLevel = useMemo(() => {
    const avgRisk = walletState.transactions.reduce((sum, t) => sum + t.riskScore, 0) / walletState.transactions.length;
    if (avgRisk > 50) return { level: 'High', color: 'text-destructive', bg: 'bg-destructive/10' };
    if (avgRisk > 30) return { level: 'Medium', color: 'text-warning', bg: 'bg-warning/10' };
    return { level: 'Low', color: 'text-success', bg: 'bg-success/10' };
  }, [walletState.transactions]);

  const dailySpent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return walletState.transactions
      .filter(t => t.type === 'sent' && new Date(t.timestamp) >= today)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [walletState.transactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = walletState.transactions;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
    
    if (sortBy === 'amount') {
      return [...filtered].sort((a, b) => b.amount - a.amount);
    }
    return filtered;
  }, [walletState.transactions, filterStatus, sortBy]);

  const handleSendMoney = (data: any) => {
    setPendingTransaction(data);
    setShowSendModal(false);
    setShowConfirm(true);
  };

  const handleConfirmTransaction = (otp?: string) => {
    if (pendingTransaction.riskScore > 75 && !otp) {
      alert('OTP required for high-risk transaction');
      return;
    }

    const newTransaction = {
      type: 'sent' as const,
      recipient: pendingTransaction.recipient,
      amount: pendingTransaction.amount,
      status: 'completed' as const,
      riskScore: Math.min(pendingTransaction.riskScore + 10, 100),
      note: pendingTransaction.note,
      ip: '192.168.1.100',
      device: 'Chrome on Windows',
    };

    walletState.addTransaction(newTransaction);
    walletState.addAlert({
      type: 'success',
      message: `Successfully sent ₹${pendingTransaction.amount.toLocaleString('en-IN')} to ${pendingTransaction.recipient}`,
    });

    setShowConfirm(false);
    setPendingTransaction(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Security Alert Banner */}
      {riskLevel.level !== 'Low' && (
        <div className={`${riskLevel.bg} ${riskLevel.color} border border-current rounded-lg p-4 flex items-start gap-3`}>
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Security Risk Level: {riskLevel.level}</p>
            <p className="text-sm mt-1">Recent transactions show elevated risk patterns. Consider enabling additional security measures.</p>
          </div>
        </div>
      )}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Balance Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl font-bold text-foreground">
                  {walletState.showBalance ? `₹${walletState.balance.toLocaleString('en-IN')}` : '••••••'}
                </span>
                <button
                  onClick={() => walletState.setShowBalance(!walletState.showBalance)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {walletState.showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-primary opacity-20" />
          </div>
          <p className="text-xs text-success">↑ 2.5% this month</p>
        </div>

        {/* Last Login */}
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-4">Last Login</p>
          <p className="text-lg font-semibold text-foreground">
            {walletState.lastLogin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {walletState.lastLogin.toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">IP: 192.168.1.100</p>
        </div>

        {/* Security Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Security Status</p>
              <p className={`text-lg font-semibold ${walletState.securityStatus.color}`}>
                {walletState.securityStatus.level}
              </p>
            </div>
            <Shield className={`w-8 h-8 ${walletState.securityStatus.color} opacity-20`} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">MFA: {walletState.mfaEnabled ? 'Enabled' : 'Disabled'}</p>
        </div>

        {/* Daily Limit */}
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Daily Limit</p>
          <p className="text-lg font-semibold text-foreground">₹{dailySpent.toLocaleString('en-IN')} / ₹{walletState.dailyLimit.toLocaleString('en-IN')}</p>
          <div className="mt-3 bg-muted rounded-full h-2 w-full overflow-hidden">
            <div
              className={`h-full transition-all ${dailySpent > walletState.dailyLimit * 0.8 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${Math.min((dailySpent / walletState.dailyLimit) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{(100 - (dailySpent / walletState.dailyLimit) * 100).toFixed(1)}% remaining</p>
        </div>
      </div>

      {/* Send Money Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Send Money</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Recipient</label>
            <Input placeholder="Email or Wallet ID" className="bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
            <Input type="number" placeholder="0.00" className="bg-background" />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => setShowSendModal(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
          <option value="under_review">Under Review</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

        <Button
          variant="outline"
          onClick={() => {
            const csv = ['Date,Type,Recipient,Amount,Status,Risk Score'];
            filteredTransactions.forEach(t => {
              csv.push(`"${t.timestamp.toISOString()}","${t.type}","${t.recipient}","${t.amount}","${t.status}","${t.riskScore}"`);
            });
            const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transactions.csv';
            a.click();
          }}
          className="text-sm"
        >
          Export CSV
        </Button>

        <Button
          variant="outline"
          onClick={onFreezeDemo}
          className="text-sm ml-auto text-destructive hover:text-destructive bg-transparent"
        >
          Freeze Account (Demo)
        </Button>
      </div>

      {/* Transaction History Table */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Transaction History
        </h2>
        <TransactionTable transactions={filteredTransactions} />
      </div>

      {/* Modals */}
      {showSendModal && (
        <SendMoneyModal
          onClose={() => setShowSendModal(false)}
          onSubmit={handleSendMoney}
        />
      )}

      {showConfirm && pendingTransaction && (
        <TransactionConfirmation
          transaction={pendingTransaction}
          onConfirm={handleConfirmTransaction}
          onCancel={() => {
            setShowConfirm(false);
            setPendingTransaction(null);
          }}
        />
      )}
    </div>
  );
}
