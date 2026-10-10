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
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RevolvingFundTransaction } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';

const STATUS_OPTIONS = ['Completed', 'Pending', 'Cancelled'];
const PAYMENT_METHODS = ['Cash', 'Bank', 'Mobile Banking', 'Other'];
const TYPE_OPTIONS = ['Collection', 'Distribution', 'Return'];

export const RevolvingFundPage: React.FC = () => {
  const {
    activeSubItem,
    setActiveNav,
    revolvingFund,
    revolvingFundLoading,
    addRevolvingFund,
    updateRevolvingFund,
    deleteRevolvingFund,
    searchQuery,
    t,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'Collection' | 'Distribution' | 'Return'>('Collection');

  // Add Form State
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPersonName, setFormPersonName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState<number | ''>(1000);
  const [formPaymentMethod, setFormPaymentMethod] = useState('Cash');
  const [formReference, setFormReference] = useState('');
  const [formStatus, setFormStatus] = useState<string>('Completed');
  const [formNote, setFormNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [editingTransaction, setEditingTransaction] = useState<RevolvingFundTransaction | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editType, setEditType] = useState<'Collection' | 'Distribution' | 'Return'>('Collection');
  const [editPersonName, setEditPersonName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState<number | ''>('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editReference, setEditReference] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deletingTransaction, setDeletingTransaction] = useState<RevolvingFundTransaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const effectiveSearch = localSearch || searchQuery;

  // 13. ACCOUNTING LOGIC: Calculate balance ONLY from "Completed" status transactions
  const totalFundCollection = useMemo(() => {
    return revolvingFund
      .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'collection')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [revolvingFund]);

  const totalDistributed = useMemo(() => {
    return revolvingFund
      .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'distribution')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [revolvingFund]);

  const totalReturned = useMemo(() => {
    return revolvingFund
      .filter((t) => t.status === 'Completed' && t.type?.toLowerCase() === 'return')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [revolvingFund]);

  const currentFundBalance = useMemo(() => {
    return totalFundCollection + totalReturned - totalDistributed;
  }, [totalFundCollection, totalReturned, totalDistributed]);

  // Filter based on active sub-item and form search/filter controls
  const filteredTransactions = useMemo(() => {
    return revolvingFund.filter((item) => {
      // 1. Subpage filtering
      if (activeSubItem === 'fund-collection' && item.type?.toLowerCase() !== 'collection') return false;
      if (activeSubItem === 'fund-distribution' && item.type?.toLowerCase() !== 'distribution') return false;
      if (activeSubItem === 'fund-return' && item.type?.toLowerCase() !== 'return') return false;

      // 2. Type Filter dropdown
      if (selectedType !== 'All' && item.type?.toLowerCase() !== selectedType.toLowerCase()) return false;

      // 3. Status Filter dropdown
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;

      // 4. Payment Method dropdown
      if (selectedPaymentMethod !== 'All' && item.paymentMethod !== selectedPaymentMethod) return false;

      // 5. Date range filter
      if (startDate && item.date < startDate) return false;
      if (endDate && item.date > endDate) return false;

      // 6. Search query (Person Name, Description, Reference, Note)
      const q = effectiveSearch.trim().toLowerCase();
      if (q) {
        const matchesName = item.beneficiaryOrContributor?.toLowerCase().includes(q) || item.personName?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesRef = item.reference?.toLowerCase().includes(q);
        const matchesNote = item.note?.toLowerCase().includes(q);
        const matchesId = item.id?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesRef && !matchesNote && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [revolvingFund, activeSubItem, selectedType, selectedStatus, selectedPaymentMethod, startDate, endDate, effectiveSearch]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formDate) {
      setFormError('Date is required.');
      return;
    }
    if (!formPersonName.trim()) {
      setFormError('Person Name / Source is required.');
      return;
    }
    const amt = Number(formAmount);
    if (!formAmount || isNaN(amt) || amt <= 0) {
      setFormError('Amount must be greater than 0.');
      return;
    }
    if (modalType.toLowerCase() === 'distribution' && formStatus === 'Completed' && amt > currentFundBalance) {
      setFormError(`Insufficient funds in Revolving Fund. Maximum available balance is ৳${currentFundBalance}.`);
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Description is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addRevolvingFund({
        date: formDate,
        type: modalType,
        beneficiaryOrContributor: formPersonName.trim(),
        personName: formPersonName.trim(),
        description: formDescription.trim(),
        amount: amt,
        paymentMethod: formPaymentMethod,
        reference: formReference.trim(),
        status: formStatus,
        note: formNote.trim(),
      });

      setIsAddModalOpen(false);
      // Reset form fields
      setFormDescription('');
      setFormPersonName('');
      setFormReference('');
      setFormNote('');
      setFormError(null);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to record Revolving Fund entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    setEditFormError(null);

    if (!editDate) {
      setEditFormError('Date is required.');
      return;
    }
    if (!editPersonName.trim()) {
      setEditFormError('Person Name is required.');
      return;
    }
    const amt = Number(editAmount);
    if (!editAmount || isNaN(amt) || amt <= 0) {
      setEditFormError('Amount must be greater than 0.');
      return;
    }
    // Available balance excluding the edited transaction
    let baseBalance = currentFundBalance;
    if (editingTransaction.status === 'Completed') {
      const oldType = editingTransaction.type?.toLowerCase();
      if (oldType === 'collection') baseBalance -= editingTransaction.amount;
      else if (oldType === 'return') baseBalance -= editingTransaction.amount;
      else if (oldType === 'distribution') baseBalance += editingTransaction.amount;
    }

    // New balance if the updated transaction is applied
    let potentialBalance = baseBalance;
    if (editStatus === 'Completed') {
      const newType = editType.toLowerCase();
      if (newType === 'collection') potentialBalance += amt;
      else if (newType === 'return') potentialBalance += amt;
      else if (newType === 'distribution') potentialBalance -= amt;
    }

    if (potentialBalance < 0) {
      setEditFormError(`This transaction would make the Revolving Fund balance negative (potential balance: ৳${potentialBalance}). Please adjust amount or status.`);
      return;
    }
    if (!editDescription.trim()) {
      setEditFormError('Description is required.');
      return;
    }

    setIsUpdating(true);
    try {
      await updateRevolvingFund(editingTransaction.id, {
        date: editDate,
        type: editType,
        beneficiaryOrContributor: editPersonName.trim(),
        personName: editPersonName.trim(),
        description: editDescription.trim(),
        amount: amt,
        paymentMethod: editPaymentMethod,
        status: editStatus,
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
      await deleteRevolvingFund(deletingTransaction.id);
      setDeletingTransaction(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete transaction.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openForm = (type: 'Collection' | 'Distribution' | 'Return') => {
    setModalType(type);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormPersonName('');
    setFormDescription('');
    setFormAmount(1000);
    setFormPaymentMethod('Cash');
    setFormReference('');
    setFormStatus('Completed');
    setFormNote('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEdit = (tx: RevolvingFundTransaction) => {
    setEditingTransaction(tx);
    setEditDate(tx.date);
    setEditType(tx.type?.toLowerCase() === 'collection' ? 'Collection' : tx.type?.toLowerCase() === 'distribution' ? 'Distribution' : 'Return');
    setEditPersonName(tx.personName || tx.beneficiaryOrContributor || '');
    setEditDescription(tx.description);
    setEditAmount(tx.amount);
    setEditPaymentMethod(tx.paymentMethod || 'Cash');
    setEditStatus(tx.status);
    setEditReference(tx.reference || '');
    setEditNote(tx.note || '');
    setEditFormError(null);
  };

  const subPageTitles: Record<string, { title: string; subtitle: string }> = {
    'fund-collection': {
      title: 'Fund Collection',
      subtitle: 'Inflow contributions, trustee allocations, and capital additions to the revolving fund',
    },
    'fund-distribution': {
      title: 'Fund Distribution',
      subtitle: 'Interest-free emergency loans and welfare assistance advances provided to staff and scholars',
    },
    'fund-return': {
      title: 'Fund Return',
      subtitle: 'Installment repayments and returned loan balances received back into the revolving pool',
    },
    'fund-balance': {
      title: 'Fund Balance',
      subtitle: 'Comprehensive financial snapshot and recovery status of the revolving fund',
    },
    'fund-transactions': {
      title: 'Fund Transactions',
      subtitle: 'Full ledger record of all revolving fund collections, disbursements, and returns',
    },
  };

  const currentMeta = subPageTitles[activeSubItem] || {
    title: 'Revolving Fund',
    subtitle: 'Interest-free emergency support & revolving loan ledger',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Received':
      case 'Returned':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
      case 'Disbursed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTypeBadge = (type: string) => {
    const t = type?.toLowerCase();
    if (t === 'collection') {
      return 'bg-emerald-100 text-emerald-800';
    } else if (t === 'distribution') {
      return 'bg-amber-100 text-amber-800';
    } else {
      return 'bg-indigo-100 text-indigo-800';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="Revolving Fund"
        subItemTitle={currentMeta.title}
        sectionKey="revolving-fund"
        subItemKey={activeSubItem}
      />

      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{t(currentMeta.title)}</h2>
          <p className="text-xs text-slate-500">{t(currentMeta.subtitle)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openForm('Collection')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('Record Fund Collection')}</span>
          </button>
          <button
            onClick={() => openForm('Distribution')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowDownRight className="h-4 w-4 text-amber-600" />
            <span>{t('Record Fund Distribution')}</span>
          </button>
          <button
            onClick={() => openForm('Return')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-indigo-600" />
            <span>{t('Record Fund Return')}</span>
          </button>
        </div>
      </div>

      {/* 5. FUND BALANCE SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('Total Inflow / Capital')}
          value={`৳${totalFundCollection.toLocaleString()}`}
          subtitle={t('Capital pooled from contributors')}
          icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
          accentColor="emerald"
        />
        <StatCard
          title={t('Total Loans Disbursed')}
          value={`৳${totalDistributed.toLocaleString()}`}
          subtitle={t('Active welfare disbursements out')}
          icon={<ArrowDownRight className="h-5 w-5 text-amber-700" />}
          accentColor="amber"
        />
        <StatCard
          title={t('Settled / Repaid')}
          value={`৳${totalReturned.toLocaleString()}`}
          subtitle={t('Advances repaid back to pool')}
          icon={<RotateCcw className="h-5 w-5 text-indigo-700" />}
          accentColor="indigo"
        />
        <StatCard
          title={t('Available Fund Cash')}
          value={`৳${currentFundBalance.toLocaleString()}`}
          subtitle={t('Net solvent liquid pool')}
          icon={<RotateCw className="h-5 w-5 text-sky-700" />}
          accentColor="blue"
        />
      </div>

      {/* Solvency Equation Card if on fund-balance */}
      {activeSubItem === 'fund-balance' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Revolving Fund Solvent Accounting Formula
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-center md:text-left">
              <span className="text-xs text-slate-500 font-semibold uppercase">Completed Collections</span>
              <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
                +${totalFundCollection.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">+</span>

            <div className="text-center md:text-left">
              <span className="text-xs text-slate-500 font-semibold uppercase">Completed Returns</span>
              <p className="text-2xl font-bold text-indigo-700 font-mono tabular-nums mt-0.5">
                +${totalReturned.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">−</span>

            <div className="text-center md:text-left">
              <span className="text-xs text-slate-500 font-semibold uppercase">Completed Distributions</span>
              <p className="text-2xl font-bold text-amber-700 font-mono tabular-nums mt-0.5">
                -${totalDistributed.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">=</span>

            <div className="text-center md:text-left bg-white px-5 py-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold uppercase text-sky-800">Net Solvency Pool</span>
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-1">
                ${currentFundBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. FUND TRANSACTIONS LEDGER */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Search & Advanced Filters */}
        <div className="flex flex-col p-4 border-b border-slate-100 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search name, description, ref..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-600 transition-all"
              />
            </div>

            <span className="text-xs font-medium text-slate-500">
              {filteredTransactions.length} transaction entries recorded
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Type Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-500">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Types</option>
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-slate-500">Payment:</span>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Methods</option>
                {PAYMENT_METHODS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filters */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-slate-500">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-hidden"
              />
              <span className="font-medium text-slate-500">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-hidden"
              />
            </div>

            {(localSearch || selectedType !== 'All' || selectedStatus !== 'All' || selectedPaymentMethod !== 'All' || startDate || endDate) && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSelectedType('All');
                  setSelectedStatus('All');
                  setSelectedPaymentMethod('All');
                  setStartDate('');
                  setEndDate('');
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Person / Source Name</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5">Payment Method</th>
                <th className="px-5 py-3.5">Ref / Slip #</th>
                <th className="px-5 py-3.5">Remarks / Note</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {revolvingFundLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={10} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 tabular-nums font-medium font-mono">
                      {tx.date}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${getTypeBadge(tx.type)}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-900 font-semibold">
                      {tx.personName || tx.beneficiaryOrContributor}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-600 max-w-xs truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td className={`px-5 py-3.5 whitespace-nowrap text-right font-mono tabular-nums font-bold ${
                      tx.type?.toLowerCase() === 'distribution' ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {tx.type?.toLowerCase() === 'distribution' ? '−' : '+'}৳{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                      {tx.paymentMethod || 'Cash'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-500">
                      {tx.reference || '-'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate" title={tx.note}>
                      {tx.note || '-'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                      <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(tx)}
                          title="Edit Transaction"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(tx)}
                          title="Delete Transaction"
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
                  <td colSpan={10} className="py-16 text-center text-slate-400">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No Revolving Fund entries found in this view</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Records are fully synchronized with Google Cloud Firestore.</p>
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
          title={`Record Revolving ${modalType}`}
          subtitle="Post interest-free support to the revolving capital ledger"
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
                <label className="block font-semibold text-slate-700 mb-1">Person / Source Name *</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={
                      modalType === 'Collection' ? 'e.g. Haji Salman Trust' : 'e.g. Ustadh Salman Ali'
                    }
                    value={formPersonName}
                    onChange={(e) => setFormPersonName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
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
                  placeholder="e.g. RF-Slip-921"
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
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
              <label className="block font-semibold text-slate-700 mb-1">Remarks / Note</label>
              <input
                type="text"
                placeholder="e.g. Welfare advance for housing"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Particulars / Description *</label>
              <textarea
                rows={2}
                required
                placeholder="Enter comprehensive details here..."
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Recording...' : 'Record Transaction'}
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
          title={`Edit Revolving Fund Transaction`}
          subtitle="Update record specifications in Firestore"
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
                <label className="block font-semibold text-slate-700 mb-1">Type *</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="Collection">Collection</option>
                  <option value="Distribution">Distribution</option>
                  <option value="Return">Return</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Person / Source Name *</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={editPersonName}
                    onChange={(e) => setEditPersonName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
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
                <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
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
                <label className="block font-semibold text-slate-700 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
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

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTransaction(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? 'Saving Changes...' : 'Save Changes'}
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
          title="Delete Revolving Fund Transaction"
          subtitle="Are you sure you want to delete this Revolving Fund transaction?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Warning: Permanent Deletion</span>
                Deleting this record will irreversibly remove it from Cloud Firestore and recalculate the fund balance in real-time.
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Type</span>
                  <span className="font-bold text-slate-800">{deletingTransaction.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Amount</span>
                  <span className="font-bold text-slate-800">৳{deletingTransaction.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Person Name</span>
                  <span className="font-semibold text-slate-700">{deletingTransaction.personName || deletingTransaction.beneficiaryOrContributor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date</span>
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
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteSubmit}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Transaction'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
