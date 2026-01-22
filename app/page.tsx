'use client';

import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardView } from '@/components/dashboard-view';
import { SecurityCenterView } from '@/components/security-center-view';
import { AlertSidebar } from '@/components/alert-sidebar';
import { AccountFreezeModal } from '@/components/account-freeze-modal';
import { AuthModal } from '@/components/auth-modal';
import { useWalletState } from '@/hooks/use-wallet-state';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'security'>('dashboard');
  const [mounted, setMounted] = useState(false);
  
  const walletState = useWalletState();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (walletState.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [walletState.darkMode, mounted]);

  if (!isAuthenticated) {
    return <AuthModal onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  if (walletState.accountFrozen) {
    return <AccountFreezeModal onUnfreeze={() => walletState.setAccountFrozen(false)} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <AlertSidebar alerts={walletState.alerts} />
      
      <main className="flex-1 overflow-hidden">
        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)} className="h-full flex flex-col">
          <div className="border-b bg-card">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">W</span>
                </div>
                <span className="font-semibold text-foreground">SecureWallet</span>
              </div>
              
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => walletState.setDarkMode(!walletState.darkMode)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  title={walletState.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {walletState.darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>

          <TabsContent value="dashboard" className="flex-1 overflow-auto">
            <DashboardView walletState={walletState} onFreezeDemo={() => setShowFreezeModal(true)} />
          </TabsContent>

          <TabsContent value="security" className="flex-1 overflow-auto">
            <SecurityCenterView walletState={walletState} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
