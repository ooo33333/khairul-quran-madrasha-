import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Calendar,
  Menu,
  RefreshCw,
  User,
  LogOut,
  Settings,
  X,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  pageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const { logout } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    currentUser,
    setActiveNav,
    refreshData,
    isRefreshing,
    language,
    setLanguage,
    t,
    madrasaInfo,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 px-4 sm:px-6 shadow-md border-b border-blue-900/40 text-white">
      {/* Left: Mobile hamburger + Madrasa Logo & Small page context */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          {madrasaInfo?.logo ? (
            <img
              src={madrasaInfo.logo}
              alt="Logo"
              className="h-8 w-8 rounded-lg object-contain bg-white/10 p-0.5 border border-blue-500/30 shrink-0 shadow-sm"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/30 border border-blue-400/30 text-blue-300">
              <Building className="h-4 w-4" />
            </div>
          )}
          <div className="hidden sm:block">
            <span className="text-[10px] text-blue-300/80 font-medium uppercase tracking-wider block">
              {t(pageTitle)}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Stunning Bold Bengali Title with Glowing Effect */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none px-2 text-center">
        <div className="relative group">
          {/* Subtle glow background */}
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 opacity-40 blur-sm group-hover:opacity-75 transition duration-500"></div>
          
          <h1 className="relative text-sm sm:text-lg md:text-xl font-bold tracking-tight text-white px-3 py-1 bg-slate-950/80 rounded-lg border border-blue-500/40 shadow-inner truncate max-w-[240px] sm:max-w-md">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              খাইরুল কুরআন মাদ্রাসা অফিস
            </span>
          </h1>
        </div>
      </div>

      {/* Right: Language Switcher, PWA Install & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 z-10">
        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-cyan-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
          title="Switch Language (বাংলা / English)"
        >
          <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-white/10 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-md">
              {currentUser?.name ? currentUser.name.charAt(0) : 'M'}
            </div>
            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-semibold text-white leading-tight">
                {currentUser ? currentUser.name.split(' ')[0] : 'Admin'}
              </p>
              <p className="text-[10px] text-cyan-300">{t(currentUser?.role || 'Super Admin')}</p>
            </div>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 py-1.5 shadow-2xl z-50 text-slate-100">
              <div className="border-b border-slate-800 px-4 py-2">
                <p className="text-xs font-semibold text-white">{currentUser?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email || 'admin@madrasa.org'}</p>
                <span className="mt-1 inline-block text-[10px] font-medium text-cyan-300">
                  {t('Role')}: {t(currentUser?.role || 'Super Admin')}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveNav('settings', 'madrasa-information');
                    setIsProfileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <Settings className="h-4 w-4 text-cyan-400" />
                  <span>{t('Madrasa Settings')}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveNav('settings', 'user-management');
                    setIsProfileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <User className="h-4 w-4 text-cyan-400" />
                  <span>{t('User Management')}</span>
                </button>
              </div>
              <div className="border-t border-slate-800 pt-1">
                <button
                  onClick={async () => {
                    setIsProfileMenuOpen(false);
                    await logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                  <span>{t('Sign Out / Lock')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
