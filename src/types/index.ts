export type NavigationSection =
  | 'dashboard'
  | 'students'
  | 'student-fees'
  | 'aib-account'
  | 'revolving-fund'
  | 'boarding'
  | 'accounts'
  | 'settings';

export type SubNavigationItem =
  // Students
  | 'student-list'
  | 'student-admission'
  | 'student-information'
  // Student Fees
  | 'monthly-fees'
  | 'admission-fees'
  | 'other-fees'
  | 'fee-collection'
  | 'due-fees'
  // Aib Account
  | 'aib-collection'
  | 'aib-expense'
  | 'aib-balance'
  | 'aib-transactions'
  // Revolving Fund
  | 'fund-collection'
  | 'fund-distribution'
  | 'fund-return'
  | 'fund-balance'
  | 'fund-transactions'
  // Boarding
  | 'boarding-students'
  | 'boarding-fees'
  | 'food-expense'
  | 'other-expenses'
  | 'boarding-balance'
  // Accounts
  | 'income'
  | 'expense'
  | 'transactions'
  | 'balance'
  // Settings
  | 'madrasa-information'
  | 'user-management'
  | 'academic-year'
  | 'classes'
  | 'account-categories'
  | 'login-logout'
  | 'reset-website-data'
  | 'refresh-reload'
  | 'system-restart-reboot';

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export type StudentStatus = 'Active' | 'Inactive' | 'Graduated' | 'Left' | 'On Leave';

// 4. Students Collection Firestore Schema
export interface FirestoreStudent {
  studentId: string;
  studentName: string;
  fatherName: string;
  motherName?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  className: string;
  section?: string;
  admissionDate: string;
  status: StudentStatus;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type FeeType = 'Monthly Fee' | 'Admission Fee' | 'Other Fee';
export type PaymentMethod = 'Cash' | 'Bank' | 'Mobile Banking' | 'Other';
export type FeeStatus = 'Paid' | 'Partial' | 'Due';

// 5. Student Fees Collection Firestore Schema
export interface FirestoreStudentFee {
  feeId: string;
  studentId: string;
  studentName: string;
  className: string;
  section?: string;
  feeType: FeeType | string;
  category?: string;
  month?: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod | string;
  note?: string;
  status: FeeStatus;
  createdAt: string;
  updatedAt: string;
}

// 6. Aib Account Collection Firestore Schema
export interface FirestoreAibTransaction {
  transactionId: string;
  date: string;
  type: 'collection' | 'expense';
  category: string;
  description: string;
  amount: number;
  paymentMethod?: string;
  reference?: string;
  note?: string;
  status?: 'Completed' | 'Cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 7. Revolving Fund Collection Firestore Schema
export interface FirestoreRevolvingFundTransaction {
  transactionId: string;
  date: string;
  type: 'collection' | 'distribution' | 'return';
  personName: string;
  description: string;
  amount: number;
  paymentMethod?: string;
  status: 'Completed' | 'Pending' | 'Cancelled' | string;
  reference?: string;
  note?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 8. Boarding Collection Firestore Schemas
export interface FirestoreBoardingStudent {
  studentId: string;
  studentName: string;
  className: string;
  section?: string;
  boardingStatus: 'Active' | 'Inactive' | 'Left' | 'active' | 'inactive' | string;
  joiningDate: string;
  room: string;
  bedNumber?: string;
  guardianName?: string;
  guardianPhone?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreBoardingTransaction {
  transactionId: string;
  studentId?: string;
  studentName?: string;
  date: string;
  type: 'fee' | 'foodExpense' | 'otherExpense' | string;
  category: string;
  description: string;
  amount: number;
  paymentMethod?: string;
  status?: string;
  reference?: string;
  note?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 9. General Accounts Collection Firestore Schema
export interface FirestoreAccountTransaction {
  transactionId: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank' | 'Mobile Banking' | 'Other' | string;
  reference: string;
  status: 'Completed' | 'Pending' | 'Cancelled' | string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 10. Settings Collection Firestore Schema
export interface FirestoreSettings {
  madrasaName: string;
  address: string;
  phone: string;
  email: string;
  academicYear: string;
  classes: string;
  accountCategories: string;
}

export interface Student {
  id: string; // e.g. "STD-1001"
  name: string;
  fatherName: string;
  motherName?: string;
  className: string;
  section: string;
  phone: string;
  dob?: string;
  address?: string;
  admissionDate: string;
  status: StudentStatus;
  photoUrl?: string;
  boarding?: boolean;
  roomNo?: string;
  guardianName?: string;
  bloodGroup?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeeRecord {
  id: string;
  feeId?: string;
  studentId: string;
  studentName: string;
  className: string;
  section?: string;
  feeType: FeeType | string;
  category?: string;
  totalFee: number;
  amount?: number;
  paid: number;
  paidAmount?: number;
  due: number;
  dueAmount?: number;
  lastPaymentDate: string;
  paymentDate?: string;
  status: FeeStatus;
  receiptNo?: string;
  paymentMethod?: PaymentMethod | string;
  month?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AibTransaction {
  id: string;
  transactionId?: string;
  date: string;
  type: 'collection' | 'expense' | 'Collection' | 'Expense';
  category: string;
  description: string;
  amount: number;
  paymentMethod?: string;
  reference?: string;
  note?: string;
  receiptOrVoucher?: string;
  donorOrBeneficiary?: string;
  status?: 'Completed' | 'Cancelled';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RevolvingFundTransaction {
  id: string;
  transactionId?: string;
  date: string;
  description: string;
  type: 'Collection' | 'Distribution' | 'Return' | 'collection' | 'distribution' | 'return';
  amount: number;
  beneficiaryOrContributor: string;
  personName?: string;
  paymentMethod?: string;
  status: 'Completed' | 'Pending' | 'Cancelled' | 'Disbursed' | 'Returned' | 'Overdue' | 'Received' | string;
  reference?: string;
  note?: string;
  dueDate?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardingStudent {
  id: string;
  studentId: string;
  name: string;
  className: string;
  roomNumber: string;
  bedNumber: string;
  monthlyFee: number;
  feeStatus: 'Paid' | 'Due' | 'Partial' | string;
  supervisor: string;
  joiningDate: string;
  studentName?: string;
  section?: string;
  boardingStatus?: 'Active' | 'Inactive' | 'Left' | string;
  room?: string;
  guardianName?: string;
  guardianPhone?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardingTransaction {
  id: string;
  transactionId?: string;
  studentId?: string;
  studentName?: string;
  date: string;
  type: 'fee' | 'foodExpense' | 'otherExpense' | string;
  category: string;
  description: string;
  amount: number;
  paymentMethod?: string;
  status?: string;
  reference?: string;
  note?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardingExpense {
  id: string;
  date: string;
  category: 'Food Expense' | 'Kitchen Ration' | 'Utilities' | 'Maintenance' | 'Medical' | 'Other';
  description: string;
  amount: number;
  vendor?: string;
  voucherNo: string;
}

export interface AccountTransaction {
  id: string;
  transactionId?: string;
  date: string;
  description: string;
  category: string;
  type: 'Income' | 'Expense' | 'income' | 'expense';
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  referenceNo?: string;
  reference?: string;
  paymentMethod: 'Cash' | 'Bank' | 'Mobile Banking' | 'Other' | string;
  note?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MadrasaInfo {
  name: string;
  tagline: string;
  established: string;
  regNumber: string;
  principal: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  bankName: string;
  accountNumber: string;
  branch: string;
  logo?: string;
  description?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Accountant' | 'Admission Officer' | 'Warden' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface AcademicClass {
  id: string;
  name: string;
  sections: string[];
  totalStudents: number;
  classTeacher: string;
  monthlyFee: number;
  classCode?: string;
  status?: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicYear {
  id: string;
  year: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AccountCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}
