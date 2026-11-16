import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations, Language, translateText } from '../lib/translations';
import {
  NavigationSection,
  SubNavigationItem,
  Student,
  FeeRecord,
  AibTransaction,
  RevolvingFundTransaction,
  BoardingStudent,
  BoardingExpense,
  BoardingTransaction,
  AccountTransaction,
  MadrasaInfo,
  UserAccount,
  AcademicClass,
  AcademicYear,
  AccountCategory,
  AdminUser,
  FirestoreStudent,
  FirestoreStudentFee,
  FirestoreAibTransaction,
  FirestoreRevolvingFundTransaction,
  FirestoreBoardingStudent,
  FirestoreBoardingTransaction,
  FirestoreAccountTransaction,
  FeeStatus,
  FeeType,
  PaymentMethod,
  Teacher,
  TeacherNote,
  StudentNote,
  ExamResult,
} from '../types';
import {
  INITIAL_MADRASA_INFO,
  INITIAL_STUDENTS,
  INITIAL_FEES,
  INITIAL_AIB_TRANSACTIONS,
  INITIAL_REVOLVING_FUND,
  INITIAL_BOARDING_STUDENTS,
  INITIAL_BOARDING_EXPENSES,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_ACCOUNT_CATEGORIES,
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { onSnapshot, collection, doc, setDoc, deleteDoc, getDocs, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  checkStudentIdExists,
  fetchStudentsFromFirestore,
  saveStudentToFirestore,
  updateStudentInFirestore,
  deleteStudentFromFirestore,
  fetchFeesFromFirestore,
  saveFeeToFirestore,
  updateFeeInFirestore,
  deleteFeeFromFirestore,
  fetchAibTransactionsFromFirestore,
  saveAibTransactionToFirestore,
  updateAibTransactionInFirestore,
  deleteAibTransactionFromFirestore,
  fetchRevolvingFundFromFirestore,
  saveRevolvingFundToFirestore,
  updateRevolvingFundInFirestore,
  deleteRevolvingFundFromFirestore,
  fetchBoardingStudentsFromFirestore,
  saveBoardingStudentToFirestore,
  updateBoardingStudentInFirestore,
  deleteBoardingStudentFromFirestore,
  fetchBoardingTransactionsFromFirestore,
  saveBoardingTransactionToFirestore,
  updateBoardingTransactionInFirestore,
  deleteBoardingTransactionFromFirestore,
  fetchAccountsFromFirestore,
  saveAccountTransactionToFirestore,
  updateAccountTransactionInFirestore,
  deleteAccountTransactionFromFirestore,
  fetchSettingsFromFirestore,
  saveSettingsToFirestore,
} from '../lib/firestoreService';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation
  activeSection: NavigationSection;
  activeSubItem: SubNavigationItem;
  setActiveNav: (section: NavigationSection, subItem?: SubNavigationItem) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data states
  students: Student[];
  studentsLoading: boolean;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  viewStudentProfile: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'> & { id?: string }) => Promise<Student>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  checkStudentIdExists: (id: string) => Promise<boolean>;

  fees: FeeRecord[];
  feesLoading: boolean;
  prefillFeeStudentId: string | null;
  setPrefillFeeStudentId: (id: string | null) => void;
  openFeeCollectionForStudent: (studentId: string) => void;
  addFeePayment: (fee: {
    studentId: string;
    studentName: string;
    className: string;
    section?: string;
    feeType: string;
    category?: string;
    month?: string;
    amount: number;
    paidAmount: number;
    paymentDate: string;
    paymentMethod: string;
    note?: string;
  }) => Promise<FeeRecord>;
  updateFeePayment: (
    feeId: string,
    updates: {
      feeType?: string;
      category?: string;
      month?: string;
      amount?: number;
      paidAmount?: number;
      paymentDate?: string;
      paymentMethod?: string;
      note?: string;
    }
  ) => Promise<void>;
  deleteFeePayment: (feeId: string) => Promise<void>;
  updateFeeStatus: (id: string, paidAmount: number) => Promise<void>;

  aibTransactions: AibTransaction[];
  aibTransactionsLoading: boolean;
  addAibTransaction: (item: Omit<AibTransaction, 'id'>) => void;
  updateAibTransaction: (id: string, updates: Partial<AibTransaction>) => Promise<void>;
  deleteAibTransaction: (id: string) => Promise<void>;

  revolvingFund: RevolvingFundTransaction[];
  revolvingFundLoading: boolean;
  addRevolvingFund: (item: Omit<RevolvingFundTransaction, 'id'>) => Promise<void>;
  updateRevolvingFund: (id: string, updates: Partial<RevolvingFundTransaction>) => Promise<void>;
  deleteRevolvingFund: (id: string) => Promise<void>;

  boardingStudents: BoardingStudent[];
  boardingStudentsLoading: boolean;
  addBoardingStudent: (student: Omit<BoardingStudent, 'id'>) => Promise<void>;
  updateBoardingStudent: (id: string, updates: Partial<BoardingStudent>) => Promise<void>;
  deleteBoardingStudent: (id: string) => Promise<void>;

  boardingTransactions: BoardingTransaction[];
  boardingTransactionsLoading: boolean;
  addBoardingTransaction: (tx: Omit<BoardingTransaction, 'id'>) => Promise<void>;
  updateBoardingTransaction: (id: string, updates: Partial<BoardingTransaction>) => Promise<void>;
  deleteBoardingTransaction: (id: string) => Promise<void>;

  boardingExpenses: BoardingExpense[];
  addBoardingExpense: (expense: Omit<BoardingExpense, 'id'>) => void;

  transactions: AccountTransaction[];
  accountsLoading: boolean;
  addTransaction: (tx: Omit<AccountTransaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<AccountTransaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  madrasaInfo: MadrasaInfo;
  updateMadrasaInfo: (info: Partial<MadrasaInfo>) => Promise<void>;

  users: UserAccount[];
  usersLoading: boolean;
  addUser: (user: Omit<UserAccount, 'id'>) => Promise<void>;
  updateUser: (uid: string, updates: Partial<UserAccount>) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;

  classes: AcademicClass[];
  classesLoading: boolean;
  addClass: (cls: Omit<AcademicClass, 'id' | 'totalStudents'>) => Promise<void>;
  updateClass: (id: string, updates: Partial<AcademicClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  academicYears: AcademicYear[];
  academicYearsLoading: boolean;
  addAcademicYear: (year: string) => Promise<void>;
  setActiveAcademicYear: (id: string) => Promise<void>;
  deactivateAcademicYear: (id: string) => Promise<void>;
  deleteAcademicYear: (id: string) => Promise<void>;

  accountCategories: { income: string[]; expense: string[] };
  accountCategoriesFull: AccountCategory[];
  accountCategoriesLoading: boolean;
  addAccountCategory: (cat: Omit<AccountCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccountCategory: (id: string, updates: Partial<AccountCategory>) => Promise<void>;
  deleteAccountCategory: (id: string) => Promise<void>;

  teachers: Teacher[];
  teachersLoading: boolean;
  addTeacher: (teacher: Omit<Teacher, 'id'> & { id?: string }) => Promise<Teacher>;
  updateTeacher: (id: string, updates: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;

  teacherNotes: TeacherNote[];
  addTeacherNote: (note: TeacherNote) => Promise<void>;
  deleteTeacherNote: (noteId: string) => Promise<void>;

  studentNotes: StudentNote[];
  addStudentNote: (note: StudentNote) => Promise<void>;
  deleteStudentNote: (noteId: string) => Promise<void>;

  examResults: ExamResult[];
  examResultsLoading: boolean;
  addExamResult: (result: Omit<ExamResult, 'id'>) => Promise<ExamResult>;
  updateExamResult: (id: string, updates: Partial<ExamResult>) => Promise<void>;
  deleteExamResult: (id: string) => Promise<void>;

  // Notifications
  notifications: ToastNotification[];
  addNotification: (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message?: string
  ) => void;
  dismissNotification: (id: string) => void;

  // System Controls
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  resetWebsiteData: () => void;
  refreshData: () => Promise<void>;
  isRefreshing: boolean;
  systemRestart: () => Promise<void>;
  isRestarting: boolean;

  // Language Support
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'madrasa_office_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser: authFirebaseUser, adminProfile, logout: authLogout } = useAuth();

  // Navigation State
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('madrasa_language');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('madrasa_language', lang);
    } catch (e) {
      console.warn('Could not write language preference to localStorage:', e);
    }
  };

  const t = (key: string): string => {
    return translateText(key, language);
  };

  const [activeSection, setActiveSection] = useState<NavigationSection>('dashboard');
  const [activeSubItem, setActiveSubItem] = useState<SubNavigationItem>('student-list');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState<boolean>(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const viewStudentProfile = (id: string) => {
    setSelectedStudentId(id);
    setActiveNav('students', 'student-information');
  };

  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [feesLoading, setFeesLoading] = useState<boolean>(true);
  const [prefillFeeStudentId, setPrefillFeeStudentId] = useState<string | null>(null);

  const openFeeCollectionForStudent = (studentId: string) => {
    setPrefillFeeStudentId(studentId);
    setActiveNav('student-fees', 'fee-collection');
  };

  const [aibTransactions, setAibTransactions] = useState<AibTransaction[]>([]);
  const [aibTransactionsLoading, setAibTransactionsLoading] = useState<boolean>(true);

  const [revolvingFund, setRevolvingFund] = useState<RevolvingFundTransaction[]>([]);
  const [revolvingFundLoading, setRevolvingFundLoading] = useState<boolean>(true);

  const [boardingStudents, setBoardingStudents] = useState<BoardingStudent[]>([]);
  const [boardingStudentsLoading, setBoardingStudentsLoading] = useState<boolean>(true);

  const [boardingTransactions, setBoardingTransactions] = useState<BoardingTransaction[]>([]);
  const [boardingTransactionsLoading, setBoardingTransactionsLoading] = useState<boolean>(true);

  const [boardingExpenses, setBoardingExpenses] = useState<BoardingExpense[]>([]);

  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [accountsLoading, setAccountsLoading] = useState<boolean>(true);

  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_exam_results`);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'EXAM-1001',
              studentId: 'STU-1001',
              studentName: 'আব্দুল্লাহ আল মামুন',
              className: 'হিফজ বিভাগ',
              section: 'ক',
              examName: '১ম টার্ম পরীক্ষা ২০২৬',
              academicYear: '২০২৬',
              subjects: [
                { subjectName: 'কুরআন মাজিদ ও তাজবীদ', fullMarks: 100, obtainedMarks: 85, grade: 'A+', gp: 5.0 },
                { subjectName: 'আকাইদ ও ফিকহ', fullMarks: 100, obtainedMarks: 78, grade: 'A', gp: 4.0 },
                { subjectName: 'আরবি সাহিত্য', fullMarks: 100, obtainedMarks: 82, grade: 'A+', gp: 5.0 },
                { subjectName: 'বাংলা', fullMarks: 100, obtainedMarks: 75, grade: 'A', gp: 4.0 },
                { subjectName: 'ইংরেজি', fullMarks: 100, obtainedMarks: 70, grade: 'A-', gp: 3.5 },
                { subjectName: 'গণিত', fullMarks: 100, obtainedMarks: 88, grade: 'A+', gp: 5.0 },
              ],
              totalMarks: 600,
              totalObtained: 478,
              percentage: 79.67,
              gpa: 4.42,
              finalGrade: 'A+',
              remarks: 'উত্তম ফলাফল! পড়াশোনায় আরও মনোযোগী হতে হবে।',
              date: '2026-06-15',
            },
          ];
    } catch {
      return [];
    }
  });
  const [examResultsLoading, setExamResultsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_exam_results`, JSON.stringify(examResults));
    } catch (e) {
      console.error(e);
    }
  }, [examResults]);

  const addExamResult = async (result: Omit<ExamResult, 'id'>): Promise<ExamResult> => {
    const newId = `EXAM-${Date.now().toString().slice(-6)}`;
    const newRecord: ExamResult = { ...result, id: newId };
    setExamResults((prev) => [newRecord, ...prev]);
    addNotification('success', 'ফলাফল সংরক্ষিত', `${result.studentName}-এর পরীক্ষার ফলাফল সফলভাবে যোগ করা হয়েছে।`);
    return newRecord;
  };

  const updateExamResult = async (id: string, updates: Partial<ExamResult>): Promise<void> => {
    setExamResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
    addNotification('success', 'ফলাফল আপডেট', `পরীক্ষার ফলাফল সফলভাবে হালনাগাদ করা হয়েছে।`);
  };

  const deleteExamResult = async (id: string): Promise<void> => {
    setExamResults((prev) => prev.filter((r) => r.id !== id));
    addNotification('info', 'ফলাফল মুছে ফেলা হয়েছে', `পরীক্ষার ফলাফল সফলভাবে মুছে ফেলা হয়েছে।`);
  };

  const [madrasaInfo, setMadrasaInfo] = useState<MadrasaInfo>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_info`);
      return saved ? JSON.parse(saved) : INITIAL_MADRASA_INFO;
    } catch {
      return INITIAL_MADRASA_INFO;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);

  const [classes, setClasses] = useState<AcademicClass[]>([]);
  const [classesLoading, setClassesLoading] = useState<boolean>(true);

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [academicYearsLoading, setAcademicYearsLoading] = useState<boolean>(true);

  const [accountCategoriesFull, setAccountCategoriesFull] = useState<AccountCategory[]>([]);
  const [accountCategoriesLoading, setAccountCategoriesLoading] = useState<boolean>(true);

  const accountCategories = useMemo(() => {
    const activeCats = accountCategoriesFull.filter(c => c.status === 'Active');
    const income = activeCats.filter(c => c.type === 'income').map(c => c.name);
    const expense = activeCats.filter(c => c.type === 'expense').map(c => c.name);

    return {
      income: income.length > 0 ? income : INITIAL_ACCOUNT_CATEGORIES.income,
      expense: expense.length > 0 ? expense : INITIAL_ACCOUNT_CATEGORIES.expense,
    };
  }, [accountCategoriesFull]);

  // Teachers and Notes State
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem('madrasa_teachers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'TCH-1001',
        name: 'মাওলানা মুফতি হাবিবুর রহমান',
        age: 38,
        education: 'দাওরায়ে হাদিস, তাফসির বিভাগ',
        previousEmployment: 'জামিয়া আরাবিয়া মাদরাসা (৮ বছর)',
        joiningDate: '2023-01-10',
        salary: 15000,
        phone: '01811223344',
        address: 'ঢাকা, বাংলাদেশ',
        status: 'Active',
        certificates: [],
      },
    ];
  });
  const [teachersLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('madrasa_teachers', JSON.stringify(teachers));
    } catch {}
  }, [teachers]);

  const addTeacher = async (teacher: Omit<Teacher, 'id'> & { id?: string }) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: teacher.id || `TCH-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    addNotification('success', 'Teacher Recruited', `Teacher ${newTeacher.name} successfully added.`);
    return newTeacher;
  };

  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
    addNotification('success', 'Teacher Updated', 'Teacher information successfully updated.');
  };

  const deleteTeacher = async (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    addNotification('success', 'Teacher Deleted', 'Teacher record removed.');
  };

  const [teacherNotes, setTeacherNotes] = useState<TeacherNote[]>(() => {
    try {
      const saved = localStorage.getItem('madrasa_teacher_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('madrasa_teacher_notes', JSON.stringify(teacherNotes));
    } catch {}
  }, [teacherNotes]);

  const addTeacherNote = async (note: TeacherNote) => {
    setTeacherNotes((prev) => [note, ...prev]);
    addNotification('success', 'Note Added', 'Teacher performance note saved.');
  };

  const deleteTeacherNote = async (noteId: string) => {
    setTeacherNotes((prev) => prev.filter((n) => n.id !== noteId));
    addNotification('success', 'Note Deleted', 'Note removed.');
  };

  const [studentNotes, setStudentNotes] = useState<StudentNote[]>(() => {
    try {
      const saved = localStorage.getItem('madrasa_student_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('madrasa_student_notes', JSON.stringify(studentNotes));
    } catch {}
  }, [studentNotes]);

  const addStudentNote = async (note: StudentNote) => {
    setStudentNotes((prev) => [note, ...prev]);
    addNotification('success', 'Student Note Added', 'Student behavior/achievement note saved.');
  };

  const deleteStudentNote = async (noteId: string) => {
    setStudentNotes((prev) => prev.filter((n) => n.id !== noteId));
    addNotification('success', 'Student Note Deleted', 'Note removed.');
  };

  // Sync currentUser with AuthContext
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (adminProfile) {
      return {
        id: adminProfile.uid,
        name: adminProfile.name,
        email: adminProfile.email,
        role: adminProfile.role === 'admin' ? 'Super Admin' : 'Viewer',
        status: 'Active',
        lastActive: 'Just now',
      };
    }
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (adminProfile) {
      setCurrentUser({
        id: adminProfile.uid,
        name: adminProfile.name,
        email: adminProfile.email,
        role: adminProfile.role === 'admin' ? 'Super Admin' : 'Viewer',
        status: 'Active',
        lastActive: 'Active now',
      });
    }
  }, [adminProfile]);

  // Notifications
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  // Sync to local storage on change (excluding real Firestore collections: students, fees, aibTransactions, revolvingFund, boarding, accounts)
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_info`, JSON.stringify(madrasaInfo));
    } catch {
      // Local storage fallback
    }
  }, [
    madrasaInfo,
  ]);

  // Real-time Firestore sync for Students collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setStudents([]);
      setStudentsLoading(false);
      return;
    }

    setStudentsLoading(true);
    const pathForOnSnapshot = 'students';

    const unsubscribe = onSnapshot(
      collection(db, pathForOnSnapshot),
      (snapshot) => {
        const studentList: Student[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreStudent;
          return {
            id: data.studentId || docSnap.id,
            name: data.studentName,
            fatherName: data.fatherName,
            motherName: data.motherName || '',
            className: data.className,
            section: data.section || 'A',
            phone: data.phone || '',
            dob: data.dateOfBirth || '',
            address: data.address || '',
            admissionDate: data.admissionDate || '',
            status: data.status || 'Active',
            photoUrl: data.photoUrl || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        setStudents(studentList);
        setStudentsLoading(false);
      },
      (error) => {
        console.error('Firestore students onSnapshot error:', error);
        setStudentsLoading(false);
        handleFirestoreError(error, OperationType.GET, pathForOnSnapshot);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Student Fees collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setFees([]);
      setFeesLoading(false);
      return;
    }

    setFeesLoading(true);
    const pathForFees = 'studentFees';

    const unsubscribe = onSnapshot(
      collection(db, pathForFees),
      (snapshot) => {
        const feeList: FeeRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreStudentFee;
          const id = data.feeId || docSnap.id;
          const amount = Number(data.amount) || 0;
          const paidAmount = Number(data.paidAmount) || 0;
          const dueAmount = Math.max(0, amount - paidAmount);
          const status: FeeStatus =
            paidAmount >= amount ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Due';

          return {
            id,
            feeId: id,
            studentId: data.studentId,
            studentName: data.studentName,
            className: data.className,
            section: data.section || '',
            feeType: data.feeType,
            category: data.category || '',
            totalFee: amount,
            amount,
            paid: paidAmount,
            paidAmount,
            due: dueAmount,
            dueAmount,
            lastPaymentDate: data.paymentDate || '',
            paymentDate: data.paymentDate || '',
            status,
            receiptNo: id,
            paymentMethod: data.paymentMethod || 'Cash',
            month: data.month || '',
            note: data.note || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        // Sort by paymentDate or createdAt descending
        feeList.sort((a, b) => {
          const dateA = a.paymentDate || a.createdAt || '';
          const dateB = b.paymentDate || b.createdAt || '';
          return dateB.localeCompare(dateA);
        });

        setFees(feeList);
        setFeesLoading(false);
      },
      (error) => {
        console.error('Firestore studentFees onSnapshot error:', error);
        setFeesLoading(false);
        handleFirestoreError(error, OperationType.GET, pathForFees);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Aib Transactions collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setAibTransactions([]);
      setAibTransactionsLoading(false);
      return;
    }

    setAibTransactionsLoading(true);
    const pathForAib = 'aibTransactions';

    const unsubscribe = onSnapshot(
      collection(db, pathForAib),
      (snapshot) => {
        const aibList: AibTransaction[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreAibTransaction;
          const id = data.transactionId || docSnap.id;
          return {
            id,
            transactionId: id,
            date: data.date,
            type: data.type === 'collection' ? 'Collection' : 'Expense',
            category: data.category,
            description: data.description,
            amount: Number(data.amount) || 0,
            paymentMethod: data.paymentMethod || 'Cash',
            reference: data.reference || '',
            note: data.note || '',
            status: data.status || 'Completed',
            createdBy: data.createdBy || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        // Sort by date or createdAt descending
        aibList.sort((a, b) => {
          const dateA = a.date || a.createdAt || '';
          const dateB = b.date || b.createdAt || '';
          return dateB.localeCompare(dateA);
        });

        setAibTransactions(aibList);
        setAibTransactionsLoading(false);
      },
      (error) => {
        console.error('Firestore aibTransactions onSnapshot error:', error);
        setAibTransactionsLoading(false);
        handleFirestoreError(error, OperationType.GET, pathForAib);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Revolving Fund Transactions collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setRevolvingFund([]);
      setRevolvingFundLoading(false);
      return;
    }

    setRevolvingFundLoading(true);
    const pathForRf = 'revolvingFundTransactions';

    const unsubscribe = onSnapshot(
      collection(db, pathForRf),
      (snapshot) => {
        const rfList: RevolvingFundTransaction[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreRevolvingFundTransaction;
          const id = data.transactionId || docSnap.id;
          return {
            id,
            transactionId: id,
            date: data.date,
            type: data.type === 'collection' ? 'Collection' : data.type === 'distribution' ? 'Distribution' : 'Return',
            description: data.description,
            amount: Number(data.amount) || 0,
            beneficiaryOrContributor: data.personName || '',
            personName: data.personName || '',
            paymentMethod: data.paymentMethod || 'Cash',
            status: data.status || 'Completed',
            reference: data.reference || '',
            note: data.note || '',
            createdBy: data.createdBy || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        // Sort by date or createdAt descending
        rfList.sort((a, b) => {
          const dateA = a.date || a.createdAt || '';
          const dateB = b.date || b.createdAt || '';
          return dateB.localeCompare(dateA);
        });

        setRevolvingFund(rfList);
        setRevolvingFundLoading(false);
      },
      (error) => {
        console.error('Firestore revolvingFundTransactions onSnapshot error:', error);
        setRevolvingFundLoading(false);
        handleFirestoreError(error, OperationType.GET, pathForRf);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Boarding Students collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setBoardingStudents([]);
      setBoardingStudentsLoading(false);
      return;
    }

    setBoardingStudentsLoading(true);
    const pathForBStudents = 'boardingStudents';

    const unsubscribe = onSnapshot(
      collection(db, pathForBStudents),
      (snapshot) => {
        const bList: BoardingStudent[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreBoardingStudent;
          const id = data.studentId || docSnap.id;
          return {
            id,
            studentId: id,
            name: data.studentName || '',
            studentName: data.studentName || '',
            className: data.className || '',
            section: data.section || 'A',
            roomNumber: data.room || '',
            room: data.room || '',
            bedNumber: data.bedNumber || '',
            monthlyFee: 120, // default fee
            feeStatus: 'Due',
            supervisor: 'Ustadh Huzaifa', // default supervisor
            joiningDate: data.joiningDate || '',
            boardingStatus: data.boardingStatus || 'Active',
            guardianName: data.guardianName || '',
            guardianPhone: data.guardianPhone || '',
            note: data.note || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        setBoardingStudents(bList);
        setBoardingStudentsLoading(false);
      },
      (error) => {
        console.error('Firestore boardingStudents onSnapshot error:', error);
        setBoardingStudentsLoading(false);
        handleFirestoreError(error, OperationType.GET, pathForBStudents);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Boarding Transactions collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setBoardingTransactions([]);
      setBoardingTransactionsLoading(false);
      return;
    }

    setBoardingTransactionsLoading(true);
    const pathForBTx = 'boardingTransactions';

    const unsubscribe = onSnapshot(
      collection(db, pathForBTx),
      (snapshot) => {
        const txList: BoardingTransaction[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreBoardingTransaction;
          const id = data.transactionId || docSnap.id;
          return {
            id,
            transactionId: id,
            studentId: data.studentId || '',
            studentName: data.studentName || '',
            date: data.date,
            type: data.type,
            category: data.category,
            description: data.description,
            amount: Number(data.amount) || 0,
            paymentMethod: data.paymentMethod || 'Cash',
            status: data.status || 'Completed',
            reference: data.reference || '',
            note: data.note || '',
            createdBy: data.createdBy || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        // Sort by date or createdAt descending
        txList.sort((a, b) => {
          const dateA = a.date || a.createdAt || '';
          const dateB = b.date || b.createdAt || '';
          return dateB.localeCompare(dateA);
        });

        setBoardingTransactions(txList);
        setBoardingTransactionsLoading(false);
      },
      (error) => {
        console.error('Firestore boardingTransactions onSnapshot error:', error);
        setBoardingTransactionsLoading(false);
        handleFirestoreError(error, OperationType.GET, pathForBTx);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for General Accounts collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setTransactions([]);
      setAccountsLoading(false);
      return;
    }

    setAccountsLoading(true);
    const pathForAccounts = 'accounts';

    const unsubscribe = onSnapshot(
      collection(db, pathForAccounts),
      (snapshot) => {
        const txList: AccountTransaction[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreAccountTransaction;
          const id = data.transactionId || docSnap.id;
          return {
            id,
            transactionId: id,
            date: data.date,
            type: data.type === 'income' ? 'Income' : 'Expense',
            category: data.category,
            description: data.description,
            amount: Number(data.amount) || 0,
            paymentMethod: data.paymentMethod || 'Cash',
            reference: data.reference || '',
            referenceNo: data.reference || '',
            status: (data.status as any) || 'Completed',
            createdBy: data.createdBy || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        // Sort by date or createdAt descending
        txList.sort((a, b) => {
          const dateA = a.date || a.createdAt || '';
          const dateB = b.date || b.createdAt || '';
          return dateB.localeCompare(dateA);
        });

        setTransactions(txList);
        setAccountsLoading(false);
      },
      (error) => {
        console.error('Firestore accounts onSnapshot error:', error);
        setAccountsLoading(false);
        handleFirestoreError(error, OperationType.GET, pathForAccounts);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Madrasa Info doc
  useEffect(() => {
    if (!authFirebaseUser) return;

    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'madrasaInformation'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setMadrasaInfo({
            name: data.name || INITIAL_MADRASA_INFO.name,
            tagline: data.tagline || INITIAL_MADRASA_INFO.tagline,
            established: data.established || INITIAL_MADRASA_INFO.established,
            regNumber: data.regNumber || INITIAL_MADRASA_INFO.regNumber,
            principal: data.principal || INITIAL_MADRASA_INFO.principal,
            phone: data.phone || INITIAL_MADRASA_INFO.phone,
            email: data.email || INITIAL_MADRASA_INFO.email,
            website: data.website || INITIAL_MADRASA_INFO.website,
            address: data.address || INITIAL_MADRASA_INFO.address,
            bankName: data.bankName || INITIAL_MADRASA_INFO.bankName,
            accountNumber: data.accountNumber || INITIAL_MADRASA_INFO.accountNumber,
            branch: data.branch || INITIAL_MADRASA_INFO.branch,
            logo: data.logo || INITIAL_MADRASA_INFO.logo,
            description: data.description || '',
          });
        }
      },
      (error) => {
        console.error('Firestore madrasaInformation snapshot error:', error);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Users collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setUsers([]);
      setUsersLoading(false);
      return;
    }

    setUsersLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const userList: UserAccount[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as AdminUser;
          const uid = data.uid || docSnap.id;
          return {
            id: uid,
            name: data.name || '',
            email: data.email || '',
            role: data.role === 'admin' ? 'Super Admin' : 'Staff' as any,
            status: data.status === 'active' ? 'Active' : 'Inactive' as any,
            lastActive: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'Active now',
          };
        });

        setUsers(userList);
        setUsersLoading(false);
      },
      (error) => {
        console.error('Firestore users snapshot error:', error);
        setUsersLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Classes collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setClasses([]);
      setClassesLoading(false);
      return;
    }

    setClassesLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'classes'),
      (snapshot) => {
        const classList: AcademicClass[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || '',
            sections: data.sections || ['A'],
            classTeacher: data.classTeacher || 'Unassigned',
            monthlyFee: Number(data.monthlyFee) || 50,
            totalStudents: Number(data.totalStudents) || 0,
            classCode: data.classCode || '',
            status: data.status || 'Active',
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt || '',
          };
        });

        // If collection is empty, seed with initial mock classes
        if (classList.length === 0 && snapshot.metadata.fromCache === false) {
          // Let's seed classes dynamically in background so they exist
          INITIAL_CLASSES.forEach((cls) => {
            setDoc(doc(db, 'classes', cls.id), {
              name: cls.name,
              sections: cls.sections,
              classTeacher: cls.classTeacher,
              monthlyFee: cls.monthlyFee,
              totalStudents: cls.totalStudents,
              classCode: cls.name.replace(/\s+/g, '-').toUpperCase(),
              status: 'Active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }).catch(console.error);
          });
        }

        setClasses(classList);
        setClassesLoading(false);
      },
      (error) => {
        console.error('Firestore classes snapshot error:', error);
        setClassesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Academic Years collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setAcademicYears([]);
      setAcademicYearsLoading(false);
      return;
    }

    setAcademicYearsLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'academicYears'),
      (snapshot) => {
        const ayList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as AcademicYear;
          return {
            id: docSnap.id,
            year: data.year,
            status: data.status || 'Inactive',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        // If empty, seed a default active year
        if (ayList.length === 0 && snapshot.metadata.fromCache === false) {
          setDoc(doc(db, 'academicYears', 'AY-2026'), {
            year: '2026',
            status: 'Active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }).catch(console.error);
        }

        // Sort by year descending
        ayList.sort((a, b) => b.year.localeCompare(a.year));

        setAcademicYears(ayList);
        setAcademicYearsLoading(false);
      },
      (error) => {
        console.error('Firestore academicYears snapshot error:', error);
        setAcademicYearsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  // Real-time Firestore sync for Account Categories collection
  useEffect(() => {
    if (!authFirebaseUser) {
      setAccountCategoriesFull([]);
      setAccountCategoriesLoading(false);
      return;
    }

    setAccountCategoriesLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'accountCategories'),
      (snapshot) => {
        const catList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as AccountCategory;
          return {
            id: docSnap.id,
            name: data.name,
            type: data.type,
            description: data.description || '',
            status: data.status || 'Active',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        // Seed default categories if empty
        if (catList.length === 0 && snapshot.metadata.fromCache === false) {
          const DEFAULT_INCOME_CATS = [
            'Donation',
            'Admission Income',
            'Tuition Income',
            'Service Income',
            'Other Income',
          ];
          const DEFAULT_EXPENSE_CATS = [
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
          DEFAULT_INCOME_CATS.forEach((cat, idx) => {
            setDoc(doc(db, 'accountCategories', `INC-CAT-${idx + 1}`), {
              name: cat,
              type: 'income',
              description: `${cat} accounting ledger head`,
              status: 'Active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }).catch(console.error);
          });
          DEFAULT_EXPENSE_CATS.forEach((cat, idx) => {
            setDoc(doc(db, 'accountCategories', `EXP-CAT-${idx + 1}`), {
              name: cat,
              type: 'expense',
              description: `${cat} voucher ledger head`,
              status: 'Active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }).catch(console.error);
          });
        }

        setAccountCategoriesFull(catList);
        setAccountCategoriesLoading(false);
      },
      (error) => {
        console.error('Firestore accountCategories snapshot error:', error);
        setAccountCategoriesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authFirebaseUser]);

  const addNotification = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message?: string
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newNotif: ToastNotification = { id, type, title, message };
    setNotifications((prev) => [...prev, newNotif]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const setActiveNav = (section: NavigationSection, subItem?: SubNavigationItem) => {
    setActiveSection(section);
    if (subItem) {
      setActiveSubItem(subItem);
    } else {
      switch (section) {
        case 'students':
          setActiveSubItem('student-list');
          break;
        case 'student-fees':
          setActiveSubItem('monthly-fees');
          break;
        case 'boarding':
          setActiveSubItem('boarding-students');
          break;
        case 'accounts':
          setActiveSubItem('income');
          break;
        case 'settings':
          setActiveSubItem('madrasa-information');
          break;
        default:
          break;
      }
    }
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Student Actions with Firestore
  const addStudent = async (newStudentData: Omit<Student, 'id'> & { id?: string }): Promise<Student> => {
    const studentId = newStudentData.id ? newStudentData.id.trim() : `STD-${1000 + students.length + 1}`;

    // 1. Check if ID already exists
    const exists = await checkStudentIdExists(studentId);
    if (exists) {
      throw new Error(`Student ID "${studentId}" already exists. Please enter a unique Student ID.`);
    }

    const now = new Date().toISOString();
    const firestoreRecord: FirestoreStudent = {
      studentId,
      studentName: newStudentData.name.trim(),
      fatherName: newStudentData.fatherName.trim(),
      motherName: newStudentData.motherName?.trim() || '',
      dateOfBirth: newStudentData.dob || '',
      phone: newStudentData.phone?.trim() || '',
      address: newStudentData.address?.trim() || '',
      className: newStudentData.className,
      section: newStudentData.section || 'A',
      admissionDate: newStudentData.admissionDate,
      status: newStudentData.status,
      photoUrl: newStudentData.photoUrl || '',
      createdAt: now,
      updatedAt: now,
    };

    // Save directly to Firestore
    await saveStudentToFirestore(firestoreRecord);

    const createdStudent: Student = {
      ...newStudentData,
      id: studentId,
      createdAt: now,
      updatedAt: now,
    };

    // Also link to boarding if requested
    if (newStudentData.boarding) {
      setBoardingStudents((prev) => [
        {
          id: `BRD-${Date.now().toString().slice(-4)}`,
          studentId: createdStudent.id,
          name: createdStudent.name,
          className: createdStudent.className,
          roomNumber: newStudentData.roomNo || 'Dorm-General',
          bedNumber: 'Allocated',
          monthlyFee: 120,
          feeStatus: 'Due',
          supervisor: 'Ustadh Huzaifa',
          joiningDate: createdStudent.admissionDate,
        },
        ...prev,
      ]);
    }

    addNotification(
      'success',
      'Student Admitted',
      `${createdStudent.name} registered with ID ${createdStudent.id}`
    );
    return createdStudent;
  };

  const updateStudent = async (id: string, updated: Partial<Student>): Promise<void> => {
    const now = new Date().toISOString();
    const updatePayload: Partial<FirestoreStudent> = {
      ...(updated.name && { studentName: updated.name.trim() }),
      ...(updated.fatherName && { fatherName: updated.fatherName.trim() }),
      ...(updated.motherName !== undefined && { motherName: updated.motherName.trim() }),
      ...(updated.dob !== undefined && { dateOfBirth: updated.dob }),
      ...(updated.phone !== undefined && { phone: updated.phone.trim() }),
      ...(updated.address !== undefined && { address: updated.address.trim() }),
      ...(updated.className && { className: updated.className }),
      ...(updated.section && { section: updated.section }),
      ...(updated.admissionDate && { admissionDate: updated.admissionDate }),
      ...(updated.status && { status: updated.status }),
      ...(updated.photoUrl !== undefined && { photoUrl: updated.photoUrl }),
      updatedAt: now,
    };

    await updateStudentInFirestore(id, updatePayload);

    addNotification(
      'success',
      'Student Updated',
      `Student ID ${id} information has been updated`
    );
  };

  const deleteStudent = async (id: string): Promise<void> => {
    const student = students.find((s) => s.id === id);
    if (!student) {
      throw new Error('Student not found in registry');
    }

    // Delete student document from Firestore
    await deleteStudentFromFirestore(id);

    // Safely handle related boarding student data
    try {
      const boardingSnap = await getDoc(doc(db, 'boardingStudents', id));
      if (boardingSnap.exists()) {
        await deleteDoc(doc(db, 'boardingStudents', id));
      }
    } catch (boardingErr) {
      console.warn('Failed to clean up boarding record for deleted student:', boardingErr);
    }

    if (selectedStudentId === id) {
      setSelectedStudentId(null);
    }

    addNotification(
      'success',
      'Student Deleted Successfully',
      `${student.name} (ID: ${id}) has been permanently deleted from the registry.`
    );
  };

  // Fee Actions with real Firestore persistence
  const addFeePayment = async (newFee: {
    studentId: string;
    studentName: string;
    className: string;
    section?: string;
    feeType: string;
    category?: string;
    month?: string;
    amount: number;
    paidAmount: number;
    paymentDate: string;
    paymentMethod: string;
    note?: string;
  }): Promise<FeeRecord> => {
    const amount = Number(newFee.amount) || 0;
    const paidAmount = Number(newFee.paidAmount) || 0;

    if (amount <= 0) {
      throw new Error('Total Amount must be greater than 0.');
    }
    if (paidAmount < 0) {
      throw new Error('Paid Amount cannot be negative.');
    }
    if (paidAmount > amount) {
      throw new Error('Paid Amount cannot exceed Total Amount.');
    }

    const feeId = `FEE-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();
    const dueAmount = Math.max(0, amount - paidAmount);
    const status: FeeStatus =
      paidAmount >= amount ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Due';

    const firestoreRecord: FirestoreStudentFee = {
      feeId,
      studentId: newFee.studentId.trim(),
      studentName: newFee.studentName.trim(),
      className: newFee.className.trim(),
      section: newFee.section?.trim() || '',
      feeType: newFee.feeType,
      category: newFee.category?.trim() || '',
      month: newFee.month?.trim() || '',
      amount,
      paidAmount,
      dueAmount,
      paymentDate: newFee.paymentDate || now.split('T')[0],
      paymentMethod: newFee.paymentMethod || 'Cash',
      note: newFee.note?.trim() || '',
      status,
      createdAt: now,
      updatedAt: now,
    };

    await saveFeeToFirestore(feeId, firestoreRecord);

    addNotification(
      'success',
      'Fee Collection Recorded',
      `Receipt #${feeId} generated for ${newFee.studentName} ($${paidAmount} paid)`
    );

    return {
      id: feeId,
      ...firestoreRecord,
      totalFee: amount,
      paid: paidAmount,
      due: dueAmount,
      lastPaymentDate: firestoreRecord.paymentDate,
    };
  };

  const updateFeePayment = async (
    feeId: string,
    updates: {
      feeType?: string;
      category?: string;
      month?: string;
      amount?: number;
      paidAmount?: number;
      paymentDate?: string;
      paymentMethod?: string;
      note?: string;
    }
  ): Promise<void> => {
    const existingFee = fees.find((f) => f.id === feeId);
    const amount = updates.amount !== undefined ? Number(updates.amount) : (existingFee?.totalFee || 0);
    const paidAmount = updates.paidAmount !== undefined ? Number(updates.paidAmount) : (existingFee?.paid || 0);

    if (amount <= 0) {
      throw new Error('Total Amount must be greater than 0.');
    }
    if (paidAmount < 0) {
      throw new Error('Paid Amount cannot be negative.');
    }
    if (paidAmount > amount) {
      throw new Error('Paid Amount cannot exceed Total Amount.');
    }

    const dueAmount = Math.max(0, amount - paidAmount);
    const status: FeeStatus =
      paidAmount >= amount ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Due';

    const firestorePayload: Partial<FirestoreStudentFee> = {
      ...(updates.feeType && { feeType: updates.feeType }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.month !== undefined && { month: updates.month }),
      amount,
      paidAmount,
      dueAmount,
      status,
      ...(updates.paymentDate && { paymentDate: updates.paymentDate }),
      ...(updates.paymentMethod && { paymentMethod: updates.paymentMethod }),
      ...(updates.note !== undefined && { note: updates.note }),
      updatedAt: new Date().toISOString(),
    };

    await updateFeeInFirestore(feeId, firestorePayload);

    addNotification(
      'success',
      'Fee Transaction Updated',
      `Receipt #${feeId} has been updated. Status: ${status}`
    );
  };

  const deleteFeePayment = async (feeId: string): Promise<void> => {
    const existingFee = fees.find((f) => f.id === feeId);
    await deleteFeeFromFirestore(feeId);

    addNotification(
      'info',
      'Fee Transaction Deleted',
      `Receipt #${feeId} (${existingFee?.feeType || 'Fee'}) has been removed from Firestore.`
    );
  };

  const updateFeeStatus = async (id: string, paidAmount: number): Promise<void> => {
    const f = fees.find((item) => item.id === id);
    if (!f) return;
    const newPaid = f.paid + paidAmount;
    await updateFeePayment(id, { paidAmount: newPaid });
  };

  // Aib Actions
  const addAibTransaction = (item: Omit<AibTransaction, 'id'>) => {
    const txId = `AIB-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    if (authFirebaseUser) {
      saveAibTransactionToFirestore({
        transactionId: txId,
        date: item.date,
        type: item.type === 'Collection' || item.type === 'collection' ? 'collection' : 'expense',
        category: item.category,
        description: item.description,
        amount: item.amount,
        paymentMethod: item.paymentMethod || 'Cash',
        reference: item.reference || '',
        note: item.note || '',
        createdBy: authFirebaseUser.uid,
        createdAt: now,
        updatedAt: now,
      }).catch((err) => {
        console.error('Failed to save Aib transaction to Firestore:', err);
      });
    }

    addNotification(
      'success',
      'Aib Entry Saved',
      `${item.type}: $${item.amount} recorded for ${item.category}`
    );
  };

  const updateAibTransaction = async (
    id: string,
    updates: Partial<AibTransaction>
  ): Promise<void> => {
    const now = new Date().toISOString();
    const firestorePayload: Partial<FirestoreAibTransaction> = {
      ...(updates.date && { date: updates.date }),
      ...(updates.type && { type: updates.type === 'Collection' || updates.type === 'collection' ? 'collection' : 'expense' }),
      ...(updates.category && { category: updates.category }),
      ...(updates.description && { description: updates.description }),
      ...(updates.amount !== undefined && { amount: Number(updates.amount) || 0 }),
      ...(updates.paymentMethod !== undefined && { paymentMethod: updates.paymentMethod }),
      ...(updates.reference !== undefined && { reference: updates.reference }),
      ...(updates.note !== undefined && { note: updates.note }),
      ...(updates.status !== undefined && { status: updates.status }),
      updatedAt: now,
    };

    await updateAibTransactionInFirestore(id, firestorePayload);

    addNotification(
      'success',
      'Aib Entry Updated',
      `Transaction ${id} updated successfully.`
    );
  };

  const deleteAibTransaction = async (id: string): Promise<void> => {
    await deleteAibTransactionFromFirestore(id);

    addNotification(
      'info',
      'Aib Entry Deleted',
      `Transaction ${id} removed from Firestore.`
    );
  };

  // Revolving Fund Actions
  const addRevolvingFund = async (item: Omit<RevolvingFundTransaction, 'id'>) => {
    const rfId = `RF-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const typeLower = item.type?.toLowerCase() as 'collection' | 'distribution' | 'return';
    const statusVal = item.status || 'Completed';

    // 14. FINANCIAL SAFETY: Check solvency before saving completed distribution
    if (typeLower === 'distribution' && statusVal === 'Completed') {
      // Calculate projected balance
      let currentCol = 0;
      let currentRet = 0;
      let currentDist = 0;
      revolvingFund.forEach((t) => {
        if (t.status === 'Completed') {
          const tType = t.type?.toLowerCase();
          if (tType === 'collection') currentCol += Number(t.amount) || 0;
          else if (tType === 'return') currentRet += Number(t.amount) || 0;
          else if (tType === 'distribution') currentDist += Number(t.amount) || 0;
        }
      });
      const currentBalance = currentCol + currentRet - currentDist;
      if (currentBalance < item.amount) {
        throw new Error('Insufficient Revolving Fund balance for this distribution.');
      }
    }

    if (authFirebaseUser) {
      await saveRevolvingFundToFirestore({
        transactionId: rfId,
        date: item.date,
        type: typeLower,
        personName: item.beneficiaryOrContributor || item.personName || 'Contributor',
        description: item.description,
        amount: item.amount,
        paymentMethod: item.paymentMethod || 'Cash',
        status: statusVal,
        reference: item.reference || '',
        note: item.note || '',
        createdBy: authFirebaseUser.uid,
        createdAt: now,
        updatedAt: now,
      });
    }

    addNotification(
      'success',
      'Fund Entry Recorded',
      `${item.type}: $${item.amount} successfully processed.`
    );
  };

  const updateRevolvingFund = async (
    id: string,
    updates: Partial<RevolvingFundTransaction>
  ): Promise<void> => {
    const existing = revolvingFund.find((t) => t.id === id);
    if (!existing) return;

    const finalType = (updates.type || existing.type)?.toLowerCase() as 'collection' | 'distribution' | 'return';
    const finalStatus = updates.status || existing.status;
    const finalAmount = updates.amount !== undefined ? Number(updates.amount) : existing.amount;

    // 14. FINANCIAL SAFETY: Check solvency before saving updated completed distribution
    if (finalType === 'distribution' && finalStatus === 'Completed') {
      let currentCol = 0;
      let currentRet = 0;
      let currentDist = 0;
      revolvingFund.forEach((t) => {
        if (t.id === id) return; // Exclude original
        if (t.status === 'Completed') {
          const tType = t.type?.toLowerCase();
          if (tType === 'collection') currentCol += Number(t.amount) || 0;
          else if (tType === 'return') currentRet += Number(t.amount) || 0;
          else if (tType === 'distribution') currentDist += Number(t.amount) || 0;
        }
      });
      // Projected balance if we apply the update
      const projectedBalance = currentCol + currentRet - (currentDist + finalAmount);
      if (projectedBalance < 0) {
        throw new Error('Insufficient Revolving Fund balance for this distribution.');
      }
    }

    // Safety check for reduction of capital
    if (finalType !== 'distribution' && finalStatus === 'Completed') {
      let currentCol = 0;
      let currentRet = 0;
      let currentDist = 0;
      revolvingFund.forEach((t) => {
        if (t.id === id) return; // Exclude original
        if (t.status === 'Completed') {
          const tType = t.type?.toLowerCase();
          if (tType === 'collection') currentCol += Number(t.amount) || 0;
          else if (tType === 'return') currentRet += Number(t.amount) || 0;
          else if (tType === 'distribution') currentDist += Number(t.amount) || 0;
        }
      });
      // Projected balance
      const newCol = currentCol + (finalType === 'collection' ? finalAmount : 0);
      const newRet = currentRet + (finalType === 'return' ? finalAmount : 0);
      if (newCol + newRet - currentDist < 0) {
        throw new Error('Modification would result in a negative Revolving Fund balance.');
      }
    }

    const now = new Date().toISOString();
    const firestorePayload: Partial<FirestoreRevolvingFundTransaction> = {
      ...(updates.date && { date: updates.date }),
      ...(updates.type && { type: finalType }),
      ...(updates.beneficiaryOrContributor && { personName: updates.beneficiaryOrContributor }),
      ...(updates.personName && { personName: updates.personName }),
      ...(updates.description && { description: updates.description }),
      ...(updates.amount !== undefined && { amount: finalAmount }),
      ...(updates.paymentMethod !== undefined && { paymentMethod: updates.paymentMethod }),
      ...(updates.status && { status: finalStatus }),
      ...(updates.reference !== undefined && { reference: updates.reference }),
      ...(updates.note !== undefined && { note: updates.note }),
      updatedAt: now,
    };

    await updateRevolvingFundInFirestore(id, firestorePayload);

    addNotification(
      'success',
      'Fund Entry Updated',
      `Transaction ${id} successfully updated.`
    );
  };

  const deleteRevolvingFund = async (id: string): Promise<void> => {
    const existing = revolvingFund.find((t) => t.id === id);
    if (existing && existing.status === 'Completed') {
      const typeLower = existing.type?.toLowerCase();
      if (typeLower === 'collection' || typeLower === 'return') {
        // Deleting capital or return might make the balance negative if distributions exist
        let currentCol = 0;
        let currentRet = 0;
        let currentDist = 0;
        revolvingFund.forEach((t) => {
          if (t.id === id) return; // Exclude this deleted one
          if (t.status === 'Completed') {
            const tType = t.type?.toLowerCase();
            if (tType === 'collection') currentCol += Number(t.amount) || 0;
            else if (tType === 'return') currentRet += Number(t.amount) || 0;
            else if (tType === 'distribution') currentDist += Number(t.amount) || 0;
          }
        });
        if (currentCol + currentRet - currentDist < 0) {
          throw new Error('Deleting this transaction would make the Revolving Fund balance negative.');
        }
      }
    }

    await deleteRevolvingFundFromFirestore(id);

    addNotification(
      'info',
      'Fund Entry Deleted',
      `Transaction ${id} successfully deleted from Firestore.`
    );
  };

  // Boarding Actions
  const addBoardingStudent = async (student: Omit<BoardingStudent, 'id'>) => {
    // Check duplicate
    const existing = boardingStudents.find((b) => b.studentId === student.studentId);
    if (existing) {
      throw new Error('This student is already registered in Boarding.');
    }

    const now = new Date().toISOString();
    if (authFirebaseUser) {
      await saveBoardingStudentToFirestore({
        studentId: student.studentId,
        studentName: student.studentName || student.name,
        className: student.className,
        section: student.section || 'A',
        boardingStatus: student.boardingStatus || 'Active',
        joiningDate: student.joiningDate,
        room: student.room || student.roomNumber,
        bedNumber: student.bedNumber,
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
        note: student.note || '',
        createdAt: now,
        updatedAt: now,
      });
    }

    addNotification(
      'success',
      'Boarding Student Enrolled',
      `${student.name || student.studentName} has been assigned to Boarding.`
    );
  };

  const updateBoardingStudent = async (id: string, updates: Partial<BoardingStudent>) => {
    const now = new Date().toISOString();
    const payload: Partial<FirestoreBoardingStudent> = {
      ...(updates.className && { className: updates.className }),
      ...(updates.section && { section: updates.section }),
      ...(updates.boardingStatus && { boardingStatus: updates.boardingStatus }),
      ...(updates.joiningDate && { joiningDate: updates.joiningDate }),
      ...((updates.room || updates.roomNumber) && { room: updates.room || updates.roomNumber }),
      ...(updates.bedNumber && { bedNumber: updates.bedNumber }),
      ...(updates.guardianName !== undefined && { guardianName: updates.guardianName }),
      ...(updates.guardianPhone !== undefined && { guardianPhone: updates.guardianPhone }),
      ...(updates.note !== undefined && { note: updates.note }),
      updatedAt: now,
    };

    await updateBoardingStudentInFirestore(id, payload);

    addNotification(
      'success',
      'Boarding Record Updated',
      `Boarding info for Student ID ${id} has been updated.`
    );
  };

  const deleteBoardingStudent = async (id: string) => {
    await deleteBoardingStudentFromFirestore(id);
    addNotification(
      'info',
      'Boarding Student Removed',
      `Student ID ${id} was completely removed from the boarding collection.`
    );
  };

  const addBoardingTransaction = async (tx: Omit<BoardingTransaction, 'id'>) => {
    const txId = `BRD-TX-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    if (authFirebaseUser) {
      await saveBoardingTransactionToFirestore({
        transactionId: txId,
        studentId: tx.studentId || '',
        studentName: tx.studentName || '',
        date: tx.date,
        type: tx.type,
        category: tx.category,
        description: tx.description,
        amount: Number(tx.amount) || 0,
        paymentMethod: tx.paymentMethod || 'Cash',
        status: tx.status || 'Completed',
        reference: tx.reference || '',
        note: tx.note || '',
        createdBy: authFirebaseUser.uid,
        createdAt: now,
        updatedAt: now,
      });
    }

    addNotification(
      'success',
      'Boarding Transaction Saved',
      `${tx.type === 'fee' ? 'Fee Collected' : 'Expense Recorded'}: $${tx.amount} logged.`
    );
  };

  const updateBoardingTransaction = async (id: string, updates: Partial<BoardingTransaction>) => {
    const now = new Date().toISOString();
    const payload: Partial<FirestoreBoardingTransaction> = {
      ...(updates.studentId !== undefined && { studentId: updates.studentId }),
      ...(updates.studentName !== undefined && { studentName: updates.studentName }),
      ...(updates.date && { date: updates.date }),
      ...(updates.type && { type: updates.type }),
      ...(updates.category && { category: updates.category }),
      ...(updates.description && { description: updates.description }),
      ...(updates.amount !== undefined && { amount: Number(updates.amount) || 0 }),
      ...(updates.paymentMethod !== undefined && { paymentMethod: updates.paymentMethod }),
      ...(updates.status && { status: updates.status }),
      ...(updates.reference !== undefined && { reference: updates.reference }),
      ...(updates.note !== undefined && { note: updates.note }),
      updatedAt: now,
    };

    await updateBoardingTransactionInFirestore(id, payload);

    addNotification(
      'success',
      'Boarding Transaction Updated',
      `Transaction ${id} has been successfully updated.`
    );
  };

  const deleteBoardingTransaction = async (id: string) => {
    await deleteBoardingTransactionFromFirestore(id);

    addNotification(
      'info',
      'Boarding Transaction Deleted',
      `Transaction ${id} has been deleted from Firestore.`
    );
  };

  const addBoardingExpense = (expense: Omit<BoardingExpense, 'id'>) => {
    addBoardingTransaction({
      date: expense.date,
      type: 'foodExpense',
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      paymentMethod: 'Cash',
      status: 'Completed',
      note: expense.vendor || 'Supplier',
    }).catch(console.error);
  };

  // General Account Actions
  const addTransaction = async (tx: Omit<AccountTransaction, 'id'>) => {
    const txId = `TXN-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    if (authFirebaseUser) {
      await saveAccountTransactionToFirestore({
        transactionId: txId,
        date: tx.date,
        type: tx.type?.toLowerCase() === 'income' ? 'income' : 'expense',
        category: tx.category,
        description: tx.description,
        amount: Number(tx.amount) || 0,
        paymentMethod: tx.paymentMethod || 'Cash',
        reference: tx.reference || '',
        status: tx.status || 'Completed',
        createdBy: authFirebaseUser.uid,
        createdAt: now,
        updatedAt: now,
      });
    }

    addNotification(
      'success',
      'Transaction Recorded',
      `${tx.type}: $${tx.amount} successfully processed.`
    );
  };

  const updateTransaction = async (id: string, updates: Partial<AccountTransaction>) => {
    const now = new Date().toISOString();
    let finalType: 'income' | 'expense' | undefined = undefined;
    if (updates.type) {
      finalType = updates.type.toLowerCase() === 'income' ? 'income' : 'expense';
    }

    const firestorePayload: Partial<FirestoreAccountTransaction> = {
      ...(updates.date && { date: updates.date }),
      ...(finalType && { type: finalType }),
      ...(updates.category && { category: updates.category }),
      ...(updates.description && { description: updates.description }),
      ...(updates.amount !== undefined && { amount: Number(updates.amount) || 0 }),
      ...(updates.paymentMethod && { paymentMethod: updates.paymentMethod }),
      ...(updates.reference !== undefined && { reference: updates.reference }),
      ...(updates.status && { status: updates.status }),
      updatedAt: now,
    };

    await updateAccountTransactionInFirestore(id, firestorePayload);

    addNotification(
      'success',
      'Transaction Updated',
      `Transaction ${id} successfully updated.`
    );
  };

  const deleteTransaction = async (id: string) => {
    await deleteAccountTransactionFromFirestore(id);

    addNotification(
      'info',
      'Transaction Deleted',
      `Transaction ${id} successfully deleted.`
    );
  };

  // Settings Actions
  const updateMadrasaInfo = async (info: Partial<MadrasaInfo>) => {
    const now = new Date().toISOString();
    const merged = { ...madrasaInfo, ...info };
    if (authFirebaseUser) {
      await setDoc(doc(db, 'settings', 'madrasaInformation'), {
        ...merged,
        updatedAt: now,
      }, { merge: true });
    } else {
      setMadrasaInfo(merged);
    }
    addNotification('success', 'Madrasa Information Saved', 'Institutional profile successfully updated in Firestore.');
  };

  // User Management Actions
  const addUser = async (newUser: Omit<UserAccount, 'id'>) => {
    const now = new Date().toISOString();
    const userDocRef = doc(collection(db, 'users'));
    await setDoc(userDocRef, {
      uid: userDocRef.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role === 'Super Admin' ? 'admin' : 'staff',
      status: newUser.status === 'Active' ? 'active' : 'inactive',
      createdAt: now,
      updatedAt: now,
    });
    addNotification('success', 'User Created', `${newUser.name} registered successfully.`);
  };

  const updateUser = async (uid: string, updates: Partial<UserAccount>) => {
    const now = new Date().toISOString();
    const payload: any = {
      ...(updates.name && { name: updates.name }),
      ...(updates.email && { email: updates.email }),
      ...(updates.role && { role: updates.role === 'Super Admin' ? 'admin' : 'staff' }),
      ...(updates.status && { status: updates.status === 'Active' ? 'active' : 'inactive' }),
      updatedAt: now,
    };
    await setDoc(doc(db, 'users', uid), payload, { merge: true });
    addNotification('success', 'User Profile Updated', 'Administrative privileges synced.');
  };

  const deleteUser = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
    addNotification('info', 'User Deleted', 'Administrative credentials revoked.');
  };

  // Classes Actions
  const addClass = async (cls: Omit<AcademicClass, 'id' | 'totalStudents'>) => {
    const now = new Date().toISOString();
    const classId = `CLS-${Date.now().toString().slice(-6)}`;
    await setDoc(doc(db, 'classes', classId), {
      name: cls.name,
      sections: cls.sections || ['A'],
      classTeacher: cls.classTeacher || 'Unassigned',
      monthlyFee: Number(cls.monthlyFee) || 50,
      totalStudents: 0,
      classCode: cls.classCode || cls.name.replace(/\s+/g, '-').toUpperCase(),
      status: cls.status || 'Active',
      createdAt: now,
      updatedAt: now,
    });
    addNotification('success', 'Class Created', `Class "${cls.name}" added successfully.`);
  };

  const updateClass = async (id: string, updates: Partial<AcademicClass>) => {
    const now = new Date().toISOString();
    const payload: any = {
      ...(updates.name && { name: updates.name }),
      ...(updates.sections && { sections: updates.sections }),
      ...(updates.classTeacher && { classTeacher: updates.classTeacher }),
      ...(updates.monthlyFee !== undefined && { monthlyFee: Number(updates.monthlyFee) || 0 }),
      ...(updates.classCode && { classCode: updates.classCode }),
      ...(updates.status && { status: updates.status }),
      updatedAt: now,
    };
    await setDoc(doc(db, 'classes', id), payload, { merge: true });
    addNotification('success', 'Class Updated', 'Class settings updated.');
  };

  const deleteClass = async (id: string) => {
    const cls = classes.find(c => c.id === id);
    if (!cls) return;

    // Validation: cannot delete if being used by students
    const isUsed = students.some(s => s.className === cls.name);
    if (isUsed) {
      throw new Error(`Cannot delete class "${cls.name}" because existing students are currently enrolled in it.`);
    }

    await deleteDoc(doc(db, 'classes', id));
    addNotification('info', 'Class Deleted', `Class "${cls.name}" permanently removed.`);
  };

  // Academic Years Actions
  const addAcademicYear = async (year: string) => {
    const now = new Date().toISOString();
    const id = `AY-${year}`;
    // Check duplication
    if (academicYears.some(a => a.year === year)) {
      throw new Error(`Academic year "${year}" already exists.`);
    }

    await setDoc(doc(db, 'academicYears', id), {
      year,
      status: 'Inactive',
      createdAt: now,
      updatedAt: now,
    });
    addNotification('success', 'Academic Year Created', `Session ${year} added.`);
  };

  const setActiveAcademicYear = async (id: string) => {
    const now = new Date().toISOString();
    const promises = academicYears.map(async (ay) => {
      const isTarget = ay.id === id;
      const finalStatus = isTarget ? 'Active' : 'Inactive';
      if (ay.status !== finalStatus) {
        await setDoc(doc(db, 'academicYears', ay.id), {
          status: finalStatus,
          updatedAt: now,
        }, { merge: true });
      }
    });
    await Promise.all(promises);
    addNotification('success', 'Academic Year Activated', 'Current active term shifted.');
  };

  const deactivateAcademicYear = async (id: string) => {
    const now = new Date().toISOString();
    await setDoc(doc(db, 'academicYears', id), {
      status: 'Inactive',
      updatedAt: now,
    }, { merge: true });
    addNotification('info', 'Academic Year Deactivated', 'Term is now inactive.');
  };

  const deleteAcademicYear = async (id: string) => {
    await deleteDoc(doc(db, 'academicYears', id));
    addNotification('info', 'Academic Year Deleted', 'Session record removed.');
  };

  // Account Categories Actions
  const addAccountCategory = async (cat: Omit<AccountCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const catId = `CAT-${Date.now().toString().slice(-6)}`;
    await setDoc(doc(db, 'accountCategories', catId), {
      name: cat.name,
      type: cat.type,
      description: cat.description || '',
      status: cat.status || 'Active',
      createdAt: now,
      updatedAt: now,
    });
    addNotification('success', 'Category Created', `Category "${cat.name}" added to ${cat.type} heads.`);
  };

  const updateAccountCategory = async (id: string, updates: Partial<AccountCategory>) => {
    const now = new Date().toISOString();
    const payload: any = {
      ...(updates.name && { name: updates.name }),
      ...(updates.type && { type: updates.type }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.status && { status: updates.status }),
      updatedAt: now,
    };
    await setDoc(doc(db, 'accountCategories', id), payload, { merge: true });
    addNotification('success', 'Category Updated', 'Category settings synced.');
  };

  const deleteAccountCategory = async (id: string) => {
    const cat = accountCategoriesFull.find(c => c.id === id);
    if (!cat) return;

    // Check if category is used by existing transactions
    const isUsedInAccounts = transactions.some(t => t.category === cat.name);
    if (isUsedInAccounts) {
      throw new Error(`Cannot delete category "${cat.name}" because it is currently used by existing transactions. You can deactivate it instead.`);
    }

    await deleteDoc(doc(db, 'accountCategories', id));
    addNotification('info', 'Category Deleted', `Category "${cat.name}" permanently deleted.`);
  };

  // System Controls
  const resetWebsiteData = async (options?: {
    students?: boolean;
    fees?: boolean;
    aib?: boolean;
    revolving?: boolean;
    boarding?: boolean;
    accounts?: boolean;
    settings?: boolean;
  }) => {
    try {
      const full = !options || Object.values(options).every(v => v === undefined || v === true);

      if (full || options?.students) {
        const snap = await getDocs(collection(db, 'students'));
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'students', d.id))));
      }
      if (full || options?.fees) {
        const snap = await getDocs(collection(db, 'studentFees'));
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'studentFees', d.id))));
      }
      if (full || options?.aib) {
        const snap = await getDocs(collection(db, 'aibTransactions'));
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'aibTransactions', d.id))));
      }
      if (full || options?.revolving) {
        const snap = await getDocs(collection(db, 'revolvingFundTransactions'));
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'revolvingFundTransactions', d.id))));
      }
      if (full || options?.boarding) {
        const bStudentsSnap = await getDocs(collection(db, 'boardingStudents'));
        await Promise.all(bStudentsSnap.docs.map(d => deleteDoc(doc(db, 'boardingStudents', d.id))));

        const bTxSnap = await getDocs(collection(db, 'boardingTransactions'));
        await Promise.all(bTxSnap.docs.map(d => deleteDoc(doc(db, 'boardingTransactions', d.id))));
      }
      if (full || options?.accounts) {
        const snap = await getDocs(collection(db, 'accounts'));
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'accounts', d.id))));
      }
      if (full || options?.settings) {
        await deleteDoc(doc(db, 'settings', 'madrasaInformation'));

        const classesSnap = await getDocs(collection(db, 'classes'));
        await Promise.all(classesSnap.docs.map(d => deleteDoc(doc(db, 'classes', d.id))));

        const aySnap = await getDocs(collection(db, 'academicYears'));
        await Promise.all(aySnap.docs.map(d => deleteDoc(doc(db, 'academicYears', d.id))));

        const catSnap = await getDocs(collection(db, 'accountCategories'));
        await Promise.all(catSnap.docs.map(d => deleteDoc(doc(db, 'accountCategories', d.id))));
      }

      addNotification(
        'success',
        'Website Data Reset Complete',
        'Selected Firestore collections successfully formatted.'
      );
    } catch (err: any) {
      console.error(err);
      addNotification('error', 'Reset Failed', err.message || 'Firestore format operation failed.');
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsRefreshing(false);
    addNotification('info', 'System Refreshed', 'Office records reloaded successfully.');
  };

  const systemRestart = async () => {
    setIsRestarting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsRestarting(false);
    addNotification(
      'success',
      'System Restart Complete',
      'Madrasa Office Management session initialized cleanly.'
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeSection,
        activeSubItem,
        setActiveNav,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        searchQuery,
        setSearchQuery,
        students,
        studentsLoading,
        selectedStudentId,
        setSelectedStudentId,
        viewStudentProfile,
        addStudent,
        updateStudent,
        deleteStudent,
        checkStudentIdExists,
        fees,
        feesLoading,
        prefillFeeStudentId,
        setPrefillFeeStudentId,
        openFeeCollectionForStudent,
        addFeePayment,
        updateFeePayment,
        deleteFeePayment,
        updateFeeStatus,
        aibTransactions,
        aibTransactionsLoading,
        addAibTransaction,
        updateAibTransaction,
        deleteAibTransaction,
        revolvingFund,
        revolvingFundLoading,
        addRevolvingFund,
        updateRevolvingFund,
        deleteRevolvingFund,
        boardingStudents,
        boardingStudentsLoading,
        addBoardingStudent,
        updateBoardingStudent,
        deleteBoardingStudent,
        boardingTransactions,
        boardingTransactionsLoading,
        addBoardingTransaction,
        updateBoardingTransaction,
        deleteBoardingTransaction,
        boardingExpenses,
        addBoardingExpense,
        transactions,
        accountsLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        madrasaInfo,
        updateMadrasaInfo,
        users,
        usersLoading,
        addUser,
        updateUser,
        deleteUser,
        classes,
        classesLoading,
        addClass,
        updateClass,
        deleteClass,
        academicYears,
        academicYearsLoading,
        addAcademicYear,
        setActiveAcademicYear,
        deactivateAcademicYear,
        deleteAcademicYear,
        accountCategories,
        accountCategoriesFull,
        accountCategoriesLoading,
        addAccountCategory,
        updateAccountCategory,
        deleteAccountCategory,
        teachers,
        teachersLoading,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        teacherNotes,
        addTeacherNote,
        deleteTeacherNote,
        studentNotes,
        addStudentNote,
        deleteStudentNote,
        examResults,
        examResultsLoading,
        addExamResult,
        updateExamResult,
        deleteExamResult,
        notifications,
        addNotification,
        dismissNotification,
        currentUser,
        setCurrentUser,
        resetWebsiteData,
        refreshData,
        isRefreshing,
        systemRestart,
        isRestarting,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
