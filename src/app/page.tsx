'use client';

import React, { useState, useEffect } from 'react';
import { 
  LegoApp, CreditWallet, Organization, User, TeamMember, AuditLog 
} from '@/types/legologic';
import { ALL_TEMPLATES, SATU_PIPELINE_APP, CREATE_BLANK_APP } from '@/lib/templates';
import { Sidebar } from '@/components/Sidebar';
import { StudioView } from '@/components/StudioView';
import { ChatView } from '@/components/ChatView';
import { LibraryView } from '@/components/LibraryView';
import { UsageView } from '@/components/UsageView';
import { DatabaseView } from '@/components/DatabaseView';
import { HistoryView } from '@/components/HistoryView';
import { ConnectorsView } from '@/components/ConnectorsView';
import { SettingsView } from '@/components/SettingsView';
import { UIGalleryView } from '@/components/UIGalleryView';
import { UIGalleryItem } from '@/lib/ui-gallery';
import { BillingModal } from '@/components/BillingModal';
import { TeamModal } from '@/components/TeamModal';
import { AuthModal } from '@/components/AuthModal';
import { AuthUserProfile } from '@/lib/firebase';

export default function Home() {
  // Initial app is a clean blank project ("Project Baru")
  const [apps, setApps] = useState<LegoApp[]>(() => [CREATE_BLANK_APP(), ...ALL_TEMPLATES]);
  const [currentAppId, setCurrentAppId] = useState<string>('app-new-blank');
  
  // Navigation tabs: 'chat' (Menu 1), 'studio' (Menu 2), 'library' (Menu 3)
  const [currentNavTab, setCurrentNavTab] = useState<string>('chat');
  
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [user, setUser] = useState<User>({
    id: 'user-bobi',
    name: 'Om Bobi',
    email: 'bobi@genesis.id',
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
    { id: 'tm-1', name: 'Om Bobi', email: 'bobi@genesis.id', role: 'OWNER', status: 'active', joinedAt: '2026-11-01' },
    { id: 'tm-2', name: 'Ahmad Sales', email: 'ahmad@nalarasa.com', role: 'MEMBER', status: 'active', joinedAt: '2026-11-03' },
    { id: 'tm-3', name: 'Dian Designer', email: 'dian@nalarasa.com', role: 'MEMBER', status: 'active', joinedAt: '2026-11-05' },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-11-08T10:00:00Z',
      userId: 'user-bobi',
      userName: 'Om Bobi',
      action: 'Project Baru Siap',
      details: 'Studio GENESIS kanvas bersih siap menerima instruksi.',
      type: 'build',
    },
    {
      id: 'log-2',
      timestamp: '2026-11-08T09:30:00Z',
      userId: 'user-bobi',
      userName: 'Om Bobi',
      action: 'Inisialisasi Model AI',
      details: 'Terkoneksi ke GENESIS AI Engine terverifikasi.',
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
          // If blank app isn't in saved list, keep blank app available
          const hasBlank = parsed.some(a => a.id === 'app-new-blank');
          const merged = hasBlank ? parsed : [CREATE_BLANK_APP(), ...parsed];
          setApps(merged);
        }
      }
      const savedWallet = localStorage.getItem('legologic_wallet_v1');
      if (savedWallet) {
        setWallet(JSON.parse(savedWallet));
      }
      const savedUser = localStorage.getItem('legologic_user_v1');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
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
    const exists = apps.some(a => a.id === updatedApp.id);
    let next: LegoApp[];
    if (exists) {
      next = apps.map(a => a.id === updatedApp.id ? updatedApp : a);
    } else {
      next = [updatedApp, ...apps];
    }
    setCurrentAppId(updatedApp.id);
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
    const updatedApp = {
      ...currentApp,
      plan: plan,
      isPublished: true,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateApp(updatedApp);

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

  // Handler to create a brand new clean project
  const handleNewBuild = () => {
    const blank = CREATE_BLANK_APP();
    setApps(prev => [blank, ...prev.filter(a => a.id !== blank.id)]);
    setCurrentAppId(blank.id);
    setCurrentNavTab('studio');
  };

  // Handler when user opens an app from chat or library into Studio
  const handleOpenAppInStudio = (appToOpen: LegoApp) => {
    const exists = apps.some(a => a.id === appToOpen.id);
    if (!exists) {
      setApps(prev => [appToOpen, ...prev]);
    }
    setCurrentAppId(appToOpen.id);
    setCurrentNavTab('studio');
  };

  // Handler to use a template
  const handleUseTemplate = (template: LegoApp) => {
    const cloned: LegoApp = {
      ...template,
      id: 'app-' + Date.now(),
      slug: template.slug + '-' + Math.floor(100 + Math.random() * 900),
      name: template.name + ' (Kloning)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
    };
    handleUpdateApp(cloned);
    setCurrentAppId(cloned.id);
    setCurrentNavTab('studio');
  };

  // Handler to select and apply a UI design style from Dribbble / Magnific gallery
  const handleSelectUIStyle = (styleItem: UIGalleryItem) => {
    if (currentApp) {
      const updatedVersions = currentApp.versions.map((v, i) => {
        if (i === currentApp.versions.length - 1) {
          return {
            ...v,
            primaryColor: styleItem.colors.primary,
            accentColor: styleItem.colors.accent,
            tagline: `${v.tagline} • Style: ${styleItem.title}`,
          };
        }
        return v;
      });
      const updatedApp: LegoApp = {
        ...currentApp,
        versions: updatedVersions,
        updatedAt: new Date().toISOString(),
      };
      handleUpdateApp(updatedApp);
      handleAddAuditLog({
        userId: user.id,
        userName: user.name,
        action: `Terapkan Desain UI "${styleItem.title}"`,
        details: `Gaya visual ${styleItem.badge} (${styleItem.categoryLabel}) dengan font ${styleItem.typography}`,
        type: 'build',
      });
    }
    setCurrentNavTab('studio');
  };

  const handleRollbackToVersion = (versionNumber: number) => {
    const updatedApp: LegoApp = {
      ...currentApp,
      currentVersion: versionNumber,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateApp(updatedApp);
    handleAddAuditLog({
      userId: user.id,
      userName: user.name,
      action: `Rollback ke Versi v${versionNumber}`,
      details: `Mengembalikan aplikasi "${currentApp.name}" ke konfigurasi versi v${versionNumber}`,
      type: 'rollback',
    });
  };

  const currentApp = apps.find(a => a.id === currentAppId) || apps[0] || CREATE_BLANK_APP();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa] antialiased">
      {/* Sleek Left Sidebar */}
      <Sidebar
        currentTab={currentNavTab}
        onSelectTab={(tab) => {
          setCurrentNavTab(tab);
        }}
        onNewBuild={handleNewBuild}
        onOpenBilling={() => setIsBillingOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        organization={organization}
        wallet={wallet}
      />

      {/* Main View Area depending on active menu */}
      {currentNavTab === 'chat' ? (
        /* MENU 1: Chat Assistant with GENESIS AI */
        <ChatView
          wallet={wallet}
          user={user}
          onOpenInStudio={handleOpenAppInStudio}
          onOpenBilling={() => setIsBillingOpen(true)}
          onOpenGallery={() => setCurrentNavTab('gallery')}
        />
      ) : currentNavTab === 'studio' ? (
        /* MENU 2: Studio View (Clean Canvas by default, or active app) */
        <StudioView
          app={currentApp}
          allApps={apps}
          wallet={wallet}
          user={user}
          organization={organization}
          activeNavTab="studio"
          onUpdateApp={handleUpdateApp}
          onUpdateWallet={handleUpdateWallet}
          onSelectApp={(appId) => {
            setCurrentAppId(appId);
          }}
          onOpenBilling={() => setIsBillingOpen(true)}
          onNavigateToTab={(tab) => setCurrentNavTab(tab)}
        />
      ) : currentNavTab === 'library' ? (
        /* MENU 3: Library (Recent Projects + Templates Gallery + UI Gallery tab) */
        <LibraryView
          recentApps={apps.filter(a => a.id !== 'app-new-blank')}
          templates={ALL_TEMPLATES}
          onOpenAppInStudio={(appId) => {
            setCurrentAppId(appId);
            setCurrentNavTab('studio');
          }}
          onUseTemplate={handleUseTemplate}
          onNewBuild={handleNewBuild}
          onSelectUIStyle={handleSelectUIStyle}
        />
      ) : currentNavTab === 'gallery' ? (
        /* MENU: Galeri Desain UI (Dribbble & Magnific) */
        <UIGalleryView
          onSelectStyle={handleSelectUIStyle}
          onNavigateToStudio={() => setCurrentNavTab('studio')}
        />
      ) : currentNavTab === 'database' ? (
        /* MENU 4: Database Management & Skema Data */
        <DatabaseView
          currentApp={currentApp}
          allApps={apps}
          onSelectApp={(appId) => setCurrentAppId(appId)}
          onUpdateApp={handleUpdateApp}
          onNavigateToTab={(tab) => setCurrentNavTab(tab)}
        />
      ) : currentNavTab === 'history' ? (
        /* MENU 5: History Versi & Audit Log */
        <HistoryView
          currentApp={currentApp}
          auditLogs={auditLogs}
          onRollbackToVersion={handleRollbackToVersion}
          onNavigateToTab={(tab) => setCurrentNavTab(tab)}
        />
      ) : currentNavTab === 'usage' ? (
        /* MENU 6: Usage & Manajemen Kredit */
        <UsageView
          wallet={wallet}
          currentApp={currentApp}
          onOpenBilling={() => setIsBillingOpen(true)}
        />
      ) : currentNavTab === 'connectors' ? (
        /* MENU 7: Connectors & Integrasi Bisnis */
        <ConnectorsView />
      ) : currentNavTab === 'settings' ? (
        /* MENU 8: Settings Profil & Workspace */
        <SettingsView
          user={user}
          organization={organization}
          teamMembers={teamMembers}
          onOpenTeam={() => setIsTeamOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      ) : (
        /* Fallback */
        <StudioView
          app={currentApp}
          allApps={apps}
          wallet={wallet}
          user={user}
          organization={organization}
          activeNavTab={currentNavTab}
          onUpdateApp={handleUpdateApp}
          onUpdateWallet={handleUpdateWallet}
          onSelectApp={(appId) => {
            setCurrentAppId(appId);
          }}
          onOpenBilling={() => setIsBillingOpen(true)}
          onNavigateToTab={(tab) => setCurrentNavTab(tab)}
        />
      )}

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
