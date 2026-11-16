import React, { useState, useMemo } from 'react';
import {
  Calendar,
  BarChart2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Filter,
  Download,
  Printer,
  Search,
  CalendarDays,
  Clock,
  CheckCircle2,
  Landmark,
  Wallet,
  RotateCcw,
  Building2,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { StatCard } from '../../components/common/StatCard';

const MONTHS_BN = [
  { id: '01', name: 'জানুয়ারি', en: 'January' },
  { id: '02', name: 'ফেব্রুয়ারি', en: 'February' },
  { id: '03', name: 'মার্চ', en: 'March' },
  { id: '04', name: 'এপ্রিল', en: 'April' },
  { id: '05', name: 'মে', en: 'May' },
  { id: '06', name: 'জুন', en: 'June' },
  { id: '07', name: 'জুলাই', en: 'July' },
  { id: '08', name: 'আগস্ট', en: 'August' },
  { id: '09', name: 'সেপ্টেম্বর', en: 'September' },
  { id: '10', name: 'অক্টোবর', en: 'October' },
  { id: '11', name: 'নভেম্বর', en: 'November' },
  { id: '12', name: 'ডিসেম্বর', en: 'December' },
];

const YEARS = Array.from({ length: 11 }, (_, i) => String(2016 + i)); // 2016 to 2026

export const YearlyMonthlyDailyAccountsPage: React.FC = () => {
  const {
    transactions,
    fees,
    aibTransactions,
    revolvingFund,
    boardingStudents,
    students,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'yearly' | 'monthly' | 'daily'>('yearly');
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Quick preset filters state
  const [quickPreset, setQuickPreset] = useState<string>('this-year');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Helper date checker
  const matchesFilter = (dateStr: string, mode: 'year' | 'month' | 'date' | 'preset', val1: string, val2?: string) => {
    if (!dateStr) return false;
    if (mode === 'year') return dateStr.startsWith(val1);
    if (mode === 'month') return dateStr.startsWith(`${val1}-${val2}`);
    if (mode === 'date') return dateStr === val1;
    return true;
  };

  // ==========================================
  // 1. YEARLY FILTERED DATA
  // ==========================================
  const yearlyStudents = useMemo(() => {
    return students.filter((s) => {
      const dt = s.admissionDate || s.createdAt || '';
      return dt.startsWith(selectedYear);
    });
  }, [students, selectedYear]);

  const totalStudentsUpToYear = useMemo(() => {
    return students.filter((s) => {
      const dt = s.admissionDate || s.createdAt || '';
      return !dt || dt.slice(0, 4) <= selectedYear;
    }).length || students.length;
  }, [students, selectedYear]);

  const yearlyGeneralTx = useMemo(() => {
    return transactions.filter((tx) => tx.date && tx.date.startsWith(selectedYear));
  }, [transactions, selectedYear]);

  const yearlyFees = useMemo(() => {
    return fees.filter((f) => {
      const dt = f.paymentDate || f.createdAt || '';
      return dt.startsWith(selectedYear);
    });
  }, [fees, selectedYear]);

  const yearlyAib = useMemo(() => {
    return aibTransactions.filter((tx) => tx.date && tx.date.startsWith(selectedYear));
  }, [aibTransactions, selectedYear]);

  const yearlyFund = useMemo(() => {
    return revolvingFund.filter((tx) => tx.date && tx.date.startsWith(selectedYear));
  }, [revolvingFund, selectedYear]);

  const yearlyBoarding = useMemo(() => {
    return boardingStudents.filter((bs) => {
      const dt = bs.joiningDate || bs.createdAt || '';
      return dt.startsWith(selectedYear);
    });
  }, [boardingStudents, selectedYear]);

  // Yearly Totals
  const yearlyIncome = useMemo(() => {
    const genInc = yearlyGeneralTx.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const feeInc = yearlyFees.reduce((s, f) => s + (Number(f.paidAmount) || 0), 0);
    const aibInc = yearlyAib.filter(t => t.type === 'collection').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const fundInc = yearlyFund.filter(t => t.status === 'Completed' && (t.type === 'collection' || t.type === 'return')).reduce((s, t) => s + (Number(t.amount) || 0), 0);
    return genInc + feeInc + aibInc + fundInc;
  }, [yearlyGeneralTx, yearlyFees, yearlyAib, yearlyFund]);

  const yearlyExpense = useMemo(() => {
    const genExp = yearlyGeneralTx.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const aibExp = yearlyAib.filter(t => t.type === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const fundExp = yearlyFund.filter(t => t.status === 'Completed' && t.type === 'distribution').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    return genExp + aibExp + fundExp;
  }, [yearlyGeneralTx, yearlyAib, yearlyFund]);

  const yearlyNetBalance = yearlyIncome - yearlyExpense;

  // Month breakdown for year
  const monthlyBreakdown = useMemo(() => {
    return MONTHS_BN.map((m) => {
      const p = `${selectedYear}-${m.id}`;
      const mStud = students.filter(s => (s.admissionDate || s.createdAt || '').startsWith(p)).length;
      const mGen = transactions.filter(t => t.date && t.date.startsWith(p));
      const mFees = fees.filter(f => (f.paymentDate || f.createdAt || '').startsWith(p));
      const mAib = aibTransactions.filter(t => t.date && t.date.startsWith(p));
      const mFund = revolvingFund.filter(t => t.date && t.date.startsWith(p));

      const inc = mGen.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0) +
                  mFees.reduce((s, f) => s + (Number(f.paidAmount) || 0), 0) +
                  mAib.filter(t => t.type === 'collection').reduce((s, t) => s + (Number(t.amount) || 0), 0) +
                  mFund.filter(t => t.status === 'Completed' && (t.type === 'collection' || t.type === 'return')).reduce((s, t) => s + (Number(t.amount) || 0), 0);

      const exp = mGen.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0) +
                  mAib.filter(t => t.type === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0) +
                  mFund.filter(t => t.status === 'Completed' && t.type === 'distribution').reduce((s, t) => s + (Number(t.amount) || 0), 0);

      return {
        ...m,
        admissions: mStud,
        income: inc,
        expense: exp,
        balance: inc - exp,
        count: mGen.length + mFees.length + mAib.length + mFund.length,
      };
    });
  }, [selectedYear, students, transactions, fees, aibTransactions, revolvingFund]);


  // ==========================================
  // 2. MONTHLY FILTERED DATA
  // ==========================================
  const monthPrefix = `${selectedYear}-${selectedMonth}`;

  const monthlyStudents = useMemo(() => {
    return students.filter(s => (s.admissionDate || s.createdAt || '').startsWith(monthPrefix));
  }, [students, monthPrefix]);

  const monthlyGeneralTx = useMemo(() => transactions.filter(t => t.date && t.date.startsWith(monthPrefix)), [transactions, monthPrefix]);
  const monthlyFees = useMemo(() => fees.filter(f => (f.paymentDate || f.createdAt || '').startsWith(monthPrefix)), [fees, monthPrefix]);
  const monthlyAib = useMemo(() => aibTransactions.filter(t => t.date && t.date.startsWith(monthPrefix)), [aibTransactions, monthPrefix]);
  const monthlyFund = useMemo(() => revolvingFund.filter(t => t.date && t.date.startsWith(monthPrefix)), [revolvingFund, monthPrefix]);

  const monthlyIncome = useMemo(() => {
    const genInc = monthlyGeneralTx.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const feeInc = monthlyFees.reduce((s, f) => s + (Number(f.paidAmount) || 0), 0);
    const aibInc = monthlyAib.filter(t => t.type === 'collection').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const fundInc = monthlyFund.filter(t => t.status === 'Completed' && (t.type === 'collection' || t.type === 'return')).reduce((s, t) => s + (Number(t.amount) || 0), 0);
    return genInc + feeInc + aibInc + fundInc;
  }, [monthlyGeneralTx, monthlyFees, monthlyAib, monthlyFund]);

  const monthlyExpense = useMemo(() => {
    const genExp = monthlyGeneralTx.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const aibExp = monthlyAib.filter(t => t.type === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const fundExp = monthlyFund.filter(t => t.status === 'Completed' && t.type === 'distribution').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    return genExp + aibExp + fundExp;
  }, [monthlyGeneralTx, monthlyAib, monthlyFund]);

  const monthlyNetBalance = monthlyIncome - monthlyExpense;


  // ==========================================
  // 3. DAILY FILTERED DATA
  // ==========================================
  const dailyStudents = useMemo(() => {
    return students.filter(s => (s.admissionDate || s.createdAt || '') === selectedDate);
  }, [students, selectedDate]);

  const dailyGeneralTx = useMemo(() => transactions.filter(t => t.date === selectedDate), [transactions, selectedDate]);
  const dailyFees = useMemo(() => fees.filter(f => (f.paymentDate || f.createdAt || '') === selectedDate), [fees, selectedDate]);
  const dailyAib = useMemo(() => aibTransactions.filter(t => t.date === selectedDate), [aibTransactions, selectedDate]);
  const dailyFund = useMemo(() => revolvingFund.filter(t => t.date === selectedDate), [revolvingFund, selectedDate]);

  const dailyIncome = useMemo(() => {
    const genInc = dailyGeneralTx.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const feeInc = dailyFees.reduce((s, f) => s + (Number(f.paidAmount) || 0), 0);
    const aibInc = dailyAib.filter(t => t.type === 'collection').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const fundInc = dailyFund.filter(t => t.status === 'Completed' && (t.type === 'collection' || t.type === 'return')).reduce((s, t) => s + (Number(t.amount) || 0), 0);
    return genInc + feeInc + aibInc + fundInc;
  }, [dailyGeneralTx, dailyFees, dailyAib, dailyFund]);

  const dailyExpense = useMemo(() => {
    const genExp = dailyGeneralTx.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const aibExp = dailyAib.filter(t => t.type === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const fundExp = dailyFund.filter(t => t.status === 'Completed' && t.type === 'distribution').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    return genExp + aibExp + fundExp;
  }, [dailyGeneralTx, dailyAib, dailyFund]);

  const dailyNetBalance = dailyIncome - dailyExpense;


  // ==========================================
  // 4. QUICK PRESET FILTERED DATA
  // ==========================================
  const quickStudents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return students.filter(s => {
      const dt = s.admissionDate || s.createdAt || '';
      if (!dt) return false;
      if (quickPreset === 'today') return dt === today;
      if (quickPreset === 'this-month') return dt.startsWith(today.slice(0, 7));
      if (quickPreset === 'this-year') return dt.startsWith(today.slice(0, 4));
      if (quickPreset === 'custom') {
        if (customStartDate && dt < customStartDate) return false;
        if (customEndDate && dt > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [students, quickPreset, customStartDate, customEndDate]);

  const quickTransactions = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return transactions.filter(tx => {
      const dt = tx.date;
      if (!dt) return false;
      if (quickPreset === 'today') return dt === todayStr;
      if (quickPreset === 'yesterday') {
        const yest = new Date();
        yest.setDate(today.getDate() - 1);
        return dt === yest.toISOString().split('T')[0];
      }
      if (quickPreset === 'last-7-days') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return dt >= weekAgo.toISOString().split('T')[0] && dt <= todayStr;
      }
      if (quickPreset === 'this-month') return dt.startsWith(today.toISOString().slice(0, 7));
      if (quickPreset === 'last-month') {
        const lastM = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return dt.startsWith(lastM.toISOString().slice(0, 7));
      }
      if (quickPreset === 'this-year') return dt.startsWith(String(today.getFullYear()));
      if (quickPreset === 'custom') {
        if (customStartDate && dt < customStartDate) return false;
        if (customEndDate && dt > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [transactions, quickPreset, customStartDate, customEndDate]);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle={language === 'bn' ? 'হিসাবখাত' : 'Accounts'}
        subItemTitle={language === 'bn' ? 'বছরওয়ারি, মাসওয়ারি ও দিনওয়ারি হিসাব' : 'Yearly, Monthly & Daily Reports'}
        sectionKey="accounts"
        subItemKey="yearly-monthly-daily"
      />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {language === 'bn' ? '📊 বছরওয়ারি, মাসওয়ারি ও দিনওয়ারি সমন্বিত হিসাব ও ছাত্রছাত্রী বিবরণী' : '📊 Yearly, Monthly & Daily Integrated Reports'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'শিক্ষার্থী ভর্তি, সাধারণ আয়-ব্যয়, ছাত্র ফি, গোরাবাত তহবিল, ঘুরাবা তহবিল ও আবাসিক বোর্ডের সার্বিক খতিয়ান'
              : 'Unified ledger connecting student admissions, general accounts, fees, Aib, Ghuraba fund & boarding'}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-xs transition-colors cursor-pointer print:hidden"
        >
          <Printer className="h-4 w-4" />
          <span>{language === 'bn' ? 'রিপোর্ট প্রিন্ট করুন' : 'Print Report'}</span>
        </button>
      </div>

      {/* Quick Shortcuts Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{language === 'bn' ? 'দ্রুত হিসাব দেখার শর্টকাট' : 'Quick Accounting Shortcuts'}</span>
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {language === 'bn' ? `${quickStudents.length} শিক্ষার্থী ও ${quickTransactions.length} লেনদেন` : `${quickStudents.length} students & ${quickTransactions.length} txns`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'today', bn: 'আজকের হিসাব', en: 'Today' },
            { id: 'yesterday', bn: 'গতকালের হিসাব', en: 'Yesterday' },
            { id: 'last-7-days', bn: 'বিগত ৭ দিন', en: 'Last 7 Days' },
            { id: 'this-month', bn: 'চলতি মাস', en: 'This Month' },
            { id: 'last-month', bn: 'বিগত মাস', en: 'Last Month' },
            { id: 'this-year', bn: 'চলতি বছর', en: 'This Year' },
            { id: 'custom', bn: 'কাস্টম রেঞ্জ', en: 'Custom Range' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setQuickPreset(preset.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                quickPreset === preset.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? preset.bn : preset.en}
            </button>
          ))}
        </div>

        {quickPreset === 'custom' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-600">{language === 'bn' ? 'তারিখ থেকে:' : 'From:'}</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-slate-800"
            />
            <span className="font-semibold text-slate-600">{language === 'bn' ? 'তারিখ পর্যন্ত:' : 'To:'}</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-slate-800"
            />
          </div>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs max-w-md">
        {[
          { id: 'yearly', bn: '১. বছরওয়ারি হিসাব ও ছাত্রছাত্রী', en: '1. Yearly Reports' },
          { id: 'monthly', bn: '২. মাসওয়ারি হিসাব ও ছাত্রছাত্রী', en: '2. Monthly Reports' },
          { id: 'daily', bn: '৩. দিনওয়ারি হিসাব ও ছাত্রছাত্রী', en: '3. Daily Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {language === 'bn' ? tab.bn : tab.en}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 1. YEARLY VIEW */}
      {/* ========================================================= */}
      {activeTab === 'yearly' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-bold text-slate-700">{language === 'bn' ? 'বছর নির্বাচন করুন:' : 'Select Year:'}</span>
            <div className="flex flex-wrap gap-1.5">
              {YEARS.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold font-mono transition-all cursor-pointer ${
                    selectedYear === yr
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={language === 'bn' ? `${selectedYear} সালে ভর্তি` : `${selectedYear} Admissions`}
              value={yearlyStudents.length.toLocaleString()}
              subtitle={language === 'bn' ? `মোট শিক্ষার্থী (সচল: ${totalStudentsUpToYear})` : `Admitted this year`}
              icon={<Users className="h-5 w-5 text-blue-600" />}
              accentColor="blue"
            />
            <StatCard
              title={language === 'bn' ? `${selectedYear} মোট আয়` : `${selectedYear} Total Income`}
              value={`৳${yearlyIncome.toLocaleString()}`}
              subtitle={language === 'bn' ? 'সকল উৎস থেকে প্রাপ্তি' : 'All sources revenue'}
              icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
              accentColor="emerald"
            />
            <StatCard
              title={language === 'bn' ? `${selectedYear} মোট ব্যয়` : `${selectedYear} Total Expense`}
              value={`৳${yearlyExpense.toLocaleString()}`}
              subtitle={language === 'bn' ? 'সকল খাতের পরিশোধ' : 'All outlays'}
              icon={<ArrowDownRight className="h-5 w-5 text-amber-700" />}
              accentColor="amber"
            />
            <StatCard
              title={language === 'bn' ? `${selectedYear} নিট ব্যালেন্স` : `${selectedYear} Net Balance`}
              value={`৳${yearlyNetBalance.toLocaleString()}`}
              subtitle={language === 'bn' ? 'সর্বমোট স্থিতি' : 'Net surplus reserve'}
              icon={<TrendingUp className="h-5 w-5 text-indigo-700" />}
              accentColor="blue"
            />
          </div>

          {/* Students Admitted in Selected Year Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <span>{language === 'bn' ? `${selectedYear} সালে ভর্তিকৃত শিক্ষার্থী তালিকা` : `${selectedYear} Student Admissions Roster`}</span>
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {language === 'bn' ? `মোট ${yearlyStudents.length} জন` : `Total ${yearlyStudents.length}`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">{language === 'bn' ? 'আইডি' : 'ID'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'শিক্ষার্থীর নাম' : 'Student Name'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'পিতার নাম' : 'Father Name'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'শ্রেণী' : 'Class'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'ভর্তির তারিখ' : 'Admission Date'}</th>
                    <th className="px-5 py-3 text-center">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {yearlyStudents.length > 0 ? (
                    yearlyStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-slate-700">{s.id}</td>
                        <td className="px-5 py-3 font-bold text-slate-900">{s.name}</td>
                        <td className="px-5 py-3 text-slate-600">{s.fatherName}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{s.className}</td>
                        <td className="px-5 py-3 font-mono text-slate-600">{s.admissionDate || s.createdAt}</td>
                        <td className="px-5 py-3 text-center">
                          <span className="inline-block rounded px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        {language === 'bn' ? `${selectedYear} সালে কোনো নতুন শিক্ষার্থী ভর্তির রেকর্ড নেই।` : `No student admissions found in ${selectedYear}.`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Month Breakdown Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'bn' ? `${selectedYear} সালের মাসভিত্তিক সমন্বিত হিসাব ও ছাত্রভর্তি` : `${selectedYear} Monthly Integrated Statement`}
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {language === 'bn' ? 'মাসে ক্লিক করে বিস্তারিত দেখুন' : 'Click month for details'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">{language === 'bn' ? 'মাস' : 'Month'}</th>
                    <th className="px-5 py-3 text-center">{language === 'bn' ? 'নতুন ভর্তি' : 'Admissions'}</th>
                    <th className="px-5 py-3 text-right">{language === 'bn' ? 'মোট আয়' : 'Income'}</th>
                    <th className="px-5 py-3 text-right">{language === 'bn' ? 'মোট ব্যয়' : 'Expense'}</th>
                    <th className="px-5 py-3 text-right">{language === 'bn' ? 'অবশিষ্ট জের' : 'Net Balance'}</th>
                    <th className="px-5 py-3 text-center">{language === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyBreakdown.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => {
                        setSelectedMonth(m.id);
                        setActiveTab('monthly');
                      }}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-900 group-hover:text-blue-600">
                        {language === 'bn' ? m.name : m.en} ({selectedYear})
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-blue-700">
                        {m.admissions} জন
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-700">
                        +৳{m.income.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-amber-700">
                        -৳{m.expense.toLocaleString()}
                      </td>
                      <td className={`px-5 py-3.5 text-right font-mono font-bold ${m.balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                        ৳{m.balance.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MONTHLY VIEW */}
      {/* ========================================================= */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">{language === 'bn' ? 'বছর:' : 'Year:'}</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold font-mono text-slate-800"
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 mr-2">{language === 'bn' ? 'মাস নির্বাচন করুন:' : 'Month:'}</span>
              {MONTHS_BN.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMonth(m.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    selectedMonth === m.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {language === 'bn' ? m.name : m.en}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title={language === 'bn' ? `${MONTHS_BN.find((m) => m.id === selectedMonth)?.name} ${selectedYear} মোট আয়` : `Income for ${selectedMonth}/${selectedYear}`}
              value={`৳${monthlyIncome.toLocaleString()}`}
              subtitle={language === 'bn' ? 'ফি, অনুদান, গোরাবাত ও ফান্ডসহ মোট আয়' : 'Total monthly income'}
              icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
              accentColor="emerald"
            />
            <StatCard
              title={language === 'bn' ? `${MONTHS_BN.find((m) => m.id === selectedMonth)?.name} ${selectedYear} মোট ব্যয়` : `Expense for ${selectedMonth}/${selectedYear}`}
              value={`৳${monthlyExpense.toLocaleString()}`}
              subtitle={language === 'bn' ? 'বেতন, খাবার ও অন্যান্য খরচ' : 'Total monthly expense'}
              icon={<ArrowDownRight className="h-5 w-5 text-amber-700" />}
              accentColor="amber"
            />
            <StatCard
              title={language === 'bn' ? 'মাসের অবশিষ্ট ব্যালেন্স' : 'Monthly Net Balance'}
              value={`৳${monthlyNetBalance.toLocaleString()}`}
              subtitle={language === 'bn' ? 'নিট উদ্বৃত্ত জের' : 'Net surplus'}
              icon={<TrendingUp className="h-5 w-5 text-sky-700" />}
              accentColor="blue"
            />
          </div>

          {/* Monthly Admissions Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'bn'
                  ? `${MONTHS_BN.find((m) => m.id === selectedMonth)?.name} ${selectedYear} এ ভর্তিকৃত ছাত্রছাত্রী`
                  : `Student Admissions in ${selectedMonth}/${selectedYear}`}
              </h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {language === 'bn' ? `${monthlyStudents.length} জন ভর্তি` : `${monthlyStudents.length} admitted`}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">{language === 'bn' ? 'আইডি' : 'ID'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'শিক্ষার্থীর নাম' : 'Name'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'পিতার নাম' : 'Father'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'শ্রেণী' : 'Class'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyStudents.length > 0 ? (
                    monthlyStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-mono font-bold text-slate-700">{s.id}</td>
                        <td className="px-5 py-3 font-bold text-slate-900">{s.name}</td>
                        <td className="px-5 py-3 text-slate-600">{s.fatherName}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{s.className}</td>
                        <td className="px-5 py-3 font-mono text-slate-600">{s.admissionDate || s.createdAt}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        {language === 'bn' ? 'এই মাসে নতুন কোনো ভর্তি নেই।' : 'No student admissions in this month.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Transactions Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'bn'
                  ? `${MONTHS_BN.find((m) => m.id === selectedMonth)?.name} ${selectedYear} এর সমস্ত আর্থিক লেনদেন (সাধারণ, ফি, গোরাবাত ও ফান্ড)`
                  : `All Financial Transactions in ${selectedMonth}/${selectedYear}`}
              </h3>
              <span className="text-xs font-semibold text-slate-600">
                {language === 'bn' ? `${monthlyGeneralTx.length + monthlyFees.length + monthlyAib.length + monthlyFund.length}টি এন্ট্রি` : `entries`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'বিভাগ' : 'Section'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'বিবরণ / উৎস' : 'Description / Source'}</th>
                    <th className="px-5 py-3 text-right">{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'মাধ্যম' : 'Method'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ...monthlyGeneralTx.map(t => ({ ...t, sourceSec: 'সাধারণ হিসাব' })),
                    ...monthlyFees.map(f => ({ id: f.feeId, date: f.paymentDate || f.createdAt, type: 'Income', category: 'শিক্ষার্থী ফি', description: `${f.studentName} (${f.feeType})`, amount: f.paidAmount, paymentMethod: 'Cash', sourceSec: 'ফি আদায়' })),
                    ...monthlyAib.map(t => ({ ...t, sourceSec: 'গোরাবাত তহবিল' })),
                    ...monthlyFund.map(t => ({ ...t, sourceSec: 'ঘুরাবা তহবিল' })),
                  ].length > 0 ? (
                    [
                      ...monthlyGeneralTx.map(t => ({ ...t, sourceSec: 'সাধারণ হিসাব' })),
                      ...monthlyFees.map(f => ({ id: f.feeId, date: f.paymentDate || f.createdAt, type: 'Income', category: 'শিক্ষার্থী ফি', description: `${f.studentName} (${f.feeType})`, amount: f.paidAmount, paymentMethod: 'Cash', sourceSec: 'ফি আদায়' })),
                      ...monthlyAib.map(t => ({ ...t, sourceSec: 'গোরাবাত তহবিল' })),
                      ...monthlyFund.map(t => ({ ...t, sourceSec: 'ঘুরাবা তহবিল' })),
                    ].sort((a,b) => (b.date || '').localeCompare(a.date || '')).map((item: any) => {
                      const isInc = item.type?.toLowerCase() === 'income' || item.type === 'collection' || item.type === 'return';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-mono text-slate-600">{item.date}</td>
                          <td className="px-5 py-3 font-semibold text-blue-700">{item.sourceSec}</td>
                          <td className="px-5 py-3 text-slate-800">{item.description || item.category || '-'}</td>
                          <td className={`px-5 py-3 text-right font-mono font-bold ${isInc ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {isInc ? '+' : '−'}৳{(Number(item.amount) || Number(item.paidAmount) || 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-slate-600">{item.paymentMethod || 'Cash'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        {language === 'bn' ? 'এই মাসে কোনো লেনদেন রেকর্ড নেই।' : 'No financial records in this month.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DAILY VIEW */}
      {/* ========================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              <span>{language === 'bn' ? 'তারিখ নির্বাচন করুন:' : 'Select Date:'}</span>
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-600"
            />
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {language === 'bn' ? 'আজকের তারিখ' : 'Today'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title={language === 'bn' ? `${selectedDate} তারিখের মোট আয়` : `Income on ${selectedDate}`}
              value={`৳${dailyIncome.toLocaleString()}`}
              subtitle={language === 'bn' ? 'দিনের মোট প্রাপ্তি' : 'Daily income'}
              icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
              accentColor="emerald"
            />
            <StatCard
              title={language === 'bn' ? `${selectedDate} তারিখের মোট ব্যয়` : `Expense on ${selectedDate}`}
              value={`৳${dailyExpense.toLocaleString()}`}
              subtitle={language === 'bn' ? 'দিনের মোট পরিশোধ' : 'Daily expense'}
              icon={<ArrowDownRight className="h-5 w-5 text-amber-700" />}
              accentColor="amber"
            />
            <StatCard
              title={language === 'bn' ? 'দিনের নিট জের' : 'Net Daily Balance'}
              value={`৳${dailyNetBalance.toLocaleString()}`}
              subtitle={language === 'bn' ? 'নিট উদ্বৃত্ত' : 'Net balance'}
              icon={<TrendingUp className="h-5 w-5 text-sky-700" />}
              accentColor="blue"
            />
          </div>

          {/* Daily Students Admitted */}
          {dailyStudents.length > 0 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                {language === 'bn' ? `${selectedDate} তারিখে ভর্তিকৃত শিক্ষার্থী` : `Admissions on ${selectedDate}`}
              </h3>
              <div className="space-y-1">
                {dailyStudents.map(s => (
                  <div key={s.id} className="bg-white p-2.5 rounded-lg border border-blue-100 text-xs flex justify-between items-center">
                    <span className="font-bold text-slate-900">{s.name} ({s.id})</span>
                    <span className="text-slate-600">শ্রেণী: {s.className}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Transactions */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'bn' ? `${selectedDate} তারিখের সমস্ত লেনদেন ও ফি আদায়` : `Transactions on ${selectedDate}`}
              </h3>
              <span className="text-xs font-semibold text-slate-600">
                {language === 'bn' ? `${dailyGeneralTx.length + dailyFees.length + dailyAib.length + dailyFund.length}টি এন্ট্রি` : `entries`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">{language === 'bn' ? 'বিভাগ' : 'Section'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'বিবরণ / খাত' : 'Description'}</th>
                    <th className="px-5 py-3 text-right">{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                    <th className="px-5 py-3">{language === 'bn' ? 'মাধ্যম' : 'Method'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ...dailyGeneralTx.map(t => ({ ...t, sourceSec: 'সাধারণ হিসাব' })),
                    ...dailyFees.map(f => ({ id: f.feeId, type: 'Income', category: 'শিক্ষার্থী ফি', description: `${f.studentName} (${f.feeType})`, amount: f.paidAmount, paymentMethod: 'Cash', sourceSec: 'ফি আদায়' })),
                    ...dailyAib.map(t => ({ ...t, sourceSec: 'গোরাবাত তহবিল' })),
                    ...dailyFund.map(t => ({ ...t, sourceSec: 'ঘুরাবা তহবিল' })),
                  ].length > 0 ? (
                    [
                      ...dailyGeneralTx.map(t => ({ ...t, sourceSec: 'সাধারণ হিসাব' })),
                      ...dailyFees.map(f => ({ id: f.feeId, type: 'Income', category: 'শিক্ষার্থী ফি', description: `${f.studentName} (${f.feeType})`, amount: f.paidAmount, paymentMethod: 'Cash', sourceSec: 'ফি আদায়' })),
                      ...dailyAib.map(t => ({ ...t, sourceSec: 'গোরাবাত তহবিল' })),
                      ...dailyFund.map(t => ({ ...t, sourceSec: 'ঘুরাবা তহবিল' })),
                    ].map((item: any) => {
                      const isInc = item.type?.toLowerCase() === 'income' || item.type === 'collection' || item.type === 'return';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-semibold text-blue-700">{item.sourceSec}</td>
                          <td className="px-5 py-3 text-slate-800">{item.description || item.category || '-'}</td>
                          <td className={`px-5 py-3 text-right font-mono font-bold ${isInc ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {isInc ? '+' : '−'}৳{(Number(item.amount) || Number(item.paidAmount) || 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-slate-600">{item.paymentMethod || 'Cash'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        {language === 'bn' ? `${selectedDate} তারিখে কোনো লেনদেন বা ভর্তি নেই।` : `No records on ${selectedDate}.`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Preset Results */}
      {quickPreset && quickPreset !== 'this-year' && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-blue-100 pb-2">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-600" />
              <span>{language === 'bn' ? 'শর্টকাট ফিল্টার ফলাফল (শিক্ষার্থী ও অর্থ)' : 'Shortcut Filtered Results'}</span>
            </h3>
            <span className="text-xs font-bold font-mono text-blue-800">
              {language === 'bn' ? `শিক্ষার্থী: ${quickStudents.length} জন` : `Students: ${quickStudents.length}`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">{language === 'bn' ? 'মোট আয় (সকল খাত)' : 'Total Revenue'}</span>
              <p className="text-lg font-bold text-emerald-700 font-mono">
                +৳{quickTransactions.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">{language === 'bn' ? 'মোট ব্যয় (সকল খাত)' : 'Total Outlays'}</span>
              <p className="text-lg font-bold text-amber-700 font-mono">
                -৳{quickTransactions.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">{language === 'bn' ? 'নিট উদ্বৃত্ত' : 'Net Balance'}</span>
              <p className="text-lg font-black text-slate-900 font-mono">
                ৳{(
                  quickTransactions.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0) -
                  quickTransactions.filter(t => t.status === 'Completed' && t.type?.toLowerCase() === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0)
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
