import React, { useState, useMemo, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer,
  Receipt,
  ArrowRight,
  DollarSign,
  User,
  RotateCcw,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeeRecord, FeeType, PaymentMethod, FeeStatus, SubNavigationItem } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';

const MONTH_OPTIONS = [
  'January 2026',
  'February 2026',
  'March 2026',
  'April 2026',
  'May 2026',
  'June 2026',
  'July 2026',
  'August 2026',
  'September 2026',
  'October 2026',
  'November 2026',
  'December 2026',
];

const OTHER_FEE_CATEGORIES = [
  'Exam Fee',
  'Form Fee',
  'ID Card Fee',
  'Certificate Fee',
  'Other',
];

export const FeesManagerPage: React.FC = () => {
  const {
    activeSubItem,
    setActiveNav,
    fees,
    feesLoading,
    students,
    addFeePayment,
    updateFeePayment,
    deleteFeePayment,
    searchQuery,
    prefillFeeStudentId,
    setPrefillFeeStudentId,
    classes,
    madrasaInfo,
    t,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedFeeType, setSelectedFeeType] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Interactive Fee Collection Form State
  const [collectStudentId, setCollectStudentId] = useState('');
  const [collectFeeType, setCollectFeeType] = useState<FeeType>('Monthly Fee');
  const [collectCategory, setCollectCategory] = useState('Exam Fee');
  const [collectMonth, setCollectMonth] = useState('October 2026');
  const [totalAmount, setTotalAmount] = useState<number | ''>(100);
  const [paidAmount, setPaidAmount] = useState<number | ''>(100);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals state
  const [viewingReceipt, setViewingReceipt] = useState<FeeRecord | null>(null);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);
  const [deletingFee, setDeletingFee] = useState<FeeRecord | null>(null);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle prefilled student when opening collection
  useEffect(() => {
    if (prefillFeeStudentId) {
      setCollectStudentId(prefillFeeStudentId);
      setPrefillFeeStudentId(null);
    } else if (!collectStudentId && students.length > 0) {
      setCollectStudentId(students[0].id);
    }
  }, [prefillFeeStudentId, students, collectStudentId, setPrefillFeeStudentId]);

  // Selected student details for auto-populating
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === collectStudentId);
  }, [students, collectStudentId]);

  // Calculated Due Amount in Collection Form
  const calculatedDue = useMemo(() => {
    const total = typeof totalAmount === 'number' ? totalAmount : 0;
    const paid = typeof paidAmount === 'number' ? paidAmount : 0;
    return Math.max(0, total - paid);
  }, [totalAmount, paidAmount]);

  // Calculated Status in Collection Form
  const calculatedStatus: FeeStatus = useMemo(() => {
    const total = typeof totalAmount === 'number' ? totalAmount : 0;
    const paid = typeof paidAmount === 'number' ? paidAmount : 0;
    if (paid >= total && total > 0) return 'Paid';
    if (paid > 0 && paid < total) return 'Partial';
    return 'Due';
  }, [totalAmount, paidAmount]);

  // Combined search term
  const effectiveSearch = localSearch || searchQuery;

  // Filter fees based on active sub-page & search & filters
  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      // 1. Sub-item filter
      if (activeSubItem === 'monthly-fees' && fee.feeType !== 'Monthly Fee') return false;
      if (activeSubItem === 'admission-fees' && fee.feeType !== 'Admission Fee') return false;
      if (activeSubItem === 'other-fees' && fee.feeType !== 'Other Fee' && fee.feeType !== 'Other') return false;
      if (activeSubItem === 'due-fees' && (fee.due <= 0 && fee.status === 'Paid')) return false;

      // 2. Search query (Student ID, Student Name, Father Name)
      const q = effectiveSearch.trim().toLowerCase();
      if (q) {
        const studentObj = students.find((s) => s.id === fee.studentId);
        const matchesId = fee.studentId.toLowerCase().includes(q);
        const matchesName = fee.studentName.toLowerCase().includes(q);
        const matchesFather = studentObj?.fatherName
          ? studentObj.fatherName.toLowerCase().includes(q)
          : false;
        const matchesReceipt = fee.id.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesFather && !matchesReceipt) {
          return false;
        }
      }

      // 3. Class filter
      if (selectedClass !== 'All' && fee.className !== selectedClass) {
        return false;
      }

      // 4. Status filter
      if (selectedStatus !== 'All' && fee.status !== selectedStatus) {
        return false;
      }

      // 5. Fee Type filter (used on due-fees)
      if (selectedFeeType !== 'All' && fee.feeType !== selectedFeeType) {
        return false;
      }

      // 6. Payment Month filter (used on monthly-fees)
      if (selectedMonth !== 'All' && fee.month !== selectedMonth) {
        return false;
      }

      return true;
    });
  }, [
    fees,
    students,
    activeSubItem,
    effectiveSearch,
    selectedClass,
    selectedStatus,
    selectedFeeType,
    selectedMonth,
  ]);

  // Unique classes for filter dropdown
  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => set.add(c.name));
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set);
  }, [classes, students]);

  // Overall Financial Totals for Active View
  const viewTotals = useMemo(() => {
    let targetFees = fees;
    if (activeSubItem === 'monthly-fees') {
      targetFees = fees.filter((f) => f.feeType === 'Monthly Fee');
    } else if (activeSubItem === 'admission-fees') {
      targetFees = fees.filter((f) => f.feeType === 'Admission Fee');
    } else if (activeSubItem === 'other-fees') {
      targetFees = fees.filter((f) => f.feeType === 'Other Fee' || f.feeType === 'Other');
    } else if (activeSubItem === 'due-fees') {
      targetFees = fees.filter((f) => f.due > 0 || f.status !== 'Paid');
    }

    const totalBilled = targetFees.reduce((sum, f) => sum + (Number(f.totalFee) || 0), 0);
    const totalCollected = targetFees.reduce((sum, f) => sum + (Number(f.paid) || 0), 0);
    const totalDue = targetFees.reduce((sum, f) => sum + (Number(f.due) || 0), 0);

    return { totalBilled, totalCollected, totalDue, count: targetFees.length };
  }, [fees, activeSubItem]);

  // Subpage Meta Titles
  const subPageTitles: Record<SubNavigationItem, { title: string; subtitle: string }> = {
    'monthly-fees': {
      title: 'Monthly Fees',
      subtitle: 'Class-wise monthly tuition fee billing and collection status',
    },
    'admission-fees': {
      title: 'Admission Fees',
      subtitle: 'Session enrollment and one-time admission fee receipts',
    },
    'other-fees': {
      title: 'Other Fees',
      subtitle: 'Examination, form, ID card, and ancillary fee collections',
    },
    'fee-collection': {
      title: 'Fee Collection Desk',
      subtitle: 'Process student fee receipts, record real-time payments and print invoices',
    },
    'due-fees': {
      title: 'Due Fees Ledger',
      subtitle: 'Outstanding fee balances requiring collection and settlement',
    },
    'student-list': { title: '', subtitle: '' },
    'student-admission': { title: '', subtitle: '' },
    'student-information': { title: '', subtitle: '' },
    'aib-collection': { title: '', subtitle: '' },
    'aib-expense': { title: '', subtitle: '' },
    'aib-balance': { title: '', subtitle: '' },
    'aib-transactions': { title: '', subtitle: '' },
    'fund-collection': { title: '', subtitle: '' },
    'fund-distribution': { title: '', subtitle: '' },
    'fund-return': { title: '', subtitle: '' },
    'fund-balance': { title: '', subtitle: '' },
    'fund-transactions': { title: '', subtitle: '' },
    'boarding-students': { title: '', subtitle: '' },
    'boarding-fees': { title: '', subtitle: '' },
    'food-expense': { title: '', subtitle: '' },
    'other-expenses': { title: '', subtitle: '' },
    'boarding-balance': { title: '', subtitle: '' },
    income: { title: '', subtitle: '' },
    expense: { title: '', subtitle: '' },
    transactions: { title: '', subtitle: '' },
    balance: { title: '', subtitle: '' },
    'madrasa-information': { title: '', subtitle: '' },
    'user-management': { title: '', subtitle: '' },
    'academic-year': { title: '', subtitle: '' },
    classes: { title: '', subtitle: '' },
    'account-categories': { title: '', subtitle: '' },
    'login-logout': { title: '', subtitle: '' },
    'reset-website-data': { title: '', subtitle: '' },
    'refresh-reload': { title: '', subtitle: '' },
    'system-restart-reboot': { title: '', subtitle: '' },
  };

  const currentMeta = subPageTitles[activeSubItem] || {
    title: 'Student Fees',
    subtitle: 'Manage fee schedules, collections and balances',
  };

  // Handle Fee Collection Form Submission
  const handleCollectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedStudent) {
      setFormError('Please select a student from the registered list.');
      return;
    }
    if (!collectFeeType) {
      setFormError('Fee Type is required.');
      return;
    }

    const total = typeof totalAmount === 'number' ? totalAmount : 0;
    const paid = typeof paidAmount === 'number' ? paidAmount : 0;

    if (total <= 0) {
      setFormError('Total Amount must be greater than 0.');
      return;
    }
    if (paid < 0) {
      setFormError('Paid Amount cannot be negative.');
      return;
    }
    if (paid > total) {
      setFormError('Paid Amount cannot exceed Total Amount.');
      return;
    }
    if (!paymentDate) {
      setFormError('Payment Date is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdRecord = await addFeePayment({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        className: selectedStudent.className,
        section: selectedStudent.section || 'A',
        feeType: collectFeeType,
        category: collectFeeType === 'Other Fee' ? collectCategory : undefined,
        month: collectFeeType === 'Monthly Fee' ? collectMonth : undefined,
        amount: total,
        paidAmount: paid,
        paymentDate,
        paymentMethod,
        note: note.trim() || undefined,
      });

      // Show receipt modal
      setViewingReceipt(createdRecord);

      // Reset form fields
      setPaidAmount(total);
      setNote('');
    } catch (err: any) {
      console.error('Error recording fee:', err);
      setFormError(err.message || 'Failed to save fee in Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Fee submission
  const handleSaveEditFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;
    setEditFormError(null);

    const total = Number(editingFee.totalFee) || 0;
    const paid = Number(editingFee.paid) || 0;

    if (total <= 0) {
      setEditFormError('Total Amount must be greater than 0.');
      return;
    }
    if (paid < 0) {
      setEditFormError('Paid Amount cannot be negative.');
      return;
    }
    if (paid > total) {
      setEditFormError('Paid Amount cannot exceed Total Amount.');
      return;
    }

    setIsUpdating(true);
    try {
      await updateFeePayment(editingFee.id, {
        feeType: editingFee.feeType,
        category: editingFee.category,
        month: editingFee.month,
        amount: total,
        paidAmount: paid,
        paymentDate: editingFee.lastPaymentDate,
        paymentMethod: editingFee.paymentMethod,
        note: editingFee.note,
      });
      setEditingFee(null);
    } catch (err: any) {
      console.error('Update fee error:', err);
      setEditFormError(err.message || 'Failed to update fee record.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete Fee Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingFee) return;
    setIsDeleting(true);
    try {
      await deleteFeePayment(deletingFee.id);
      setDeletingFee(null);
    } catch (err) {
      console.error('Delete fee error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: FeeStatus | string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partial':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Due':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="Student Fees"
        subItemTitle={currentMeta.title}
        sectionKey="student-fees"
        subItemKey={activeSubItem}
      />

      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{t(currentMeta.title)}</h2>
          <p className="text-xs text-slate-500">{t(currentMeta.subtitle)}</p>
        </div>

        {activeSubItem !== 'fee-collection' && (
          <button
            onClick={() => setActiveNav('student-fees', 'fee-collection')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            <span>{t('Open Fee Collection Desk')}</span>
          </button>
        )}
      </div>

      {/* Summary Stat Cards */}
      {activeSubItem !== 'fee-collection' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t('Total Billed Fees')}
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                ৳{viewTotals.totalBilled.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {viewTotals.count} {t('records')}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              {t('Total Fee Collected (Paid)')}
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-emerald-950 tabular-nums">
                ৳{viewTotals.totalCollected.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-700 font-medium">{t('Actual Money In')}</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              {t('Outstanding Dues')}
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-amber-950 tabular-nums">
                ৳{viewTotals.totalDue.toLocaleString()}
              </span>
              <span className="text-xs text-amber-700 font-medium">{t('To be collected')}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEE COLLECTION DESK FORM */}
      {activeSubItem === 'fee-collection' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-600" />
                <span>{t('Fee Collection Form')}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Collect and record fees directly into Cloud Firestore for existing students')}
              </p>
            </div>
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {t('Status')}: {t(calculatedStatus)}
            </span>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{t(formError)}</span>
            </div>
          )}

          <form onSubmit={handleCollectSubmit} className="space-y-5">
            {/* Student Selection & Auto-populated profile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5">
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  {t('Select Registered Student')} <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={collectStudentId}
                  onChange={(e) => setCollectStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="">-- {t('Choose Student from Directory')} --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id} - {s.className})
                    </option>
                  ))}
                </select>
                {students.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    {t('No students found.')}
                  </p>
                )}
              </div>

              {/* Automatically Populated Student Info Card */}
              <div className="lg:col-span-7 rounded-lg bg-slate-50 p-3.5 border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {t('Auto-Populated Student Details')}
                </div>
                {selectedStudent ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('Student ID')}</span>
                      <strong className="font-mono text-emerald-800">{selectedStudent.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('Student Name')}</span>
                      <strong className="text-slate-900 truncate block">{selectedStudent.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('Class')}</span>
                      <strong className="text-slate-800">{selectedStudent.className}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('Section')}</span>
                      <strong className="text-slate-800">{selectedStudent.section || 'A'}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {t('Select a student on the left to automatically populate details.')}
                  </p>
                )}
              </div>
            </div>

            {/* Fee Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs pt-3 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Fee Type')} <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={collectFeeType}
                  onChange={(e) => setCollectFeeType(e.target.value as FeeType)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-medium"
                >
                  <option value="Monthly Fee">{t('Monthly Fee')}</option>
                  <option value="Admission Fee">{t('Admission Fee')}</option>
                  <option value="Other Fee">{t('Other Fee')}</option>
                </select>
              </div>

              {/* Conditional: Month for Monthly Fee */}
              {collectFeeType === 'Monthly Fee' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('Fee Month / Period')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={collectMonth}
                    onChange={(e) => setCollectMonth(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional: Subcategory for Other Fee */}
              {collectFeeType === 'Other Fee' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('Fee Category')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={collectCategory}
                    onChange={(e) => setCollectCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    {OTHER_FEE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {t(c)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Payment Date')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Payment Method')} <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Cash">{t('Cash')}</option>
                  <option value="Bank">{t('Bank')}</option>
                  <option value="Mobile Banking">{t('Mobile Banking')}</option>
                  <option value="Other">{t('Other')}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Total Amount')} (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  placeholder="Total fee bill"
                  value={totalAmount}
                  onChange={(e) =>
                    setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Paid Amount')} (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={typeof totalAmount === 'number' ? totalAmount : undefined}
                  step="any"
                  placeholder="Actual money received"
                  value={paidAmount}
                  onChange={(e) =>
                    setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-mono font-semibold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Due Amount')} (৳)
                </label>
                <input
                  type="text"
                  disabled
                  value={`৳${calculatedDue}`}
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-xs text-amber-800 font-mono font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                {t('Transaction Note / Remarks')}
              </label>
              <input
                type="text"
                placeholder="e.g. Bank slip #4829 or Cash received by Office Assistant"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setTotalAmount(100);
                  setPaidAmount(100);
                  setNote('');
                  setFormError(null);
                }}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t('Reset Form')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedStudent}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isSubmitting ? t('Saving...') : t('Save & Record Fee')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. LIST TABLE FOR MONTHLY, ADMISSION, OTHER, DUE FEES */}
      {activeSubItem !== 'fee-collection' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={t('Search by Student ID, Student Name, Father Name...')}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500">{t('Class')}:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="All">{t('All Classes')}</option>
                  {uniqueClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Filter on Monthly Fees */}
              {activeSubItem === 'monthly-fees' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500">{t('Month')}:</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="All">{t('All Months')}</option>
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Fee Type Filter on Due Fees */}
              {activeSubItem === 'due-fees' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500">{t('Fee Type')}:</span>
                  <select
                    value={selectedFeeType}
                    onChange={(e) => setSelectedFeeType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="All">{t('All Types')}</option>
                    <option value="Monthly Fee">{t('Monthly Fee')}</option>
                    <option value="Admission Fee">{t('Admission Fee')}</option>
                    <option value="Other Fee">{t('Other Fee')}</option>
                  </select>
                </div>
              )}

              {/* Status Filter (on monthly, admission, other) */}
              {activeSubItem !== 'due-fees' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500">{t('Status')}:</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="All">{t('All Status')}</option>
                    <option value="Paid">{t('Paid')}</option>
                    <option value="Partial">{t('Partial')}</option>
                    <option value="Due">{t('Due')}</option>
                  </select>
                </div>
              )}

              {(localSearch ||
                selectedClass !== 'All' ||
                selectedStatus !== 'All' ||
                selectedFeeType !== 'All' ||
                selectedMonth !== 'All') && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setSelectedClass('All');
                    setSelectedStatus('All');
                    setSelectedFeeType('All');
                    setSelectedMonth('All');
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  title={t('Reset')}
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t('Reset')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">{t('Student ID')}</th>
                    <th className="px-5 py-3.5">{t('Student Name')}</th>
                    <th className="px-5 py-3.5">{t('Class')}</th>

                    {activeSubItem === 'monthly-fees' && (
                      <th className="px-5 py-3.5">{t('Fee Month')}</th>
                    )}
                    {activeSubItem === 'admission-fees' && (
                      <th className="px-5 py-3.5">{t('Admission Date')}</th>
                    )}
                    {activeSubItem === 'other-fees' && (
                      <th className="px-5 py-3.5">{t('Fee Category')}</th>
                    )}
                    {activeSubItem === 'due-fees' && (
                      <th className="px-5 py-3.5">{t('Fee Type')}</th>
                    )}

                    <th className="px-5 py-3.5 text-right">{t('Total Amount')}</th>
                    <th className="px-5 py-3.5 text-right">{t('Paid Amount')}</th>
                    <th className="px-5 py-3.5 text-right">{t('Due Amount')}</th>
                    <th className="px-5 py-3.5 text-center">{t('Status')}</th>
                    <th className="px-5 py-3.5">
                      {activeSubItem === 'due-fees' ? t('Last Payment') : t('Payment Date')}
                    </th>
                    <th className="px-5 py-3.5 text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feesLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={10} className="px-5 py-4">
                          <div className="h-4 bg-slate-100 rounded w-full"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredFees.length > 0 ? (
                    filteredFees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono font-semibold text-emerald-800">
                          {fee.studentId}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-900">
                          {fee.studentName}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                          {fee.className}
                        </td>

                        {activeSubItem === 'monthly-fees' && (
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                            {fee.month || 'Monthly'}
                          </td>
                        )}
                        {activeSubItem === 'admission-fees' && (
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono">
                            {fee.paymentDate || fee.lastPaymentDate}
                          </td>
                        )}
                        {activeSubItem === 'other-fees' && (
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-800 font-medium">
                            {fee.category || fee.feeType}
                          </td>
                        )}
                        {activeSubItem === 'due-fees' && (
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-800 font-medium">
                            {fee.feeType}
                          </td>
                        )}

                        <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono font-medium text-slate-800 tabular-nums">
                          ৳{fee.totalFee}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono font-semibold text-emerald-700 tabular-nums">
                          ৳{fee.paid}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono font-semibold text-amber-700 tabular-nums">
                          ৳{fee.due}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap text-center">
                          <span
                            className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(
                              fee.status
                            )}`}
                          >
                            {fee.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono">
                          {fee.paymentDate || fee.lastPaymentDate || '-'}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* In Due Fees: "Collect Fee" button */}
                            {activeSubItem === 'due-fees' && (
                              <button
                                onClick={() => {
                                  setCollectStudentId(fee.studentId);
                                  setCollectFeeType(
                                    (fee.feeType as FeeType) || 'Monthly Fee'
                                  );
                                  setTotalAmount(fee.due);
                                  setPaidAmount(fee.due);
                                  setActiveNav('student-fees', 'fee-collection');
                                }}
                                className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                              >
                                <span>{t('Collect Fee')}</span>
                              </button>
                            )}

                            {/* View Receipt */}
                            <button
                              onClick={() => setViewingReceipt(fee)}
                              title={t('Print Receipt')}
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                            >
                              <Receipt className="h-4 w-4" />
                            </button>

                            {/* Edit Fee */}
                            <button
                              onClick={() => {
                                setEditFormError(null);
                                setEditingFee({ ...fee });
                              }}
                              title={t('Edit Fee Record')}
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            {/* Delete Fee */}
                            <button
                              onClick={() => setDeletingFee(fee)}
                              title={t('Delete Fee Record')}
                              className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-14 text-center text-slate-400">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                          <Receipt className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          {activeSubItem === 'due-fees'
                            ? t('No outstanding due fees found.')
                            : t('No fee records found in Firestore.')}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activeSubItem === 'due-fees'
                            ? t('All student accounts are currently settled with zero balance.')
                            : t('Click "Open Fee Collection Desk" above to record a new fee payment.')}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. EDIT FEE MODAL */}
      {editingFee && (
        <Modal
          isOpen={!!editingFee}
          onClose={() => setEditingFee(null)}
          title={t('Edit Fee Transaction')}
          subtitle={`${t('Receipt')} #${editingFee.id}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEditFee} className="space-y-4">
            {editFormError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{t(editFormError)}</span>
              </div>
            )}

            <div className="rounded-lg bg-slate-50 p-3 text-xs border border-slate-200 space-y-1">
              <p className="text-slate-500">
                {t('Student')}:{' '}
                <strong className="text-slate-900">{editingFee.studentName}</strong> (
                <span className="font-mono text-emerald-800">{editingFee.studentId}</span>)
              </p>
              <p className="text-slate-500">
                {t('Class')}: <strong className="text-slate-800">{editingFee.className}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Fee Type')}</label>
                <select
                  value={editingFee.feeType}
                  onChange={(e) => setEditingFee({ ...editingFee, feeType: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:border-emerald-600 focus:outline-hidden font-medium"
                >
                  <option value="Monthly Fee">{t('Monthly Fee')}</option>
                  <option value="Admission Fee">{t('Admission Fee')}</option>
                  <option value="Other Fee">{t('Other Fee')}</option>
                </select>
              </div>

              {editingFee.feeType === 'Monthly Fee' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('Fee Month')}</label>
                  <select
                    value={editingFee.month || 'October 2026'}
                    onChange={(e) => setEditingFee({ ...editingFee, month: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('Fee Category')}</label>
                  <input
                    type="text"
                    value={editingFee.category || ''}
                    onChange={(e) => setEditingFee({ ...editingFee, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Total Amount')} (৳)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={editingFee.totalFee}
                  onChange={(e) =>
                    setEditingFee({
                      ...editingFee,
                      totalFee: Number(e.target.value),
                      due: Math.max(0, Number(e.target.value) - editingFee.paid),
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Paid Amount')} (৳)</label>
                <input
                  type="number"
                  min={0}
                  max={editingFee.totalFee}
                  required
                  value={editingFee.paid}
                  onChange={(e) =>
                    setEditingFee({
                      ...editingFee,
                      paid: Number(e.target.value),
                      due: Math.max(0, editingFee.totalFee - Number(e.target.value)),
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-600 focus:outline-hidden font-mono text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Payment Date')}</label>
                <input
                  type="date"
                  required
                  value={editingFee.lastPaymentDate}
                  onChange={(e) =>
                    setEditingFee({ ...editingFee, lastPaymentDate: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Payment Method')}</label>
                <select
                  value={editingFee.paymentMethod || 'Cash'}
                  onChange={(e) =>
                    setEditingFee({ ...editingFee, paymentMethod: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Cash">{t('Cash')}</option>
                  <option value="Bank">{t('Bank')}</option>
                  <option value="Mobile Banking">{t('Mobile Banking')}</option>
                  <option value="Other">{t('Other')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">{t('Transaction Note / Remarks')}</label>
              <input
                type="text"
                value={editingFee.note || ''}
                onChange={(e) => setEditingFee({ ...editingFee, note: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-900 border border-amber-200 flex justify-between items-center font-medium">
              <span>{t('Due Amount')}: ৳{Math.max(0, editingFee.totalFee - editingFee.paid)}</span>
              <span>
                {t('Status')}:{' '}
                {editingFee.paid >= editingFee.totalFee
                  ? t('Paid')
                  : editingFee.paid > 0
                  ? t('Partial')
                  : t('Due')}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingFee(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? t('Saving...') : t('Save Changes')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. DELETE FEE CONFIRMATION MODAL */}
      {deletingFee && (
        <Modal
          isOpen={!!deletingFee}
          onClose={() => setDeletingFee(null)}
          title={t('Delete Fee Transaction')}
          subtitle={t('Confirm deletion from Google Cloud Firestore')}
          isDestructive={true}
          maxWidth="md"
          footer={
            <>
              <button
                onClick={() => setDeletingFee(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? t('Deleting...') : t('Confirm Delete')}
              </button>
            </>
          }
        >
          <div className="text-xs text-slate-600 space-y-3">
            <p className="text-slate-800">
              {t('Are you sure you want to delete this fee transaction?')}
            </p>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Student Name')}:</span>
                <strong className="text-slate-900">{deletingFee.studentName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Fee Type')}:</span>
                <strong className="text-slate-900">{t(deletingFee.feeType)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Total Amount')}:</span>
                <strong className="font-mono text-slate-900">৳{deletingFee.totalFee}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Receipt')} #{deletingFee.id}</span>
              </div>
            </div>
            <p className="text-rose-600 text-[11px]">
              {t('This document will be deleted from the Firestore collection')} <code className="font-mono">studentFees/{deletingFee.id}</code>. {t('This action cannot be undone.')}
            </p>
          </div>
        </Modal>
      )}

      {/* 6. RECEIPT INVOICE MODAL */}
      {viewingReceipt && (
        <Modal
          isOpen={!!viewingReceipt}
          onClose={() => setViewingReceipt(null)}
          title={t('Official Student Fee Receipt')}
          subtitle={`${t('Voucher')} #${viewingReceipt.id}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{t('Print Receipt')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                {t('Close')}
              </button>
            </div>
          }
        >
          <div className="space-y-4 p-2 text-xs">
            {/* Madrasa Letterhead Header */}
            <div className="text-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                {madrasaInfo.name || t('Madrasa Office')}
              </h3>
              <p className="text-[11px] text-slate-500">{madrasaInfo.address || t('Office Management')}</p>
              <span className="inline-block mt-1 font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {t('Receipt')} #{viewingReceipt.id}
              </span>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-slate-50 p-2">
                <span className="text-slate-400 block text-[10px]">{t('Student Name')}</span>
                <strong className="text-slate-900 font-semibold">{viewingReceipt.studentName}</strong>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <span className="text-slate-400 block text-[10px]">{t('Student ID')}</span>
                <strong className="font-mono text-emerald-800">{viewingReceipt.studentId}</strong>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <span className="text-slate-400 block text-[10px]">{t('Class & Section')}</span>
                <strong className="text-slate-800">
                  {viewingReceipt.className} ({t('Section')} {viewingReceipt.section || 'A'})
                </strong>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <span className="text-slate-400 block text-[10px]">{t('Payment Date')}</span>
                <strong className="font-mono text-slate-800">
                  {viewingReceipt.paymentDate || viewingReceipt.lastPaymentDate}
                </strong>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">{t('Description')}</th>
                    <th className="py-2 px-3 text-right">{t('Amount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-900">{t(viewingReceipt.feeType)}</p>
                      {viewingReceipt.month && (
                        <p className="text-[11px] text-slate-500">{t('Month')}: {viewingReceipt.month}</p>
                      )}
                      {viewingReceipt.category && (
                        <p className="text-[11px] text-slate-500">{t('Category')}: {t(viewingReceipt.category)}</p>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ৳{viewingReceipt.totalFee}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50/70 border-t border-slate-200 font-medium">
                  <tr>
                    <td className="py-1.5 px-3 text-slate-600">{t('Total Billed')}:</td>
                    <td className="py-1.5 px-3 text-right font-mono tabular-nums">
                      ৳{viewingReceipt.totalFee}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-emerald-800 font-semibold">{t('Amount Paid')}:</td>
                    <td className="py-1.5 px-3 text-right font-mono font-bold text-emerald-800 tabular-nums">
                      ৳{viewingReceipt.paid}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-amber-800 font-semibold">{t('Remaining Due')}:</td>
                    <td className="py-1.5 px-3 text-right font-mono font-bold text-amber-800 tabular-nums">
                      ৳{viewingReceipt.due}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>{t('Payment Method')}: {t(viewingReceipt.paymentMethod || 'Cash')}</span>
              <span className={`px-2 py-0.5 rounded font-semibold border ${getStatusBadge(viewingReceipt.status)}`}>
                {t('Status')}: {t(viewingReceipt.status)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
