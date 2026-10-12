import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  RotateCw,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  CreditCard,
  User,
  Filter,
  Eye,
  TrendingUp,
  X,
  BarChart2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccountTransaction } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { AccountsReportModal } from '../../components/common/AccountsReportModal';

const STATUS_OPTIONS = ['Completed', 'Pending', 'Cancelled'];
const PAYMENT_METHODS = ['Cash', 'Bank', 'Mobile Banking', 'Other'];

const DEFAULT_INCOME_CATEGORIES = [
  'Donation',
  'Admission Income',
  'Tuition Income',
  'Service Income',
  'Other Income',
];

const DEFAULT_EXPENSE_CATEGORIES = [
  'Salary',
  'Office Expense',
  'Electricity',
  'Water',
  'Internet',
  'Maintenance',
  'Stationery',
  'Transport',
  'Other Expense',
];

export const AccountsPage: React.FC = () => {
  const {
    activeSubItem,
    transactions,
    accountsLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    accountCategories,
    searchQuery,
    language,
    t,
  } = useApp();

  const translateMethod = (method: string, lang: string) => {
    if (lang !== 'bn') return method;
    const map: Record<string, string> = {
      'Cash': 'নগদ',
      'Bank': 'ব্যাংক',
      'Mobile Banking': 'মোবাইল ব্যাংকিং',
      'Other': 'অন্যান্য'
    };
    return map[method] || method;
  };

  const translateStatus = (status: string, lang: string) => {
    if (lang !== 'bn') return status;
    const map: Record<string, string> = {
      'Completed': 'সম্পন্ন',
      'Pending': 'অপেক্ষমাণ',
      'Cancelled': 'বাতিলকৃত'
    };
    return map[status] || status;
  };

  const translateType = (type: string, lang: string) => {
    if (lang !== 'bn') return type;
    const map: Record<string, string> = {
      'income': 'আয়',
      'expense': 'ব্যয়',
      'Income': 'আয়',
      'Expense': 'ব্যয়'
    };
    return map[type] || type;
  };

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All'); // For Transactions page
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'income' | 'expense'>('income');

  // Add Form State
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState<number | ''>(1000);
  const [formPaymentMethod, setFormPaymentMethod] = useState('Cash');
  const [formReference, setFormReference] = useState('');
  const [formStatus, setFormStatus] = useState<'Completed' | 'Pending' | 'Cancelled'>('Completed');
  const [formNote, setFormNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Form State
  const [editingTx, setEditingTx] = useState<AccountTransaction | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState<number | ''>('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('Cash');
  const [editReference, setEditReference] = useState('');
  const [editStatus, setEditStatus] = useState<'Completed' | 'Pending' | 'Cancelled'>('Completed');
  const [editNote, setEditNote] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // View Modal State
  const [viewingTx, setViewTx] = useState<AccountTransaction | null>(null);

  // Delete Confirmation State
  const [deletingTx, setDeletingTx] = useState<AccountTransaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const effectiveSearch = localSearch || searchQuery;

  // Resolve Categories list dynamically
  const resolvedCategories = useMemo(() => {
    const incCats =
      accountCategories && accountCategories.income && accountCategories.income.length > 0
        ? accountCategories.income
        : DEFAULT_INCOME_CATEGORIES;

    const expCats =
      accountCategories && accountCategories.expense && accountCategories.expense.length > 0
        ? accountCategories.expense
        : DEFAULT_EXPENSE_CATEGORIES;

    return {
      income: incCats,
      expense: expCats,
    };
  }, [accountCategories]);

  // Balance calculation: Completed status only
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const currentBalance = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  // Filter transactions based on page (income/expense/transactions/balance) and search/controls
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const typeLower = t.type?.toLowerCase();

      // 1. Page sub-item routing filter
      if (activeSubItem === 'income' && typeLower !== 'income') return false;
      if (activeSubItem === 'expense' && typeLower !== 'expense') return false;

      // 2. Type Filter dropdown (only on transactions/balance page)
      if (
        (activeSubItem === 'transactions' || activeSubItem === 'balance') &&
        selectedTypeFilter !== 'All' &&
        typeLower !== selectedTypeFilter.toLowerCase()
      ) {
        return false;
      }

      // 3. Category Filter
      if (selectedCategoryFilter !== 'All' && t.category !== selectedCategoryFilter) return false;

      // 4. Payment Method Filter
      if (selectedPaymentFilter !== 'All' && t.paymentMethod !== selectedPaymentFilter) return false;

      // 5. Status Filter
      if (selectedStatusFilter !== 'All' && t.status !== selectedStatusFilter) return false;

      // 6. Date Range Filter
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;

      // 7. Search query (ID, description, category, reference)
      const q = effectiveSearch.trim().toLowerCase();
      if (q) {
        const matchesId = (t.transactionId || t.id || '').toLowerCase().includes(q);
        const matchesDesc = (t.description || '').toLowerCase().includes(q);
        const matchesCategory = (t.category || '').toLowerCase().includes(q);
        const matchesRef = (t.reference || t.referenceNo || '').toLowerCase().includes(q);

        if (!matchesId && !matchesDesc && !matchesCategory && !matchesRef) {
          return false;
        }
      }

      return true;
    });
  }, [
    transactions,
    activeSubItem,
    selectedTypeFilter,
    selectedCategoryFilter,
    selectedPaymentFilter,
    selectedStatusFilter,
    startDate,
    endDate,
    effectiveSearch,
  ]);

  // Submit new transaction
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formDate) {
      setFormError('Date is required.');
      return;
    }
    if (!formCategory) {
      setFormError('Category is required.');
      return;
    }
    const amt = Number(formAmount);
    if (!formAmount || isNaN(amt) || amt <= 0) {
      setFormError('Amount must be greater than 0.');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Description/Narration is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction({
        date: formDate,
        type: addModalType,
        category: formCategory,
        description: formDescription.trim(),
        amount: amt,
        paymentMethod: formPaymentMethod,
        reference: formReference.trim(),
        status: formStatus,
        note: formNote.trim(),
      });

      setIsAddModalOpen(false);
      // Reset fields
      setFormDescription('');
      setFormReference('');
      setFormNote('');
      setFormError(null);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to record General Account entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit edit transaction
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    setEditError(null);

    if (!editDate) {
      setEditError('Date is required.');
      return;
    }
    if (!editCategory) {
      setEditError('Category is required.');
      return;
    }
    const amt = Number(editAmount);
    if (!editAmount || isNaN(amt) || amt <= 0) {
      setEditError('Amount must be greater than 0.');
      return;
    }
    if (!editDescription.trim()) {
      setEditError('Description/Narration is required.');
      return;
    }

    setIsUpdating(true);
    try {
      await updateTransaction(editingTx.id, {
        date: editDate,
        category: editCategory,
        description: editDescription.trim(),
        amount: amt,
        paymentMethod: editPaymentMethod,
        reference: editReference.trim(),
        status: editStatus,
        note: editNote.trim(),
      });

      setEditingTx(null);
    } catch (err: any) {
      console.error(err);
      setEditError(err.message || 'Failed to update transaction.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm and delete transaction
  const handleDeleteSubmit = async () => {
    if (!deletingTx) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTx.id);
      setDeletingTx(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete transaction.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddForm = (type: 'income' | 'expense') => {
    setAddModalType(type);
    setFormDate(new Date().toISOString().split('T')[0]);
    const cats = type === 'income' ? resolvedCategories.income : resolvedCategories.expense;
    setFormCategory(cats[0] || '');
    setFormDescription('');
    setFormAmount(1000);
    setFormPaymentMethod('Cash');
    setFormReference('');
    setFormStatus('Completed');
    setFormNote('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditForm = (tx: AccountTransaction) => {
    setEditingTx(tx);
    setEditDate(tx.date);
    setEditCategory(tx.category);
    setEditDescription(tx.description);
    setEditAmount(tx.amount);
    setEditPaymentMethod(tx.paymentMethod || 'Cash');
    setEditReference(tx.reference || tx.referenceNo || '');
    setEditStatus(tx.status || 'Completed');
    setEditNote(tx.note || '');
    setEditError(null);
  };

  // Category summary counts for a beautiful mini-dashboard progress bar visualization
  const categorySummary = useMemo(() => {
    const summary: Record<string, number> = {};
    transactions
      .filter((t) => t.status === 'Completed')
      .forEach((t) => {
        summary[t.category] = (summary[t.category] || 0) + (Number(t.amount) || 0);
      });
    return Object.entries(summary).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const subPageTitles: Record<string, { title: string; subtitle: string }> = {
    income: {
      title: language === 'bn' ? 'আয় ব্যবস্থাপনা' : 'Income Management',
      subtitle: language === 'bn' ? 'প্রাতিষ্ঠানিক অনুদান, টিউশন ফি এবং অন্যান্য আয় রেকর্ড করুন' : 'Record operational donations, tuition receipts, grants, and miscellaneous revenues',
    },
    expense: {
      title: language === 'bn' ? 'ব্যয় ব্যবস্থাপনা' : 'Expense Management',
      subtitle: language === 'bn' ? 'শিক্ষকদের বেতন, বিদ্যুৎ বিল, ক্যাম্পাস ভাড়া এবং অন্যান্য খরচ মনিটর করুন' : 'Monitor salary honorariums, utility bills, campus rent, and office outlays',
    },
    transactions: {
      title: language === 'bn' ? 'সকল লেনদেনসমূহ' : 'Ledger / Transactions',
      subtitle: language === 'bn' ? 'অডিট উপযোগী সার্বিক ক্যাশফ্লো ও লেনদেনের মাস্টার খতিয়ান' : 'Comprehensive general ledger journal representing audit-ready cashflow logs',
    },
    balance: {
      title: language === 'bn' ? 'জমা-খরচের বর্তমান স্থিতি' : 'General Accounts Balance',
      subtitle: language === 'bn' ? 'নেট উদ্বৃত্ত হিসাব এবং খাত অনুযায়ী নগদ অর্থ বিতরণ' : 'Surplus calculations, net solvency margins, and category-wise cash distributions',
    },
  };

  const currentMeta = subPageTitles[activeSubItem] || {
    title: language === 'bn' ? 'সাধারণ হিসাবখাত' : 'General Accounts',
    subtitle: language === 'bn' ? 'সমন্বিত মাস্টার অ্যাকাউন্ট লেজার এবং আর্থিক রিজার্ভ' : 'Consolidated master accounting ledger and financial reserves',
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle={language === 'bn' ? 'হিসাবখাত' : 'Accounts'}
        subItemTitle={currentMeta.title}
        sectionKey="accounts"
        subItemKey={activeSubItem}
      />

      {/* Top Title & Quick Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{t(currentMeta.title)}</h2>
          <p className="text-xs text-slate-500">{t(currentMeta.subtitle)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
          >
            <BarChart2 className="h-4 w-4" />
            <span>{language === 'bn' ? '📊 হিসাব রিপোর্ট ও ডাউনলোড' : 'Accounts Report & Download'}</span>
          </button>
          <button
            onClick={() => openAddForm('income')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('Record Income')}</span>
          </button>
          <button
            onClick={() => openAddForm('expense')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowDownRight className="h-4 w-4 text-amber-600" />
            <span>{t('Record Expense')}</span>
          </button>
        </div>
      </div>

      {/* Financial Position Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title={language === 'bn' ? 'মোট সাধারণ আয়' : t('Total General Income')}
          value={`৳${totalIncome.toLocaleString()}`}
          subtitle={language === 'bn' ? 'সর্বমোট আয় এন্ট্রি' : t('Cumulative income entries')}
          icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
          accentColor="emerald"
        />
        <StatCard
          title={language === 'bn' ? 'মোট সাধারণ ব্যয়' : t('Total General Expense')}
          value={`৳${totalExpense.toLocaleString()}`}
          subtitle={language === 'bn' ? 'সর্বমোট ব্যয় এন্ট্রি' : t('Cumulative expense entries')}
          icon={<ArrowDownRight className="h-5 w-5 text-amber-700" />}
          accentColor="amber"
        />
        <StatCard
          title={language === 'bn' ? 'নিট পরিচালন স্থিতি' : t('Net Operating Balance')}
          value={`৳${currentBalance.toLocaleString()}`}
          subtitle={language === 'bn' ? 'উদ্বৃত্ত পরিচালন স্থিতি' : t('Surplus operating balance')}
          icon={<TrendingUp className="h-5 w-5 text-sky-700" />}
          accentColor="blue"
        />
      </div>

      {/* Visual Balance Equation block - Prominent on Balance page */}
      {activeSubItem === 'balance' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            {language === 'bn' ? 'সাধারণ হিসাবখাত ব্যালেন্সের হিসাব সমীকরণ' : 'General Accounts Balance Formula'}
          </h3>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-center lg:text-left">
              <span className="text-xs text-slate-500 font-semibold uppercase">{language === 'bn' ? 'সম্পন্ন আয়সমূহ' : 'Completed Incomes'}</span>
              <p className="text-2xl font-bold text-emerald-700 font-mono mt-0.5">
                +৳{totalIncome.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">−</span>

            <div className="text-center lg:text-left">
              <span className="text-xs text-slate-500 font-semibold uppercase">{language === 'bn' ? 'সম্পন্ন ব্যয়সমূহ' : 'Completed Expenses'}</span>
              <p className="text-2xl font-bold text-amber-700 font-mono mt-0.5">
                -৳{totalExpense.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">=</span>

            <div className="text-center lg:text-left bg-white px-5 py-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs text-sky-800 font-bold uppercase">{language === 'bn' ? 'নিট সংরক্ষিত জের' : 'Net Solvent General Reserve'}</span>
              <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                ৳{currentBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Dynamic Tailwind Horizontal Progress Category Distribution Chart */}
          {categorySummary.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'bn' ? 'খাত অনুযায়ী বিতরণ (সম্পন্ন)' : 'Distribution by Category (Completed)'}
              </h4>
              <div className="space-y-2">
                {categorySummary.map(([cat, amount]) => {
                  const maxAmt = Math.max(...categorySummary.map(([, a]) => a), 1);
                  const pct = Math.min(100, Math.round((amount / maxAmt) * 100));
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600">{language === 'bn' ? t(cat) : cat}</span>
                        <span className="text-slate-950 font-bold font-mono">৳{amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Filters and Ledger list */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Advanced Filters controls */}
        <div className="flex flex-col p-4 border-b border-slate-100 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={language === 'bn' ? 'বিবরণ, রেফারেন্স বা খাত দিয়ে খুঁজুন...' : 'Search description, reference, category...'}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-600 transition-all"
              />
            </div>

            <span className="text-xs font-medium text-slate-500">
              {language === 'bn' ? `${filteredTransactions.length}টি রেকর্ড মিলেছে` : `${filteredTransactions.length} items matched`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Type Filter (only on Transactions and Balance page) */}
            {(activeSubItem === 'transactions' || activeSubItem === 'balance') && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">{language === 'bn' ? 'ধরণ:' : 'Type:'}</span>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => {
                    setSelectedTypeFilter(e.target.value);
                    setSelectedCategoryFilter('All'); // Reset category because categories differ
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="All">{language === 'bn' ? 'সকল ধরণ' : 'All Types'}</option>
                  <option value="income">{language === 'bn' ? 'আয়' : 'Income'}</option>
                  <option value="expense">{language === 'bn' ? 'ব্যয়' : 'Expense'}</option>
                </select>
              </div>
            )}

            {/* Dynamic Category Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-500">{language === 'bn' ? 'খাত:' : 'Category:'}</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="All">{language === 'bn' ? 'সকল খাত' : 'All Categories'}</option>
                {/* Populate categories based on active view or type selection */}
                {activeSubItem === 'income' || selectedTypeFilter.toLowerCase() === 'income'
                  ? resolvedCategories.income.map((c) => (
                      <option key={c} value={c}>{language === 'bn' ? t(c) : c}</option>
                    ))
                  : activeSubItem === 'expense' || selectedTypeFilter.toLowerCase() === 'expense'
                  ? resolvedCategories.expense.map((c) => (
                      <option key={c} value={c}>{language === 'bn' ? t(c) : c}</option>
                    ))
                  : [...resolvedCategories.income, ...resolvedCategories.expense].map((c) => (
                      <option key={c} value={c}>{language === 'bn' ? t(c) : c}</option>
                    ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-500">{language === 'bn' ? 'পরিশোধ মাধ্যম:' : 'Payment:'}</span>
              <select
                value={selectedPaymentFilter}
                onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="All">{language === 'bn' ? 'সকল মাধ্যম' : 'All Methods'}</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{translateMethod(m, language)}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-500">{language === 'bn' ? 'অবস্থা:' : 'Status:'}</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="All">{language === 'bn' ? 'সকল অবস্থা' : 'All Statuses'}</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{translateStatus(s, language)}</option>
                ))}
              </select>
            </div>

            {/* Date Range filters */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-slate-500">{language === 'bn' ? 'তারিখ থেকে:' : 'From:'}</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-hidden"
              />
              <span className="font-medium text-slate-500">{language === 'bn' ? 'তারিখ পর্যন্ত:' : 'To:'}</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-hidden"
              />
            </div>

            {(localSearch ||
              selectedCategoryFilter !== 'All' ||
              selectedPaymentFilter !== 'All' ||
              selectedStatusFilter !== 'All' ||
              selectedTypeFilter !== 'All' ||
              startDate ||
              endDate) && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSelectedCategoryFilter('All');
                  setSelectedPaymentFilter('All');
                  setSelectedStatusFilter('All');
                  setSelectedTypeFilter('All');
                  setStartDate('');
                  setEndDate('');
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filters'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Responsive Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                <th className="px-5 py-3.5">{language === 'bn' ? 'লেনদেন আইডি' : 'Transaction ID'}</th>
                <th className="px-5 py-3.5">{language === 'bn' ? 'ধরণ' : 'Type'}</th>
                <th className="px-5 py-3.5">{language === 'bn' ? 'খাত' : 'Category'}</th>
                <th className="px-5 py-3.5">{language === 'bn' ? 'বিবরণ' : 'Description'}</th>
                <th className="px-5 py-3.5 text-right">{language === 'bn' ? 'টাকার পরিমাণ' : 'Amount'}</th>
                <th className="px-5 py-3.5">{language === 'bn' ? 'পরিশোধের মাধ্যম' : 'Payment Method'}</th>
                <th className="px-5 py-3.5">{language === 'bn' ? 'রেফ / স্লিপ' : 'Ref / Slip'}</th>
                <th className="px-5 py-3.5 text-center">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="px-5 py-3.5 text-right">{language === 'bn' ? 'কার্যক্রম' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accountsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={10} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const isInc = tx.type?.toLowerCase() === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono font-medium">
                        {tx.date}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-slate-600">
                        {tx.transactionId || tx.id}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isInc ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {translateType(tx.type, language)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-900 font-semibold">
                        {language === 'bn' ? t(tx.category) : tx.category}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-600 max-w-xs truncate" title={tx.description}>
                        {tx.description}
                      </td>
                      <td
                        className={`px-5 py-3.5 whitespace-nowrap text-right font-mono tabular-nums font-bold ${
                          isInc ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {isInc ? '+' : '−'}৳{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-semibold">
                        {translateMethod(tx.paymentMethod || 'Cash', language)}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-500 font-medium">
                        {tx.reference || tx.referenceNo || '-'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <span
                          className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${
                            tx.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : tx.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {translateStatus(tx.status, language)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewTx(tx)}
                            title={language === 'bn' ? 'ভাউচার দেখুন' : 'View Voucher'}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openEditForm(tx)}
                            title={language === 'bn' ? 'রেকর্ড সংশোধন করুন' : 'Edit Record'}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingTx(tx)}
                            title={language === 'bn' ? 'রেকর্ড মুছে ফেলুন' : 'Delete Record'}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-400">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">
                      {language === 'bn' ? 'এই ভিউতে কোনো হিসাবখাতের রেকর্ড পাওয়া যায়নি' : 'No General Accounts records found in this view'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'bn' ? 'রেকর্ডগুলো গুগল ক্লাউড ফায়ারস্টোরের সাথে সম্পূর্ণরূপে সিঙ্ক করা হয়েছে।' : 'Records are fully synchronized with Google Cloud Firestore.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Income/Expense Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={`Record General ${addModalType === 'income' ? 'Income' : 'Expense'}`}
          subtitle="Post financial voucher details directly to General Accounts ledger"
          maxWidth="md"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {formError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-[11px] text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Accounting Category *</label>
                <select
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="">-- Select Category --</option>
                  {(addModalType === 'income' ? resolvedCategories.income : resolvedCategories.expense).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (৳) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference / Slip #</label>
                <input
                  type="text"
                  placeholder="e.g. SLIP-2193"
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Particulars / Description *</label>
              <textarea
                rows={2}
                required
                placeholder="Enter complete description of cash flow..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Internal Remarks / Note</label>
              <input
                type="text"
                placeholder="Optional bookkeeping remarks..."
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Recording...' : 'Record Voucher'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Record Modal */}
      {editingTx && (
        <Modal
          isOpen={!!editingTx}
          onClose={() => setEditingTx(null)}
          title={`Edit ${editingTx.type} Record`}
          subtitle="Modify financial specs inside Cloud Firestore"
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            {editError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-[11px] text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{editError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Accounting Category *</label>
                <select
                  required
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {(editingTx.type?.toLowerCase() === 'income'
                    ? resolvedCategories.income
                    : resolvedCategories.expense
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
                <select
                  value={editPaymentMethod}
                  onChange={(e) => setEditPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (৳) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference / Slip #</label>
                <input
                  type="text"
                  value={editReference}
                  onChange={(e) => setEditReference(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Particulars / Description *</label>
              <textarea
                rows={2}
                required
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Remarks / Note</label>
              <input
                type="text"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTx(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Voucher Details Modal */}
      {viewingTx && (
        <Modal
          isOpen={!!viewingTx}
          onClose={() => setViewTx(null)}
          title="General Accounts Voucher"
          subtitle={`Ledger Reference: ${viewingTx.transactionId || viewingTx.id}`}
          maxWidth="sm"
          footer={
            <button
              onClick={() => setViewTx(null)}
              className="rounded-lg bg-slate-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
            >
              Close Voucher
            </button>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Transaction Date:</span>
              <span className="font-semibold text-slate-800 font-mono">{viewingTx.date}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Classification:</span>
              <span
                className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                  viewingTx.type?.toLowerCase() === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {viewingTx.type}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Accounting Category:</span>
              <span className="font-semibold text-slate-800">{viewingTx.category}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Amount Paid / Received:</span>
              <span className="font-bold text-slate-950 font-mono text-sm">
                ৳{viewingTx.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-semibold text-slate-800">{viewingTx.paymentMethod || 'Cash'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Ref / Slip #:</span>
              <span className="font-semibold text-slate-800 font-mono">{viewingTx.reference || viewingTx.referenceNo || '-'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Approval Status:</span>
              <span
                className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                  viewingTx.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : viewingTx.status === 'Pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {viewingTx.status}
              </span>
            </div>
            {viewingTx.note && (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Auditor Remarks:</span>
                <span className="text-slate-700 font-medium italic">{viewingTx.note}</span>
              </div>
            )}
            <div className="pt-2">
              <span className="text-slate-500 block mb-1 font-semibold">Narrative Particulars:</span>
              <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 font-medium leading-relaxed">
                {viewingTx.description}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Record Confirmation Modal */}
      {deletingTx && (
        <Modal
          isOpen={!!deletingTx}
          onClose={() => setDeletingTx(null)}
          title="Delete Master Ledger Record"
          subtitle="Are you sure you want to permanently delete this accounting entry?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-rose-950">Warning: Audit Removal</span>
                Deleting this master transaction will permanently excise it from Cloud Firestore. All liquid account ledger calculations will re-reconcile in real time.
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Classification</span>
                  <span className="font-bold text-slate-800">{deletingTx.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Amount</span>
                  <span className="font-bold text-slate-800">৳{deletingTx.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Accounting Category</span>
                  <span className="font-semibold text-slate-700">{deletingTx.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Transaction Date</span>
                  <span className="font-mono text-slate-600">{deletingTx.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingTx(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteSubmit}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Record'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Accounts Report & Download Modal */}
      <AccountsReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
