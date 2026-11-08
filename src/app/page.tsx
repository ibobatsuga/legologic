'use client';

import React, { useState, useEffect } from 'react';
import { 
  LegoApp, CreditWallet, Organization, User, TeamMember, AuditLog 
} from '@/types/legologic';
import { ALL_TEMPLATES, SATU_PIPELINE_APP } from '@/lib/templates';
import { Sidebar } from '@/components/Sidebar';
import { StudioView } from '@/components/StudioView';
import { BillingModal } from '@/components/BillingModal';
import { TeamModal } from '@/components/TeamModal';
import { AuthModal } from '@/components/AuthModal';
import { AuthUserProfile } from '@/lib/firebase';

export default function Home() {
  const [apps, setApps] = useState<LegoApp[]>(ALL_TEMPLATES);
  const [currentAppId, setCurrentAppId] = useState<string>(SATU_PIPELINE_APP.id);
  const [currentNavTab, setCurrentNavTab] = useState<string>('studio');
  const [isHomeState, setIsHomeState] = useState<boolean>(false);
  
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [user, setUser] = useState<User>({
    id: 'user-bobi',
    name: 'Om Bobi',
    email: 'bobi@legologic.id',
    role: 'OWNER',
  });

  const [organization, setOrganization] = useState<Organization>({
    id: 'org-1',
    name: 'Nalarasa Studio',
    slug: 'nalarasa',
    plan: 'STARTER',
    ownerId: 'user-bobi',
  });

  const [wallet, setWallet] = useState<CreditWallet>({
    aiCredits: 50,
    aiMaxCredits: 150,
    cloudCredits: 450,
    cloudMaxCredits: 500,
    aiUsedThisMonth: 15,
    cloudUsedThisMonth: 50,
    plan: 'STARTER',
    renewalDate: '2026-12-08',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 'tm-1', name: 'Om Bobi', email: 'bobi@legologic.id', role: 'OWNER', status: 'active', joinedAt: '2026-11-01' },
    { id: 'tm-2', name: 'Ahmad Sales', email: 'ahmad@nalarasa.com', role: 'MEMBER', status: 'active', joinedAt: '2026-11-03' },
    { id: 'tm-3', name: 'Dian Designer', email: 'dian@nalarasa.com', role: 'MEMBER', status: 'active', joinedAt: '2026-11-05' },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-11-08T10:00:00Z',
      userId: 'user-bobi',
      userName: 'Om Bobi',
      action: 'Aplikasi SatuPipeline Siap',
      details: 'Template CRM consent-first dengan pipeline visual kanban siap digunakan.',
      type: 'build',
    },
    {
      id: 'log-2',
      timestamp: '2026-11-08T09:30:00Z',
      userId: 'user-bobi',
      userName: 'Om Bobi',
      action: 'Inisialisasi Model AI',
      details: 'Terkoneksi ke gateway Sakelar AI dengan model claude-sonnet-4.6.',
      type: 'build',
    }
  ]);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedApps = localStorage.getItem('legologic_apps_v1');
      if (savedApps) {
        const parsed = JSON.parse(savedApps);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApps(parsed);
          setCurrentAppId(parsed[0].id);
        }
      }
      const savedWallet = localStorage.getItem('legologic_wallet_v1');
      if (savedWallet) {
        setWallet(JSON.parse(savedWallet));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveAppsToStorage = (updated: LegoApp[]) => {
    setApps(updated);
    try {
      localStorage.setItem('legologic_apps_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleUpdateApp = (updatedApp: LegoApp) => {
    const next = apps.map(a => a.id === updatedApp.id ? updatedApp : a);
    saveAppsToStorage(next);
  };

  const handleUpdateWallet = (updatedWallet: CreditWallet) => {
    setWallet(updatedWallet);
    try {
      localStorage.setItem('legologic_wallet_v1', JSON.stringify(updatedWallet));
    } catch (e) {}
  };

  const handleAddAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...logData,
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handlePaymentSuccess = (
    plan: import('@/types/legologic').AppPlan,
    amountPaid: number,
    aiCreditsAdded: number,
    method: string
  ) => {
    // Update active app plan
    const updatedApp = {
      ...currentApp,
      plan: plan,
      isPublished: true,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateApp(updatedApp);

    // Update wallet credits
    const updatedWallet: CreditWallet = {
      ...wallet,
      aiCredits: wallet.aiCredits + aiCreditsAdded,
      aiMaxCredits: Math.max(wallet.aiMaxCredits, wallet.aiCredits + aiCreditsAdded),
      cloudCredits: wallet.cloudCredits + 100,
    };
    handleUpdateWallet(updatedWallet);

    handleAddAuditLog({
      userId: user.id,
      userName: user.name,
      action: `Aktivasi Paket ${plan} App`,
      details: `Aplikasi "${currentApp.name}" diaktifkan ke paket ${plan} (+${aiCreditsAdded} Kredit AI, Bayar: Rp ${amountPaid.toLocaleString('id-ID')} via ${method})`,
      type: 'credit',
    });
  };

  const handleAuthSuccess = (profile: AuthUserProfile) => {
    const updatedUser: User = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      role: 'OWNER',
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('legologic_user_v1', JSON.stringify(updatedUser));
    } catch (e) {}

    handleAddAuditLog({
      userId: updatedUser.id,
      userName: updatedUser.name,
      action: profile.provider === 'google' ? 'Login via Akun Google' : 'Login Akun Email',
      details: `Berhasil masuk dengan email: ${profile.email}`,
      type: 'team',
    });
  };

  const currentApp = apps.find(a => a.id === currentAppId) || apps[0] || SATU_PIPELINE_APP;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa] antialiased">
      {/* Sleek Left Sidebar (Matching user screenshots) */}
      <Sidebar
        currentTab={isHomeState ? 'templates' : currentNavTab}
        onSelectTab={(tab) => {
          setCurrentNavTab(tab);
          if (tab === 'templates' || tab === 'library') {
            setIsHomeState(true);
          } else {
            setIsHomeState(false);
          }
        }}
        onNewBuild={() => {
          setIsHomeState(true);
        }}
        onOpenBilling={() => setIsBillingOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        organization={organization}
        wallet={wallet}
      />

      {/* Main Studio View with 3-Column / Split Canvas (Matching user screenshots) */}
      <StudioView
        app={currentApp}
        allApps={apps}
        wallet={wallet}
        user={user}
        organization={organization}
        onUpdateApp={handleUpdateApp}
        onUpdateWallet={handleUpdateWallet}
        onSelectApp={(appId) => {
          setCurrentAppId(appId);
          setIsHomeState(false);
        }}
        onOpenBilling={() => setIsBillingOpen(true)}
        isHomeState={isHomeState}
        onExitHomeState={() => setIsHomeState(false)}
      />

      {/* Auth Modal (Firebase Google Sign In + Email) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Billing Modal */}
      <BillingModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        wallet={wallet}
        currentApp={currentApp}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Team Modal */}
      <TeamModal
        isOpen={isTeamOpen}
        onClose={() => setIsTeamOpen(false)}
        organization={organization}
        members={teamMembers}
        onInviteMember={(email, name, role) => {
          const newMember: TeamMember = {
            id: 'tm-' + Date.now(),
            name,
            email,
            role,
            status: 'invited',
            joinedAt: new Date().toISOString(),
          };
          setTeamMembers(prev => [...prev, newMember]);
          handleAddAuditLog({
            userId: user.id,
            userName: user.name,
            action: 'Undang Anggota Tim',
            details: `Mengundang ${email} sebagai peran ${role}`,
            type: 'team',
          });
        }}
        onRemoveMember={(id) => {
          setTeamMembers(prev => prev.filter(m => m.id !== id));
        }}
      />
    </div>
  );
}
