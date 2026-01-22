'use client';

import { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import type { Transaction } from '@/hooks/use-wallet-state';

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">✓ Completed</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">⏳ Pending</span>;
      case 'blocked':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">✕ Blocked</span>;
      case 'under_review':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">🔍 Under Review</span>;
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 75) return 'text-destructive bg-destructive/10';
    if (score > 50) return 'text-warning bg-warning/10';
    if (score > 25) return 'text-accent bg-accent/10';
    return 'text-success bg-success/10';
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="overflow-x-auto border border-border rounded-lg bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Date/Time</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Recipient/Sender</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground">Risk</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <div key={transaction.id}>
              <tr className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-6 py-4 text-sm text-foreground">
                  {transaction.timestamp.toLocaleDateString()} {transaction.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={transaction.type === 'sent' ? 'text-destructive' : 'text-success'}>
                    {transaction.type === 'sent' ? '→ Sent' : '← Received'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{transaction.recipient}</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                  {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 text-sm">{getStatusBadge(transaction.status)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRiskColor(transaction.riskScore)}`}>
                    {transaction.riskScore}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setExpandedId(expandedId === transaction.id ? null : transaction.id)}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === transaction.id ? 'rotate-180' : ''}`} />
                  </button>
                </td>
              </tr>

              {/* Expanded Row */}
              {expandedId === transaction.id && (
                <tr className="bg-muted/20 border-b border-border">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Transaction ID</p>
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs bg-background px-2 py-1 rounded text-foreground break-all">
                            {transaction.id}
                          </code>
                          <button
                            onClick={() => copyToClipboard(transaction.id)}
                            className="text-muted-foreground hover:text-foreground transition"
                          >
                            {copiedId === transaction.id ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">IP Address</p>
                        <p className="text-foreground">{transaction.ip || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Device</p>
                        <p className="text-foreground text-xs">{transaction.device || 'N/A'}</p>
                      </div>
                      {transaction.note && (
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Notes</p>
                          <p className="text-foreground text-xs">{transaction.note}</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </div>
          ))}
        </tbody>
      </table>
    </div>
  );
}
