import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Camera,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Student, StudentStatus } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';

export const StudentListPage: React.FC = () => {
  const { adminProfile } = useAuth();
  const {
    students,
    studentsLoading,
    updateStudent,
    deleteStudent,
    setActiveNav,
    searchQuery,
    viewStudentProfile,
    classes,
    fees, // Let's also destructure fees to check for existing student fees
    t,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const effectiveSearch = localSearch || searchQuery;

  const studentFeesCount = useMemo(() => {
    if (!deletingStudent) return 0;
    return fees.filter((f) => f.studentId === deletingStudent.id).length;
  }, [fees, deletingStudent]);

  // Filter students based on search and dropdown filters
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = effectiveSearch.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.fatherName.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q));

      const matchesClass = selectedClass === 'All' || s.className === selectedClass;
      const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, effectiveSearch, selectedClass, selectedStatus]);

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [effectiveSearch, selectedClass, selectedStatus, pageSize]);

  // Derived pagination variables
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => set.add(c.name));
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set);
  }, [classes, students]);

  // Handle Edit form submission
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditError(null);

    // Validate required fields
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
    if (!editingStudent.status) {
      setEditError('Student Status is required.');
      return;
    }

    setIsSavingEdit(true);
    try {
      await updateStudent(editingStudent.id, editingStudent);
      setEditingStudent(null);
    } catch (err: any) {
      console.error('Failed to update student:', err);
      setEditError(err.message || 'Failed to update student in Firestore.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteStudent(deletingStudent.id);
      setDeletingStudent(null);
    } catch (err: any) {
      console.error('Failed to delete student:', err);
      setDeleteError(err.message || 'Failed to delete student from Firestore. Check your permissions.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle photo upload inside Edit modal
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
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="Students"
        subItemTitle="Student List"
        sectionKey="students"
        subItemKey="student-list"
      />

      {/* Top Action Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{t('Student List')}</h2>
          <p className="text-xs text-slate-500">
            {t('Real-time Firestore registry of enrolled madrasa students')}
          </p>
        </div>

        <button
          onClick={() => setActiveNav('students', 'student-admission')}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t('Student Admission')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={t('Search by Name, Student ID, Father Name, Phone...')}
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
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="All">{t('All Classes')}</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500">{t('Status')}:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="All">{t('All Status')}</option>
              <option value="Active">{t('Active')}</option>
              <option value="Inactive">{t('Inactive')}</option>
              <option value="Graduated">{t('Graduated')}</option>
              <option value="Left">{t('Left')}</option>
            </select>
          </div>

          {(localSearch || selectedClass !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setLocalSearch('');
                setSelectedClass('All');
                setSelectedStatus('All');
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              title={t('Reset Filters')}
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t('Reset')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">{t('Student ID')}</th>
                <th className="px-5 py-3.5">{t('Student Name')}</th>
                <th className="px-5 py-3.5">{t('Father Name')}</th>
                <th className="px-5 py-3.5">{t('Class')}</th>
                <th className="px-5 py-3.5">{t('Section')}</th>
                <th className="px-5 py-3.5">{t('Phone')}</th>
                <th className="px-5 py-3.5">{t('Admission Date')}</th>
                <th className="px-5 py-3.5 text-center">{t('Status')}</th>
                <th className="px-5 py-3.5 text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsLoading ? (
                // Loading State
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="h-3.5 w-16 bg-slate-200 rounded"></div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-200"></div>
                        <div className="h-3.5 w-28 bg-slate-200 rounded"></div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3.5 w-20 bg-slate-200 rounded"></div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3.5 w-8 bg-slate-200 rounded"></div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3.5 w-20 bg-slate-200 rounded"></div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="h-4 w-14 bg-slate-200 rounded mx-auto"></div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="h-5 w-16 bg-slate-200 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono font-semibold text-emerald-800">
                      {student.id}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="h-7 w-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            {student.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{student.name}</p>
                          {student.motherName && (
                            <span className="text-[10px] text-slate-400">
                              M: {student.motherName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                      {student.fatherName}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-800">
                      {student.className}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono">
                      {student.section || '-'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-mono tabular-nums">
                      {student.phone || '-'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 tabular-nums">
                      {student.admissionDate}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(
                          student.status
                        )}`}
                      >
                        {t(student.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStudent(student)}
                          title={t('View student file')}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditError(null);
                            setEditingStudent({ ...student });
                          }}
                          title={t('Edit student')}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteError(null);
                            setDeletingStudent(student);
                          }}
                          title={t('Delete student')}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Clean Empty State
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-slate-800">{t('No students found.')}</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {students.length === 0
                        ? t('No students are registered in the Firestore database yet. Click below to add the first admission.')
                        : t('No student records match your active search or filter criteria.')}
                    </p>
                    {students.length === 0 ? (
                      <button
                        onClick={() => setActiveNav('students', 'student-admission')}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{t('Admit First Student')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setLocalSearch('');
                          setSelectedClass('All');
                          setSelectedStatus('All');
                        }}
                        className="mt-3 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        {t('Clear search and filters')}
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        {!studentsLoading && filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span>
                {t('Students')}:{' '}
                <strong className="text-slate-900 font-mono">
                  {(currentPage - 1) * pageSize + 1}
                </strong>{' '}
                -{' '}
                <strong className="text-slate-900 font-mono">
                  {Math.min(currentPage * pageSize, filteredStudents.length)}
                </strong>{' '}
                / <strong className="text-slate-900 font-mono">{filteredStudents.length}</strong>
              </span>

              <div className="flex items-center gap-1 text-[11px] text-slate-500 pl-3 border-l border-slate-200">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 focus:outline-hidden"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>{t('Previous')}</span>
              </button>

              <span className="px-2 text-xs font-semibold text-slate-700 font-mono">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{t('Next')}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW STUDENT MODAL */}
      {viewingStudent && (
        <Modal
          isOpen={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
          title={t('Student Record Profile')}
          subtitle={`${t('Student ID')}: ${viewingStudent.id}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => {
                  viewStudentProfile(viewingStudent.id);
                  setViewingStudent(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>{t('Open Full Student Information Record')}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent({ ...viewingStudent });
                    setViewingStudent(null);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {t('Edit Student')}
                </button>
                <button
                  type="button"
                  onClick={() => setViewingStudent(null)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  {t('Close')}
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              {viewingStudent.photoUrl ? (
                <img
                  src={viewingStudent.photoUrl}
                  alt={viewingStudent.name}
                  className="h-16 w-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-700 text-xl font-bold text-white shadow-xs">
                  {viewingStudent.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-slate-900">{viewingStudent.name}</h4>
                <p className="text-xs text-slate-500">
                  {t('Student ID')}:{' '}
                  <span className="font-mono font-semibold text-emerald-800">
                    {viewingStudent.id}
                  </span>{' '}
                  · {viewingStudent.className} ({t('Section')} {viewingStudent.section || 'A'})
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(
                      viewingStudent.status
                    )}`}
                  >
                    {t('Status')}: {t(viewingStudent.status)}
                  </span>
                  {viewingStudent.boarding && (
                    <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 border border-sky-200">
                      {t('Hostel Boarding Resident')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="text-slate-400">{t('Father Name')}:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{viewingStudent.fatherName}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="text-slate-400">{t('Mother Name')}:</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {viewingStudent.motherName || t('Not recorded')}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="text-slate-400">{t('Phone Number')}:</span>
                <p className="font-semibold text-slate-900 mt-0.5 font-mono">
                  {viewingStudent.phone || t('Not recorded')}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="text-slate-400">{t('Date of Birth')}:</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {viewingStudent.dob || t('Not recorded')}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="text-slate-400">{t('Admission Date')}:</span>
                <p className="font-semibold text-slate-900 mt-0.5 font-mono">
                  {viewingStudent.admissionDate}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="text-slate-400">{t('Class & Section')}:</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {viewingStudent.className} · {t('Section')} {viewingStudent.section || 'A'}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-xs">
              <span className="text-slate-400">{t('Residential Address')}:</span>
              <p className="font-semibold text-slate-900 mt-0.5">
                {viewingStudent.address || t('Address not registered')}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title={t('Student Edit')}
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
                <span className="text-[10px] text-slate-400">{t('Student ID cannot be changed')}</span>
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
                  {uniqueClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
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
          title={t('Student Delete')}
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
            {deleteError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{deleteError}</span>
              </div>
            )}

            <p className="leading-relaxed">
              {t('Are you sure you want to delete this student from the active registry?')}{' '}
              <strong className="text-slate-900 font-semibold">{deletingStudent.name}</strong> (
              <span className="font-mono font-bold text-slate-900">
                {deletingStudent.id}
              </span>
              )
            </p>

            {studentFeesCount > 0 ? (
              <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-amber-800 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>{t('Financial Integrity Check: Fee Records Present')}</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  {t('This student has')} <strong className="font-semibold">{studentFeesCount} {t('records')}</strong>.
                  {' '}{t('To preserve Madrasa financial history, these fee documents will NOT be deleted and will remain in Firestore.')}
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-slate-700 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-slate-500" />
                  <span>{t('Financial Status')}</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  {t('No fee records were found in the database for this student.')}
                </p>
              </div>
            )}

            <div className="rounded-lg bg-red-50 p-3 border border-red-100 text-red-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{t('Permanent Database Action')}</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                {t('This document will be deleted from the Firestore collection')} <code className="font-mono bg-red-100/50 px-1 py-0.5 rounded text-red-900">students/{deletingStudent.id}</code>. {t('This action cannot be undone.')}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
