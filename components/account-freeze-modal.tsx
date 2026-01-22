'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Lock } from 'lucide-react';

interface AccountFreezeModalProps {
  onUnfreeze: () => void;
}

export function AccountFreezeModal({ onUnfreeze }: AccountFreezeModalProps) {
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'freeze' | 'otp' | 'success'>('freeze');

  const handleSendOtp = () => {
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      setStep('success');
      setTimeout(onUnfreeze, 2000);
    } else {
      alert('Invalid OTP');
    }
  };

  if (step === 'freeze') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-card rounded-lg shadow-lg max-w-md w-full border border-destructive">
          <div className="bg-destructive/10 border-b border-destructive px-6 py-4 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-destructive">Account Frozen</h2>
              <p className="text-sm text-destructive/80 mt-1">Security risk detected</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-warning mb-2">Freeze Reason</p>
              <p className="text-sm text-foreground">Multiple high-risk transactions detected from unusual locations</p>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground mb-3">Detected Suspicious Patterns</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-destructive">•</span>
                  Blocked transaction from new IP address (203.0.113.50)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-destructive">•</span>
                  Unusual transaction amount ($1,250+) to unknown recipient
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-destructive">•</span>
                  Login attempt from unfamiliar device
                </li>
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-primary">
                ℹ️ Your account is temporarily locked. You cannot perform any transactions until this is resolved.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              To unlock your account, verify your identity using OTP verification.
            </p>
          </div>

          <div className="flex gap-2 p-6 border-t border-border">
            <Button variant="outline" onClick={() => alert('Support contacted')} className="flex-1">
              Contact Support
            </Button>
            <Button
              onClick={handleSendOtp}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Send OTP
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-card rounded-lg shadow-lg max-w-md w-full border border-border">
          <div className="p-6 space-y-6">
            <div className="text-center">
              <Lock className="w-12 h-12 text-primary mx-auto mb-2 opacity-20" />
              <h2 className="text-lg font-semibold text-foreground">Verify Identity</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter the OTP sent to your registered email</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">6-Digit OTP</label>
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                className="bg-background font-mono text-center text-2xl tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground mt-2">Demo OTP: 123456</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('freeze')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                Unlock Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full border border-success">
        <div className="bg-success/10 border-b border-success px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <span className="text-success-foreground text-lg">✓</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-success">Account Unlocked</h2>
            <p className="text-sm text-success/80 mt-0.5">Your account is now active</p>
          </div>
        </div>

        <div className="p-6 text-center">
          <p className="text-sm text-foreground mb-2">Your identity has been verified successfully.</p>
          <p className="text-xs text-muted-foreground">You can now access your wallet and perform transactions.</p>
        </div>
      </div>
    </div>
  );
}
