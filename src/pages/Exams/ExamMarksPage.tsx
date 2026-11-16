import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamResult, SubjectMark, SubNavigationItem } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import {
  Award,
  Plus,
  Search,
  Printer,
  FileText,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  User,
  Calendar,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

const DEFAULT_SUBJECTS = [
  'কুরআন মাজিদ ও তাজবীদ',
  'আকাইদ ও ফিকহ',
  'আরবি সাহিত্য ও ব্যাকরণ',
  'বাংলা',
  'ইংরেজি',
  'গণিত',
  'ইতিহাস ও সামাজিক বিজ্ঞান',
];

export const ExamMarksPage: React.FC = () => {
  const {
    activeSubItem,
    setActiveNav,
    examResults,
    students,
    classes,
    addExamResult,
    updateExamResult,
    deleteExamResult,
    madrasaInfo,
    t,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [selectedExamFilter, setSelectedExamFilter] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [viewingReportCard, setViewingReportCard] = useState<ExamResult | null>(null);
  const [deletingResult, setDeletingResult] = useState<ExamResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formStudentId, setFormStudentId] = useState('');
  const [formExamName, setFormExamName] = useState('১ম টার্ম পরীক্ষা ২০২৬');
  const [formAcademicYear, setFormAcademicYear] = useState('২০২৬');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formRemarks, setFormRemarks] = useState('উত্তম ফলাফল! পড়াশোনায় আরও মনোযোগী হতে হবে।');
  
  // Subject marks state for form
  const [subjectEntries, setSubjectEntries] = useState<Array<{ subjectName: string; fullMarks: number; obtainedMarks: number }>>(
    DEFAULT_SUBJECTS.map((s) => ({ subjectName: s, fullMarks: 100, obtainedMarks: 80 }))
  );

  // Selected student for form
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === formStudentId);
  }, [students, formStudentId]);

  // Initialize form student when opening modal
  const handleOpenAddModal = () => {
    if (students.length > 0 && !formStudentId) {
      setFormStudentId(students[0].id);
    }
    setEditingResult(null);
    setFormError(null);
    setSubjectEntries(DEFAULT_SUBJECTS.map((s) => ({ subjectName: s, fullMarks: 100, obtainedMarks: 80 })));
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (result: ExamResult) => {
    setEditingResult(result);
    setFormStudentId(result.studentId);
    setFormExamName(result.examName);
    setFormAcademicYear(result.academicYear);
    setFormDate(result.date);
    setFormRemarks(result.remarks);
    setSubjectEntries(
      result.subjects.map((sub) => ({
        subjectName: sub.subjectName,
        fullMarks: sub.fullMarks,
        obtainedMarks: sub.obtainedMarks,
      }))
    );
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Calculate Grade and GP from percentage
  const calculateGradeAndGp = (percentage: number) => {
    if (percentage >= 80) return { grade: 'A+', gp: 5.0 };
    if (percentage >= 70) return { grade: 'A', gp: 4.0 };
    if (percentage >= 60) return { grade: 'A-', gp: 3.5 };
    if (percentage >= 50) return { grade: 'B', gp: 3.0 };
    if (percentage >= 40) return { grade: 'C', gp: 2.0 };
    if (percentage >= 33) return { grade: 'D', gp: 1.0 };
    return { grade: 'F', gp: 0.0 };
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedStudent) {
      setFormError('দয়া করে একজন শিক্ষার্থী নির্বাচন করুন।');
      return;
    }
    if (!formExamName.trim()) {
      setFormError('পরীক্ষার নাম আবশ্যক।');
      return;
    }

    // Process subject marks
    let totalMarks = 0;
    let totalObtained = 0;
    let totalGp = 0;
    let hasFail = false;

    const processedSubjects: SubjectMark[] = subjectEntries.map((item) => {
      const full = Number(item.fullMarks) || 100;
      const obtained = Math.min(full, Math.max(0, Number(item.obtainedMarks) || 0));
      const percentage = full > 0 ? (obtained / full) * 100 : 0;
      const { grade, gp } = calculateGradeAndGp(percentage);

      totalMarks += full;
      totalObtained += obtained;
      totalGp += gp;

      if (grade === 'F') {
        hasFail = true;
      }

      return {
        subjectName: item.subjectName,
        fullMarks: full,
        obtainedMarks: obtained,
        grade,
        gp,
      };
    });

    const percentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
    const avgGp = processedSubjects.length > 0 ? totalGp / processedSubjects.length : 0;
    const finalGrade = hasFail ? 'F' : avgGp >= 5.0 ? 'A+' : avgGp >= 4.0 ? 'A' : avgGp >= 3.5 ? 'A-' : avgGp >= 3.0 ? 'B' : avgGp >= 2.0 ? 'C' : avgGp >= 1.0 ? 'D' : 'F';
    const gpa = Number(Math.min(5.0, avgGp).toFixed(2));

    setIsSubmitting(true);
    try {
      if (editingResult) {
        await updateExamResult(editingResult.id, {
          studentId: selectedStudent.id,
          studentName: selectedStudent.name,
          className: selectedStudent.className,
          section: selectedStudent.section || 'ক',
          examName: formExamName.trim(),
          academicYear: formAcademicYear.trim(),
          subjects: processedSubjects,
          totalMarks,
          totalObtained,
          percentage: Number(percentage.toFixed(2)),
          gpa,
          finalGrade,
          remarks: formRemarks.trim(),
          date: formDate,
        });
      } else {
        await addExamResult({
          studentId: selectedStudent.id,
          studentName: selectedStudent.name,
          className: selectedStudent.className,
          section: selectedStudent.section || 'ক',
          examName: formExamName.trim(),
          academicYear: formAcademicYear.trim(),
          subjects: processedSubjects,
          totalMarks,
          totalObtained,
          percentage: Number(percentage.toFixed(2)),
          gpa,
          finalGrade,
          remarks: formRemarks.trim(),
          date: formDate,
        });
      }
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error('Exam result save error:', err);
      setFormError(err.message || 'ফলাফল সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter results
  const filteredResults = useMemo(() => {
    return examResults.filter((res) => {
      const q = localSearch.trim().toLowerCase();
      if (q) {
        const matchesId = res.studentId.toLowerCase().includes(q);
        const matchesName = res.studentName.toLowerCase().includes(q);
        const matchesExam = res.examName.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesExam) return false;
      }
      if (selectedClassFilter !== 'All' && res.className !== selectedClassFilter) {
        return false;
      }
      if (selectedExamFilter !== 'All' && res.examName !== selectedExamFilter) {
        return false;
      }
      return true;
    });
  }, [examResults, localSearch, selectedClassFilter, selectedExamFilter]);

  // Unique exams for filter
  const uniqueExamNames = useMemo(() => {
    const set = new Set<string>();
    examResults.forEach((r) => set.add(r.examName));
    return Array.from(set);
  }, [examResults]);

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'A':
      case 'A-':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'B':
      case 'C':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'D':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="পরীক্ষাসমূহ ও ফলাফল"
        subItemTitle={activeSubItem === 'report-cards' ? 'রিপোর্ট কার্ড ও মার্কশিট' : 'নম্বর এন্ট্রি ও ফলাফল'}
        sectionKey="exams"
        subItemKey={activeSubItem}
      />

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs">
        <button
          onClick={() => setActiveNav('exams', 'exam-marks')}
          className={`flex-1 rounded-lg py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubItem === 'exam-marks'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>নম্বর ও মার্কস এন্ট্রি (Exam Marks)</span>
        </button>
        <button
          onClick={() => setActiveNav('exams', 'report-cards')}
          className={`flex-1 rounded-lg py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubItem === 'report-cards'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>রিপোর্ট কার্ড ও মার্কশিট (Report Cards)</span>
        </button>
      </div>

      {/* EXAM MARKS VIEW */}
      {activeSubItem === 'exam-marks' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">ছাত্র-ছাত্রীদের পরীক্ষার নম্বর ব্যবস্থাপনা</h2>
              <p className="text-xs text-slate-500">বিভিন্ন বিষয়ের নম্বর ইনপুট করুন এবং স্বয়ংক্রিয় গ্রেড ও জিপিএ হিসাব করুন</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>নতুন পরীক্ষার নম্বর এন্ট্রি</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="শিক্ষার্থী আইডি, নাম বা পরীক্ষার নাম দিয়ে খুঁজুন..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500">শ্রেণী:</span>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="All">সকল শ্রেণী</option>
                  {classes.map((c, idx) => (
                    <option key={`${c.id || c.name}-${idx}`} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500">পরীক্ষা:</span>
                <select
                  value={selectedExamFilter}
                  onChange={(e) => setSelectedExamFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="All">সকল পরীক্ষা</option>
                  {uniqueExamNames.map((ex, idx) => (
                    <option key={`${ex}-${idx}`} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">শিক্ষার্থী আইডি</th>
                    <th className="px-5 py-3.5">শিক্ষার্থীর নাম</th>
                    <th className="px-5 py-3.5">শ্রেণী</th>
                    <th className="px-5 py-3.5">পরীক্ষার নাম</th>
                    <th className="px-5 py-3.5 text-right">মোট প্রাপ্ত নম্বর</th>
                    <th className="px-5 py-3.5 text-right">শতকরা (%)</th>
                    <th className="px-5 py-3.5 text-center">জিপিএ (GPA)</th>
                    <th className="px-5 py-3.5 text-center">গ্রেড</th>
                    <th className="px-5 py-3.5 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-semibold text-emerald-800">{res.studentId}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-900">{res.studentName}</td>
                        <td className="px-5 py-3.5 text-slate-600">{res.className}</td>
                        <td className="px-5 py-3.5 font-medium text-blue-900">{res.examName}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-800">
                          {res.totalObtained} / {res.totalMarks}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-slate-600">{res.percentage}%</td>
                        <td className="px-5 py-3.5 text-center font-mono font-bold text-emerald-700">{res.gpa.toFixed(2)}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold border ${getGradeBadge(res.finalGrade)}`}>
                            {res.finalGrade}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingReportCard(res)}
                              title="রিপোর্ট কার্ড দেখুন ও প্রিন্ট করুন"
                              className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                            >
                              <Award className="h-3.5 w-3.5" />
                              <span>মার্কশিট</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(res)}
                              title="সম্পাদনা করুন"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingResult(res)}
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
                      <td colSpan={9} className="py-16 text-center text-slate-400">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600">কোনো পরীক্ষার ফলাফল পাওয়া যায়নি</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">নতুন পরীক্ষার নম্বর এন্ট্রি করতে উপরের বোতামে ক্লিক করুন।</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CARDS GENERATOR VIEW */}
      {activeSubItem === 'report-cards' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">ছাত্র-ছাত্রীদের রিপোর্ট কার্ড ও মার্কশিট জেনারেটর</h2>
              <p className="text-xs text-slate-500">প্রতিটি শিক্ষার্থীর অফিশিয়াল মার্কশিট প্রিন্ট ও পিডিএফ ডাউনলোড করুন</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examResults.map((res) => (
              <div key={res.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {res.studentId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{res.studentName}</h3>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold border ${getGradeBadge(res.finalGrade)}`}>
                    GPA {res.gpa.toFixed(2)} ({res.finalGrade})
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div>পরীক্ষা: <strong className="text-slate-900">{res.examName}</strong></div>
                  <div>শ্রেণী: <strong>{res.className}</strong> (সেকশন: {res.section})</div>
                  <div>প্রাপ্ত নম্বর: <strong className="font-mono text-emerald-800">{res.totalObtained} / {res.totalMarks}</strong> ({res.percentage}%)</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setViewingReportCard(res)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-xs transition-colors"
                  >
                    <Award className="h-4 w-4" />
                    <span>রিপোর্ট কার্ড দেখুন ও প্রিন্ট করুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT EXAM MARKS MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingResult ? 'পরীক্ষার নম্বর সম্পাদনা করুন' : 'নতুন পরীক্ষার নম্বর এন্ট্রি করুন'}
          subtitle="শিক্ষার্থীর বিষয়ভিত্তিক নম্বর এন্ট্রি করুন"
          maxWidth="2xl"
        >
          <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
            {formError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  শিক্ষার্থী নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id}) - {s.className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  পরীক্ষার নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formExamName}
                  onChange={(e) => setFormExamName(e.target.value)}
                  placeholder="যেমন: ১ম টার্ম পরীক্ষা ২০২৬"
                  className="w-full rounded-lg border border-slate-200 p-2.5 font-medium text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">শিক্ষাবর্ষ</label>
                <input
                  type="text"
                  value={formAcademicYear}
                  onChange={(e) => setFormAcademicYear(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 font-medium text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ফলাফলের তারিখ</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800 text-sm">বিষয়ভিত্তিক নম্বর এন্ট্রি (পূর্ণমান ১০০)</label>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">বিষয়ের নাম</th>
                      <th className="px-4 py-2.5 w-32">পূর্ণমান</th>
                      <th className="px-4 py-2.5 w-32">প্রাপ্ত নম্বর</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjectEntries.map((sub, idx) => (
                      <tr key={`${sub.subjectName}-${idx}`} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-medium text-slate-900">{sub.subjectName}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={1}
                            value={sub.fullMarks}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const updated = [...subjectEntries];
                              updated[idx].fullMarks = val;
                              setSubjectEntries(updated);
                            }}
                            className="w-full rounded-md border border-slate-200 p-1.5 font-mono text-center"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={0}
                            max={sub.fullMarks}
                            value={sub.obtainedMarks}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const updated = [...subjectEntries];
                              updated[idx].obtainedMarks = val;
                              setSubjectEntries(updated);
                            }}
                            className="w-full rounded-md border border-slate-200 p-1.5 font-mono font-bold text-emerald-800 text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">শিক্ষকের মন্তব্য / গ্রেডিং রিমার্কস</label>
              <input
                type="text"
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'ফলাফল সংরক্ষণ করুন'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* REPORT CARD MODAL & PRINT VIEW */}
      {viewingReportCard && (
        <Modal
          isOpen={!!viewingReportCard}
          onClose={() => setViewingReportCard(null)}
          title="অফিসিয়াল রিপোর্ট কার্ড / মার্কশিট (Report Card)"
          subtitle="প্রিন্ট অথবা পিডিএফ ডাউনলোড করুন"
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Printable Report Card Area */}
            <div
              id="printable-report-card"
              className="rounded-xl border-2 border-slate-300 bg-white p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0 font-sans text-slate-900"
            >
              {/* Madrasa Header */}
              <div className="text-center border-b-2 border-emerald-800 pb-4 space-y-1.5">
                <h1 className="text-xl font-black text-emerald-950 font-serif">
                  {madrasaInfo?.name || 'খাইরুল কুরআন মাদ্রাসা ও এতিমখানা'}
                </h1>
                <p className="text-xs text-slate-600">
                  {madrasaInfo?.address || 'মাদ্রাসা ভবন, ঢাকা, বাংলাদেশ'} | ফোন: {madrasaInfo?.phone || '০১৭০০০০০০০০'}
                </p>
                <div className="inline-block px-4 py-1 bg-emerald-900 text-white font-extrabold rounded-md text-xs tracking-wider mt-1 uppercase">
                  {viewingReportCard.examName} - শিক্ষাবর্ষ {viewingReportCard.academicYear}
                </div>
              </div>

              {/* Student Bio Box */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <div>শিক্ষার্থীর নাম: <strong className="text-slate-900 text-sm">{viewingReportCard.studentName}</strong></div>
                  <div>শিক্ষার্থী আইডি: <strong className="font-mono text-emerald-800">{viewingReportCard.studentId}</strong></div>
                  <div>শ্রেণী: <strong>{viewingReportCard.className}</strong></div>
                </div>
                <div className="space-y-1 text-right">
                  <div>সেকশন: <strong>{viewingReportCard.section}</strong></div>
                  <div>শিক্ষাবর্ষ: <strong>{viewingReportCard.academicYear}</strong></div>
                  <div>প্রকাশের তারিখ: <strong className="font-mono">{viewingReportCard.date}</strong></div>
                </div>
              </div>

              {/* Subject Marks Table */}
              <div>
                <table className="w-full border-collapse border border-slate-300 text-xs text-left">
                  <thead className="bg-emerald-900 text-white font-semibold">
                    <tr>
                      <th className="border border-emerald-900 px-3 py-2.5">ক্র:</th>
                      <th className="border border-emerald-900 px-3 py-2.5">বিষয়ের নাম</th>
                      <th className="border border-emerald-900 px-3 py-2.5 text-center">পূর্ণমান</th>
                      <th className="border border-emerald-900 px-3 py-2.5 text-center">প্রাপ্ত নম্বর</th>
                      <th className="border border-emerald-900 px-3 py-2.5 text-center">গ্রেড</th>
                      <th className="border border-emerald-900 px-3 py-2.5 text-center">জিপিএ (GP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {viewingReportCard.subjects.map((sub, index) => (
                      <tr key={`${sub.subjectName}-${index}`} className="hover:bg-slate-50">
                        <td className="border border-slate-300 px-3 py-2 text-center font-mono">{index + 1}</td>
                        <td className="border border-slate-300 px-3 py-2 font-medium">{sub.subjectName}</td>
                        <td className="border border-slate-300 px-3 py-2 text-center font-mono">{sub.fullMarks}</td>
                        <td className="border border-slate-300 px-3 py-2 text-center font-mono font-bold text-emerald-800">{sub.obtainedMarks}</td>
                        <td className="border border-slate-300 px-3 py-2 text-center font-bold">{sub.grade}</td>
                        <td className="border border-slate-300 px-3 py-2 text-center font-mono">{sub.gp.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold">
                    <tr>
                      <td colSpan={2} className="border border-slate-300 px-3 py-2.5 text-right">মোট:</td>
                      <td className="border border-slate-300 px-3 py-2.5 text-center font-mono">{viewingReportCard.totalMarks}</td>
                      <td className="border border-slate-300 px-3 py-2.5 text-center font-mono text-emerald-900">{viewingReportCard.totalObtained}</td>
                      <td colSpan={2} className="border border-slate-300 px-3 py-2.5 text-center">
                        শতকরা: {viewingReportCard.percentage}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Summary Performance Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                <div>
                  <span className="text-slate-500 block text-[11px]">মোট প্রাপ্ত নম্বর</span>
                  <strong className="text-sm font-mono font-bold text-emerald-900">{viewingReportCard.totalObtained} / {viewingReportCard.totalMarks}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">শতকরা হার</span>
                  <strong className="text-sm font-mono font-bold text-emerald-900">{viewingReportCard.percentage}%</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">চূড়ান্ত জিপিএ (GPA)</span>
                  <strong className="text-base font-mono font-black text-emerald-950">{viewingReportCard.gpa.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">চূড়ান্ত গ্রেড</span>
                  <strong className="text-base font-black text-emerald-950">{viewingReportCard.finalGrade}</strong>
                </div>
              </div>

              {viewingReportCard.remarks && (
                <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong>শিক্ষকের মন্তব্য:</strong> {viewingReportCard.remarks}
                </div>
              )}

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-6 pt-16 text-center text-xs">
                <div className="border-t border-slate-400 pt-1 font-semibold">শ্রেণী শিক্ষক</div>
                <div className="border-t border-slate-400 pt-1 font-semibold">পরীক্ষা নিয়ন্ত্রক</div>
                <div className="border-t border-slate-400 pt-1 font-semibold">অধ্যক্ষ / মুহতামিম</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingReportCard(null)}
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
                <span>রিপোর্ট কার্ড প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingResult && (
        <Modal
          isOpen={!!deletingResult}
          onClose={() => setDeletingResult(null)}
          title="পরীক্ষার ফলাফল মুছে ফেলুন"
          subtitle="আপনি কি নিশ্চিতভাবে এই ফলাফলটি মুছে ফেলতে চান?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3.5 text-rose-800 border border-rose-200">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">স্থায়ীভাবে মুছে ফেলা</span>
                এই ফলাফলটি মুছে ফেললে তা ডাটাবেস থেকে স্থায়ীভাবে মুছে যাবে।
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
              <div>শিক্ষার্থী: <strong className="text-slate-900">{deletingResult.studentName}</strong></div>
              <div>পরীক্ষা: <strong>{deletingResult.examName}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingResult(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteExamResult(deletingResult.id);
                  setDeletingResult(null);
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
