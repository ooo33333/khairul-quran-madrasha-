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
  'জানুয়ারি ২০২৬',
  'ফেব্রুয়ারি ২০২৬',
  'মার্চ ২০২৬',
  'এপ্রিল ২০২৬',
  'মে ২০২৬',
  'জুন ২০২৬',
  'জুলাই ২০২৬',
  'আগস্ট ২০২৬',
  'সেপ্টেম্বর ২০২৬',
  'অক্টোবর ২০২৬',
  'নভেম্বর ২০২৬',
  'ডিসেম্বর ২০২৬',
];

const OTHER_FEE_CATEGORIES = [
  'পরীক্ষা ফি',
  'ফর্ম ফি',
  'আইডি কার্ড ফি',
  'সনদপত্র ফি',
  'অন্যান্য',
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
    updateFeeStatus,
    deleteFeePayment,
    searchQuery,
    prefillFeeStudentId,
    setPrefillFeeStudentId,
    classes,
    madrasaInfo,
    t,
  } = useApp();

  // Due Collection Modal State
  const [collectingDueFee, setCollectingDueFee] = useState<FeeRecord | null>(null);
  const [duePayAmount, setDuePayAmount] = useState<number | ''>(0);
  const [isCollectingDue, setIsCollectingDue] = useState(false);
  const [dueModalError, setDueModalError] = useState<string | null>(null);

  const [localSearch, setLocalSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedFeeType, setSelectedFeeType] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Interactive Fee Collection Form State
  const [collectStudentId, setCollectStudentId] = useState('');
  const [collectFeeType, setCollectFeeType] = useState<FeeType>('Monthly Fee');
  const [collectCategory, setCollectCategory] = useState('পরীক্ষা ফি');
  const [collectMonth, setCollectMonth] = useState('অক্টোবর ২০২৬');
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
      if (activeSubItem === 'monthly-fees' && fee.feeType !== 'Monthly Fee') return false;
      if (activeSubItem === 'admission-fees' && fee.feeType !== 'Admission Fee') return false;
      if (activeSubItem === 'other-fees' && fee.feeType !== 'Other Fee' && fee.feeType !== 'Other') return false;
      if (activeSubItem === 'due-fees' && (fee.due <= 0 && fee.status === 'Paid')) return false;

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

      if (selectedClass !== 'All' && fee.className !== selectedClass) {
        return false;
      }

      if (selectedStatus !== 'All' && fee.status !== selectedStatus) {
        return false;
      }

      if (selectedFeeType !== 'All' && fee.feeType !== selectedFeeType) {
        return false;
      }

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
      title: 'মাসিক ফি',
      subtitle: 'শ্রেণীভিত্তিক মাসিক টিউশন ফি বিলিং এবং আদায়ের অবস্থা',
    },
    'admission-fees': {
      title: 'ভর্তি ফি',
      subtitle: 'সেশন এনরোলমেন্ট এবং এককালীন ভর্তি ফি রসিদ',
    },
    'other-fees': {
      title: 'অন্যান্য ফি',
      subtitle: 'পরীক্ষা, ফর্ম, আইডি কার্ড এবং আনুষঙ্গিক ফি সংগ্রহ',
    },
    'fee-collection': {
      title: 'ফি আদায় ডেস্ক',
      subtitle: 'শিক্ষার্থী ফি রসিদ প্রসেস করুন, রিয়েল-টাইম পেমেন্ট রেকর্ড করুন এবং ইনভয়েস প্রিন্ট করুন',
    },
    'due-fees': {
      title: 'বকেয়া ফি খাতা',
      subtitle: 'বকেয়া ফি ব্যালেন্স যা সংগ্রহ এবং নিষ্পত্তি করা প্রয়োজন',
    },
    'teacher-recruitment': { title: '', subtitle: '' },
    'student-list': { title: '', subtitle: '' },
    'student-admission': { title: '', subtitle: '' },
    'student-information': { title: '', subtitle: '' },
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
    'yearly-monthly-daily': { title: '', subtitle: '' },
    'exam-marks': { title: '', subtitle: '' },
    'report-cards': { title: '', subtitle: '' },
    'madrasa-information': { title: '', subtitle: '' },
    'user-management': { title: '', subtitle: '' },
    'academic-year': { title: '', subtitle: '' },
    classes: { title: '', subtitle: '' },
    'account-categories': { title: '', subtitle: '' },
    'login-logout': { title: '', subtitle: '' },
    'reset-website-data': { title: '', subtitle: '' },
    'refresh-reload': { title: '', subtitle: '' },
    'system-restart-reboot': { title: '', subtitle: '' },
    'data-backup': { title: '', subtitle: '' },
  };

  const currentMeta = subPageTitles[activeSubItem] || {
    title: 'শিক্ষার্থী ফি',
    subtitle: 'ফি সময়সূচী, সংগ্রহ এবং ব্যালেন্স পরিচালনা করুন',
  };

  // Handle Fee Collection Form Submission
  const handleCollectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedStudent) {
      setFormError('দয়া করে তালিকা থেকে একজন শিক্ষার্থী নির্বাচন করুন।');
      return;
    }
    if (!collectFeeType) {
      setFormError('ফি এর ধরণ আবশ্যক।');
      return;
    }

    const total = typeof totalAmount === 'number' ? totalAmount : 0;
    const paid = typeof paidAmount === 'number' ? paidAmount : 0;

    if (total <= 0) {
      setFormError('মোট পরিমাণ শূন্য বা ঋণাত্মক হতে পারবে না।');
      return;
    }
    if (paid < 0) {
      setFormError('পরিশোধিত পরিমাণ ঋণাত্মক হতে পারবে না।');
      return;
    }
    if (paid > total) {
      setFormError('পরিশোধিত পরিমাণ মোট পরিমাণের চেয়ে বেশি হতে পারবে না।');
      return;
    }
    if (!paymentDate) {
      setFormError('পেমেন্টের তারিখ আবশ্যক।');
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

      setViewingReceipt(createdRecord);
      setPaidAmount(total);
      setNote('');
    } catch (err: any) {
      console.error('Error recording fee:', err);
      setFormError(err.message || 'ফায়ারস্টোরে ফি সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEditFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;
    setEditFormError(null);

    const total = Number(editingFee.totalFee) || 0;
    const paid = Number(editingFee.paid) || 0;

    if (total <= 0) {
      setEditFormError('মোট পরিমাণ শূন্য হতে পারবে না।');
      return;
    }
    if (paid < 0) {
      setEditFormError('পরিশোধিত পরিমাণ ঋণাত্মক হতে পারবে না।');
      return;
    }
    if (paid > total) {
      setEditFormError('পরিশোধিত পরিমাণ মোট পরিমাণের চেয়ে বেশি হতে পারবে না।');
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
      setEditFormError(err.message || 'ফি রেকর্ড আপডেট করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsUpdating(false);
    }
  };

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

  const handleDueCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingDueFee) return;
    setDueModalError(null);

    const amountToPay = typeof duePayAmount === 'number' ? duePayAmount : 0;
    if (amountToPay <= 0) {
      setDueModalError('আদায়কৃত পরিমাণ শূন্য বা ঋণাত্মক হতে পারবে না।');
      return;
    }
    if (amountToPay > collectingDueFee.due) {
      setDueModalError('আদায়কৃত পরিমাণ বকেয়া পরিমাণের চেয়ে বেশি হতে পারবে না।');
      return;
    }

    setIsCollectingDue(true);
    try {
      await updateFeeStatus(collectingDueFee.id, amountToPay);
      const updatedRecord = fees.find((f) => f.id === collectingDueFee.id);
      const receiptTarget = updatedRecord
        ? { ...updatedRecord }
        : {
            ...collectingDueFee,
            paid: collectingDueFee.paid + amountToPay,
            due: Math.max(0, collectingDueFee.due - amountToPay),
            status: (collectingDueFee.paid + amountToPay) >= collectingDueFee.totalFee ? 'Paid' : ('Partial' as FeeStatus),
          };
      setCollectingDueFee(null);
      setViewingReceipt(receiptTarget as FeeRecord);
    } catch (err: any) {
      console.error('Due collection error:', err);
      setDueModalError(err.message || 'বকেয়া আদায় রেকর্ড করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsCollectingDue(false);
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

  const translateStatus = (st?: string) => {
    if (!st) return '';
    if (st === 'Paid') return 'পরিশোধিত';
    if (st === 'Partial') return 'আংশিক';
    if (st === 'Due') return 'বকেয়া';
    return st;
  };

  const translateFeeType = (ft?: string) => {
    if (!ft) return '';
    if (ft === 'Monthly Fee') return 'মাসিক ফি';
    if (ft === 'Admission Fee') return 'ভর্তি ফি';
    if (ft === 'Other Fee') return 'অন্যান্য ফি';
    return ft;
  };

  const translatePaymentMethod = (pm?: string) => {
    if (!pm) return '';
    if (pm === 'Cash') return 'নগদ';
    if (pm === 'Bank') return 'ব্যাংক';
    if (pm === 'Mobile Banking') return 'মোবাইল ব্যাংকিং';
    if (pm === 'Other') return 'অন্যান্য';
    return pm;
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="শিক্ষার্থী ফি"
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

        {/* Quick Actions / Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {activeSubItem !== 'fee-collection' ? (
            <button
              onClick={() => setActiveNav('student-fees', 'fee-collection')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>নতুন ফি আদায় ডেস্ক</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveNav('student-fees', 'monthly-fees')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
            >
              <Receipt className="h-4 w-4 text-emerald-700" />
              <span>মাসিক ফি তালিকা দেখুন</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">মোট বিলকৃত</span>
            <p className="text-xl font-black text-slate-900 font-mono mt-1">
              ৳{viewTotals.totalBilled.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{viewTotals.count} টি রেকর্ড</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold">
            📊
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">সংগৃহীত</span>
            <p className="text-xl font-black text-emerald-700 font-mono mt-1">
              ৳{viewTotals.totalCollected.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-600 mt-0.5 block">সফল আদায়</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
            ✅
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">বকেয়া পাওনা</span>
            <p className="text-xl font-black text-rose-700 font-mono mt-1">
              ৳{viewTotals.totalDue.toLocaleString()}
            </p>
            <span className="text-[11px] text-rose-600 mt-0.5 block">অনাদায়ী পরিমাণ</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-700 font-bold">
            ⚠️
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">আদায়ের হার</span>
            <p className="text-xl font-black text-indigo-700 font-mono mt-1">
              {viewTotals.totalBilled > 0
                ? `${Math.round((viewTotals.totalCollected / viewTotals.totalBilled) * 100)}%`
                : '0%'}
            </p>
            <span className="text-[11px] text-indigo-600 mt-0.5 block">কার্যকারিতা</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold">
            📈
          </div>
        </div>
      </div>

      {/* 2. FEE COLLECTION DESK FORM */}
      {activeSubItem === 'fee-collection' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-700" />
              <span>ফি আদায় ডেস্ক ও রসিদ তৈরি</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              শিক্ষার্থীর আইডি বা নাম সিলেক্ট করে তাৎক্ষণিকভাবে ফি রসিদ প্রিন্ট করুন এবং ফায়ারস্টোরে সংরক্ষণ করুন।
            </p>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCollectSubmit} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5">
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  শিক্ষার্থী নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={collectStudentId}
                  onChange={(e) => setCollectStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="">-- ডিরেক্টরি থেকে শিক্ষার্থী বেছে নিন --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id} - {s.className})
                    </option>
                  ))}
                </select>
                {students.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    কোনো শিক্ষার্থী পাওয়া যায়নি।
                  </p>
                )}
              </div>

              {/* Automatically Populated Student Info Card */}
              <div className="lg:col-span-7 rounded-lg bg-slate-50 p-3.5 border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  স্বয়ংক্রিয়ভাবে পূরণকৃত শিক্ষার্থীর বিবরণ
                </div>
                {selectedStudent ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">শিক্ষার্থী আইডি</span>
                      <strong className="font-mono text-emerald-800">{selectedStudent.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">শিক্ষার্থীর নাম</span>
                      <strong className="text-slate-900 truncate block">{selectedStudent.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">শ্রেণী</span>
                      <strong className="text-slate-800">{selectedStudent.className}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">সেকশন</span>
                      <strong className="text-slate-800">{selectedStudent.section || 'A'}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    বিবরণ স্বয়ংক্রিয়ভাবে দেখতে বাম দিক থেকে একজন শিক্ষার্থী নির্বাচন করুন।
                  </p>
                )}
              </div>
            </div>

            {/* Fee Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs pt-3 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ফি এর ধরণ <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={collectFeeType}
                  onChange={(e) => setCollectFeeType(e.target.value as FeeType)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-medium"
                >
                  <option value="Monthly Fee">মাসিক ফি (Monthly Fee)</option>
                  <option value="Admission Fee">ভর্তি ফি (Admission Fee)</option>
                  <option value="Other Fee">অন্যান্য ফি (Other Fee)</option>
                </select>
              </div>

              {/* Conditional: Month for Monthly Fee */}
              {collectFeeType === 'Monthly Fee' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ফি এর মাস / সময়কাল <span className="text-rose-500">*</span>
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
                    ফি ক্যাটাগরি <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={collectCategory}
                    onChange={(e) => setCollectCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    {OTHER_FEE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  পেমেন্টের তারিখ <span className="text-rose-500">*</span>
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
                  পেমেন্ট মাধ্যম <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Cash">নগদ (Cash)</option>
                  <option value="Bank">ব্যাংক (Bank)</option>
                  <option value="Mobile Banking">মোবাইল ব্যাংকিং (Mobile Banking)</option>
                  <option value="Other">অন্যান্য (Other)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  মোট পরিমাণ (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  placeholder="মোট ফি বিল"
                  value={totalAmount}
                  onChange={(e) =>
                    setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  পরিশোধিত পরিমাণ (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={typeof totalAmount === 'number' ? totalAmount : undefined}
                  step="any"
                  placeholder="প্রকৃত প্রাপ্ত টাকা"
                  value={paidAmount}
                  onChange={(e) =>
                    setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-mono font-semibold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  বকেয়া পরিমাণ (৳)
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
                লেনদেনের নোট / মন্তব্য
              </label>
              <input
                type="text"
                placeholder="যেমন: ব্যাংক স্লিপ নং বা অফিস সহকারীর নাম"
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
                ফর্ম রিসেট করুন
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedStudent}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ ও ফি রেকর্ড করুন'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. LIST TABLE FOR MONTHLY, ADMISSION, OTHER, DUE FEES */}
      {activeSubItem !== 'fee-collection' && (
        <div className="space-y-4">
          {/* Informative Banner for Due Fees */}
          {activeSubItem === 'due-fees' && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-amber-950 text-sm">বকেয়া ফি আদায় করার নিয়মাবলী:</h4>
                <p>
                  ১. কোনো শিক্ষার্থীর বকেয়া ফি আদায় করতে হলে নিচের তালিকা থেকে ঐ শিক্ষার্থীর নামের পাশে থাকা <strong className="text-emerald-800">"বকেয়া আদায়"</strong> (Dollar icon) বাটনে ক্লিক করুন।
                </p>
                <p>
                  ২. পপআপ উইন্ডোতে পরিশোধিত পরিমাণ লিখে নিশ্চিত করলেই বকেয়া টাকা স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে এবং মোট বকেয়া ও স্ট্যাটাস আপডেট হয়ে যাবে।
                </p>
                <p>
                  ৩. এছাড়াও আপনি চাইলে উপরে <strong className="text-emerald-800">"নতুন ফি আদায় ডেস্ক"</strong> থেকে যেকোনো নতুন ফি এন্ট্রি করার সময়ও আংশিক বা পূর্ণ পেমেন্ট নিতে পারেন।
                </p>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="শিক্ষার্থী আইডি, নাম বা পিতার নাম দিয়ে খুঁজুন..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500">শ্রেণী:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="All">সকল শ্রেণী</option>
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
                  <span className="text-[11px] font-medium text-slate-500">মাস:</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="All">সকল মাস</option>
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
                  <span className="text-[11px] font-medium text-slate-500">ফি এর ধরণ:</span>
                  <select
                    value={selectedFeeType}
                    onChange={(e) => setSelectedFeeType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="All">সকল ধরণ</option>
                    <option value="Monthly Fee">মাসিক ফি</option>
                    <option value="Admission Fee">ভর্তি ফি</option>
                    <option value="Other Fee">অন্যান্য ফি</option>
                  </select>
                </div>
              )}

              {/* Status Filter (on monthly, admission, other) */}
              {activeSubItem !== 'due-fees' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500">স্ট্যাটাস:</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="All">সকল স্ট্যাটাস</option>
                    <option value="Paid">পরিশোধিত</option>
                    <option value="Partial">আংশিক</option>
                    <option value="Due">বকেয়া</option>
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
                  title="রিসেট"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>রিসেট</span>
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
                    <th className="px-5 py-3.5">শিক্ষার্থী আইডি</th>
                    <th className="px-5 py-3.5">শিক্ষার্থীর নাম</th>
                    <th className="px-5 py-3.5">শ্রেণী</th>

                    {activeSubItem === 'monthly-fees' && (
                      <th className="px-5 py-3.5">ফি এর মাস</th>
                    )}
                    {activeSubItem === 'admission-fees' && (
                      <th className="px-5 py-3.5">ভর্তির তারিখ</th>
                    )}
                    {activeSubItem === 'other-fees' && (
                      <th className="px-5 py-3.5">ফি ক্যাটাগরি</th>
                    )}
                    {activeSubItem === 'due-fees' && (
                      <th className="px-5 py-3.5">ফি এর ধরণ</th>
                    )}

                    <th className="px-5 py-3.5 text-right">মোট পরিমাণ (৳)</th>
                    <th className="px-5 py-3.5 text-right">পরিশোধিত (৳)</th>
                    <th className="px-5 py-3.5 text-right">বকেয়া (৳)</th>
                    <th className="px-5 py-3.5 text-center">স্ট্যাটাস</th>
                    <th className="px-5 py-3.5">
                      {activeSubItem === 'due-fees' ? 'শেষ পেমেন্ট' : 'পেমেন্টের তারিখ'}
                    </th>
                    <th className="px-5 py-3.5 text-right">কার্যক্রম</th>
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
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                            {fee.month || '-'}
                          </td>
                        )}
                        {activeSubItem === 'admission-fees' && (
                          <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-600">
                            {fee.lastPaymentDate || '-'}
                          </td>
                        )}
                        {activeSubItem === 'other-fees' && (
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                            {fee.category || fee.feeType}
                          </td>
                        )}
                        {activeSubItem === 'due-fees' && (
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                            {translateFeeType(fee.feeType)}
                          </td>
                        )}

                        <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono font-bold text-slate-900">
                          ৳{fee.totalFee.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono font-bold text-emerald-700">
                          ৳{fee.paid.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono font-bold text-rose-700">
                          ৳{fee.due.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-center">
                          <span
                            className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(
                              fee.status
                            )}`}
                          >
                            {translateStatus(fee.status)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-500">
                          {fee.lastPaymentDate}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {fee.due > 0 && (
                              <button
                                onClick={() => {
                                  setCollectingDueFee(fee);
                                  setDuePayAmount(fee.due);
                                  setDueModalError(null);
                                }}
                                title="বকেয়া আদায় করুন"
                                className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-200 transition-colors shadow-2xs"
                              >
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>বকেয়া আদায়</span>
                              </button>
                            )}
                            <button
                              onClick={() => setViewingReceipt(fee)}
                              title="রসিদ দেখুন ও প্রিন্ট করুন"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                            >
                              <Receipt className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingFee(fee);
                              }}
                              title="সম্পাদনা করুন"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingFee(fee)}
                              title="মুছে ফেলুন"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
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
                          <Receipt className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600">এই ভিউতে কোনো ফি রেকর্ড পাওয়া যায়নি</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">নতুন ফি রসিদ তৈরি করতে উপরের "নতুন ফি আদায় ডেস্ক" বোতামে ক্লিক করুন।</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECEIPT MODAL */}
      {viewingReceipt && (
        <Modal
          isOpen={!!viewingReceipt}
          onClose={() => setViewingReceipt(null)}
          title="ফি আদায় রসিদ (Fee Receipt)"
          subtitle="অফিস কপি ও ছাত্র কপি প্রিন্ট করুন"
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs">
            {/* Printable Receipt Area */}
            <div
              id="printable-receipt"
              className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0"
            >
              {/* Header */}
              <div className="text-center border-b border-slate-200 pb-4 space-y-1">
                <h2 className="text-base font-black text-emerald-900 font-sans">
                  {madrasaInfo?.name || 'খাইরুল কুরআন মাদ্রাসা অফিস'}
                </h2>
                <p className="text-[11px] text-slate-500">
                  {madrasaInfo?.address || 'মাদ্রাসা ভবন, ঢাকা, বাংলাদেশ'} | ফোন: {madrasaInfo?.phone || '০১৭০০০০০০০০'}
                </p>
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-full text-[11px] mt-1">
                  OFFICIAL FEE MONEY RECEIPT
                </div>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1">
                  <div>রসিদ নং: <strong className="font-mono">{viewingReceipt.id.slice(0, 10)}</strong></div>
                  <div>শিক্ষার্থীর নাম: <strong className="text-slate-900">{viewingReceipt.studentName}</strong></div>
                  <div>শিক্ষার্থী আইডি: <strong className="font-mono text-emerald-800">{viewingReceipt.studentId}</strong></div>
                  <div>শ্রেণী: <strong>{viewingReceipt.className}</strong> (সেকশন: {viewingReceipt.section || 'A'})</div>
                </div>
                <div className="space-y-1 text-right">
                  <div>তারিখ: <strong className="font-mono">{viewingReceipt.lastPaymentDate}</strong></div>
                  <div>ফি এর ধরণ: <strong>{translateFeeType(viewingReceipt.feeType)}</strong></div>
                  {viewingReceipt.month && <div>মাস: <strong>{viewingReceipt.month}</strong></div>}
                  {viewingReceipt.category && <div>ক্যাটাগরি: <strong>{viewingReceipt.category}</strong></div>}
                  <div>পেমেন্ট মাধ্যম: <strong>{translatePaymentMethod(viewingReceipt.paymentMethod)}</strong></div>
                </div>
              </div>

              {/* Table breakdown */}
              <div className="pt-3">
                <table className="w-full border-collapse border border-slate-300 text-xs text-left">
                  <thead className="bg-slate-100 font-semibold">
                    <tr>
                      <th className="border border-slate-300 px-3 py-2">বিবরণ</th>
                      <th className="border border-slate-300 px-3 py-2 text-right">পরিমাণ (৳)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2">
                        {translateFeeType(viewingReceipt.feeType)} {viewingReceipt.month ? `- ${viewingReceipt.month}` : ''}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-mono">
                        ৳{viewingReceipt.totalFee.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 font-semibold">পরিশোধিত টাকা:</td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-mono font-bold text-emerald-800">
                        ৳{viewingReceipt.paid.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 font-semibold">বকেয়া টাকা:</td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-mono font-bold text-rose-700">
                        ৳{viewingReceipt.due.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {viewingReceipt.note && (
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <strong>নোট:</strong> {viewingReceipt.note}
                </div>
              )}

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-12 text-center text-xs">
                <div className="border-t border-slate-400 pt-1">ছাত্র / অভিভাবকের স্বাক্ষর</div>
                <div className="border-t border-slate-400 pt-1">হিসাবরক্ষক / ক্যাশিয়ার</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 shadow-xs"
              >
                <Printer className="h-4 w-4" />
                <span>রসিদ প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. EDIT FEE MODAL */}
      {editingFee && (
        <Modal
          isOpen={!!editingFee}
          onClose={() => setEditingFee(null)}
          title="ফি রেকর্ড সম্পাদনা"
          subtitle="ফি বিল এবং পরিশোধিত টাকার পরিমাণ সংশোধন করুন"
          maxWidth="sm"
        >
          <form onSubmit={handleSaveEditFee} className="space-y-4 text-xs">
            {editFormError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{editFormError}</span>
              </div>
            )}

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
              <div>ছাত্র: <strong className="text-slate-900">{editingFee.studentName}</strong> ({editingFee.studentId})</div>
              <div>ফি এর ধরণ: <strong>{translateFeeType(editingFee.feeType)}</strong></div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">মোট বিলকৃত টাকা (৳) *</label>
              <input
                type="number"
                required
                min={1}
                value={editingFee.totalFee}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  setEditingFee({
                    ...editingFee,
                    totalFee: val,
                    due: Math.max(0, val - editingFee.paid),
                    status: editingFee.paid >= val ? 'Paid' : editingFee.paid > 0 ? 'Partial' : 'Due',
                  });
                }}
                className="w-full rounded-lg border border-slate-200 p-2 font-mono font-bold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">পরিশোধিত টাকা (৳) *</label>
              <input
                type="number"
                required
                min={0}
                max={editingFee.totalFee}
                value={editingFee.paid}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  setEditingFee({
                    ...editingFee,
                    paid: val,
                    due: Math.max(0, editingFee.totalFee - val),
                    status: val >= editingFee.totalFee ? 'Paid' : val > 0 ? 'Partial' : 'Due',
                  });
                }}
                className="w-full rounded-lg border border-slate-200 p-2 font-mono font-bold text-emerald-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">নোট / মন্তব্য</label>
              <input
                type="text"
                value={editingFee.note || ''}
                onChange={(e) => setEditingFee({ ...editingFee, note: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingFee(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {isUpdating ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {deletingFee && (
        <Modal
          isOpen={!!deletingFee}
          onClose={() => setDeletingFee(null)}
          title="ফি রেকর্ড মুছে ফেলুন"
          subtitle="আপনি কি নিশ্চিতভাবে এই ফি রেকর্ডটি মুছে ফেলতে চান?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">স্থায়ীভাবে মুছে ফেলা</span>
                এই রেকর্ডটি মুছে ফেললে তা ডাটাবেস থেকে স্থায়ীভাবে মুছে যাবে এবং মোট সংগৃহীত হিসাব আপডেট হবে।
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
              <div>ছাত্র: <strong className="text-slate-900">{deletingFee.studentName}</strong></div>
              <div>ফি এর ধরণ: <strong>{translateFeeType(deletingFee.feeType)}</strong></div>
              <div>পরিমাণ: <strong className="font-mono text-emerald-800">৳{deletingFee.paid.toLocaleString()}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingFee(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 7. DUE COLLECTION MODAL */}
      {collectingDueFee && (
        <Modal
          isOpen={!!collectingDueFee}
          onClose={() => setCollectingDueFee(null)}
          title="বকেয়া ফি আদায় করুন (Collect Due)"
          subtitle="শিক্ষার্থীর বকেয়া ফি জমা নিন এবং হিসাব আপডেট করুন"
          maxWidth="md"
        >
          <form onSubmit={handleDueCollectionSubmit} className="space-y-4 text-xs">
            {dueModalError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{dueModalError}</span>
              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">শিক্ষার্থী:</span>
                <strong className="text-slate-900">{collectingDueFee.studentName} ({collectingDueFee.studentId})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ফি এর ধরণ:</span>
                <strong className="text-slate-900">{translateFeeType(collectingDueFee.feeType)} {collectingDueFee.month ? `(${collectingDueFee.month})` : ''}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মোট ফি বিল:</span>
                <span className="font-mono font-bold text-slate-800">৳{collectingDueFee.totalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পূর্বে পরিশোধিত:</span>
                <span className="font-mono font-bold text-emerald-700">৳{collectingDueFee.paid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-700 font-semibold">বর্তমান বকেয়া:</span>
                <span className="font-mono font-black text-rose-700 text-sm">৳{collectingDueFee.due.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                এবার কত টাকা আদায় করছেন? (৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={collectingDueFee.due}
                step="any"
                value={duePayAmount}
                onChange={(e) =>
                  setDuePayAmount(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm font-mono font-bold text-emerald-800 focus:border-emerald-600 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                সর্বোচ্চ বকেয়া পরিমাণ: <strong className="font-mono">৳{collectingDueFee.due.toLocaleString()}</strong>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCollectingDueFee(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isCollectingDue}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                <DollarSign className="h-4 w-4" />
                <span>{isCollectingDue ? 'আদায় হচ্ছে...' : 'বকেয়া আদায় নিশ্চিত করুন'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
