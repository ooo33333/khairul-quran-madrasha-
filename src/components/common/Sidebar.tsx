import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  CreditCard,
  Wallet,
  RotateCcw,
  Building2,
  Landmark,
  Settings,
  Award,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  X,
  RefreshCw,
  Power,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NavigationSection, SubNavigationItem } from '../../types';

interface SidebarItem {
  key: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { key: SubNavigationItem; label: string }[];
}

export const Sidebar: React.FC = () => {
  const { adminProfile } = useAuth();
  const {
    activeSection,
    activeSubItem,
    setActiveNav,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    refreshData,
    isRefreshing,
    t,
    madrasaInfo,
  } = useApp();

  // Track expanded sections in sidebar
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    students: true,
    'student-fees': false,
    'revolving-fund': false,
    boarding: false,
    accounts: false,
    exams: false,
    settings: false,
  });

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const navItems: SidebarItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      key: 'students',
      label: 'Students',
      icon: GraduationCap,
      subItems: [
        { key: 'teacher-recruitment', label: 'Teacher Recruitment' },
        { key: 'student-list', label: 'Student List' },
        { key: 'student-admission', label: 'Student Admission' },
        { key: 'student-information', label: 'Student Information' },
      ],
    },
    {
      key: 'student-fees',
      label: 'Student Fees',
      icon: CreditCard,
      subItems: [
        { key: 'monthly-fees', label: 'Monthly Fees' },
        { key: 'admission-fees', label: 'Admission Fees' },
        { key: 'other-fees', label: 'Other Fees' },
        { key: 'fee-collection', label: 'Fee Collection' },
        { key: 'due-fees', label: 'Due Fees' },
      ],
    },
    {
      key: 'revolving-fund',
      label: 'Revolving Fund',
      icon: RotateCcw,
      subItems: [
        { key: 'fund-collection', label: 'Fund Collection' },
        { key: 'fund-distribution', label: 'Fund Distribution' },
        { key: 'fund-return', label: 'Fund Return' },
        { key: 'fund-balance', label: 'Fund Balance' },
        { key: 'fund-transactions', label: 'Fund Transactions' },
      ],
    },
    {
      key: 'boarding',
      label: 'Boarding',
      icon: Building2,
      subItems: [
        { key: 'boarding-students', label: 'Boarding Students' },
        { key: 'boarding-fees', label: 'Boarding Fees' },
        { key: 'food-expense', label: 'Food Expense' },
        { key: 'other-expenses', label: 'Other Expenses' },
        { key: 'boarding-balance', label: 'Boarding Balance' },
      ],
    },
    {
      key: 'accounts',
      label: 'Accounts',
      icon: Landmark,
      subItems: [
        { key: 'income', label: 'Income' },
        { key: 'expense', label: 'Expense' },
        { key: 'transactions', label: 'Transactions' },
        { key: 'balance', label: 'Balance' },
        { key: 'yearly-monthly-daily', label: 'Yearly, Monthly & Daily Reports' },
      ],
    },
    {
      key: 'exams',
      label: 'Examinations',
      icon: Award,
      subItems: [
        { key: 'exam-marks', label: 'Exam Marks' },
        { key: 'report-cards', label: 'Report Cards' },
      ],
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: Settings,
      subItems: ([
        { key: 'madrasa-information', label: 'Madrasa Information' },
        { key: 'user-management', label: 'User Management' },
        { key: 'academic-year', label: 'Academic Year' },
        { key: 'classes', label: 'Classes' },
        { key: 'account-categories', label: 'Account Categories' },
        { key: 'login-logout', label: 'Login / Logout' },
        { key: 'reset-website-data', label: 'Reset Website Data' },
        { key: 'refresh-reload', label: 'Refresh / Reload' },
        { key: 'system-restart-reboot', label: 'System Restart / Reboot' },
      ] as { key: SubNavigationItem; label: string }[]).filter((item) => {
        const isStaff = adminProfile?.role === 'staff';
        if (isStaff) {
          return (
            item.key !== 'user-management' &&
            item.key !== 'reset-website-data' &&
            item.key !== 'system-restart-reboot'
          );
        }
        return true;
      }),
    },
  ];

  const handleMainItemClick = (item: SidebarItem) => {
    if (!item.subItems) {
      setActiveNav(item.key);
    } else {
      // Toggle expansion or open default subItem
      toggleSection(item.key);
      if (activeSection !== item.key) {
        setActiveNav(item.key, item.subItems[0].key);
      }
    }
  };

  const handleSubItemClick = (sectionKey: NavigationSection, subKey: SubNavigationItem) => {
    setActiveNav(sectionKey, subKey);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-[#0B132B] text-slate-200 border-r border-slate-800/80 shadow-xl">
      {/* Brand Header */}
      <div>
        <div className="flex h-18 items-center justify-between border-b border-slate-800 px-4 bg-[#070D1F]">
          <button
            onClick={() => setActiveNav('dashboard')}
            className="flex items-center gap-3 text-left group transition-opacity hover:opacity-95 overflow-hidden"
          >
            {madrasaInfo?.logo ? (
              <img
                src={madrasaInfo.logo}
                alt="Logo"
                className="h-9 w-9 rounded-xl object-contain bg-white p-1 border border-blue-500/40 shrink-0 shadow-md shadow-blue-500/10"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-sm border border-blue-400/50 shrink-0 shadow-md shadow-blue-600/30">
                ഖ
              </div>
            )}
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold tracking-tight text-blue-300 font-sans truncate">
                  {t('Madrasa Office')}
                </span>
                <span className="text-[10px] font-semibold tracking-wide text-slate-400 truncate">
                  {t('Office Management')}
                </span>
              </div>
            )}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex rounded-xl p-2 text-slate-400 hover:bg-slate-800/80 hover:text-blue-400 transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1.5">
          {navItems.map((item) => {
            const isSectionActive = activeSection === item.key;
            const isExpanded = expandedSections[item.key] || isSectionActive;
            const Icon = item.icon;

            return (
              <div key={item.key} className="space-y-1">
                {/* Main Item Button */}
                <button
                  onClick={() => handleMainItemClick(item)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    isSectionActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 border-l-4 border-rose-500'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isSectionActive
                          ? 'text-white'
                          : 'text-blue-400 group-hover:text-blue-300'
                      }`}
                    />
                    {!isSidebarCollapsed && (
                      <span className="truncate">{t(item.label)}</span>
                    )}
                  </div>

                  {!isSidebarCollapsed && item.subItems && (
                    <span className="text-slate-400 group-hover:text-white">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                </button>

                {/* Sub Items Accordion */}
                {!isSidebarCollapsed && item.subItems && isExpanded && (
                  <div className="ml-4 pl-3 border-l border-slate-800 py-1 space-y-0.5">
                    {item.subItems.map((sub) => {
                      const isSubActive =
                        isSectionActive && activeSubItem === sub.key;

                      return (
                        <button
                          key={sub.key}
                          onClick={() => handleSubItemClick(item.key, sub.key)}
                          className={`flex w-full items-center rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                            isSubActive
                              ? 'bg-slate-800 text-emerald-400 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{t(sub.label)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer System Quick Indicator */}
      <div className="border-t border-slate-800 p-3 bg-slate-950/40">
        {!isSidebarCollapsed ? (
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>{t('Active Session')}</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">1447-48 AH</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div
          className={`fixed inset-y-0 left-0 z-30 transition-all duration-200 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
