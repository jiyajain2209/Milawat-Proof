import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { ShieldAlert, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';

interface AdminPortalProps {
  onNavigateToStore: () => void;
}

export interface AdminUserSession {
  email: string | null;
  displayName?: string | null;
  uid?: string;
  isSessionAuth?: boolean;
}

const AUTHORIZED_ADMIN_EMAIL = 'jiyajain2209@gmail.com';
export const ADMIN_SESSION_STORAGE_KEY = 'milawat_admin_session_v1';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigateToStore }) => {
  const [user, setUser] = useState<AdminUserSession | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          displayName: currentUser.displayName,
          uid: currentUser.uid,
          isSessionAuth: false,
        });
      } else {
        // If not in Firebase Auth, check if verified local admin session exists
        try {
          const saved = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
          if (saved) {
            setUser(JSON.parse(saved));
          }
        } catch {
          // ignore
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      setUser(null);
      await signOut(auth);
    } catch {
      // ignore
    }
  };

  const handleAdminAuthenticated = (adminSession: AdminUserSession) => {
    try {
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(adminSession));
    } catch {
      // ignore
    }
    setUser(adminSession);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E4DE] shadow-sm flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6 text-[#1C9A6C] animate-pulse" />
        </div>
        <div className="w-5 h-5 border-2 border-[#1C9A6C]/30 border-t-[#1C9A6C] rounded-full animate-spin mb-2" />
        <p className="text-xs font-semibold text-[#525252]">Verifying admin session...</p>
      </div>
    );
  }

  // If unauthenticated: render Admin Login screen
  if (!user) {
    return (
      <AdminLogin
        onBackToStore={onNavigateToStore}
        onAdminAuthenticated={handleAdminAuthenticated}
      />
    );
  }

  // Verify that the logged in account is the designated admin
  const userEmail = user.email?.toLowerCase().trim();
  const isAuthorized = userEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F9F8F5] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-red-200 p-6 sm:p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#141414]">Access Restricted</h1>
            <p className="text-xs text-[#717171] leading-relaxed">
              Signed in as <span className="font-semibold text-[#141414]">{user.email || 'Anonymous'}</span>.
              This administrative dashboard is strictly restricted to the authorized owner.
            </p>
          </div>

          <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg text-xs text-red-800 text-left font-mono">
            Required admin: <span className="font-bold">{AUTHORIZED_ADMIN_EMAIL}</span>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 rounded-lg bg-[#141414] hover:bg-[#262626] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out &amp; Switch Account</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToStore}
              className="w-full py-2 px-4 rounded-lg border border-[#E5E4DE] hover:bg-[#F5F4F0] text-[#525252] text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and authorized: render Admin Dashboard with live Firestore orders
  return (
    <AdminDashboard
      user={user}
      onNavigateToStore={onNavigateToStore}
      onSignOut={handleSignOut}
    />
  );
};


