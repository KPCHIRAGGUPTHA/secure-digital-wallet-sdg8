'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface TransactionConfirmationProps {
  transaction: {
    recipient: string;
    amount: number;
    note?: string;
    riskScore: number;
  };
  onConfirm: (otp?: string) => void;
  onCancel: () => void;
}

export function TransactionConfirmation({ transaction, onConfirm, onCancel }: TransactionConfirmationProps) {
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const fee = Math.round(transaction.amount * 0.01);
  const total = transaction.amount + fee;

  const handleConfirm = () => {
    if (transaction.riskScore > 75) {
      if (!otp) {
        setShowOtpInput(true);
        return;
      }
      if (otp !== '123456') {
        alert('Invalid OTP');
        return;
      }
    }
    onConfirm(otp);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Confirm Transaction</h2>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">To</span>
              <span className="text-sm font-medium text-foreground">{transaction.recipient}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-sm font-semibold text-foreground">₹{transaction.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fee</span>
              <span className="text-sm text-foreground">₹{fee.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {transaction.note && (
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Note</p>
              <p className="text-sm text-foreground">{transaction.note}</p>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-primary/10 text-primary rounded-lg">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs">Estimated completion time: 2-5 minutes</p>
          </div>

          {transaction.riskScore > 75 && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 bg-warning/10 text-warning rounded-lg">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">OTP Verification Required</p>
                  <p className="text-xs mt-1">This high-risk transaction requires OTP authentication.</p>
                </div>
              </div>

              {showOtpInput && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Enter OTP</label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    className="bg-background font-mono text-center tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-2">Demo OTP: 123456</p>
                </div>
              )}
            </div>
          )}

          <div className={`p-3 rounded-lg ${transaction.riskScore > 50 ? 'bg-warning/10' : 'bg-success/10'} text-sm`}>
            <p className={`text-xs font-semibold ${transaction.riskScore > 50 ? 'text-warning' : 'text-success'} mb-1`}>
              Risk Score: {Math.round(transaction.riskScore)}/100
            </p>
            <p className="text-xs text-muted-foreground">
              {transaction.riskScore > 75 ? 'Very High risk - additional verification required' :
               transaction.riskScore > 50 ? 'High risk - transaction may be delayed' :
               'Low risk - transaction will process normally'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 p-6 border-t border-border">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {transaction.riskScore > 75 && !otp ? 'Enter OTP' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
