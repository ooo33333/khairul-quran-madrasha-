import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  BarChart2,
  Calendar,
  Filter,
  X,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building2,
  CreditCard,
  Landmark,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AccountsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountsReportModal: React.FC<AccountsReportModalProps> = ({ isOpen, onClose }) => {
  const {
    madrasaInfo,
    transactions,
    aibTransactions,
    revolvingFund,
    fees,
    boardingStudents,
    language,
    t,
  } = useApp();

  // Filter States
  const [accountType, setAccountType] = useState<
    'all' | 'aib' | 'revolving' | 'general' | 'fees' | 'boarding'
  >('all');
  const [periodType, setPeriodType] = useState<'overall' | 'monthly' | 'daterange'>('overall');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showChart, setShowChart] = useState(true);

  const reportRef = useRef<HTMLDivElement>(null);

  // Filter logic based on dates
  const matchesDate = (dateStr: string) => {
    if (!dateStr) return true;
    if (periodType === 'monthly') {
      return dateStr.startsWith(selectedMonth);
    }
    if (periodType === 'daterange') {
      if (startDate && dateStr < startDate) return false;
      if (endDate && dateStr > endDate) return false;
      return true;
    }
    return true; // overall
  };

  // 1. General Accounts Data
  const filteredGeneral = useMemo(() => {
    return transactions.filter((tx) => matchesDate(tx.date));
  }, [transactions, periodType, selectedMonth, startDate, endDate]);

  const generalIncome = useMemo(
    () =>
      filteredGeneral
        .filter((tx) => tx.status === 'Completed' && tx.type?.toLowerCase() === 'income')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [filteredGeneral]
  );

  const generalExpense = useMemo(
    () =>
      filteredGeneral
        .filter((tx) => tx.status === 'Completed' && tx.type?.toLowerCase() === 'expense')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [filteredGeneral]
  );

  // 2. Aib Account Data
  const filteredAib = useMemo(() => {
    return aibTransactions.filter((tx) => matchesDate(tx.date));
  }, [aibTransactions, periodType, selectedMonth, startDate, endDate]);

  const aibCollection = useMemo(
    () =>
      filteredAib
        .filter((tx) => tx.type === 'collection')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [filteredAib]
  );

  const aibExpense = useMemo(
    () =>
      filteredAib
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [filteredAib]
  );

  // 3. Revolving Fund Data
  const filteredRevolving = useMemo(() => {
    return revolvingFund.filter((tx) => matchesDate(tx.date));
  }, [revolvingFund, periodType, selectedMonth, startDate, endDate]);

  const revolvingCollection = useMemo(
    () =>
      filteredRevolving
        .filter((tx) => tx.type === 'collection')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [filteredRevolving]
  );

  const revolvingDistribution = useMemo(
    () =>
      filteredRevolving
        .filter((tx) => tx.type === 'distribution')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [filteredRevolving]
  );

  const revolvingReturn = useMemo(
    () =>
      filteredRevolving
        .filter((tx) => tx.type === 'return')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [filteredRevolving]
  );

  // 4. Student Fees Data
  const filteredFees = useMemo(() => {
    return fees.filter((f) => matchesDate(f.paymentDate || f.createdAt || ''));
  }, [fees, periodType, selectedMonth, startDate, endDate]);

  const totalFeesCollected = useMemo(
    () => filteredFees.reduce((sum, f) => sum + (Number(f.paidAmount) || 0), 0),
    [filteredFees]
  );

  const totalFeesDue = useMemo(
    () => filteredFees.reduce((sum, f) => sum + (Number(f.dueAmount) || 0), 0),
    [filteredFees]
  );

  // 5. Boarding Data
  const filteredBoardingStudents = useMemo(() => {
    return boardingStudents.filter((bs) => {
      const dateToCheck = bs.joiningDate || bs.createdAt || '';
      return matchesDate(dateToCheck);
    });
  }, [boardingStudents, periodType, selectedMonth, startDate, endDate]);

  // Grand Totals across all sections
  const grandTotalIncome = generalIncome + aibCollection + revolvingCollection + totalFeesCollected + revolvingReturn;
  const grandTotalExpense = generalExpense + aibExpense + revolvingDistribution;
  const netGrandBalance = grandTotalIncome - grandTotalExpense;

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Download Chart as PNG handler
  const handleDownloadChartPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('খায়রুল কুরআন মাদ্রাসা - আর্থিক হিসাব সারসংক্ষেপ চার্ট', 40, 40);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`সময়কাল: ${periodType === 'monthly' ? selectedMonth : 'সামগ্রিক (Overall)'}`, 40, 65);

    // Bars
    const categories = [
      { label: 'সাধারণ আয়', value: generalIncome, color: '#059669' },
      { label: 'সাধারণ ব্যয়', value: generalExpense, color: '#d97706' },
      { label: 'আইব সংগ্রহ', value: aibCollection, color: '#2563eb' },
      { label: 'রিভলভিং ফান্ড', value: revolvingCollection, color: '#7c3aed' },
      { label: 'ছাত্রদের ফি', value: totalFeesCollected, color: '#0284c7' },
    ];

    const maxVal = Math.max(...categories.map((c) => c.value), 1000);
    const startX = 60;
    const startY = 320;
    const barWidth = 90;
    const maxHeight = 180;

    categories.forEach((cat, idx) => {
      const x = startX + idx * 130;
      const barH = (cat.value / maxVal) * maxHeight;
      const y = startY - barH;

      // Draw bar
      ctx.fillStyle = cat.color;
      ctx.fillRect(x, y, barWidth, barH);

      // Value text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`৳${cat.value.toLocaleString()}`, x, y - 8);

      // Label
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(cat.label, x, startY + 20);
    });

    // Convert to image download
    const link = document.createElement('a');
    link.download = `Khairul_Quran_Madrasa_Accounts_Chart_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'bn' ? '📊 হিসাব রিপোর্ট ও ডাউনলোড' : '📊 Accounts Report & Download'}
              </h2>
              <p className="text-xs text-slate-300">
                {language === 'bn'
                  ? 'খায়রুল কুরআন মাদ্রাসা অফিসিয়াল আর্থিক হিসাব বিবরণী'
                  : 'Khairul Quran Madrasa Official Financial Reports'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar & Filters (Hidden during print) */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 print:hidden space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'হিসাবের ধরণ (Account Type)' : 'Account Type'}
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="all">
                  {language === 'bn' ? 'সকল হিসাবের সারসংক্ষেপ (All Accounts)' : 'Summary of All Accounts'}
                </option>
                <option value="general">
                  {language === 'bn' ? 'মাদ্রাসার সাধারণ হিসাব (General Accounts)' : 'General Madrasa Accounts'}
                </option>
                <option value="aib">
                  {language === 'bn' ? 'আইবের হিসাব (Aib Account)' : 'Aib Account'}
                </option>
                <option value="revolving">
                  {language === 'bn' ? 'রিভলভিং ফান্ড (Revolving Fund)' : 'Revolving Fund'}
                </option>
                <option value="fees">
                  {language === 'bn' ? 'ছাত্রদের ফি (Student Fees)' : 'Student Fees'}
                </option>
                <option value="boarding">
                  {language === 'bn' ? 'বোর্ডিং হিসাব (Boarding Accounts)' : 'Boarding Accounts'}
                </option>
              </select>
            </div>

            {/* Period Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সময়কাল (Period)' : 'Period Filter'}
              </label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="overall">
                  {language === 'bn' ? 'সামগ্রিক / সব সময় (Overall)' : 'Overall / All-time'}
                </option>
                <option value="monthly">
                  {language === 'bn' ? 'নির্দিষ্ট মাস (Monthly Report)' : 'Specific Month'}
                </option>
                <option value="daterange">
                  {language === 'bn' ? 'তারিখ থেকে তারিখ (Date Range)' : 'Date Range'}
                </option>
              </select>
            </div>

            {/* Conditional Month or Date Range Pickers */}
            {periodType === 'monthly' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'মাস নির্বাচন করুন' : 'Select Month'}
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            )}

            {periodType === 'daterange' && (
              <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'bn' ? 'শুরু তারিখ' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'bn' ? 'শেষ তারিখ' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChart(!showChart)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                  showChart ? 'bg-sky-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BarChart2 className="h-4 w-4" />
                <span>{language === 'bn' ? '📊 চার্ট দেখুন' : 'View Chart'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {showChart && (
                <button
                  onClick={handleDownloadChartPNG}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>{language === 'bn' ? '📥 চার্ট ডাউনলোড (PNG)' : 'Download Chart PNG'}</span>
                </button>
              )}
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>{language === 'bn' ? '🖨️ প্রিন্ট করুন / PDF' : 'Print / Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Report Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white print:p-0" ref={reportRef}>
          {/* Official Report Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-2">
            <div className="flex items-center justify-center gap-3">
              {madrasaInfo?.logo && (
                <img
                  src={madrasaInfo.logo}
                  alt="Logo"
                  className="h-12 w-12 rounded-lg object-contain bg-white p-1 border border-slate-200"
                />
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                  খায়রুল কুরআন মাদ্রাসা
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {madrasaInfo?.address || 'মাদ্রাসা অফিস ম্যানেজমেন্ট সিস্টেম, বাংলাদেশ'}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wide bg-slate-100 py-1.5 rounded-md inline-block px-4">
                {accountType === 'all' && 'সকল আর্থিক হিসাবের সামগ্রিক সারসংক্ষেপ রিপোর্ট'}
                {accountType === 'general' && 'মাদ্রাসার সাধারণ হিসাব বিবরণী'}
                {accountType === 'aib' && 'আইব অ্যাকাউন্ট হিসাব রিপোর্ট'}
                {accountType === 'revolving' && 'রিভলভিং ফান্ড হিসাব রিপোর্ট'}
                {accountType === 'fees' && 'ছাত্রদের ফি আদায় ও বকেয়া রিপোর্ট'}
                {accountType === 'boarding' && 'বোর্ডিং হিসাব ও খরচ বিবরণী'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-1">
              <span>
                <strong>সময়কাল:</strong>{' '}
                {periodType === 'overall' && 'সামগ্রিক (Overall / All-time)'}
                {periodType === 'monthly' && `মাস: ${selectedMonth}`}
                {periodType === 'daterange' && `তারিখ: ${startDate || 'শুরু'} হইতে ${endDate || 'বর্তমান'}`}
              </span>
              <span>•</span>
              <span>
                <strong>প্রস্তুতের তারিখ:</strong> {new Date().toLocaleDateString('bn-BD')}
              </span>
            </div>
          </div>

          {/* Graphical Bar Chart View (Toggleable) */}
          {showChart && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 print:block">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-sky-600" />
                <span>{language === 'bn' ? 'আর্থিক তুলনা ও গ্রাফিক্যাল সারসংক্ষেপ' : 'Financial Comparison & Summary Chart'}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                  <span className="text-[11px] text-slate-500 font-semibold block">সাধারণ আয়</span>
                  <p className="text-base font-bold text-emerald-700 font-mono mt-1">৳{generalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                  <span className="text-[11px] text-slate-500 font-semibold block">সাধারণ ব্যয়</span>
                  <p className="text-base font-bold text-amber-700 font-mono mt-1">৳{generalExpense.toLocaleString()}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                  <span className="text-[11px] text-slate-500 font-semibold block">আইব সংগ্রহ</span>
                  <p className="text-base font-bold text-blue-700 font-mono mt-1">৳{aibCollection.toLocaleString()}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                  <span className="text-[11px] text-slate-500 font-semibold block">রিভলভিং ফান্ড</span>
                  <p className="text-base font-bold text-purple-700 font-mono mt-1">৳{revolvingCollection.toLocaleString()}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-500 font-semibold block">ছাত্রদের ফি</span>
                  <p className="text-base font-bold text-sky-700 font-mono mt-1">৳{totalFeesCollected.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                {language === 'bn' ? 'মোট আয় / সংগ্রহ' : 'Total Income / Collection'}
              </span>
              <p className="text-2xl font-black text-emerald-900 font-mono mt-1">
                ৳{grandTotalIncome.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">সকল ফান্ড ও ফি মিলিয়ে মোট আদায়</p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                {language === 'bn' ? 'মোট ব্যয় / বিতরণ' : 'Total Expense / Distribution'}
              </span>
              <p className="text-2xl font-black text-amber-900 font-mono mt-1">
                ৳{grandTotalExpense.toLocaleString()}
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">সকল খরচ ও ফান্ড বিতরণ মিলিয়ে</p>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                {language === 'bn' ? 'সমাপনী নিট ব্যালেন্স' : 'Net Closing Balance'}
              </span>
              <p className="text-2xl font-black text-sky-900 font-mono mt-1">
                ৳{netGrandBalance.toLocaleString()}
              </p>
              <p className="text-[11px] text-sky-700 mt-0.5">মোট আয় বিয়োগ মোট ব্যয়</p>
            </div>
          </div>

          {/* Section 1: General Madrasa Accounts */}
          {(accountType === 'all' || accountType === 'general') && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-emerald-600" />
                  <span>মাদ্রাসার সাধারণ হিসাব (General Accounts)</span>
                </h3>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  আয়: ৳{generalIncome.toLocaleString()} | ব্যয়: ৳{generalExpense.toLocaleString()}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-3 py-2">তারিখ</th>
                      <th className="px-3 py-2">ধরণ</th>
                      <th className="px-3 py-2">ক্যাটাগরি</th>
                      <th className="px-3 py-2">বিবরণ</th>
                      <th className="px-3 py-2">পেমেন্ট</th>
                      <th className="px-3 py-2 text-right">টাকা (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGeneral.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-4 text-center text-slate-400">
                          কোনো সাধারণ হিসাবের এন্ট্রি পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredGeneral.map((tx) => (
                        <tr key={tx.transactionId || tx.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono">{tx.date}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full font-bold ${
                                tx.type?.toLowerCase() === 'income'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-medium">{tx.category}</td>
                          <td className="px-3 py-2 text-slate-600">{tx.description}</td>
                          <td className="px-3 py-2 text-slate-500">{tx.paymentMethod}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                            ৳{Number(tx.amount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 2: Aib Account */}
          {(accountType === 'all' || accountType === 'aib') && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-blue-600" />
                  <span>আইব অ্যাকাউন্ট হিসাব (Aib Account)</span>
                </h3>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  সংগ্রহ: ৳{aibCollection.toLocaleString()} | খরচ: ৳{aibExpense.toLocaleString()}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-3 py-2">তারিখ</th>
                      <th className="px-3 py-2">ধরণ</th>
                      <th className="px-3 py-2">ক্যাটাগরি</th>
                      <th className="px-3 py-2">বিবরণ</th>
                      <th className="px-3 py-2 text-right">টাকা (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAib.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                          কোনো আইব হিসাবের এন্ট্রি পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredAib.map((tx) => (
                        <tr key={tx.transactionId || tx.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono">{tx.date}</td>
                          <td className="px-3 py-2 font-semibold capitalize">{tx.type}</td>
                          <td className="px-3 py-2 font-medium">{tx.category}</td>
                          <td className="px-3 py-2 text-slate-600">{tx.description}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                            ৳{Number(tx.amount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 3: Revolving Fund */}
          {(accountType === 'all' || accountType === 'revolving') && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-purple-600" />
                  <span>রিভলভিং ফান্ড হিসাব (Revolving Fund)</span>
                </h3>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  সংগ্রহ: ৳{revolvingCollection.toLocaleString()} | বিতরণ: ৳{revolvingDistribution.toLocaleString()}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-3 py-2">তারিখ</th>
                      <th className="px-3 py-2">ধরণ</th>
                      <th className="px-3 py-2">নাম / ব্যক্তি</th>
                      <th className="px-3 py-2">বিবরণ</th>
                      <th className="px-3 py-2 text-right">টাকা (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRevolving.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                          কোনো রিভলভিং ফান্ড এন্ট্রি পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredRevolving.map((tx) => (
                        <tr key={tx.transactionId || tx.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono">{tx.date}</td>
                          <td className="px-3 py-2 font-semibold capitalize">{tx.type}</td>
                          <td className="px-3 py-2 font-medium">{tx.personName}</td>
                          <td className="px-3 py-2 text-slate-600">{tx.description}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                            ৳{Number(tx.amount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Student Fees */}
          {(accountType === 'all' || accountType === 'fees') && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-sky-600" />
                  <span>ছাত্রদের ফি আদায় (Student Fees Collection)</span>
                </h3>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  মোট আদায়: ৳{totalFeesCollected.toLocaleString()} | বকেয়া: ৳{totalFeesDue.toLocaleString()}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-3 py-2">তারিখ</th>
                      <th className="px-3 py-2">ছাত্রের নাম</th>
                      <th className="px-3 py-2">শ্রেণী</th>
                      <th className="px-3 py-2">ফি এর ধরণ</th>
                      <th className="px-3 py-2 text-right">পরিশোধিত (৳)</th>
                      <th className="px-3 py-2 text-right">বকেয়া (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-4 text-center text-slate-400">
                          কোনো ফি আদায়ের রেকর্ড পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredFees.slice(0, 50).map((f) => (
                        <tr key={f.feeId || f.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono">{f.paymentDate || f.createdAt}</td>
                          <td className="px-3 py-2 font-medium">{f.studentName}</td>
                          <td className="px-3 py-2">{f.className}</td>
                          <td className="px-3 py-2">{f.feeType}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-emerald-700">
                            ৳{Number(f.paidAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-red-600">
                            ৳{Number(f.dueAmount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: Boarding Accounts */}
          {(accountType === 'all' || accountType === 'boarding') && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-600" />
                  <span>বোর্ডিং আবাসিক ছাত্র সংখ্যা ও বিবরণ (Boarding Students)</span>
                </h3>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  আবাসিক ছাত্র: {filteredBoardingStudents.length} জন
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-3 py-2">ছাত্র আইডি</th>
                      <th className="px-3 py-2">নাম</th>
                      <th className="px-3 py-2">শ্রেণী</th>
                      <th className="px-3 py-2">ভর্তির তারিখ</th>
                      <th className="px-3 py-2">অবস্থা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBoardingStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                          কোনো বোর্ডিং ছাত্র পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredBoardingStudents.slice(0, 30).map((bs) => (
                        <tr key={bs.studentId} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono font-bold">{bs.studentId}</td>
                          <td className="px-3 py-2 font-medium">{bs.studentName}</td>
                          <td className="px-3 py-2">{bs.className}</td>
                          <td className="px-3 py-2 font-mono">{bs.joiningDate || 'N/A'}</td>
                          <td className="px-3 py-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {bs.boardingStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Official Signature Footer for Print */}
          <div className="pt-12 grid grid-cols-3 gap-8 text-center text-xs text-slate-700 pt-16">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold">হিসাবরক্ষকের স্বাক্ষর</p>
              <p className="text-[10px] text-slate-500">Accountant Signature</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold">প্রধান শিক্ষক / মুহতামিম</p>
              <p className="text-[10px] text-slate-500">Principal / Muhtamim</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold">সভাপতি / পরিচালনা পর্ষদ</p>
              <p className="text-[10px] text-slate-500">President / Governing Body</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            খায়রুল কুরআন মাদ্রাসা অফিস ম্যানেজমেন্ট সিস্টেম • প্রিন্ট করার সময় স্বয়ংক্রিয়ভাবে হেডার/ফুটার পরিচ্ছন্ন থাকবে।
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
