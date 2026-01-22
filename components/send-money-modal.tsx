'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, AlertTriangle } from 'lucide-react';

interface SendMoneyModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function SendMoneyModal({ onClose, onSubmit }: SendMoneyModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const riskScore = useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    let score = 20; // Base score
    if (amountNum > 500) score += (amountNum - 500) / 10;
    if (amountNum > 1000) score += 20;
    if (recipient.includes('unknown') || recipient.includes('suspicious')) score += 30;
    return Math.min(score, 100);
  }, [amount, recipient]);

  const getRiskLevel = () => {
    if (riskScore > 75) return { level: 'Very High', color: 'text-destructive' };
    if (riskScore > 50) return { level: 'High', color: 'text-warning' };
    if (riskScore > 25) return { level: 'Medium', color: 'text-accent' };
    return { level: 'Low', color: 'text-success' };
  };

  const risk = getRiskLevel();

  const handleSubmit = () => {
    if (!recipient || !amount) {
      alert('Please fill all fields');
      return;
    }
    onSubmit({
      recipient,
      amount: parseFloat(amount),
      note,
      riskScore,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Send Money</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Recipient Email/Wallet ID</label>
            <Input
              placeholder="Enter recipient details"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Amount (INR)</label>
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Note (Optional)</label>
            <textarea
              placeholder="Add a memo..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>

          {/* Real-time Risk Score */}
          <div className={`p-4 rounded-lg border ${risk.color} border-current/20 ${risk.color.replace('text-', 'bg-')}/10`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Transaction Risk Score</span>
              <span className={`text-2xl font-bold ${risk.color}`}>{Math.round(riskScore)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${risk.color.replace('text-', 'bg-')}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <p className={`text-xs mt-2 ${risk.color}`}>Risk Level: {risk.level}</p>
          </div>

          {riskScore > 75 && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">This is a high-risk transaction. You will need OTP verification to complete it.</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!recipient || !amount}
          >
            Review & Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
