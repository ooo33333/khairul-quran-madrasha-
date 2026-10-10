import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import {
  FirestoreStudent,
  FirestoreStudentFee,
  FirestoreAibTransaction,
  FirestoreRevolvingFundTransaction,
  FirestoreBoardingStudent,
  FirestoreBoardingTransaction,
  FirestoreAccountTransaction,
  FirestoreSettings,
  AdminUser,
} from '../types';

// 1. Users
export async function fetchUsersFromFirestore(): Promise<AdminUser[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as AdminUser);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveUserToFirestore(user: AdminUser): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    await setDoc(doc(db, 'users', user.uid), user, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 2. Students Collection
export async function checkStudentIdExists(studentId: string): Promise<boolean> {
  const path = `students/${studentId}`;
  try {
    const snap = await getDoc(doc(db, 'students', studentId));
    return snap.exists();
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function getStudentFromFirestore(studentId: string): Promise<FirestoreStudent | null> {
  const path = `students/${studentId}`;
  try {
    const snap = await getDoc(doc(db, 'students', studentId));
    if (snap.exists()) {
      return snap.data() as FirestoreStudent;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function fetchStudentsFromFirestore(): Promise<FirestoreStudent[]> {
  const path = 'students';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as FirestoreStudent);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveStudentToFirestore(student: FirestoreStudent): Promise<void> {
  const path = `students/${student.studentId}`;
  try {
    await setDoc(doc(db, 'students', student.studentId), student, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateStudentInFirestore(
  studentId: string,
  updates: Partial<FirestoreStudent>
): Promise<void> {
  const path = `students/${studentId}`;
  try {
    await updateDoc(doc(db, 'students', studentId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteStudentFromFirestore(studentId: string): Promise<void> {
  const path = `students/${studentId}`;
  try {
    await deleteDoc(doc(db, 'students', studentId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 3. Student Fees Collection
export async function fetchFeesFromFirestore(): Promise<FirestoreStudentFee[]> {
  const path = 'studentFees';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as FirestoreStudentFee);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveFeeToFirestore(feeId: string, fee: FirestoreStudentFee): Promise<void> {
  const path = `studentFees/${feeId}`;
  try {
    await setDoc(doc(db, 'studentFees', feeId), fee, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateFeeInFirestore(
  feeId: string,
  updates: Partial<FirestoreStudentFee>
): Promise<void> {
  const path = `studentFees/${feeId}`;
  try {
    await updateDoc(doc(db, 'studentFees', feeId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteFeeFromFirestore(feeId: string): Promise<void> {
  const path = `studentFees/${feeId}`;
  try {
    await deleteDoc(doc(db, 'studentFees', feeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 4. Aib Transactions Collection
export async function fetchAibTransactionsFromFirestore(): Promise<FirestoreAibTransaction[]> {
  const path = 'aibTransactions';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as FirestoreAibTransaction);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveAibTransactionToFirestore(
  tx: FirestoreAibTransaction
): Promise<void> {
  const path = `aibTransactions/${tx.transactionId}`;
  try {
    await setDoc(doc(db, 'aibTransactions', tx.transactionId), tx);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateAibTransactionInFirestore(
  transactionId: string,
  updates: Partial<FirestoreAibTransaction>
): Promise<void> {
  const path = `aibTransactions/${transactionId}`;
  try {
    await updateDoc(doc(db, 'aibTransactions', transactionId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteAibTransactionFromFirestore(transactionId: string): Promise<void> {
  const path = `aibTransactions/${transactionId}`;
  try {
    await deleteDoc(doc(db, 'aibTransactions', transactionId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 5. Revolving Fund Transactions Collection
export async function fetchRevolvingFundFromFirestore(): Promise<
  FirestoreRevolvingFundTransaction[]
> {
  const path = 'revolvingFundTransactions';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as FirestoreRevolvingFundTransaction);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveRevolvingFundToFirestore(
  tx: FirestoreRevolvingFundTransaction
): Promise<void> {
  const path = `revolvingFundTransactions/${tx.transactionId}`;
  try {
    await setDoc(doc(db, 'revolvingFundTransactions', tx.transactionId), tx, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateRevolvingFundInFirestore(
  transactionId: string,
  updates: Partial<FirestoreRevolvingFundTransaction>
): Promise<void> {
  const path = `revolvingFundTransactions/${transactionId}`;
  try {
    await updateDoc(doc(db, 'revolvingFundTransactions', transactionId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteRevolvingFundFromFirestore(transactionId: string): Promise<void> {
  const path = `revolvingFundTransactions/${transactionId}`;
  try {
    await deleteDoc(doc(db, 'revolvingFundTransactions', transactionId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 6. Boarding Students Collection
export async function fetchBoardingStudentsFromFirestore(): Promise<FirestoreBoardingStudent[]> {
  const path = 'boardingStudents';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as FirestoreBoardingStudent);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveBoardingStudentToFirestore(
  st: FirestoreBoardingStudent
): Promise<void> {
  const path = `boardingStudents/${st.studentId}`;
  try {
    await setDoc(doc(db, 'boardingStudents', st.studentId), st, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateBoardingStudentInFirestore(
  studentId: string,
  updates: Partial<FirestoreBoardingStudent>
): Promise<void> {
  const path = `boardingStudents/${studentId}`;
  try {
    await updateDoc(doc(db, 'boardingStudents', studentId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteBoardingStudentFromFirestore(studentId: string): Promise<void> {
  const path = `boardingStudents/${studentId}`;
  try {
    await deleteDoc(doc(db, 'boardingStudents', studentId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 7. Boarding Transactions Collection
export async function fetchBoardingTransactionsFromFirestore(): Promise<
  FirestoreBoardingTransaction[]
> {
  const path = 'boardingTransactions';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as FirestoreBoardingTransaction);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveBoardingTransactionToFirestore(
  tx: FirestoreBoardingTransaction
): Promise<void> {
  const path = `boardingTransactions/${tx.transactionId}`;
  try {
    await setDoc(doc(db, 'boardingTransactions', tx.transactionId), tx, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateBoardingTransactionInFirestore(
  transactionId: string,
  updates: Partial<FirestoreBoardingTransaction>
): Promise<void> {
  const path = `boardingTransactions/${transactionId}`;
  try {
    await updateDoc(doc(db, 'boardingTransactions', transactionId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteBoardingTransactionFromFirestore(transactionId: string): Promise<void> {
  const path = `boardingTransactions/${transactionId}`;
  try {
    await deleteDoc(doc(db, 'boardingTransactions', transactionId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 8. General Accounts Collection
export async function fetchAccountsFromFirestore(): Promise<FirestoreAccountTransaction[]> {
  const path = 'accounts';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as FirestoreAccountTransaction);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveAccountTransactionToFirestore(
  tx: FirestoreAccountTransaction
): Promise<void> {
  const path = `accounts/${tx.transactionId}`;
  try {
    await setDoc(doc(db, 'accounts', tx.transactionId), tx, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateAccountTransactionInFirestore(
  transactionId: string,
  updates: Partial<FirestoreAccountTransaction>
): Promise<void> {
  const path = `accounts/${transactionId}`;
  try {
    await updateDoc(doc(db, 'accounts', transactionId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteAccountTransactionFromFirestore(transactionId: string): Promise<void> {
  const path = `accounts/${transactionId}`;
  try {
    await deleteDoc(doc(db, 'accounts', transactionId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 9. Settings Collection
export async function fetchSettingsFromFirestore(): Promise<FirestoreSettings | null> {
  const path = 'settings/general';
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (snap.exists()) {
      return snap.data() as FirestoreSettings;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function saveSettingsToFirestore(settings: FirestoreSettings): Promise<void> {
  const path = 'settings/general';
  try {
    await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
