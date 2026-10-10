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

const ROOM_OPTIONS = ['Dorm-A', 'Dorm-B', 'Dorm-C', 'Dorm-D', 'VIP Room', 'General Dorm'];
const BOARDING_STATUS_OPTIONS = ['Active', 'Inactive', 'Left'];
const PAYMENT_METHODS = ['Cash', 'Bank', 'Mobile Banking', 'Other'];
const TRANSACTION_STATUSES = ['Completed', 'Pending', 'Cancelled'];

const FOOD_EXPENSE_CATEGORIES = [
  'Rice',
  'Vegetables',
  'Meat',
  'Fish',
  'Oil',
  'Grocery',
  'Gas',
  'Other Food Expense',
];

const OTHER_EXPENSE_CATEGORIES = [
  'Electricity',
  'Water',
  'Cleaning',
  'Maintenance',
  'Furniture',
  'Medical',
  'Other',
];

const FEE_CATEGORIES = [
  'Monthly Boarding Fee',
  'Food Fee',
  'Other Boarding Fee',
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
  const [addRoom, setAddRoom] = useState('Dorm-A');
  const [addBed, setAddBed] = useState('Bed-1');
  const [addStatus, setAddStatus] = useState('Active');
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
  const [txPaymentMethod, setTxPaymentMethod] = useState('Cash');
  const [txStatus, setTxStatus] = useState('Completed');
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
    return boardingStudents.filter((b) => b.boardingStatus === 'Active');
  }, [boardingStudents]);

  const selectedResidentDetails = useMemo(() => {
    return boardingStudents.find((b) => b.studentId === txStudentId);
  }, [boardingStudents, txStudentId]);

  // 9. BOARDING BALANCE: Accounting calculations (Only completed transactions affect balance)
  const totalBoardingFees = useMemo(() => {
    return boardingTransactions
      .filter((t) => t.status === 'Completed' && t.type === 'fee')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [boardingTransactions]);

  const totalFoodExpense = useMemo(() => {
    return boardingTransactions
      .filter((t) => t.status === 'Completed' && (t.type === 'foodExpense' || t.category === 'Food Expense' || t.category === 'Kitchen Ration'))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [boardingTransactions]);

  const totalOtherExpense = useMemo(() => {
    return boardingTransactions
      .filter((t) => t.status === 'Completed' && t.type === 'otherExpense' && t.category !== 'Food Expense' && t.category !== 'Kitchen Ration')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [boardingTransactions]);

  const boardingBalance = useMemo(() => {
    return totalBoardingFees - totalFoodExpense - totalOtherExpense;
  }, [totalBoardingFees, totalFoodExpense, totalOtherExpense]);

  const totalBoardingStudentsCount = useMemo(() => {
    return boardingStudents.filter((b) => b.boardingStatus === 'Active').length;
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
      // 1. Search Query
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

      // 2. Class Filter
      if (selectedClass !== 'All' && b.className !== selectedClass) return false;

      // 3. Room Filter
      const bRoom = b.room || b.roomNumber;
      if (selectedRoom !== 'All' && bRoom !== selectedRoom) return false;

      // 4. Status Filter
      const bStatus = b.boardingStatus;
      if (selectedStatus !== 'All' && bStatus !== selectedStatus) return false;

      return true;
    });
  }, [boardingStudents, students, effectiveSearch, selectedClass, selectedRoom, selectedStatus]);

  // Filters Boarding Transactions
  const filteredTxs = useMemo(() => {
    return boardingTransactions.filter((t) => {
      // 1. Subpage filter
      if (activeSubItem === 'boarding-fees' && t.type !== 'fee') return false;
      if (activeSubItem === 'food-expense' && t.type !== 'foodExpense') return false;
      if (activeSubItem === 'other-expenses' && t.type !== 'otherExpense') return false;

      // 2. Dynamic Types dropdown
      if (txTypeFilter !== 'All' && t.type !== txTypeFilter) return false;

      // 3. Category Filter
      if (txCatFilter !== 'All' && t.category !== txCatFilter) return false;

      // 4. Status Filter
      if (txStatusFilter !== 'All' && t.status !== txStatusFilter) return false;

      // 5. Date filter
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;

      // 6. Search (Student ID, Student Name, Description, Category)
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
      setAddError('Please select a registered student.');
      return;
    }
    if (!addJoiningDate) {
      setAddError('Joining Date is required.');
      return;
    }
    if (!addRoom) {
      setAddError('Room selection is required.');
      return;
    }

    setIsAddingStudent(true);
    try {
      const studentObj = students.find((s) => s.id === addStudentId);
      if (!studentObj) throw new Error('Student data not found.');

      // Check if student is already active in boarding
      const alreadyActive = boardingStudents.some(
        (b) => b.studentId === addStudentId && (b.boardingStatus?.toLowerCase() === 'active')
      );
      if (alreadyActive) {
        setAddError(`Student "${studentObj.name}" is already an Active resident in boarding.`);
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
        supervisor: 'Ustadh Huzaifa',
      });

      setIsAddStudentOpen(false);
      setAddStudentOpenId('');
      setAddGuardianName('');
      setAddGuardianPhone('');
      setAddNote('');
    } catch (err: any) {
      console.error(err);
      setAddError(err.message || 'Failed to enroll student.');
    } finally {
      setIsAddingStudent(false);
    }
  };

  // Handle Edit Student Submission
  const handleEditStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditStudentError(null);

    if (!editJoiningDate) {
      setEditStudentError('Joining Date is required.');
      return;
    }
    if (!editRoom) {
      setEditStudentError('Room selection is required.');
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
      setEditStudentError(err.message || 'Failed to update boarding student.');
    } finally {
      setIsUpdatingStudent(false);
    }
  };

  // Handle Remove Student Confirmation
  const handleRemoveStudentConfirm = async () => {
    if (!removingStudent) return;
    setIsRemovingStudent(true);
    try {
      // 4. REMOVE FROM BOARDING: Sets boardingStatus = "Inactive" and update updatedAt
      await updateBoardingStudent(removingStudent.studentId, {
        boardingStatus: 'Inactive',
      });
      setRemovingStudent(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to remove student from Boarding.');
    } finally {
      setIsRemovingStudent(false);
    }
  };

  // Handle Recording Boarding Transaction (Fee / Expenses)
  const handleAddTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);

    if (txModalType === 'fee' && !txStudentId) {
      setTxError('Please select an active resident student.');
      return;
    }
    if (!txDate) {
      setTxError('Transaction date is required.');
      return;
    }
    const amt = Number(txAmount);
    if (!txAmount || isNaN(amt) || amt <= 0) {
      setTxError('Amount must be greater than 0.');
      return;
    }
    if (!txDescription.trim()) {
      setTxError('Description is required.');
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
      setTxError(err.message || 'Failed to record transaction.');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  // Handle Edit Transaction Submission
  const handleEditTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    setEditTxError(null);

    if (!editTxDate) {
      setEditTxError('Date is required.');
      return;
    }
    const amt = Number(editTxAmount);
    if (!editTxAmount || isNaN(amt) || amt <= 0) {
      setEditTxError('Amount must be greater than 0.');
      return;
    }
    if (!editTxDescription.trim()) {
      setEditTxError('Description is required.');
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
      setEditTxError(err.message || 'Failed to update transaction.');
    } finally {
      setIsUpdatingTx(false);
    }
  };

  // Handle Delete Transaction Submission
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
    setTxPaymentMethod('Cash');
    setTxStatus('Completed');
    setTxReference('');
    setTxNote('');
    setTxStudentId(activeResidents.length > 0 ? activeResidents[0].studentId : '');
    setTxDescription(type === 'fee' ? 'Monthly hostel room rent and dining fee' : '');
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
    setEditTxPaymentMethod(tx.paymentMethod || 'Cash');
    setEditTxStatus(tx.status || 'Completed');
    setEditTxReference(tx.reference || '');
    setEditTxNote(tx.note || '');
    setEditTxError(null);
  };

  const openEditStudent = (b: BoardingStudent) => {
    setEditingStudent(b);
    setEditRoom(b.room || b.roomNumber);
    setEditBed(b.bedNumber);
    setEditStatus(b.boardingStatus || 'Active');
    setEditJoiningDate(b.joiningDate);
    setEditGuardianName(b.guardianName || '');
    setEditGuardianPhone(b.guardianPhone || '');
    setEditStudentNote(b.note || '');
    setEditStudentError(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
      case 'Partial':
      case 'Due':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Inactive':
      case 'Left':
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const subPageTitles: Record<string, { title: string; subtitle: string }> = {
    'boarding-students': {
      title: 'Boarding Students',
      subtitle: 'Manage residential students, rooms, beds and guardian contact details',
    },
    'boarding-fees': {
      title: 'Boarding Fees',
      subtitle: 'Collect and track monthly residential/dining fees from boarding students',
    },
    'food-expense': {
      title: 'Food Expense',
      subtitle: 'Record and monitor kitchen ration, mess and catering expenses',
    },
    'other-expenses': {
      title: 'Other Expenses',
      subtitle: 'Track utilities, laundry, medical, maintenance and miscellaneous hostel costs',
    },
    'boarding-balance': {
      title: 'Boarding Balance',
      subtitle: 'Surplus reconciliation and comprehensive financial snapshot of the boarding fund',
    },
  };

  const currentMeta = subPageTitles[activeSubItem] || {
    title: 'Boarding Management',
    subtitle: 'Hostel, boarding, dining and residential operations ledger',
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="Boarding"
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
              <span>{t('Add Boarding Student')}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => openAddTx('fee')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{t('Record Boarding Fee')}</span>
              </button>
              <button
                onClick={() => openAddTx('foodExpense')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                <Utensils className="h-4 w-4 text-amber-600" />
                <span>{t('Record Food Expense')}</span>
              </button>
              <button
                onClick={() => openAddTx('otherExpense')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                <Building2 className="h-4 w-4 text-purple-600" />
                <span>{t('Record Other Expense')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title={t('Total Residents')}
          value={totalBoardingStudentsCount}
          subtitle={t('Currently housed in hostel')}
          icon={<Users className="h-5 w-5 text-slate-700" />}
          accentColor="slate"
        />
        <StatCard
          title={t('Total Boarding Fees')}
          value={`৳${totalBoardingFees.toLocaleString()}`}
          subtitle={t('Collected fees from residents')}
          icon={<ArrowUpRight className="h-5 w-5 text-emerald-700" />}
          accentColor="emerald"
        />
        <StatCard
          title={t('Total Food Expense')}
          value={`৳${totalFoodExpense.toLocaleString()}`}
          subtitle={t('Cumulative mess groceries & ration')}
          icon={<Utensils className="h-5 w-5 text-amber-700" />}
          accentColor="amber"
        />
        <StatCard
          title={t('Hostel Maintenance')}
          value={`৳${totalOtherExpense.toLocaleString()}`}
          subtitle={t('Utilities, repairs & supplies')}
          icon={<Building2 className="h-5 w-5 text-purple-700" />}
          accentColor="purple"
        />
        <StatCard
          title={t('Net Boarding Balance')}
          value={`৳${boardingBalance.toLocaleString()}`}
          subtitle={t('Fees collected minus all expenses')}
          icon={<Receipt className="h-5 w-5 text-sky-700" />}
          accentColor="blue"
        />
      </div>

      {/* Balance reconciliation page */}
      {activeSubItem === 'boarding-balance' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Boarding Reserve Accounting Solvency Check
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-center md:text-left">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Boarding Fees</span>
              <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
                +৳{totalBoardingFees.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">−</span>

            <div className="text-center md:text-left">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Food Expense</span>
              <p className="text-2xl font-bold text-amber-700 font-mono tabular-nums mt-1">
                -৳{totalFoodExpense.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">−</span>

            <div className="text-center md:text-left">
              <span className="text-xs text-slate-500 font-semibold uppercase">Other Boarding Expenses</span>
              <p className="text-2xl font-bold text-amber-700 font-mono tabular-nums mt-1">
                -৳{totalOtherExpense.toLocaleString()}
              </p>
            </div>

            <span className="text-xl font-bold text-slate-400">=</span>

            <div className="text-center md:text-left bg-white px-5 py-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold uppercase text-sky-800">Net Boarding Surplus</span>
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-1">
                ৳{boardingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

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
                placeholder="Search by ID, student name, father name..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">Class:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="All">All Classes</option>
                  {uniqueClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">Room:</span>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="All">All Rooms</option>
                  {uniqueRooms.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
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
                  <span>Reset</span>
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
                    <th className="px-5 py-3.5">Student ID</th>
                    <th className="px-5 py-3.5">Student Name</th>
                    <th className="px-5 py-3.5">Class</th>
                    <th className="px-5 py-3.5 text-center">Section</th>
                    <th className="px-5 py-3.5">Room</th>
                    <th className="px-5 py-3.5">Bed Number</th>
                    <th className="px-5 py-3.5">Joining Date</th>
                    <th className="px-5 py-3.5">Guardian Details</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
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
                            {st.boardingStatus || 'Active'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setPrefillFeeStudentId(st.studentId);
                                viewStudentProfile(st.studentId);
                              }}
                              title="View Boarding Profile"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => openEditStudent(st)}
                              title="Edit Boarding Settings"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            {st.boardingStatus !== 'Inactive' && (
                              <button
                                onClick={() => setRemovingStudent(st)}
                                title="Remove from Boarding"
                                className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer font-semibold text-xs border border-rose-100 px-2 py-0.5"
                              >
                                Remove
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
                        <p className="text-xs font-semibold text-slate-600">No boarding students found in this view</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click "Enroll Boarding Student" above to register a resident.</p>
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
                  placeholder="Search student ID, name, particulars..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white transition-all"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredTxs.length} transaction entries filtered
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Type Filter */}
              {activeSubItem === 'boarding-balance' && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-medium text-slate-500">Type:</span>
                  <select
                    value={txTypeFilter}
                    onChange={(e) => setTxTypeFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                  >
                    <option value="All">All Types</option>
                    <option value="fee">Boarding Fees</option>
                    <option value="foodExpense">Food Expense</option>
                    <option value="otherExpense">Other Expense</option>
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-slate-500">Status:</span>
                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  {TRANSACTION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Date Filters */}
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
                  <span>Reset Filters</span>
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
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Student / Particulars</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Description</th>
                    <th className="px-5 py-3.5 text-right">Amount</th>
                    <th className="px-5 py-3.5">Payment Method</th>
                    <th className="px-5 py-3.5">Ref / Slip #</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
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
                            {t.type === 'fee' ? 'Fee Collection' : t.type === 'foodExpense' ? 'Food Expense' : 'Other Expense'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900">
                          {t.type === 'fee' ? (
                            <div>
                              <span>{t.studentName || 'Resident'}</span>
                              <span className="block text-[10px] font-mono text-emerald-800 font-normal">{t.studentId}</span>
                            </div>
                          ) : (
                            'Boarding Mess'
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
                          {t.type === 'fee' ? '+' : '−'}${t.amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                          {t.paymentMethod || 'Cash'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-500">
                          {t.reference || '-'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-center">
                          <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(t.status || 'Completed')}`}>
                            {t.status || 'Completed'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditTx(t)}
                              title="Edit Transaction"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingTransaction(t)}
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
                          <Receipt className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600">No boarding transactions found in this category</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Vouchers and receipts are loaded in real-time from Firestore.</p>
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
          title="Enroll Boarding Resident"
          subtitle="Assign Registered Student to Madrasa Dormitory & Mess"
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
                <label className="block font-semibold text-slate-700 mb-1">Select Registered Student *</label>
                <select
                  required
                  value={addStudentId}
                  onChange={(e) => setAddStudentOpenId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id} - {s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-7 rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Auto-populated Student Info</span>
                {selectedStudentDetails ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">ID & Name</span>
                      <strong className="text-slate-900">{selectedStudentDetails.id} - {selectedStudentDetails.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Father's Name</span>
                      <strong className="text-slate-800">{selectedStudentDetails.fatherName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Academic Class</span>
                      <strong className="text-slate-800">{selectedStudentDetails.className}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Section</span>
                      <strong className="text-slate-800">{selectedStudentDetails.section || 'A'}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">Select a student on the left to review details.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dormitory Room *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Bed Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bed-3"
                  value={addBed}
                  onChange={(e) => setAddBed(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Boarding Status *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Joining Date *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Local Guardian Name</label>
                <input
                  type="text"
                  placeholder="Leave empty for father"
                  value={addGuardianName}
                  onChange={(e) => setAddGuardianName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guardian Phone #</label>
                <input
                  type="text"
                  placeholder="Leave empty for father's phone"
                  value={addGuardianPhone}
                  onChange={(e) => setAddGuardianPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dormitory & Mess Particular Note</label>
              <input
                type="text"
                placeholder="e.g. Any food allergies or special medical instructions..."
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAddingStudent || !addStudentId}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isAddingStudent ? 'Enrolling...' : 'Enroll in Boarding'}
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
          title={`Edit Boarding settings`}
          subtitle="Modify room assignment and guardian details in Firestore"
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
                <label className="block font-semibold text-slate-700 mb-1">Dormitory Room *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Bed Number *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Boarding Status *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Joining Date *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Local Guardian Name</label>
                <input
                  type="text"
                  value={editGuardianName}
                  onChange={(e) => setEditGuardianName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guardian Phone #</label>
                <input
                  type="text"
                  value={editGuardianPhone}
                  onChange={(e) => setEditGuardianPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Note</label>
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingStudent}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingStudent ? 'Saving...' : 'Save Changes'}
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
          title="Remove Resident from Boarding"
          subtitle="Are you sure you want to remove this student from Boarding?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5">Notice: Main Student Record remains active</strong>
                Removing this resident will only change their boarding status to <span className="font-bold">Inactive</span> and keep all financial and boarding history intact.
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
              <div>Student Name: <strong className="text-slate-900">{removingStudent.studentName || removingStudent.name}</strong></div>
              <div>Student ID: <strong className="text-slate-900 font-mono">{removingStudent.studentId}</strong></div>
              <div>Room & Bed: <strong className="text-slate-800 font-mono">{removingStudent.room || removingStudent.roomNumber} - {removingStudent.bedNumber}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRemovingStudent(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRemovingStudent}
                onClick={handleRemoveStudentConfirm}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isRemovingStudent ? 'Processing...' : 'Remove from Boarding'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Boarding Transaction Modal (Collect Fee, Food Expense, Other Expense) */}
      {isAddTxOpen && (
        <Modal
          isOpen={isAddTxOpen}
          onClose={() => setIsAddTxOpen(false)}
          title={
            txModalType === 'fee'
              ? 'Collect Boarding Fee'
              : txModalType === 'foodExpense'
              ? 'Record Food & Mess Expense'
              : 'Record Other Boarding Expense'
          }
          subtitle="Log receipt or expenditure directly into Boarding Firestore pool"
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
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Boarding Student *</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <select
                      required
                      value={txStudentId}
                      onChange={(e) => setTxStudentId(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                    >
                      <option value="">-- Choose Resident --</option>
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
                  <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Amount ($) *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Fee Category *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Reference / Voucher #</label>
                  <input
                    type="text"
                    placeholder="e.g. Bill #8210"
                    value={txReference}
                    onChange={(e) => setTxReference(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status *</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Note</label>
              <input
                type="text"
                placeholder="e.g. Paid in full for October 2026"
                value={txNote}
                onChange={(e) => setTxNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description / Particulars *</label>
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingTx}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingTx ? 'Saving...' : 'Save Transaction'}
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
          title={`Edit Boarding Transaction`}
          subtitle="Modify transaction record inside boardingTransactions collection"
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
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Type *</label>
                <select
                  value={editTxType}
                  onChange={(e) => setEditTxType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="fee">Boarding Fee</option>
                  <option value="foodExpense">Food Expense</option>
                  <option value="otherExpense">Other Expense</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Amount ($) *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Status *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Reference / Voucher #</label>
                <input
                  type="text"
                  value={editTxReference}
                  onChange={(e) => setEditTxReference(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note / Remarks</label>
                <input
                  type="text"
                  value={editTxNote}
                  onChange={(e) => setEditTxNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description *</label>
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingTx}
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingTx ? 'Saving Changes...' : 'Save Changes'}
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
          title="Delete Boarding Transaction"
          subtitle="Are you sure you want to delete this Boarding transaction?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Irreversible Deletion</span>
                Deleting this record will permanently remove it from Firestore and instantly update the Boarding balance.
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1.5">
              <div>Type: <strong className="text-slate-900 uppercase font-bold">{deletingTransaction.type}</strong></div>
              <div>Category: <strong className="text-slate-800 font-semibold">{deletingTransaction.category}</strong></div>
              <div>Amount: <strong className="text-slate-900 font-mono font-bold">${deletingTransaction.amount.toLocaleString()}</strong></div>
              <div>Date: <strong className="text-slate-700 font-mono">{deletingTransaction.date}</strong></div>
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
                disabled={isDeletingTx}
                onClick={handleDeleteTxSubmit}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeletingTx ? 'Deleting...' : 'Delete Transaction'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
