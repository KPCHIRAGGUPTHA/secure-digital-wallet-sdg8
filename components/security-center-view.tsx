'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Smartphone, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import type { useWalletState } from '@/hooks/use-wallet-state';

interface SecurityCenterViewProps {
  walletState: ReturnType<typeof useWalletState>;
}

const THREATS = [
  {
    title: 'Credential Compromise',
    description: 'Unauthorized access through stolen credentials',
    mitigation: 'MFA Enabled',
    icon: Lock,
  },
  {
    title: 'Unauthorized API Access',
    description: 'Third-party application unauthorized access',
    mitigation: 'JWT Active',
    icon: Shield,
  },
  {
    title: 'Transaction Tampering',
    description: 'Man-in-the-middle attacks on transactions',
    mitigation: 'HTTPS Enforced',
    icon: AlertTriangle,
  },
  {
    title: 'Replay Attack',
    description: 'Interception and re-submission of old transactions',
    mitigation: 'Nonce Validation',
    icon: CheckCircle,
  },
  {
    title: 'Insider Misuse',
    description: 'Malicious activity from platform insiders',
    mitigation: 'Fraud Detection ON',
    icon: Smartphone,
  },
];

export function SecurityCenterView({ walletState }: SecurityCenterViewProps) {
  const [showTrustedDevices, setShowTrustedDevices] = useState(true);

  const trustedDevices = [
    { id: '1', name: 'Chrome on Windows', lastUsed: 'Today', ip: '192.168.1.100' },
    { id: '2', name: 'Safari on iPhone', lastUsed: '2 hours ago', ip: '10.0.0.50' },
    { id: '3', name: 'Firefox on Mac', lastUsed: '1 week ago', ip: '172.16.0.100' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Security Center</h1>

      {/* Threat Model */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Security Threats & Mitigations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {THREATS.map((threat) => {
            const Icon = threat.icon;
            return (
              <div key={threat.title} className="bg-card border border-border rounded-lg p-4 hover:border-primary transition">
                <div className="flex items-start justify-between mb-2">
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">Protected</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-2">{threat.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{threat.description}</p>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-success font-medium">{threat.mitigation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Security Settings</h2>

          <div className="space-y-4">
            {/* MFA Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground text-sm">Multi-Factor Authentication</p>
                <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => walletState.setMfaEnabled(!walletState.mfaEnabled)}
                className={`relative w-12 h-6 rounded-full transition ${walletState.mfaEnabled ? 'bg-success' : 'bg-muted'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${walletState.mfaEnabled ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            {/* Daily Limit */}
            <div className="pb-4 border-b border-border">
              <p className="font-medium text-foreground text-sm mb-3">Daily Transaction Limit</p>
              <input
                type="range"
                min="84000"
                max="840000"
                step="42000"
                value={walletState.dailyLimit}
                onChange={(e) => walletState.setDailyLimit(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">Current: ₹{walletState.dailyLimit.toLocaleString('en-IN')}</p>
            </div>

            {/* Password Change */}
            <Button variant="outline" className="w-full text-left justify-start bg-transparent">
              🔑 Change Password
            </Button>

            {/* Session Management */}
            <Button variant="outline" className="w-full text-left justify-start text-destructive hover:text-destructive bg-transparent">
              ✕ Sign Out All Devices
            </Button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>

          <div className="space-y-3">
            {walletState.alerts.slice(0, 10).map((alert, idx) => (
              <div key={alert.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  alert.type === 'success' ? 'bg-success' :
                  alert.type === 'error' ? 'bg-destructive' :
                  alert.type === 'warning' ? 'bg-warning' :
                  'bg-primary'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp.toLocaleDateString()} {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trusted Devices */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Trusted Devices</h2>
          <button
            onClick={() => setShowTrustedDevices(!showTrustedDevices)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            {showTrustedDevices ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-3">
          {trustedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">{device.name}</p>
                  <p className="text-xs text-muted-foreground">IP: {device.ip} • Last used: {device.lastUsed}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs text-destructive hover:text-destructive bg-transparent">
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Alert Preferences</h2>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">Email Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">Receive alerts via email</p>
            </div>
            <button className="relative w-12 h-6 rounded-full transition bg-success">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition translate-x-6" />
            </button>
          </div>

          {/* Risk Threshold */}
          <div className="border-t border-border pt-4">
            <p className="font-medium text-foreground text-sm mb-3">Risk Threshold for Alerts</p>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map((level) => (
                <Button
                  key={level}
                  variant={level === 'High' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Block Notifications */}
          <div className="border-t border-border pt-4">
            <p className="font-medium text-foreground text-sm mb-3">Notification Quiet Hours</p>
            <div className="grid grid-cols-2 gap-2">
              <input type="time" defaultValue="22:00" className="px-3 py-2 bg-background text-foreground border border-border rounded-md text-sm" />
              <input type="time" defaultValue="08:00" className="px-3 py-2 bg-background text-foreground border border-border rounded-md text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
