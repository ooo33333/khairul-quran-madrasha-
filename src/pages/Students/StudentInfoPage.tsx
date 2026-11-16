import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  GraduationCap,
  Calendar,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  AlertCircle,
  Plus,
  RotateCcw,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, StudentStatus } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';

export const StudentInfoPage: React.FC = () => {
  const {
    students,
    studentsLoading,
    selectedStudentId,
    setSelectedStudentId,
    updateStudent,
    deleteStudent,
    setActiveNav,
    searchQuery,
    classes,
    fees,
    boardingStudents,
    openFeeCollectionForStudent,
    studentNotes,
    addStudentNote,
    deleteStudentNote,
    t,
  } = useApp();

  const [activeId, setActiveId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentNoteTitle, setStudentNoteTitle] = useState('');
  const [studentNoteDesc, setStudentNoteDesc] = useState('');
  const [studentNoteType, setStudentNoteType] = useState<'Crime/Discipline' | 'Achievement' | 'Warning' | 'General'>('General');

  const handleAddStudentNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !studentNoteTitle || !studentNoteDesc) return;

    await addStudentNote({
      id: `SNTE-${Date.now()}`,
      studentId: currentStudent.id,
      date: new Date().toISOString().split('T')[0],
      title: studentNoteTitle,
      description: studentNoteDesc,
      noteType: studentNoteType,
      createdAt: new Date().toISOString(),
    });

    setStudentNoteTitle('');
    setStudentNoteDesc('');
  };

  // Modals state for Edit & Delete directly from profile
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Sync activeId with context selectedStudentId or first student
  useEffect(() => {
    if (selectedStudentId && students.some((s) => s.id === selectedStudentId)) {
      setActiveId(selectedStudentId);
    } else if (students.length > 0 && (!activeId || !students.some((s) => s.id === activeId))) {
      setActiveId(students[0].id);
    }
  }, [selectedStudentId, students, activeId]);

  const effectiveSearch = searchTerm || searchQuery;

  const matchedStudents = useMemo(() => {
    const q = effectiveSearch.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.fatherName && s.fatherName.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q)) ||
        s.className.toLowerCase().includes(q)
    );
  }, [students, effectiveSearch]);

  const currentStudent =
    students.find((s) => s.id === activeId) || matchedStudents[0] || students[0];

  // Associated financial records
  const studentFees = useMemo(() => {
    if (!currentStudent) return [];
    return fees.filter((f) => f.studentId === currentStudent.id);
  }, [fees, currentStudent]);

  const totalFees = studentFees.reduce(
    (acc, f) => acc + (Number(f.totalFee) || Number(f.amount) || 0),
    0
  );
  const totalPaid = studentFees.reduce(
    (acc, f) => acc + (Number(f.paid) || Number(f.paidAmount) || 0),
    0
  );
  const totalDue = studentFees.reduce(
    (acc, f) => acc + (Number(f.due) || Number(f.dueAmount) || 0),
    0
  );

  // Associated boarding record
  const boardingRecord = useMemo(() => {
    if (!currentStudent) return undefined;
    return boardingStudents.find((b) => b.studentId === currentStudent.id);
  }, [boardingStudents, currentStudent]);

  // Edit Submission
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditError(null);

    if (!editingStudent.name.trim()) {
      setEditError('Student Name is required.');
      return;
    }
    if (!editingStudent.fatherName.trim()) {
      setEditError('Father Name is required.');
      return;
    }
    if (!editingStudent.className.trim()) {
      setEditError('Class is required.');
      return;
    }
    if (!editingStudent.admissionDate) {
      setEditError('Admission Date is required.');
      return;
    }

    setIsSavingEdit(true);
    try {
      await updateStudent(editingStudent.id, editingStudent);
      setEditingStudent(null);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update student.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await deleteStudent(deletingStudent.id);
      setDeletingStudent(null);
      if (activeId === deletingStudent.id) {
        const remaining = students.filter((s) => s.id !== deletingStudent.id);
        setActiveId(remaining[0]?.id || '');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingStudent) {
      if (file.size > 2 * 1024 * 1024) {
        setEditError('Photo size must not exceed 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingStudent({ ...editingStudent, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status: StudentStatus | string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Graduated':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Left':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="Students"
        subItemTitle="Student Information"
        sectionKey="students"
        subItemKey="student-information"
      />

      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t('Student Information')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('Individual student registry profile, personal records, and academic information')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('students', 'student-list')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
          >
            ← {t('Back to Student List')}
          </button>
          <button
            onClick={() => setActiveNav('students', 'student-admission')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t('New Admission')}</span>
          </button>
        </div>
      </div>

      {studentsLoading ? (
        // Loading Skeleton
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent mb-3"></div>
          <p className="text-sm font-semibold text-slate-700">{t('Loading...')}</p>
        </div>
      ) : students.length === 0 ? (
        // Empty State
        <div className="rounded-xl border border-slate-200 bg-white p-16 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t('No students found.')}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {t('No students are registered in the Firestore database yet. Click below to add the first admission.')}
          </p>
          <button
            onClick={() => setActiveNav('students', 'student-admission')}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{t('Admit First Student')}</span>
          </button>
        </div>
      ) : (
        /* Main 2-Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Student Selector Directory (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col h-[680px]">
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('Search by ID, name, or phone...')}
                  className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
              {matchedStudents.length > 0 ? (
                matchedStudents.map((s) => {
                  const isSelected = s.id === currentStudent?.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveId(s.id);
                        setSelectedStudentId(s.id);
                      }}
                      className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {s.photoUrl ? (
                        <img
                          src={s.photoUrl}
                          alt={s.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                          {s.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">{s.name}</p>
                          <span className="font-mono text-[10px] text-emerald-800 font-semibold">
                            {s.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{s.className}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getStatusBadge(
                              s.status
                            )}`}
                          >
                            {s.status}
                          </span>
                          {s.phone && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {s.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <p className="font-medium text-slate-700">{t('No students found.')}</p>
                  <p className="mt-1 text-slate-400">{t('Try a different search term.')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Student Profile Record (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {currentStudent ? (
              <>
                {/* Profile Top Banner */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-4">
                      {currentStudent.photoUrl ? (
                        <img
                          src={currentStudent.photoUrl}
                          alt={currentStudent.name}
                          className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white shadow-xs">
                          {currentStudent.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{currentStudent.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="font-mono font-semibold text-emerald-800">
                            {t('Student ID')}: {currentStudent.id}
                          </span>
                          <span>·</span>
                          <span className="font-medium text-slate-700">
                            {currentStudent.className}
                          </span>
                          <span>·</span>
                          <span>{t('Section')} {currentStudent.section || 'A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold border ${getStatusBadge(
                          currentStudent.status
                        )}`}
                      >
                        {t(currentStudent.status)}
                      </span>
                      <button
                        onClick={() => {
                          setEditError(null);
                          setEditingStudent({ ...currentStudent });
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>{t('Edit')}</span>
                      </button>
                      <button
                        onClick={() => setDeletingStudent(currentStudent)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{t('Delete')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Data Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-5 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400">{t('Father Name')}</span>
                      <p className="font-semibold text-slate-800">{currentStudent.fatherName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400">{t('Mother Name')}</span>
                      <p className="font-semibold text-slate-800">
                        {currentStudent.motherName || t('Not recorded')}
                      </p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-slate-400">{t('Phone Number')} & WhatsApp</span>
                      <div className="flex flex-col gap-1.5 mt-1">
                        {currentStudent.contactPhones && currentStudent.contactPhones.length > 0 ? (
                          currentStudent.contactPhones.map((cp, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{cp.relation}:</span>
                                <span className="font-mono text-slate-700 ml-1.5">{cp.number}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <a
                                  href={`tel:${cp.number}`}
                                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold flex items-center gap-1"
                                  title="সরাসরি কল করুন"
                                >
                                  কল
                                </a>
                                {cp.whatsapp && (
                                  <a
                                    href={`https://wa.me/${cp.number.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-[10px] font-semibold flex items-center gap-1"
                                    title="WhatsApp চ্যাট"
                                  >
                                    WhatsApp
                                  </a>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="font-mono text-slate-800">{currentStudent.phone || t('Not recorded')}</span>
                            {currentStudent.phone && (
                              <a
                                href={`tel:${currentStudent.phone}`}
                                className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-semibold flex items-center gap-1"
                              >
                                কল
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400">{t('Date of Birth')}</span>
                      <p className="font-semibold text-slate-800">
                        {currentStudent.dob || t('Not recorded')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400">{t('Admission Date')}</span>
                      <p className="font-semibold text-slate-800 font-mono">
                        {currentStudent.admissionDate}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400">{t('Class')} & {t('Section')}</span>
                      <p className="font-semibold text-slate-800">
                        {currentStudent.className} · {t('Section')} {currentStudent.section || 'A'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">{t('Residential Address')}</span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {currentStudent.address || t('Address not registered')}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400">ভর্তির সময় প্রদত্ত ফি</span>
                      <p className="font-bold text-emerald-700 font-mono">
                        {currentStudent.admissionFeePaid !== undefined ? `৳${currentStudent.admissionFeePaid.toLocaleString()}` : 'রেকর্ড করা হয়নি'}
                      </p>
                    </div>
                    {currentStudent.admissionFormPhotoUrl && (
                      <div className="space-y-1">
                        <span className="text-slate-400">ভর্তির ফরমের ছবি</span>
                        <div>
                          <a href={currentStudent.admissionFormPhotoUrl} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                            📄 ছবি দেখুন (View Form)
                          </a>
                        </div>
                      </div>
                    )}
                    {currentStudent.birthCertificatePhotoUrl && (
                      <div className="space-y-1">
                        <span className="text-slate-400">জন্ম নিবন্ধনের ছবি</span>
                        <div>
                          <a href={currentStudent.birthCertificatePhotoUrl} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                            📄 ছবি দেখুন (View Birth Cert)
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7. Fee History Section */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {t('Payment History')}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t('Live ledger transactions from Google Cloud Firestore')}
                      </p>
                    </div>
                    <button
                      onClick={() => openFeeCollectionForStudent(currentStudent.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{t('Collect Fee')}</span>
                    </button>
                  </div>

                  {/* Summary Cards: Total Fees, Total Paid, Total Due */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <span className="text-[11px] text-slate-500 font-medium">{t('Total Fee')}</span>
                      <p className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                        ৳{totalFees}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-50/60 border border-emerald-100 p-3">
                      <span className="text-[11px] text-emerald-800 font-medium">{t('Total Paid')}</span>
                      <p className="text-xl font-bold text-emerald-950 font-mono tabular-nums mt-0.5">
                        ৳{totalPaid}
                      </p>
                    </div>
                    <div className="rounded-lg bg-amber-50/60 border border-amber-100 p-3">
                      <span className="text-[11px] text-amber-800 font-medium">{t('Total Due')}</span>
                      <p className="text-xl font-bold text-amber-950 font-mono tabular-nums mt-0.5">
                        ৳{totalDue}
                      </p>
                    </div>
                  </div>

                  {studentFees.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">{t('Date')}</th>
                            <th className="py-2.5 px-3">{t('Fee Type')}</th>
                            <th className="py-2.5 px-3 text-right">{t('Amount')}</th>
                            <th className="py-2.5 px-3 text-right">{t('Paid')}</th>
                            <th className="py-2.5 px-3 text-right">{t('Due')}</th>
                            <th className="py-2.5 px-3">{t('Payment Method')}</th>
                            <th className="py-2.5 px-3 text-center">{t('Status')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {studentFees.map((fee) => (
                            <tr key={fee.id}>
                              <td className="py-2 px-3 text-slate-600 font-mono">
                                {fee.paymentDate || fee.lastPaymentDate || '-'}
                              </td>
                              <td className="py-2 px-3 font-medium text-slate-900">
                                {t(fee.feeType)}
                                {fee.month && (
                                  <span className="text-slate-500 font-normal"> ({fee.month})</span>
                                )}
                                {fee.category && (
                                  <span className="text-slate-500 font-normal"> ({t(fee.category)})</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-right font-mono">৳{fee.totalFee}</td>
                              <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-700">
                                ৳{fee.paid}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-semibold text-amber-700">
                                ৳{fee.due}
                              </td>
                              <td className="py-2 px-3 text-slate-600">
                                {t(fee.paymentMethod || 'Cash')}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span
                                  className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold border ${getStatusBadge(
                                    fee.status
                                  )}`}
                                >
                                  {t(fee.status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-3 text-center">{t('No fee history found for this student in Firestore.')}</p>
                  )}
                </div>

                {/* Boarding Info Card if boarder */}
                {currentStudent.boarding && boardingRecord && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                      {t('Hostel & Boarding Assignment')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2.5">
                        <span className="text-slate-400">{t('Hostel Room')}</span>
                        <p className="font-bold text-slate-900 mt-0.5">{boardingRecord.roomNumber}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2.5">
                        <span className="text-slate-400">{t('Bed Number')}</span>
                        <p className="font-bold text-slate-900 mt-0.5">{boardingRecord.bedNumber}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2.5">
                        <span className="text-slate-400">{t('Supervisor')}</span>
                        <p className="font-bold text-slate-900 mt-0.5">{boardingRecord.supervisor}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2.5">
                        <span className="text-slate-400">{t('Monthly Fee')}</span>
                        <p className="font-bold text-slate-900 font-mono mt-0.5">
                          ৳{boardingRecord.monthlyFee}/mo
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Behavior & Academic Notes Section */}
                {currentStudent && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span>শিক্ষার্থীর নোট ও আচরণ রেকর্ড (অপরাধ, কৃতিত্ব ও মন্তব্য)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-normal">
                        নোট সংখ্যা: {studentNotes.filter((n) => n.studentId === currentStudent.id).length}
                      </span>
                    </h4>

                    {/* Add Note Form */}
                    <form onSubmit={handleAddStudentNote} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            required
                            placeholder="নোটের শিরোনাম (যেমন: ক্লাসে অনুপস্থিতি / কোরআন হেফজে বিশেষ পুরস্কার)"
                            value={studentNoteTitle}
                            onChange={(e) => setStudentNoteTitle(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <select
                            value={studentNoteType}
                            onChange={(e) => setStudentNoteType(e.target.value as any)}
                            className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                          >
                            <option value="General">সাধারণ (General)</option>
                            <option value="Crime/Discipline">অপরাধ / শৃঙ্খলাভঙ্গ (Discipline)</option>
                            <option value="Achievement">কৃতিত্ব / পুরস্কার (Achievement)</option>
                            <option value="Warning">সতর্কবার্তা (Warning)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-3">
                          <textarea
                            required
                            rows={2}
                            placeholder="বিস্তারিত নোট লিখুন..."
                            value={studentNoteDesc}
                            onChange={(e) => setStudentNoteDesc(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                          ></textarea>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          নোট সংরক্ষণ করুন
                        </button>
                      </div>
                    </form>

                    {/* Notes List */}
                    <div className="space-y-2.5 max-h-52 overflow-y-auto">
                      {studentNotes
                        .filter((n) => n.studentId === currentStudent.id)
                        .map((note) => (
                          <div key={note.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                    note.noteType === 'Achievement'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : note.noteType === 'Crime/Discipline'
                                      ? 'bg-rose-100 text-rose-800'
                                      : note.noteType === 'Warning'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {note.noteType}
                                </span>
                                <span className="font-bold text-slate-900">{note.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{note.date}</span>
                              </div>
                              <p className="text-slate-600">{note.description}</p>
                            </div>
                            <button
                              onClick={() => deleteStudentNote(note.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="নোট মুছুন"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}

                      {studentNotes.filter((n) => n.studentId === currentStudent.id).length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-4 italic">এই শিক্ষার্থীর জন্য কোনো নোট বা আচরণ রেকর্ড সংরক্ষিত নেই।</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
                {t('Select a student from the directory list on the left to view profile records.')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL FROM STUDENT INFO */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title={t('Edit Student Information')}
          subtitle={`${t('Student ID')}: ${editingStudent.id}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {editError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {/* Photo update preview */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              {editingStudent.photoUrl ? (
                <img
                  src={editingStudent.photoUrl}
                  alt={editingStudent.name}
                  className="h-14 w-14 rounded-lg object-cover border border-slate-300"
                />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">
                  {editingStudent.name ? editingStudent.name.charAt(0) : '?'}
                </div>
              )}
              <div className="space-y-1">
                <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                  <Camera className="h-3.5 w-3.5" />
                  <span>{t('Change Student Photo')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditPhotoChange}
                    className="hidden"
                  />
                </label>
                {editingStudent.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingStudent({ ...editingStudent, photoUrl: undefined })}
                    className="block text-[11px] text-red-600 hover:underline"
                  >
                    {t('Remove photo')}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Student ID')}</label>
                <input
                  type="text"
                  disabled
                  value={editingStudent.id}
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2 font-mono font-semibold text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Student Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Father Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.fatherName}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, fatherName: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Mother Name')}</label>
                <input
                  type="text"
                  value={editingStudent.motherName || ''}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, motherName: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Date of Birth')}</label>
                <input
                  type="date"
                  value={editingStudent.dob || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Phone Number')}</label>
                <input
                  type="text"
                  value={editingStudent.phone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Class')} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={editingStudent.className}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, className: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 focus:border-emerald-600 focus:outline-hidden font-medium"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Section')}</label>
                <select
                  value={editingStudent.section || 'A'}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, section: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="A">{t('Section A')}</option>
                  <option value="B">{t('Section B')}</option>
                  <option value="C">{t('Section C')}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Admission Date')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={editingStudent.admissionDate}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, admissionDate: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Student Status')} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={editingStudent.status}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      status: e.target.value as StudentStatus,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 focus:border-emerald-600 focus:outline-hidden font-medium"
                >
                  <option value="Active">{t('Active')}</option>
                  <option value="Inactive">{t('Inactive')}</option>
                  <option value="Graduated">{t('Graduated')}</option>
                  <option value="Left">{t('Left')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                {t('Residential Address')}
              </label>
              <textarea
                rows={2}
                value={editingStudent.address || ''}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, address: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={isSavingEdit}
                className="rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
              >
                {isSavingEdit ? t('Saving...') : t('Save Changes')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingStudent && (
        <Modal
          isOpen={!!deletingStudent}
          onClose={() => setDeletingStudent(null)}
          title={t('Confirm Student Deletion')}
          subtitle={t('Confirm deletion from Google Cloud Firestore')}
          isDestructive={true}
          maxWidth="md"
          footer={
            <>
              <button
                onClick={() => setDeletingStudent(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? t('Deleting...') : t('Confirm Delete')}
              </button>
            </>
          }
        >
          <div className="text-xs text-slate-600 space-y-3">
            <p>
              {t('Are you sure you want to delete this student from the active registry?')}{' '}
              <strong className="text-slate-900">{deletingStudent.name}</strong> ({t('Student ID')}:{' '}
              <span className="font-mono font-semibold text-slate-900">{deletingStudent.id}</span>)?
            </p>
            <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-red-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{t('Permanent Database Action')}</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                {t('This document will be deleted from the Firestore collection')} <code className="font-mono">students/{deletingStudent.id}</code>. {t('This action cannot be undone.')}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
