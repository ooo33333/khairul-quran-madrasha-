import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  Utensils,
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Filter,
  RotateCcw,
  Edit2,
  Trash2,
  UserPlus,
  Calendar,
  CreditCard,
  User,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BoardingStudent, BoardingTransaction } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';

const ROOM_OPTIONS = ['ডরমিটরি-এ', 'ডরমিটরি-বি', 'ডরমিটরি-সি', 'ডরমিটরি-ডি', 'ভিআইপি রুম', 'সাধারণ ডরমিটরি'];
const BOARDING_STATUS_OPTIONS = ['সক্রিয় (Active)', 'নিষ্ক্রিয় (Inactive)', 'বিদায়ী (Left)'];
const PAYMENT_METHODS = ['নগদ (Cash)', 'ব্যাংক (Bank)', 'মোবাইল ব্যাংকিং (Mobile Banking)', 'অন্যান্য'];
const TRANSACTION_STATUSES = ['সম্পন্ন (Completed)', 'অপেক্ষমান (Pending)', 'বাতিল (Cancelled)'];

const FOOD_EXPENSE_CATEGORIES = [
  'চাল',
  'সবজি',
  'গোশত',
  'মাছ',
  'তেল',
  'মসলা ও মুদি',
  'গ্যাস',
  'অন্যান্য খাদ্য খরচ',
];

const OTHER_EXPENSE_CATEGORIES = [
  'বিদ্যুৎ বিল',
  'পানি বিল',
  'পরিচ্ছন্নতা',
  'মেরামত ও রক্ষণাবেক্ষণ',
  'আসবাবপত্র',
  'চিকিৎসা',
  'অন্যান্য',
];

const FEE_CATEGORIES = [
  'মাসিক বোর্ডিং ফি',
  'খাবার ফি',
  'অন্যান্য বোর্ডিং ফি',
];

export const BoardingPage: React.FC = () => {
  const {
    activeSubItem,
    setActiveNav,
    students,
    boardingStudents,
    boardingStudentsLoading,
    boardingTransactions,
    boardingTransactionsLoading,
    addBoardingStudent,
    updateBoardingStudent,
    deleteBoardingStudent,
    addBoardingTransaction,
    updateBoardingTransaction,
    deleteBoardingTransaction,
    searchQuery,
    setPrefillFeeStudentId,
    viewStudentProfile,
    t,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Transactions filters
  const [txTypeFilter, setTxTypeFilter] = useState('All');
  const [txCatFilter, setTxCatFilter] = useState('All');
  const [txStatusFilter, setTxStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<'fee' | 'foodExpense' | 'otherExpense'>('fee');

  // Add Student Form State
  const [addStudentId, setAddStudentOpenId] = useState('');
  const [addRoom, setAddRoom] = useState('ডরমিটরি-এ');
  const [addBed, setAddBed] = useState('বেড-১');
  const [addStatus, setAddStatus] = useState('সক্রিয় (Active)');
  const [addJoiningDate, setAddJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [addGuardianName, setAddGuardianName] = useState('');
  const [addGuardianPhone, setAddGuardianPhone] = useState('');
  const [addNote, setAddNote] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<BoardingStudent | null>(null);
  const [editRoom, setEditRoom] = useState('');
  const [editBed, setEditBed] = useState('');
  const [editStatusState, setEditStatus] = useState('');
  const [editJoiningDate, setEditJoiningDate] = useState('');
  const [editGuardianName, setEditGuardianName] = useState('');
  const [editGuardianPhone, setEditGuardianPhone] = useState('');
  const [editStudentNote, setEditStudentNote] = useState('');
  const [editStudentError, setEditStudentError] = useState<string | null>(null);
  const [isUpdatingStudent, setIsUpdatingStudent] = useState(false);

  // Remove Student State
  const [removingStudent, setRemovingStudent] = useState<BoardingStudent | null>(null);
  const [isRemovingStudent, setIsRemovingStudent] = useState(false);

  // Add Transaction Form State
  const [txStudentId, setTxStudentId] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txCategory, setTxCategory] = useState(FEE_CATEGORIES[0]);
  const [txDescription, setTxDescription] = useState('');
  const [txAmount, setTxAmount] = useState<number | ''>(120);
  const [txPaymentMethod, setTxPaymentMethod] = useState('নগদ (Cash)');
  const [txStatus, setTxStatus] = useState('সম্পন্ন (Completed)');
  const [txReference, setTxReference] = useState('');
  const [txNote, setTxNote] = useState('');
  const [txError, setTxError] = useState<string | null>(null);
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);

  // Edit Transaction State
  const [editingTransaction, setEditingTransaction] = useState<BoardingTransaction | null>(null);
  const [editTxDate, setEditTxDate] = useState('');
  const [editTxType, setEditTxType] = useState('');
  const [editTxCategory, setEditTxCategory] = useState('');
  const [editTxDescription, setEditTxDescription] = useState('');
  const [editTxAmount, setEditTxAmount] = useState<number | ''>('');
  const [editTxPaymentMethod, setEditTxPaymentMethod] = useState('');
  const [editTxStatus, setEditTxStatus] = useState('');
  const [editTxReference, setEditTxReference] = useState('');
  const [editTxNote, setEditTxNote] = useState('');
  const [editTxError, setEditTxError] = useState<string | null>(null);
  const [isUpdatingTx, setIsUpdatingTx] = useState(false);

  // Delete Transaction State
  const [deletingTransaction, setDeletingTransaction] = useState<BoardingTransaction | null>(null);
  const [isDeletingTx, setIsDeletingTx] = useState(false);

  const effectiveSearch = localSearch || searchQuery;

  // Selected student details for auto-populating
  const selectedStudentDetails = useMemo(() => {
    return students.find((s) => s.id === addStudentId);
  }, [students, addStudentId]);

  // Selected active boarding student details for fee collection
  const activeResidents = useMemo(() => {
    return boardingStudents.filter((b) => {
      const st = b.boardingStatus || '';
      return st.includes('Active') || st.includes('সক্রিয়') || st === 'Active';
    });
  }, [boardingStudents]);

  const selectedResidentDetails = useMemo(() => {
    return boardingStudents.find((b) => b.studentId === txStudentId);
  }, [boardingStudents, txStudentId]);

  // Accounting calculations
  const totalBoardingFees = useMemo(() => {
    return boardingTransactions
      .filter((t) => (t.status === 'Completed' || t.status?.includes('সম্পন্ন')) && t.type === 'fee')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [boardingTransactions]);

  const totalFoodExpense = useMemo(() => {
    return boardingTransactions
      .filter((t) => (t.status === 'Completed' || t.status?.includes('সম্পন্ন')) && (t.type === 'foodExpense' || t.category === 'Food Expense' || t.category === 'Kitchen Ration'))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [boardingTransactions]);

  const totalOtherExpense = useMemo(() => {
    return boardingTransactions
      .filter((t) => (t.status === 'Completed' || t.status?.includes('সম্পন্ন')) && t.type === 'otherExpense' && t.category !== 'Food Expense' && t.category !== 'Kitchen Ration')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [boardingTransactions]);

  const boardingBalance = useMemo(() => {
    return totalBoardingFees - totalFoodExpense - totalOtherExpense;
  }, [totalBoardingFees, totalFoodExpense, totalOtherExpense]);

  const totalBoardingStudentsCount = useMemo(() => {
    return boardingStudents.filter((b) => {
      const st = b.boardingStatus || '';
      return st.includes('Active') || st.includes('সক্রিয়') || st === 'Active';
    }).length;
  }, [boardingStudents]);

  // Unique Classes & Rooms for dropdown filtering
  const uniqueClasses = useMemo(() => {
    const s = new Set<string>();
    boardingStudents.forEach((b) => {
      if (b.className) s.add(b.className);
    });
    return Array.from(s);
  }, [boardingStudents]);

  const uniqueRooms = useMemo(() => {
    const s = new Set<string>();
    boardingStudents.forEach((b) => {
      if (b.room || b.roomNumber) s.add(b.room || b.roomNumber);
    });
    return Array.from(s);
  }, [boardingStudents]);

  // Filters Boarding Students
  const filteredResidents = useMemo(() => {
    return boardingStudents.filter((b) => {
      const q = effectiveSearch.trim().toLowerCase();
      if (q) {
        const studentObj = students.find((s) => s.id === b.studentId);
        const matchesId = b.studentId.toLowerCase().includes(q);
        const matchesName = (b.studentName || b.name || '').toLowerCase().includes(q);
        const matchesFather = studentObj?.fatherName?.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesFather) {
          return false;
        }
      }

      if (selectedClass !== 'All' && b.className !== selectedClass) return false;

      const bRoom = b.room || b.roomNumber;
      if (selectedRoom !== 'All' && bRoom !== selectedRoom) return false;

      const bStatus = b.boardingStatus;
      if (selectedStatus !== 'All' && !bStatus?.includes(selectedStatus)) return false;

      return true;
    });
  }, [boardingStudents, students, effectiveSearch, selectedClass, selectedRoom, selectedStatus]);

  // Filters Boarding Transactions
  const filteredTxs = useMemo(() => {
    return boardingTransactions.filter((t) => {
      if (activeSubItem === 'boarding-fees' && t.type !== 'fee') return false;
      if (activeSubItem === 'food-expense' && t.type !== 'foodExpense') return false;
      if (activeSubItem === 'other-expenses' && t.type !== 'otherExpense') return false;

      if (txTypeFilter !== 'All' && t.type !== txTypeFilter) return false;
      if (txCatFilter !== 'All' && t.category !== txCatFilter) return false;
      if (txStatusFilter !== 'All' && !t.status?.includes(txStatusFilter)) return false;

      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;

      const q = effectiveSearch.trim().toLowerCase();
      if (q) {
        const matchesId = t.studentId?.toLowerCase().includes(q);
        const matchesName = t.studentName?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesCat = t.category?.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [boardingTransactions, activeSubItem, txTypeFilter, txCatFilter, txStatusFilter, startDate, endDate, effectiveSearch]);

  // Handle Enrollment Submission
  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!addStudentId) {
      setAddError('দয়া করে একজন রেজিস্টার্ড ছাত্র নির্বাচন করুন।');
      return;
    }
    if (!addJoiningDate) {
      setAddError('যোগদানের তারিখ আবশ্যক।');
      return;
    }
    if (!addRoom) {
      setAddError('রুম নির্বাচন আবশ্যক।');
      return;
    }

    setIsAddingStudent(true);
    try {
      const studentObj = students.find((s) => s.id === addStudentId);
      if (!studentObj) throw new Error('ছাত্রের তথ্য পাওয়া যায়নি।');

      const alreadyActive = boardingStudents.some(
        (b) => b.studentId === addStudentId && ((b.boardingStatus || '').includes('Active') || (b.boardingStatus || '').includes('সক্রিয়'))
      );
      if (alreadyActive) {
        setAddError(`ছাত্র "${studentObj.name}" ইতিপূর্বেই বোর্ডিংয়ে সক্রিয় আবাসিক হিসেবে আছেন।`);
        setIsAddingStudent(false);
        return;
      }

      await addBoardingStudent({
        studentId: addStudentId,
        name: studentObj.name,
        studentName: studentObj.name,
        className: studentObj.className,
        section: studentObj.section || 'A',
        boardingStatus: addStatus,
        joiningDate: addJoiningDate,
        room: addRoom,
        roomNumber: addRoom,
        bedNumber: addBed,
        guardianName: addGuardianName.trim() || studentObj.fatherName,
        guardianPhone: addGuardianPhone.trim() || studentObj.phone,
        note: addNote.trim(),
        monthlyFee: 120,
        feeStatus: 'Due',
        supervisor: 'উস্তাদ হুযাইফা',
      });

      setIsAddStudentOpen(false);
      setAddStudentOpenId('');
      setAddGuardianName('');
      setAddGuardianPhone('');
      setAddNote('');
    } catch (err: any) {
      console.error(err);
      setAddError(err.message || 'ছাত্র ভর্তি করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleEditStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditStudentError(null);

    if (!editJoiningDate) {
      setEditStudentError('যোগদানের তারিখ আবশ্যক।');
      return;
    }
    if (!editRoom) {
      setEditStudentError('রুম নির্বাচন আবশ্যক।');
      return;
    }

    setIsUpdatingStudent(true);
    try {
      await updateBoardingStudent(editingStudent.studentId, {
        room: editRoom,
        roomNumber: editRoom,
        bedNumber: editBed,
        boardingStatus: editStatusState,
        joiningDate: editJoiningDate,
        guardianName: editGuardianName.trim(),
        guardianPhone: editGuardianPhone.trim(),
        note: editStudentNote.trim(),
      });
      setEditingStudent(null);
    } catch (err: any) {
      console.error(err);
      setEditStudentError(err.message || 'বোর্ডিং তথ্য আপডেট করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsUpdatingStudent(false);
    }
  };

  const handleRemoveStudentConfirm = async () => {
    if (!removingStudent) return;
    setIsRemovingStudent(true);
    try {
      await updateBoardingStudent(removingStudent.studentId, {
        boardingStatus: 'নিষ্ক্রিয় (Inactive)',
      });
      setRemovingStudent(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'ছাত্রকে বোর্ডিং থেকে বাদ দিতে ব্যর্থ হয়েছে।');
    } finally {
      setIsRemovingStudent(false);
    }
  };

  const handleAddTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);

    if (txModalType === 'fee' && !txStudentId) {
      setTxError('দয়া করে একজন সক্রিয় আবাসিক ছাত্র নির্বাচন করুন।');
      return;
    }
    if (!txDate) {
      setTxError('তারিখ আবশ্যক।');
      return;
    }
    const amt = Number(txAmount);
    if (!txAmount || isNaN(amt) || amt <= 0) {
      setTxError('টাকার পরিমাণ শূন্য বা ঋণাত্মক হতে পারবে না।');
      return;
    }
    if (!txDescription.trim()) {
      setTxError('বিবরণ আবশ্যক।');
      return;
    }

    setIsSubmittingTx(true);
    try {
      let stName = '';
      if (txModalType === 'fee' && selectedResidentDetails) {
        stName = selectedResidentDetails.studentName || selectedResidentDetails.name;
      }

      await addBoardingTransaction({
        studentId: txModalType === 'fee' ? txStudentId : undefined,
        studentName: txModalType === 'fee' ? stName : undefined,
        date: txDate,
        type: txModalType,
        category: txCategory,
        description: txDescription.trim(),
        amount: amt,
        paymentMethod: txPaymentMethod,
        status: txStatus,
        reference: txReference.trim(),
        note: txNote.trim(),
      });

      setIsAddTxOpen(false);
      setTxStudentId('');
      setTxDescription('');
      setTxReference('');
      setTxNote('');
    } catch (err: any) {
      console.error(err);
      setTxError(err.message || 'লেনদেন সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  const handleEditTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    setEditTxError(null);

    if (!editTxDate) {
      setEditTxError('তারিখ আবশ্যক।');
      return;
    }
    const amt = Number(editTxAmount);
    if (!editTxAmount || isNaN(amt) || amt <= 0) {
      setEditTxError('টাকার পরিমাণ শূন্য বা ঋণাত্মক হতে পারবে না।');
      return;
    }
    if (!editTxDescription.trim()) {
      setEditTxError('বিবরণ আবশ্যক।');
      return;
    }

    setIsUpdatingTx(true);
    try {
      await updateBoardingTransaction(editingTransaction.id, {
        date: editTxDate,
        type: editTxType,
        category: editTxCategory,
        description: editTxDescription.trim(),
        amount: amt,
        paymentMethod: editTxPaymentMethod,
        status: editTxStatus,
        reference: editTxReference.trim(),
        note: editTxNote.trim(),
      });
      setEditingTransaction(null);
    } catch (err: any) {
      console.error(err);
      setEditTxError(err.message || 'লেনদেন আপডেট করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsUpdatingTx(false);
    }
  };

  const handleDeleteTxSubmit = async () => {
    if (!deletingTransaction) return;
    setIsDeletingTx(true);
    try {
      await deleteBoardingTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    } catch (err) {
      console.error('Delete transaction error:', err);
    } finally {
      setIsDeletingTx(false);
    }
  };

  const openAddTx = (type: 'fee' | 'foodExpense' | 'otherExpense') => {
    setTxModalType(type);
    setTxDate(new Date().toISOString().split('T')[0]);
    setTxPaymentMethod('নগদ (Cash)');
    setTxStatus('সম্পন্ন (Completed)');
    setTxReference('');
    setTxNote('');
    setTxStudentId(activeResidents.length > 0 ? activeResidents[0].studentId : '');
    setTxDescription(type === 'fee' ? 'মাসিক আবাসিক ও মেস রুম ভাড়া' : '');
    setTxCategory(
      type === 'fee'
        ? FEE_CATEGORIES[0]
        : type === 'foodExpense'
        ? FOOD_EXPENSE_CATEGORIES[0]
        : OTHER_EXPENSE_CATEGORIES[0]
    );
    setTxAmount(type === 'fee' ? 120 : 250);
    setTxError(null);
    setIsAddTxOpen(true);
  };

  const openEditTx = (tx: BoardingTransaction) => {
    setEditingTransaction(tx);
    setEditTxDate(tx.date);
    setEditTxType(tx.type);
    setEditTxCategory(tx.category);
    setEditTxDescription(tx.description);
    setEditTxAmount(tx.amount);
    setEditTxPaymentMethod(tx.paymentMethod || 'নগদ (Cash)');
    setEditTxStatus(tx.status || 'সম্পন্ন (Completed)');
    setEditTxReference(tx.reference || '');
    setEditTxNote(tx.note || '');
    setEditTxError(null);
  };

  const openEditStudent = (b: BoardingStudent) => {
    setEditingStudent(b);
    setEditRoom(b.room || b.roomNumber);
    setEditBed(b.bedNumber);
    setEditStatus(b.boardingStatus || 'সক্রিয় (Active)');
    setEditJoiningDate(b.joiningDate);
    setEditGuardianName(b.guardianName || '');
    setEditGuardianPhone(b.guardianPhone || '');
    setEditStudentNote(b.note || '');
    setEditStudentError(null);
  };

  const getStatusBadge = (status: string) => {
    if (status.includes('Active') || status.includes('সক্রিয়') || status === 'Completed' || status === 'Paid') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (status.includes('Pending') || status.includes('অপেক্ষমান') || status === 'Due') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const subPageTitles: Record<string, { title: string; subtitle: string }> = {
    'boarding-students': {
      title: 'আবাসিক ছাত্র তালিকা',
      subtitle: 'আবাসিক ছাত্রছাত্রী, রুম, বেড এবং অভিভাবকের যোগাযোগের বিবরণ পরিচালনা করুন',
    },
    'boarding-fees': {
      title: 'বোর্ডিং ফি আদায়',
      subtitle: 'আবাসিক ছাত্রছাত্রীদের মাসিক ফি ও ডাইনিং চার্জ সংগ্রহ ও হিসাব রাখুন',
    },
    'food-expense': {
      title: 'খাবার খরচ ও বাজার',
      subtitle: 'মেস বাজার, রেশনের হিসাব এবং ক্যাটারিং খরচ পর্যবেক্ষণ করুন',
    },
    'other-expenses': {
      title: 'অন্যান্য হোস্টেল খরচ',
      subtitle: 'বিদ্যুৎ, পানি, লিলেন, পরিচ্ছন্নতা এবং হোস্টেলের খুচরা খরচ ট্র্যাক করুন',
    },
    'boarding-balance': {
      title: 'বোর্ডিং ব্যালেন্স ও হিসাব',
      subtitle: 'বোর্ডিং তহবিলের উদ্বৃত্ত হিসাব ও সামগ্রিক আর্থিক বিবরণী',
    },
  };

  const currentMeta = subPageTitles[activeSubItem] || {
    title: 'বোর্ডিং ম্যানেজমেন্ট',
    subtitle: 'হোস্টেল, মেস এবং আবাসিক পরিচালনার হিসাব',
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="বোর্ডিং (আবাসিক)"
        subItemTitle={currentMeta.title}
        sectionKey="boarding"
        subItemKey={activeSubItem}
      />

      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{t(currentMeta.title)}</h2>
          <p className="text-xs text-slate-500">{t(currentMeta.subtitle)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeSubItem === 'boarding-students' ? (
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>বোর্ডিং ছাত্র যোগ করুন</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => openAddTx('fee')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>বোর্ডিং ফি এন্ট্রি</span>
              </button>
              <button
                onClick={() => openAddTx('foodExpense')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                <Utensils className="h-4 w-4 text-amber-600" />
                <span>খাবার খরচ এন্ট্রি</span>
              </button>
              <button
                onClick={() => openAddTx('otherExpense')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                <Building2 className="h-4 w-4 text-purple-600" />
                <span>অন্যান্য খরচ এন্ট্রি</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="মোট আবাসিক ছাত্র"
          value={totalBoardingStudentsCount}
          subtitle="বর্তমানে হোস্টেলে অবস্থানরত"
          icon={<Users className="h-5 w-5 text-slate-700" />}
          accentColor="slate"
        />
        <StatCard
          title="মোট বোর্ডিং ফি"
          value={`৳${totalBoardingFees.toLocaleString()}`}
          subtitle="ছাত্রদের কাছ থেকে সংগৃহীত ফি"
          icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
          accentColor="emerald"
        />
        <StatCard
          title="মোট খাবার খরচ"
          value={`৳${totalFoodExpense.toLocaleString()}`}
          subtitle="মেস বাজার ও রেশনের খরচ"
          icon={<Utensils className="h-5 w-5 text-amber-700" />}
          accentColor="amber"
        />
        <StatCard
          title="হোস্টেল রক্ষণাবেক্ষণ"
          value={`৳${totalOtherExpense.toLocaleString()}`}
          subtitle="ইউটিলিটি, মেরামত ও সাপ্লাইজ"
          icon={<Building2 className="h-5 w-5 text-purple-700" />}
          accentColor="purple"
        />
        <StatCard
          title="নেট বোর্ডিং ব্যালেন্স"
          value={`৳${boardingBalance.toLocaleString()}`}
          subtitle="মোট ফি থেকে সকল খরচ বাদ"
          icon={<Receipt className="h-5 w-5 text-sky-700" />}
          accentColor="blue"
        />
      </div>

      {/* Main Boarding Student List Table */}
      {activeSubItem === 'boarding-students' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="ছাত্র আইডি, নাম বা পিতার নাম দিয়ে খুঁজুন..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">শ্রেণী:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="All">সকল শ্রেণী</option>
                  {uniqueClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">রুম:</span>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="All">সকল রুম</option>
                  {uniqueRooms.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">স্ট্যাটাস:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="All">সকল স্ট্যাটাস</option>
                  {BOARDING_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {(localSearch || selectedClass !== 'All' || selectedRoom !== 'All' || selectedStatus !== 'All') && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setSelectedClass('All');
                    setSelectedRoom('All');
                    setSelectedStatus('All');
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>রিসেট</span>
                </button>
              )}
            </div>
          </div>

          {/* Table list */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">ছাত্র আইডি</th>
                    <th className="px-5 py-3.5">ছাত্রের নাম</th>
                    <th className="px-5 py-3.5">শ্রেণী</th>
                    <th className="px-5 py-3.5 text-center">সেকশন</th>
                    <th className="px-5 py-3.5">রুম</th>
                    <th className="px-5 py-3.5">বেড নম্বর</th>
                    <th className="px-5 py-3.5">যোগদানের তারিখ</th>
                    <th className="px-5 py-3.5">অভিভাবকের বিবরণ</th>
                    <th className="px-5 py-3.5 text-center">স্ট্যাটাস</th>
                    <th className="px-5 py-3.5 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boardingStudentsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={10} className="px-5 py-4">
                          <div className="h-4 bg-slate-100 rounded w-full"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredResidents.length > 0 ? (
                    filteredResidents.map((st) => (
                      <tr key={st.studentId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono font-semibold text-emerald-800">
                          {st.studentId}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900">
                          {st.studentName || st.name}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                          {st.className}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-center text-slate-600 font-semibold font-mono">
                          {st.section || 'A'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-800 font-semibold">
                          {st.room || st.roomNumber}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-600">
                          {st.bedNumber || '-'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-500">
                          {st.joiningDate}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                          <div className="font-medium text-slate-700">{st.guardianName || '-'}</div>
                          <div className="text-[10px] font-mono">{st.guardianPhone || '-'}</div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-center">
                          <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(st.boardingStatus || 'Active')}`}>
                            {st.boardingStatus || 'সক্রিয়'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setPrefillFeeStudentId(st.studentId);
                                viewStudentProfile(st.studentId);
                              }}
                              title="প্রোফাইল দেখুন"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => openEditStudent(st)}
                              title="সম্পাদনা করুন"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            {st.boardingStatus !== 'নিষ্ক্রিয় (Inactive)' && (
                              <button
                                onClick={() => setRemovingStudent(st)}
                                title="বোর্ডিং থেকে বাদ দিন"
                                className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer font-semibold text-xs border border-rose-100 px-2 py-0.5"
                              >
                                বাদ দিন
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-400">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                          <Users className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600">কোনো আবাসিক ছাত্র পাওয়া যায়নি</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">নতুন আবাসিক ছাত্র যোগ করতে উপরে "বোর্ডিং ছাত্র যোগ করুন" এ ক্লিক করুন।</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Boarding Transaction List View (Fees, Food, Others) */
        <div className="space-y-4">
          {/* Advanced Filters */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="ছাত্র আইডি, নাম বা বিবরণ দিয়ে খুঁজুন..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white transition-all"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredTxs.length} টি লেনদেন পাওয়া গেছে
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">স্ট্যাটাস:</span>
                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="All">সকল স্ট্যাটাস</option>
                  {TRANSACTION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-1 text-xs">
                <span className="font-medium text-slate-500">তারিখ থেকে:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-hidden"
                />
                <span className="font-medium text-slate-500">পর্যন্ত:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-hidden"
                />
              </div>

              {(localSearch || txTypeFilter !== 'All' || txStatusFilter !== 'All' || startDate || endDate) && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setTxTypeFilter('All');
                    setTxStatusFilter('All');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>ফিল্টার রিসেট</span>
                </button>
              )}
            </div>
          </div>

          {/* Transactions List */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">তারিখ</th>
                    <th className="px-5 py-3.5">ধরণ</th>
                    <th className="px-5 py-3.5">ছাত্র / বিবরণী</th>
                    <th className="px-5 py-3.5">ক্যাটাগরি</th>
                    <th className="px-5 py-3.5">বিবরণ</th>
                    <th className="px-5 py-3.5 text-right">টাকা (৳)</th>
                    <th className="px-5 py-3.5">পেমেন্ট মাধ্যম</th>
                    <th className="px-5 py-3.5">রেফারেন্স</th>
                    <th className="px-5 py-3.5 text-center">স্ট্যাটাস</th>
                    <th className="px-5 py-3.5 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boardingTransactionsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={10} className="px-5 py-4">
                          <div className="h-4 bg-slate-100 rounded w-full"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredTxs.length > 0 ? (
                    filteredTxs.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono font-medium">
                          {t.date}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            t.type === 'fee' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.type === 'fee' ? 'ফি আদায়' : t.type === 'foodExpense' ? 'খাবার খরচ' : 'অন্যান্য খরচ'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900">
                          {t.type === 'fee' ? (
                            <div>
                              <span>{t.studentName || 'আবাসিক ছাত্র'}</span>
                              <span className="block text-[10px] font-mono text-emerald-800 font-normal">{t.studentId}</span>
                            </div>
                          ) : (
                            'বোর্ডিং মেস'
                          )}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                          {t.category}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-500 max-w-xs truncate" title={t.description}>
                          {t.description}
                        </td>
                        <td className={`px-5 py-3.5 whitespace-nowrap text-right font-mono tabular-nums font-bold ${
                          t.type === 'fee' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {t.type === 'fee' ? '+' : '−'}৳{t.amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                          {t.paymentMethod || 'নগদ'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-500">
                          {t.reference || '-'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-center">
                          <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(t.status || 'Completed')}`}>
                            {t.status || 'সম্পন্ন'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditTx(t)}
                              title="সম্পাদনা"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingTransaction(t)}
                              title="মুছে ফেলুন"
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
                          <Receipt className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600">এই ক্যাটাগরিতে কোনো লেনদেন পাওয়া যায়নি</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Boarding Student Modal */}
      {isAddStudentOpen && (
        <Modal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          title="বোর্ডিং ছাত্র ভর্তি"
          subtitle="মাদ্রাসা ডরমিটরি ও মেসে আবাসিক ছাত্র নির্ধারণ করুন"
          maxWidth="md"
        >
          <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
            {addError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-[11px] text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{addError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-2 border-b border-slate-100">
              <div className="md:col-span-5">
                <label className="block font-semibold text-slate-700 mb-1">ছাত্র নির্বাচন করুন *</label>
                <select
                  required
                  value={addStudentId}
                  onChange={(e) => setAddStudentOpenId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="">-- ছাত্র নির্বাচন --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id} - {s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-7 rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ছাত্রের তথ্য</span>
                {selectedStudentDetails ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">আইডি ও নাম</span>
                      <strong className="text-slate-900">{selectedStudentDetails.id} - {selectedStudentDetails.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">পিতার নাম</span>
                      <strong className="text-slate-800">{selectedStudentDetails.fatherName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">শ্রেণী</span>
                      <strong className="text-slate-800">{selectedStudentDetails.className}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">সেকশন</span>
                      <strong className="text-slate-800">{selectedStudentDetails.section || 'A'}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">বাম পাশ থেকে একজন ছাত্র নির্বাচন করুন।</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">রুম নম্বর *</label>
                <select
                  value={addRoom}
                  onChange={(e) => setAddRoom(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বেড নম্বর *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বেড-৩"
                  value={addBed}
                  onChange={(e) => setAddBed(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">স্ট্যাটাস *</label>
                <select
                  value={addStatus}
                  onChange={(e) => setAddStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {BOARDING_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">যোগদানের তারিখ *</label>
                <input
                  type="date"
                  required
                  value={addJoiningDate}
                  onChange={(e) => setAddJoiningDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">অভিভাবকের নাম</label>
                <input
                  type="text"
                  placeholder="পিতার নাম না হলে লিখুন"
                  value={addGuardianName}
                  onChange={(e) => setAddGuardianName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">অভিভাবকের ফোন নম্বর</label>
                <input
                  type="text"
                  placeholder="মোবাইল নম্বর"
                  value={addGuardianPhone}
                  onChange={(e) => setAddGuardianPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">বিশেষ নোট / মন্তব্য</label>
              <input
                type="text"
                placeholder="যেমন: খাবারের অ্যালার্জি বা বিশেষ নির্দেশনা..."
                value={addNote}
                onChange={(e) => setAddNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isAddingStudent || !addStudentId}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isAddingStudent ? 'সংরক্ষণ হচ্ছে...' : 'বোর্ডিং ভর্তি নিশ্চিত করুন'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Boarding Student Modal */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title="বোর্ডিং তথ্য সম্পাদনা"
          subtitle="রুম নম্বর এবং অভিভাবকের বিবরণ পরিবর্তন করুন"
          maxWidth="md"
        >
          <form onSubmit={handleEditStudentSubmit} className="space-y-4 text-xs">
            {editStudentError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-[11px] text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{editStudentError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">রুম নম্বর *</label>
                <select
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বেড নম্বর *</label>
                <input
                  type="text"
                  required
                  value={editBed}
                  onChange={(e) => setEditBed(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">স্ট্যাটাস *</label>
                <select
                  value={editStatusState}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {BOARDING_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">যোগদানের তারিখ *</label>
                <input
                  type="date"
                  required
                  value={editJoiningDate}
                  onChange={(e) => setEditJoiningDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">অভিভাবকের নাম</label>
                <input
                  type="text"
                  value={editGuardianName}
                  onChange={(e) => setEditGuardianName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">অভিভাবকের ফোন নম্বর</label>
                <input
                  type="text"
                  value={editGuardianPhone}
                  onChange={(e) => setEditGuardianPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">নোট</label>
              <input
                type="text"
                value={editStudentNote}
                onChange={(e) => setEditStudentNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isUpdatingStudent}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingStudent ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Remove Boarding Student Confirmation Modal */}
      {removingStudent && (
        <Modal
          isOpen={!!removingStudent}
          onClose={() => setRemovingStudent(null)}
          title="বোর্ডিং থেকে ছাত্র বাদ দিন"
          subtitle="আপনি কি নিশ্চিতভাবে এই ছাত্রকে বোর্ডিং থেকে বাদ দিতে চান?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5">সতর্কতা: মূল ছাত্রের রেকর্ড সক্রিয় থাকবে</strong>
                এই ছাত্রের বোর্ডিং স্ট্যাটাস <span className="font-bold">নিষ্ক্রিয় (Inactive)</span> হবে এবং পূর্বের সকল আর্থিক ও বোর্ডিং ইতিহাস সংরক্ষিত থাকবে।
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
              <div>ছাত্রের নাম: <strong className="text-slate-900">{removingStudent.studentName || removingStudent.name}</strong></div>
              <div>ছাত্র আইডি: <strong className="text-slate-900 font-mono">{removingStudent.studentId}</strong></div>
              <div>রুম ও বেড: <strong className="text-slate-800 font-mono">{removingStudent.room || removingStudent.roomNumber} - {removingStudent.bedNumber}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRemovingStudent(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={isRemovingStudent}
                onClick={handleRemoveStudentConfirm}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isRemovingStudent ? 'প্রক্রিয়াধীন...' : 'বোর্ডিং থেকে বাদ দিন'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Boarding Transaction Modal */}
      {isAddTxOpen && (
        <Modal
          isOpen={isAddTxOpen}
          onClose={() => setIsAddTxOpen(false)}
          title={
            txModalType === 'fee'
              ? 'বোর্ডিং ফি গ্রহণ'
              : txModalType === 'foodExpense'
              ? 'খাবার ও মেস খরচ এন্ট্রি'
              : 'অন্যান্য বোর্ডিং খরচ এন্ট্রি'
          }
          subtitle="বোর্ডিং ফাণ্ডে রসিদ বা ব্যয় এন্ট্রি করুন"
          maxWidth="md"
        >
          <form onSubmit={handleAddTxSubmit} className="space-y-4 text-xs">
            {txError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-[11px] text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{txError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">তারিখ *</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              {txModalType === 'fee' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">আবাসিক ছাত্র *</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <select
                      required
                      value={txStudentId}
                      onChange={(e) => setTxStudentId(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                    >
                      <option value="">-- আবাসিক ছাত্র নির্বাচন --</option>
                      {activeResidents.map((st) => (
                        <option key={st.studentId} value={st.studentId}>
                          {st.studentName || st.name} ({st.studentId})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">খরচের ক্যাটাগরি *</label>
                  <div className="relative">
                    <Tag className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <select
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                    >
                      {(txModalType === 'foodExpense' ? FOOD_EXPENSE_CATEGORIES : OTHER_EXPENSE_CATEGORIES).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মাধ্যম *</label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={txPaymentMethod}
                    onChange={(e) => setTxPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">টাকার পরিমাণ (৳) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {txModalType === 'fee' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ফির ক্যাтаগরি *</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                  >
                    {FEE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">রেফারেন্স / ভাউচার নং</label>
                  <input
                    type="text"
                    placeholder="যেমন: বিল #৮২১০"
                    value={txReference}
                    onChange={(e) => setTxReference(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">স্ট্যাটাস *</label>
                <select
                  value={txStatus}
                  onChange={(e) => setTxStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  {TRANSACTION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">নোট</label>
              <input
                type="text"
                placeholder="যেমন: চলতি মাসের সম্পূর্ণ পরিশোধ"
                value={txNote}
                onChange={(e) => setTxNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">বিবরণ *</label>
              <textarea
                rows={2}
                required
                value={txDescription}
                onChange={(e) => setTxDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddTxOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmittingTx}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingTx ? 'সংরক্ষণ হচ্ছে...' : 'লেনদেন সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <Modal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          title="বোর্ডিং লেনদেন সম্পাদনা"
          subtitle="লেনদেনের রেকর্ড সংশোধন করুন"
          maxWidth="md"
        >
          <form onSubmit={handleEditTxSubmit} className="space-y-4 text-xs">
            {editTxError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-[11px] text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{editTxError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">তারিখ *</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={editTxDate}
                    onChange={(e) => setEditTxDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ধরণ *</label>
                <select
                  value={editTxType}
                  onChange={(e) => setEditTxType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="fee">বোর্ডিং ফি</option>
                  <option value="foodExpense">খাবার খরচ</option>
                  <option value="otherExpense">অন্যান্য খরচ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ক্যাটাগরি *</label>
                <select
                  value={editTxCategory}
                  onChange={(e) => setEditTxCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  {(editTxType === 'fee' ? FEE_CATEGORIES : editTxType === 'foodExpense' ? FOOD_EXPENSE_CATEGORIES : OTHER_EXPENSE_CATEGORIES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">টাকার পরিমাণ (৳) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  value={editTxAmount}
                  onChange={(e) => setEditTxAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono font-bold focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মাধ্যম *</label>
                <select
                  value={editTxPaymentMethod}
                  onChange={(e) => setEditTxPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">স্ট্যাটাস *</label>
                <select
                  value={editTxStatus}
                  onChange={(e) => setEditTxStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  {TRANSACTION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">রেফারেন্স / ভাউচার নং</label>
                <input
                  type="text"
                  value={editTxReference}
                  onChange={(e) => setEditTxReference(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">নোট</label>
                <input
                  type="text"
                  value={editTxNote}
                  onChange={(e) => setEditTxNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">বিবরণ *</label>
              <textarea
                rows={2}
                required
                value={editTxDescription}
                onChange={(e) => setEditTxDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTransaction(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isUpdatingTx}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingTx ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Transaction Modal */}
      {deletingTransaction && (
        <Modal
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          title="বোর্ডিং লেনদেন মুছে ফেলুন"
          subtitle="আপনি কি নিশ্চিতভাবে এই লেনদেনটি মুছে ফেলতে চান?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">স্থায়ীভাবে মুছে ফেলা</span>
                এই রেকর্ডটি মুছে ফেললে তা ডাটাবেস থেকে স্থায়ীভাবে মুছে যাবে এবং বোর্ডিং ব্যালেন্স স্বয়ংক্রিয়ভাবে আপডেট হবে।
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1.5">
              <div>ধরণ: <strong className="text-slate-900 uppercase font-bold">{deletingTransaction.type}</strong></div>
              <div>ক্যাটাগরি: <strong className="text-slate-800 font-semibold">{deletingTransaction.category}</strong></div>
              <div>টাকা: <strong className="text-slate-900 font-mono font-bold">৳{deletingTransaction.amount.toLocaleString()}</strong></div>
              <div>তারিখ: <strong className="text-slate-700 font-mono">{deletingTransaction.date}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingTransaction(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={isDeletingTx}
                onClick={handleDeleteTxSubmit}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeletingTx ? 'মুছে ফেলা হচ্ছে...' : 'লেনদেন মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
