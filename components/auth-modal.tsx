'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  onAuthenticated: () => void;
}

export function AuthModal({ onAuthenticated }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [attempts, setAttempts] = useState(3);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Min 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Need uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Need lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Need number';
    if (!/[!@#$%^&*]/.test(pwd)) return 'Need special character (!@#$%^&*)';
    return '';
  };

  const handleLogin = () => {
    if (!email || !password) {
      setPasswordError('Please fill all fields');
      return;
    }
    onAuthenticated();
  };

  const handleSignup = () => {
    if (!email || !password) {
      setPasswordError('Please fill all fields');
      return;
    }
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }
    onAuthenticated();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">SecureWallet</h1>
          <p className="text-center text-muted-foreground mb-8">Your Digital Financial Vault</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!isLogin) setPasswordError(validatePassword(e.target.value));
                  }}
                  className="pl-10 pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && !isLogin && (
                <p className="text-xs text-destructive mt-1">{passwordError}</p>
              )}
            </div>

            {!isLogin && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Password requirements:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li className={password.length >= 8 ? 'text-success' : ''}>✓ Min 8 characters</li>
                  <li className={/[A-Z]/.test(password) ? 'text-success' : ''}>✓ 1 uppercase letter</li>
                  <li className={/[a-z]/.test(password) ? 'text-success' : ''}>✓ 1 lowercase letter</li>
                  <li className={/[0-9]/.test(password) ? 'text-success' : ''}>✓ 1 number</li>
                  <li className={/[!@#$%^&*]/.test(password) ? 'text-success' : ''}>✓ 1 special char</li>
                </ul>
              </div>
            )}

            <Button
              onClick={isLogin ? handleLogin : handleSignup}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </Button>

            {isLogin && (
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setPasswordError('');
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setPasswordError('');
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {isLogin && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center text-sm text-muted-foreground">
                <p>Rate Limit Status: <span className="text-warning font-medium">{attempts} attempts remaining</span></p>
              </div>
            </div>
          )}

          <div className="mt-6 bg-success/10 border border-success/20 rounded-lg p-3">
            <p className="text-xs text-success font-medium">Demo Credentials</p>
            <p className="text-xs text-muted-foreground mt-1">Email: demo@wallet.com</p>
            <p className="text-xs text-muted-foreground">Password: SecurePass123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
