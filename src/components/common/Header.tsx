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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

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
    setCurrentUser,
    setActiveNav,
    refreshData,
    isRefreshing,
    notifications,
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

  // Format current date
  const currentDate = new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          {madrasaInfo?.logo && (
            <img
              src={madrasaInfo.logo}
              alt="Logo"
              className="h-7 w-7 rounded-md object-contain bg-white p-0.5 border border-slate-200 shrink-0"
            />
          )}
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl truncate">
            {t(pageTitle)}
          </h1>
        </div>
      </div>

      {/* Right: Search, Date, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Field */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search records...')}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Current Date Display */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium">{currentDate}</span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setLanguage('en')}
            title="English"
            className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('bn')}
            title="বাংলা"
            className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer ${
              language === 'bn'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            বাং
          </button>
        </div>

        {/* Refresh / Reload Button */}
        <button
          onClick={() => refreshData()}
          disabled={isRefreshing}
          title={t('Refresh Data')}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-50"
          aria-label={t('Refresh Data')}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label={t('Notifications')}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>

          {isNotifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <span className="text-xs font-semibold text-slate-900">{t('Notifications')}</span>
                <span className="text-[11px] text-slate-500">3 recent alerts</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-900">{t('Fee Collection')}</p>
                    <p className="text-[11px] text-slate-500">October monthly fees for Hifz section compiled.</p>
                    <span className="text-[10px] text-slate-400">12 mins ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-900">{t('Food Expense')}</p>
                    <p className="text-[11px] text-slate-500">Kitchen grocery inventory re-order scheduled.</p>
                    <span className="text-[10px] text-slate-400">1 hour ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-900">{t('Student Admission')}</p>
                    <p className="text-[11px] text-slate-500">Admission verification pending for 2 new applicants.</p>
                    <span className="text-[10px] text-slate-400">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white font-semibold text-xs shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : 'M'}
            </div>
            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {currentUser ? currentUser.name.split(' ')[0] : 'Admin'}
              </p>
              <p className="text-[10px] text-slate-500">{t(currentUser?.role || 'Super Admin')}</p>
            </div>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50">
              <div className="border-b border-slate-100 px-4 py-2">
                <p className="text-xs font-semibold text-slate-900">{currentUser?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'admin@madrasa.org'}</p>
                <span className="mt-1 inline-block text-[10px] font-medium text-emerald-700">
                  {t('Role')}: {t(currentUser?.role || 'Super Admin')}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveNav('settings', 'madrasa-information');
                    setIsProfileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>{t('Madrasa Settings')}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveNav('settings', 'user-management');
                    setIsProfileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>{t('User Management')}</span>
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={async () => {
                    setIsProfileMenuOpen(false);
                    await logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
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
