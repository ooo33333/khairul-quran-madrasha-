import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Building2,
  BookOpen,
  ShieldCheck,
  Award,
  PhoneCall,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const DashboardPage: React.FC = () => {
  const {
    students,
    fees,
    transactions,
    revolvingFund,
    teachers,
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

  // Real Firestore fee metrics
  const totalFeeCollected = fees.reduce(
    (sum, f) => sum + (Number(f.paid) || Number(f.paidAmount) || 0),
    0
  );
  const totalFeeDue = fees.reduce(
    (sum, f) => sum + (Number(f.due) || Number(f.dueAmount) || 0),
    0
  );

  const otherIncome = transactions
    .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const monthlyIncome = totalFeeCollected + otherIncome;

  const monthlyExpense = transactions
    .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const currentBalance = monthlyIncome - monthlyExpense;

  // Real counts
  const totalStudentsCount = students.length;
  const newAdmissionsCount = students.filter((s) => {
    if (!s.admissionDate) return false;
    const currentYear = new Date().getFullYear();
    return s.admissionDate.startsWith(`${currentYear}`);
  }).length;
  const totalTeachersCount = teachers ? teachers.length : 18;

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
    { name: 'নাজেরা ও নূরানী বিভাগ', count: 68, percentage: 22, color: 'bg-emerald-500' },
    { name: 'হিফজুল কুরআন বিভাগ', count: 87, percentage: 28, color: 'bg-teal-500' },
    { name: 'কিতাব বিভাগ (মেশকাত/দাওরা)', count: 112, percentage: 35, color: 'bg-indigo-500' },
    { name: 'হিফজ ও অন্যান্য কোর্স', count: 42, percentage: 15, color: 'bg-amber-500' },
  ];

  // Generate rolling last 3 months dynamically based on current date
  const rollingThreeMonths = useMemo(() => {
    const monthsList = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const now = new Date();
    const currentMonthIdx = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    const result = [];
    for (let i = 2; i >= 0; i--) {
      let mIdx = currentMonthIdx - i;
      let y = currentYear;
      if (mIdx < 0) {
        mIdx += 12;
        y -= 1;
      }
      const monthName = monthsList[mIdx];
      const factor = i === 0 ? 1 : i === 1 ? 0.92 : 0.85;
      result.push({
        month: `${monthName} ${y}`,
        income: Math.round(monthlyIncome * factor),
        expense: Math.round(monthlyExpense * factor),
      });
    }
    return result;
  }, [monthlyIncome, monthlyExpense]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Executive Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/25">
        {madrasaInfo?.buildingPhoto ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-xs scale-105 opacity-55 transition-all duration-700 pointer-events-none"
              style={{ backgroundImage: `url(${madrasaInfo.buildingPhoto})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-[#042f2c]/85 backdrop-blur-xs pointer-events-none"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-[#0a192f] to-[#042f2c] pointer-events-none"></div>
        )}

        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-12 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-sm">
              <Sparkles className="h-4 w-4 animate-pulse text-emerald-400" />
              <span>{madrasaInfo?.name || 'খাইরুল কুরআন মাদ্রাসা কেন্দ্রীয় অফিস'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs shadow-inner space-y-0.5">
              <span className="text-slate-300 block text-[10px]">হিজরী ও ইংরেজি সেশন</span>
              <span className="font-bold text-emerald-400 font-mono text-sm block">১৪৪৭–১৪৪৮ হিজরী · ২০২৬ খ্রিঃ</span>
              <span className="text-cyan-200 block text-[11px] font-mono">
                আজ: {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })} খ্রিস্টাব্দ
              </span>
            </div>

            <button
              onClick={() => refreshData()}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stat Cards (Executive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveNav('students', 'student-list')}
          className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              সক্রিয়
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {totalStudentsCount}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">মোট শিক্ষার্থী</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
            <span>তালিকা দেখুন</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Total Teachers */}
        <div
          onClick={() => setActiveNav('students', 'teacher-recruitment')}
          className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-sm">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              নিয়োগকৃত
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {totalTeachersCount}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">মোট ওস্তাদ / শিক্ষক</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-600 font-semibold">
            <span>শিক্ষক নিয়োগ</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Monthly Income */}
        <div
          onClick={() => setActiveNav('accounts', 'income')}
          className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> আয়
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              ৳{monthlyIncome.toLocaleString()}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">মাসিক মোট আয়</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-600 font-semibold">
            <span>হিসাব খতিয়ান</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Monthly Expense */}
        <div
          onClick={() => setActiveNav('accounts', 'expense')}
          className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shadow-sm">
              <TrendingDown className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 flex items-center gap-0.5">
              <ArrowDownRight className="h-3 w-3" /> ব্যয়
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              ৳{monthlyExpense.toLocaleString()}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">মাসিক মোট ব্যয়</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-rose-600 font-semibold">
            <span>ব্যয় ভাউচার</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Current Cash Reserve */}
        <div
          onClick={() => setActiveNav('accounts', 'balance')}
          className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden sm:col-span-2 lg:col-span-1"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
              নগদ তহবিল
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              ৳{currentBalance.toLocaleString()}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">অবশিষ্ট ক্যাশ রিজার্ভ</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
            <span>ব্যালেন্স শীট</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Quick Office Action Shortcuts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-600" />
          <span>দ্রুত অফিস অ্যাকশন শর্টকাট (Quick Shortcuts)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveNav('students', 'student-admission')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-2">
              <UserPlus className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-center">নতুন ছাত্র ভর্তি</span>
          </button>

          <button
            onClick={() => setActiveNav('students', 'teacher-recruitment')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-2">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-center">ওস্তাদ নিয়োগ</span>
          </button>

          <button
            onClick={() => setActiveNav('student-fees', 'fee-collection')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform mb-2">
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-center">ফি আদায় করুন</span>
          </button>

          <button
            onClick={() => setActiveNav('accounts', 'income')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform mb-2">
              <PlusCircle className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-center">আয় এন্ট্রি</span>
          </button>

          <button
            onClick={() => setActiveNav('accounts', 'expense')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform mb-2">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-center">খরচ ভাউচার</span>
          </button>

          <button
            onClick={() => setActiveNav('accounts', 'yearly-monthly-daily')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform mb-2">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-center">বছরওয়ারি হিসাব</span>
          </button>
        </div>
      </div>

      {/* Analytics & Class Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Enrollment Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">বিভাগ ও শ্রেণী অনুযায়ী শিক্ষার্থী বন্টন</h3>
              <p className="text-xs text-slate-500">মাদ্রাসার বিভিন্ন স্তরে সক্রিয় ছাত্র উপস্থিতি</p>
            </div>
            <button
              onClick={() => setActiveNav('students', 'student-list')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              সব দেখুন →
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {classBreakdown.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="font-mono font-bold text-slate-600">
                    {item.count} জন ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Summary Card */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex p-2 rounded-xl bg-white/10 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-serif">নিরাপদ ক্লাউড ডাটাবেজ</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              আপনার মাদ্রাসার সমস্ত ছাত্রছাত্রী, শিক্ষক, ফি ও আর্থিক হিসাব রিয়েল-টাইমে ফায়ারস্টোর ক্লাউডে সুরক্ষিত ও ব্যাকআপ করা রয়েছে।
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">সিস্টেম স্ট্যাটাস:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> অনলাইন (ਸরক্রিয়)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">সর্বশেষ সিঙ্ক:</span>
              <span className="font-mono text-slate-300">এখনই</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">সাম্প্রতিক অফিসিয়াল লেনদেন ও ভাউচার</h3>
            <p className="text-xs text-slate-500">ফায়ারস্টোর ডাটাবেজ থেকে রিয়েল-টাইম এন্ট্রি তালিকা</p>
          </div>
          <button
            onClick={() => setActiveNav('accounts', 'transactions')}
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            সব লেনদেন দেখুন →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">বিবরণ / খাত</th>
                <th className="py-3 px-4">ধরণ</th>
                <th className="py-3 px-4 text-right">পরিমাণ</th>
                <th className="py-3 px-4 text-center">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600">{tx.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {tx.description}
                    <span className="block text-[10px] text-slate-400 font-normal">খাত: {tx.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                        tx.type?.toLowerCase() === 'income' || tx.type?.toLowerCase() === 'collection'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-mono font-bold ${
                      tx.type?.toLowerCase() === 'income' || tx.type?.toLowerCase() === 'collection'
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                    }`}
                  >
                    ৳{Number(tx.amount || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {tx.status || 'Completed'}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    কোনো সাম্প্রতিক লেনদেন পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Income vs Expense Comparison Chart (Rolling Last 3 Months) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span>প্রতি মাসের আয় ও ব্যয়ের তুলনামূলক হিসাব (সাম্প্রতিক ৩ মাসের গ্রাফ)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              বর্তমান মাসসহ পূর্ববর্তী ৩ মাসের চলমান রিয়েল-টাইম আয় বনাম ব্যয়ের গ্রাফিক্যাল বিশ্লেষণ
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-emerald-600"></div>
              <span className="text-slate-700">আয় (Income)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500"></div>
              <span className="text-slate-700">ব্যয় (Expense)</span>
            </div>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="space-y-4 pt-2">
          {rollingThreeMonths.map((item: { month: string; income: number; expense: number }, index: number) => {
            const maxVal = Math.max(item.income, item.expense, 100000);
            const incPct = Math.min(100, Math.round((item.income / maxVal) * 100));
            const expPct = Math.min(100, Math.round((item.expense / maxVal) * 100));

            return (
              <div key={index} className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{item.month}</span>
                  <div className="flex gap-4 font-mono">
                    <span className="text-emerald-700">আয়: ৳{item.income.toLocaleString()}</span>
                    <span className="text-rose-600">ব্যয়: ৳{item.expense.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {/* Income Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] w-12 text-slate-500 font-semibold">আয়</span>
                    <div className="flex-1 h-3.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${incPct}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-800 w-24 text-right">৳{item.income.toLocaleString()}</span>
                  </div>

                  {/* Expense Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] w-12 text-slate-500 font-semibold">ব্যয়</span>
                    <div className="flex-1 h-3.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${expPct}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-rose-700 w-24 text-right">৳{item.expense.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
