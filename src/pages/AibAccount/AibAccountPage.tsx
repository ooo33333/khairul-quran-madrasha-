import React, { useState, useMemo } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Edit2,
  Trash2,
  Receipt,
  FileText,
  Calendar,
  CreditCard,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AibTransaction } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';

const COLLECTION_CATEGORIES = [
  'Aib Collection',
  'Donation',
  'Contribution',
  'Other',
];

const EXPENSE_CATEGORIES = [
  'Food',
  'Education',
  'Medical',
  'Support',
  'Administrative',
  'Other',
];

const PAYMENT_METHODS = [
  'Cash',
  'Bank',
  'Mobile Banking',
  'Other',
];

export const AibAccountPage: React.FC = () => {
  const {
    activeSubItem,
    aibTransactions,
    aibTransactionsLoading,
    addAibTransaction,
    updateAibTransaction,
    deleteAibTransaction,
    searchQuery,
    t,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'Collection' | 'Expense'>('Collection');

  // Add Form State
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState('Aib Collection');
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState<number | ''>(500);
  const [formPaymentMethod, setFormPaymentMethod] = useState('Cash');
  const [formReference, setFormReference] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [editingTransaction, setEditingTransaction] = useState<AibTransaction | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState<number | ''>('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('');
  const [editReference, setEditReference] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deletingTransaction, setDeletingTransaction] = useState<AibTransaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const effectiveSearch = localSearch || searchQuery;

  // Real financial calculations based on Firestore aibTransactions state
  const totalCollection = useMemo(() => {
    return aibTransactions
      .filter((t) => t.type?.toLowerCase() === 'collection' && t.status !== 'Cancelled')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [aibTransactions]);

  const totalExpense = useMemo(() => {
    return aibTransactions
      .filter((t) => t.type?.toLowerCase() === 'expense' && t.status !== 'Cancelled')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [aibTransactions]);

  const aibBalance = useMemo(() => {
    return totalCollection - totalExpense;
  }, [totalCollection, totalExpense]);

  // Dynamic filter lists for selector dropdowns
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    aibTransactions.forEach((t) => {
      if (t.category) categories.add(t.category);
    });
    return Array.from(categories);
  }, [aibTransactions]);

  // Filter transactions based on active sub-item & search & selections
  const filteredList = useMemo(() => {
    return aibTransactions.filter((item) => {
      // 1. Subpage filtering
      if (activeSubItem === 'aib-collection' && item.type?.toLowerCase() !== 'collection') return false;
      if (activeSubItem === 'aib-expense' && item.type?.toLowerCase() !== 'expense') return false;

      // 2. Search query (Description, Category, Reference, Note, ID)
      const q = effectiveSearch.trim().toLowerCase();
      if (q) {
        const matchesId = item.id?.toLowerCase().includes(q) || item.transactionId?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesRef = item.reference?.toLowerCase().includes(q) || item.receiptOrVoucher?.toLowerCase().includes(q);
        const matchesNote = item.note?.toLowerCase().includes(q) || item.donorOrBeneficiary?.toLowerCase().includes(q);
        if (!matchesId && !matchesDesc && !matchesCat && !matchesRef && !matchesNote) {
          return false;
        }
      }

      // 3. Payment Method Filter
      if (selectedPaymentMethod !== 'All' && item.paymentMethod !== selectedPaymentMethod) {
        return false;
      }

      // 4. Category Filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [aibTransactions, activeSubItem, effectiveSearch, selectedPaymentMethod, selectedCategory]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formDate) {
      setFormError(t('Date is required.'));
      return;
    }
    if (!formCategory) {
      setFormError(t('Category is required.'));
      return;
    }
    const amt = Number(formAmount);
    if (!formAmount || isNaN(amt) || amt <= 0) {
      setFormError(t('Amount must be greater than 0.'));
      return;
    }
    if (modalType.toLowerCase() === 'expense' && amt > aibBalance) {
      setFormError(`${t('Insufficient funds in Aib Account.')} ৳${aibBalance}.`);
      return;
    }
    if (!formDescription.trim()) {
      setFormError(t('Description is required.'));
      return;
    }

    setIsSubmitting(true);
    try {
      addAibTransaction({
        date: formDate,
        type: modalType,
        category: formCategory,
        description: formDescription.trim(),
        amount: amt,
        paymentMethod: formPaymentMethod,
        reference: formReference.trim(),
        note: formNote.trim(),
      });

      setIsAddModalOpen(false);
      // Reset form
      setFormDescription('');
      setFormReference('');
      setFormNote('');
      setFormError(null);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to save transaction to Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    setEditFormError(null);

    if (!editDate) {
      setEditFormError(t('Date is required.'));
      return;
    }
    if (!editCategory) {
      setEditFormError(t('Category is required.'));
      return;
    }
    const amt = Number(editAmount);
    if (!editAmount || isNaN(amt) || amt <= 0) {
      setEditFormError(t('Amount must be greater than 0.'));
      return;
    }
    const isExpense = editingTransaction.type?.toLowerCase() === 'expense';
    if (isExpense && amt > (aibBalance + editingTransaction.amount)) {
      setEditFormError(`${t('Insufficient funds in Aib Account.')} ৳${aibBalance + editingTransaction.amount}.`);
      return;
    }
    const isCollection = editingTransaction.type?.toLowerCase() === 'collection';
    if (isCollection && (aibBalance - editingTransaction.amount + amt) < 0) {
      setEditFormError(`${t('Cannot reduce collection to')} ৳${amt}.`);
      return;
    }
    if (!editDescription.trim()) {
      setEditFormError(t('Description is required.'));
      return;
    }

    setIsUpdating(true);
    try {
      await updateAibTransaction(editingTransaction.id, {
        date: editDate,
        category: editCategory,
        description: editDescription.trim(),
        amount: amt,
        paymentMethod: editPaymentMethod,
        reference: editReference.trim(),
        note: editNote.trim(),
      });
      setEditingTransaction(null);
    } catch (err: any) {
      console.error(err);
      setEditFormError(err.message || 'Failed to update transaction.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      await deleteAibTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    } catch (err) {
      console.error('Delete transaction error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const openAdd = (type: 'Collection' | 'Expense') => {
    setModalType(type);
    setFormCategory(type === 'Collection' ? COLLECTION_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormPaymentMethod('Cash');
    setFormAmount(500);
    setFormDescription('');
    setFormReference('');
    setFormNote('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEdit = (txn: AibTransaction) => {
    setEditingTransaction(txn);
    setEditDate(txn.date);
    setEditCategory(txn.category);
    setEditDescription(txn.description);
    setEditAmount(txn.amount);
    setEditPaymentMethod(txn.paymentMethod || 'Cash');
    setEditReference(txn.reference || txn.receiptOrVoucher || '');
    setEditNote(txn.note || txn.donorOrBeneficiary || '');
    setEditFormError(null);
  };

  const subItemTitles: Record<string, { title: string; subtitle: string }> = {
    'aib-collection': {
      title: 'Aib Collection',
      subtitle: 'Donations, Waqf endowments, and earmarked charitable receipts',
    },
    'aib-expense': {
      title: 'Aib Expense',
      subtitle: 'Disbursements for designated student welfare, stipends, and grants',
    },
    'aib-balance': {
      title: 'Aib Balance',
      subtitle: 'Overview of the Aib endowment account reserve and ledger positions',
    },
    'aib-transactions': {
      title: 'Aib Transactions',
      subtitle: 'Master ledger of all Aib collections and expense postings',
    },
  };

  const currentMeta = subItemTitles[activeSubItem] || {
    title: 'Aib Account',
    subtitle: 'Special endowment and welfare funds ledger',
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="Aib Account"
        subItemTitle={currentMeta.title}
        sectionKey="aib-account"
        subItemKey={activeSubItem}
      />

      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{t(currentMeta.title)}</h2>
          <p className="text-xs text-slate-500">{t(currentMeta.subtitle)}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAdd('Collection')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('Record Aib Collection')}</span>
          </button>
          <button
            onClick={() => openAdd('Expense')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowDownRight className="h-4 w-4 text-amber-600" />
            <span>{t('Record Aib Expense')}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title={t('Total Collection')}
          value={`৳${totalCollection.toLocaleString()}`}
          subtitle={t('All cumulative Aib endowment receipts')}
          icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
          accentColor="emerald"
        />
        <StatCard
          title={t('Total Expense')}
          value={`৳${totalExpense.toLocaleString()}`}
          subtitle={t('Cumulative aid and welfare disbursements')}
          icon={<ArrowDownRight className="h-5 w-5 text-amber-700" />}
          accentColor="amber"
        />
        <StatCard
          title={t('Current Balance')}
          value={`৳${aibBalance.toLocaleString()}`}
          subtitle={t('Net available Aib account balance')}
          icon={<Wallet className="h-5 w-5 text-sky-700" />}
          accentColor="blue"
        />
      </div>

      {/* If sub-item is aib-balance, show visual calculation card */}
      {activeSubItem === 'aib-balance' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            {t('Aib Reserve Reconciliation Statement')}
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-center md:text-left">
              <span className="text-xs text-slate-500 font-medium">{t('Total Aib Collection')}</span>
              <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
                +৳{totalCollection.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">−</span>

            <div className="text-center md:text-left">
              <span className="text-xs text-slate-500 font-medium">{t('Total Aib Expense')}</span>
              <p className="text-2xl font-bold text-amber-700 font-mono tabular-nums mt-1">
                -৳{totalExpense.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">=</span>

            <div className="text-center md:text-left bg-white px-5 py-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t('Net Aib Reserve Balance')}</span>
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-1">
                ৳{aibBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-slate-100 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t('Search by desc, category, ref, note...')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500">{t('Category')}:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
              >
                <option value="All">{t('All Categories')}</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500">{t('Payment Method')}:</span>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="All">{t('All Methods')}</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {t(m)}
                  </option>
                ))}
              </select>
            </div>

            {(localSearch || selectedCategory !== 'All' || selectedPaymentMethod !== 'All') && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSelectedCategory('All');
                  setSelectedPaymentMethod('All');
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                title={t('Clear filters')}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t('Reset')}</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">{t('Date')}</th>
                <th className="px-5 py-3.5">{t('Description / Particulars')}</th>
                <th className="px-5 py-3.5">{t('Category')}</th>
                <th className="px-5 py-3.5">{t('Payment Method')}</th>
                <th className="px-5 py-3.5">{t('Ref / Slip #')}</th>
                <th className="px-5 py-3.5">{t('Remarks / Note')}</th>
                <th className="px-5 py-3.5">{t('Type')}</th>
                <th className="px-5 py-3.5 text-right">{t('Amount')}</th>
                <th className="px-5 py-3.5 text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {aibTransactionsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={9} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 tabular-nums font-medium font-mono">
                      {item.date}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                      {t(item.category)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                      {t(item.paymentMethod || 'Cash')}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-500">
                      {item.reference || item.receiptOrVoucher || '-'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                      {item.note || item.donorOrBeneficiary || '-'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          item.type?.toLowerCase() === 'collection' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {item.type?.toLowerCase() === 'collection' ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {item.type?.toLowerCase() === 'collection' ? t('Collection') : t('Expense')}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 whitespace-nowrap text-right font-mono tabular-nums font-bold ${
                      item.type?.toLowerCase() === 'collection' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {item.type?.toLowerCase() === 'collection' ? '+' : '−'}৳{item.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(item)}
                          title={t('Edit Transaction')}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(item)}
                          title={t('Delete Transaction')}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-400">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">{t('No Aib transactions found in this view')}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t('Records are loaded directly from Firebase Firestore.')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={modalType === 'Collection' ? t('Record Aib Collection') : t('Record Aib Expense')}
          subtitle={t('Add ledger entry into the Aib endowment account')}
          maxWidth="md"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            {formError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-[11px] text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Date')} *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">{t('Category')} *</label>
                <div className="relative">
                  <Tag className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                  >
                    {modalType === 'Collection'
                      ? COLLECTION_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {t(c)}
                          </option>
                        ))
                      : EXPENSE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {t(c)}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Payment Method')} *</label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {t(m)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Amount')} (৳) *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">{t('Ref / Slip #')}</label>
                <input
                  type="text"
                  placeholder="e.g. Dep-8920"
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Remarks / Note')}</label>
                <input
                  type="text"
                  placeholder="e.g. Contributed by family"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('Description / Particulars')} *</label>
              <textarea
                rows={2}
                required
                placeholder="Brief summary of transaction details..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? t('Saving...') : t('Save Entry')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <Modal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          title={t('Edit Aib Transaction')}
          subtitle={t('Update transaction specifications in Firestore')}
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            {editFormError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-[11px] text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{editFormError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Date')} *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">{t('Category')} *</label>
                <div className="relative">
                  <Tag className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                  >
                    {(editingTransaction.type?.toLowerCase() === 'collection' ? COLLECTION_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                      <option key={c} value={c}>
                        {t(c)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Payment Method')} *</label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={editPaymentMethod}
                    onChange={(e) => setEditPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {t(m)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Amount')} (৳) *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">{t('Ref / Slip #')}</label>
                <input
                  type="text"
                  value={editReference}
                  onChange={(e) => setEditReference(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Remarks / Note')}</label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('Description / Particulars')} *</label>
              <textarea
                rows={2}
                required
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTransaction(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? t('Saving Changes...') : t('Save Changes')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTransaction && (
        <Modal
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          title={t('Delete Transaction Entry')}
          subtitle={t('Confirm complete removal of this record from Cloud Firestore')}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">{t('Warning: Irreversible Action')}</span>
                {t('This will delete transaction record')} <strong className="font-mono text-rose-950">{deletingTransaction.id}</strong> {t('completely from Firestore. The Aib reserve account balance will be updated in real-time.')}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('Type')}</span>
                  <span className="font-bold text-slate-800">{t(deletingTransaction.type)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('Amount')}</span>
                  <span className="font-bold text-slate-800">৳{deletingTransaction.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('Category')}</span>
                  <span className="font-medium text-slate-700">{t(deletingTransaction.category)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('Date')}</span>
                  <span className="font-mono text-slate-600">{deletingTransaction.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingTransaction(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t('No, Keep Record')}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteSubmit}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? t('Deleting...') : t('Yes, Delete Record')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
