import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  UserPlus,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  CreditCard,
  FileText,
  DollarSign,
  ChevronRight,
  Calendar,
  RotateCw,
  RotateCcw,
  Search,
  Bell,
  RefreshCw,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const DashboardPage: React.FC = () => {
  const {
    students,
    fees,
    transactions,
    revolvingFund,
    setActiveNav,
    searchQuery,
    setSearchQuery,
    t,
    madrasaInfo,
    refreshData,
    isRefreshing,
    language,
    setLanguage,
  } = useApp();

  const [overviewTab, setOverviewTab] = useState<'class' | 'gender'>('class');
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real Firestore fee metrics (Accounting rule: Only actual Paid Amount counts as Income!)
  const totalFeeCollected = fees.reduce(
    (sum, f) => sum + (Number(f.paid) || Number(f.paidAmount) || 0),
    0
  );
  const totalFeeDue = fees.reduce(
    (sum, f) => sum + (Number(f.due) || Number(f.dueAmount) || 0),
    0
  );

  // General accounts additional income (Only actual Completed counts as income)
  const otherIncome = transactions
    .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // Monthly financials: Strictly actual received paid amounts
  const monthlyIncome = totalFeeCollected + otherIncome;

  const monthlyExpense = transactions
    .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const currentBalance = monthlyIncome - monthlyExpense;

  // Dedicated General Accounts metrics
  const generalIncome = otherIncome;
  const generalExpense = monthlyExpense;
  const generalBalance = generalIncome - generalExpense;

  // Revolving Fund Balance Calculation (Only Completed status)
  const rfCollection = revolvingFund
    .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'collection')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const rfDistribution = revolvingFund
    .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'distribution')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const rfReturn = revolvingFund
    .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'return')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const revolvingFundBalance = rfCollection + rfReturn - rfDistribution;

  // Real student count from Firestore
  const totalStudentsCount = students.length;
  const newAdmissionsCount = students.filter((s) => {
    if (!s.admissionDate) return false;
    const currentYear = new Date().getFullYear();
    return s.admissionDate.startsWith(`${currentYear}`);
  }).length;
  const totalTeachersCount = 18;

  // Filtered recent transactions
  const filteredTransactions = transactions
    .filter((t) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        (t.description || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.transactionId || t.id || '').toLowerCase().includes(q) ||
        (t.reference || t.referenceNo || '').toLowerCase().includes(q)
      );
    })
    .slice(0, 6);

  // Class distribution data
  const classBreakdown = [
    { name: 'Noorani Primary', count: 68, percentage: 16, color: 'bg-emerald-500' },
    { name: 'Hifz Program', count: 87, percentage: 20, color: 'bg-sky-500' },
    { name: 'Kitab / Alim Course', count: 124, percentage: 29, color: 'bg-indigo-500' },
    { name: 'Mutawassitah', count: 52, percentage: 12, color: 'bg-amber-500' },
    { name: 'Sanawiyah', count: 40, percentage: 9, color: 'bg-purple-500' },
    { name: 'Dawrah Hadith', count: 36, percentage: 8, color: 'bg-teal-500' },
    { name: 'Qiraat Special', count: 21, percentage: 6, color: 'bg-rose-500' },
  ];

  // Monthly income vs expense chart points
  const monthlyFlow = [
    { month: 'May', income: 14200, expense: 9800 },
    { month: 'Jun', income: 15600, expense: 10400 },
    { month: 'Jul', income: 19800, expense: 11200 },
    { month: 'Aug', income: 16500, expense: 10800 },
    { month: 'Sep', income: 17900, expense: 11900 },
    { month: 'Oct', income: 18450, expense: 11200 },
  ];

  const maxVal = Math.max(...monthlyFlow.map((d) => Math.max(d.income, d.expense)));

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Top Action Controls (Search, English, Bengali, Refresh, Notification) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <Breadcrumb sectionTitle="Dashboard" />

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative w-44 sm:w-56">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search...')}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all shadow-inner"
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

          {/* Language Switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 p-0.5 shadow-inner">
            <button
              onClick={() => setLanguage('en')}
              title="English"
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              title="বাংলা"
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                language === 'bn'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refreshData()}
            disabled={isRefreshing}
            title={t('Refresh Data')}
            className="rounded-lg border border-slate-300 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50 shadow-inner"
            aria-label={t('Refresh Data')}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Notification Button & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative rounded-lg border border-slate-300 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-inner"
              aria-label={t('Notifications')}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </button>

            {isNotifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl z-50 text-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                  <span className="text-xs font-semibold text-slate-900">{t('Notifications')}</span>
                  <span className="text-[11px] text-slate-500">3 recent alerts</span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">{t('Fee Collection')}</p>
                      <p className="text-[11px] text-slate-600">October monthly fees compiled successfully.</p>
                      <span className="text-[10px] text-slate-400">12 mins ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">{t('Food Expense')}</p>
                      <p className="text-[11px] text-slate-600">Kitchen inventory restock scheduled.</p>
                      <span className="text-[10px] text-slate-400">1 hour ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">{t('Student Admission')}</p>
                      <p className="text-[11px] text-slate-600">New admission requests pending review.</p>
                      <span className="text-[10px] text-slate-400">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome / Office Header Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-xl border border-blue-500/30 group">
        {/* Animated glowing background light effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 opacity-30 blur-md group-hover:opacity-50 transition duration-1000 animate-pulse"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full">
            {madrasaInfo?.logo ? (
              <div className="relative shrink-0 p-1 bg-white/10 rounded-xl border border-white/20 shadow-inner">
                <img
                  src={madrasaInfo.logo}
                  alt="Madrasa Logo"
                  className="h-16 w-16 object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-200 shrink-0 font-bold text-xl">
                م
              </div>
            )}
            <div className="flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 py-1">
                جامعة خورشيدية خير القرآن مدرسة
              </h2>
              <span className="text-xs text-cyan-300/90 font-medium tracking-wide">
                {t('Status: Active Operations')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudentsCount}
          subtitle="Enrolled across all classes"
          icon={<Users className="h-6 w-6 text-white" />}
          accentColor="slate"
          onClick={() => setActiveNav('students', 'student-list')}
        />
        <StatCard
          title="New Admissions"
          value={newAdmissionsCount}
          subtitle="Enrolled this term"
          trend={{ value: '+12% vs last term', isPositive: true }}
          icon={<UserPlus className="h-6 w-6 text-white" />}
          accentColor="emerald"
          onClick={() => setActiveNav('students', 'student-admission')}
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachersCount}
          subtitle="Faculty & staff members"
          icon={<GraduationCap className="h-6 w-6 text-white" />}
          accentColor="indigo"
          onClick={() => setActiveNav('settings', 'classes')}
        />
        <StatCard
          title="Monthly Income"
          value={`৳${monthlyIncome.toLocaleString()}`}
          subtitle="Fees & general receipts"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          accentColor="emerald"
          onClick={() => setActiveNav('student-fees', 'monthly-fees')}
        />
        <StatCard
          title="Monthly Expense"
          value={`৳${monthlyExpense.toLocaleString()}`}
          subtitle="Real operating expenses"
          icon={<TrendingDown className="h-6 w-6 text-white" />}
          accentColor="amber"
          onClick={() => setActiveNav('accounts', 'expense')}
        />
        <StatCard
          title="Current Balance"
          value={`৳${currentBalance.toLocaleString()}`}
          subtitle="Net institutional reserve"
          icon={<Wallet className="h-6 w-6 text-white" />}
          accentColor="blue"
          onClick={() => setActiveNav('accounts', 'balance')}
        />
        <StatCard
          title="Monthly Fees"
          value={`৳${totalFeeCollected.toLocaleString()}`}
          subtitle="Collected student fees"
          icon={<CreditCard className="h-6 w-6 text-white" />}
          accentColor="purple"
          onClick={() => setActiveNav('student-fees', 'fee-collection')}
        />
        <StatCard
          title="Due Fees"
          value={`৳${totalFeeDue.toLocaleString()}`}
          subtitle="Pending student dues"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          accentColor="amber"
          onClick={() => setActiveNav('student-fees', 'fee-collection')}
        />
      </div>

      {/* Real Firestore Fees Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-xs">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              {t('Total Student Fees Collected')}
            </span>
            <p className="text-xl font-bold font-mono text-emerald-950 mt-0.5">
              ৳{totalFeeCollected.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium">
              {t('Contributes directly to Monthly Income')}
            </span>
          </div>
          <button
            onClick={() => setActiveNav('student-fees', 'monthly-fees')}
            className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
          >
            {t('Monthly Fees')}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-xs">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              {t('Total Student Fees Due')}
            </span>
            <p className="text-xl font-bold font-mono text-amber-950 mt-0.5">
              ৳{totalFeeDue.toLocaleString()}
            </p>
            <span className="text-[11px] text-amber-700 font-medium">
              {t('Outstanding receivables (Never counted as income)')}
            </span>
          </div>
          <button
            onClick={() => setActiveNav('student-fees', 'due-fees')}
            className="rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 transition-colors"
          >
            {t('Due Fees')}
          </button>
        </div>
      </div>

      {/* General Accounts Summary Card Row */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('General Accounts Ledger Status')}
            </h3>
            <p className="text-[11px] text-slate-500">{t('Live ledger transactions from Google Cloud Firestore')}</p>
          </div>
          <button
            onClick={() => setActiveNav('accounts', 'balance')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            {t('View All Accounts')} &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="General Income"
            value={`৳${generalIncome.toLocaleString()}`}
            subtitle="Completed income vouchers"
            icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
            accentColor="emerald"
            onClick={() => setActiveNav('accounts', 'income')}
          />
          <StatCard
            title="General Expense"
            value={`৳${generalExpense.toLocaleString()}`}
            subtitle="Completed expense outlays"
            icon={<ArrowDownRight className="h-5 w-5 text-amber-700" />}
            accentColor="amber"
            onClick={() => setActiveNav('accounts', 'expense')}
          />
          <StatCard
            title="General Balance"
            value={`৳${generalBalance.toLocaleString()}`}
            subtitle="Net accounts reserve"
            icon={<Wallet className="h-5 w-5 text-sky-700" />}
            accentColor="blue"
            onClick={() => setActiveNav('accounts', 'balance')}
          />
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('Quick Actions')}
          </p>
          <span className="text-xs text-slate-400">{t('Direct office workflows')}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <button
            onClick={() => setActiveNav('students', 'student-admission')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-900 transition-colors"
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            <span>{t('Add Student')}</span>
          </button>
          <button
            onClick={() => setActiveNav('student-fees', 'fee-collection')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-900 transition-colors"
          >
            <CreditCard className="h-4 w-4 text-sky-600" />
            <span>{t('Collect Fee')}</span>
          </button>
          <button
            onClick={() => setActiveNav('accounts', 'income')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-900 transition-colors"
          >
            <ArrowUpRight className="h-4 w-4 text-indigo-600" />
            <span>{t('Record Income')}</span>
          </button>
          <button
            onClick={() => setActiveNav('accounts', 'expense')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-900 transition-colors"
          >
            <ArrowDownRight className="h-4 w-4 text-amber-600" />
            <span>{t('Record Expense')}</span>
          </button>
          <button
            onClick={() => setActiveNav('revolving-fund', 'fund-collection')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-900 transition-colors"
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            <span>{t('Fund Collection')}</span>
          </button>
          <button
            onClick={() => setActiveNav('revolving-fund', 'fund-distribution')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-900 transition-colors"
          >
            <ArrowDownRight className="h-4 w-4 text-amber-600" />
            <span>{t('Fund Distribution')}</span>
          </button>
          <button
            onClick={() => setActiveNav('revolving-fund', 'fund-return')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-900 transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-indigo-600" />
            <span>{t('Fund Return')}</span>
          </button>
        </div>
      </div>

      {/* Grid: A. Student Overview & B. Income & Expense Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* A. Student Overview */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{t('Student Overview')}</h3>
              <p className="text-xs text-slate-500">{t('Distribution across departments and classes')}</p>
            </div>
            <button
              onClick={() => setActiveNav('students', 'student-list')}
              className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              <span>{t('View All')}</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {classBreakdown.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{t(item.name)}</span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums font-semibold text-slate-900">
                      {item.count} {t('Students')}
                    </span>
                    <span className="text-slate-400 tabular-nums">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage * 3.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{t('Total Enrolled Capacity: 428 / 500')}</span>
            <span className="font-semibold text-emerald-600">85.6%</span>
          </div>
        </div>

        {/* B. Income & Expense Overview */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{t('Income & Expense Overview')}</h3>
              <p className="text-xs text-slate-500">{t('6-Month financial cashflow trend')}</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600"></span>
                <span className="text-slate-600">{t('Income')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-amber-500"></span>
                <span className="text-slate-600">{t('Expense')}</span>
              </div>
            </div>
          </div>

          {/* Clean SVG / Bar visual chart */}
          <div className="mt-6 flex h-52 items-end justify-between gap-3 px-2">
            {monthlyFlow.map((data) => {
              const incomeHeight = (data.income / maxVal) * 100;
              const expenseHeight = (data.expense / maxVal) * 100;

              return (
                 <div key={data.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center gap-1.5 h-40">
                    <div
                      title={`${t('Income')}: ৳${data.income}`}
                      className="w-1/2 rounded-t-sm bg-emerald-600 transition-all hover:bg-emerald-700"
                      style={{ height: `${incomeHeight}%` }}
                    />
                    <div
                      title={`${t('Expense')}: ৳${data.expense}`}
                      className="w-1/2 rounded-t-sm bg-amber-500 transition-all hover:bg-amber-600"
                      style={{ height: `${expenseHeight}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">{t(data.month)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">{t('Average Monthly Surplus:')}</span>
            <span className="font-semibold text-emerald-600 tabular-nums">+৳6,140 / mo</span>
          </div>
        </div>
      </div>

      {/* C. Recent Transactions Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t('Recent Transactions')}</h3>
            <p className="text-xs text-slate-500">{t('Latest financial ledger movements')}</p>
          </div>
          <button
            onClick={() => setActiveNav('accounts', 'transactions')}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <span>{t('View All Transactions')}</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">{t('Date')}</th>
                <th className="px-5 py-3">{t('Description')}</th>
                <th className="px-5 py-3">{t('Category')}</th>
                <th className="px-5 py-3">{t('Type')}</th>
                <th className="px-5 py-3 text-right">{t('Amount')}</th>
                <th className="px-5 py-3 text-center">{t('Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-medium tabular-nums">
                    {tx.date}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-900 max-w-xs truncate">
                    {tx.description}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">{t(tx.category)}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        tx.type === 'Income' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {tx.type === 'Income' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {t(tx.type)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-right font-bold tabular-nums text-slate-900">
                    ৳{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-center">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {t(tx.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
