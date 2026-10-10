import React, { useState } from 'react';
import {
  UserCheck,
  RotateCcw,
  Camera,
  GraduationCap,
  AlertCircle,
  Hash,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentStatus } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export const StudentAdmissionPage: React.FC = () => {
  const { addStudent, setActiveNav, classes, checkStudentIdExists, students, t } = useApp();

  // Generate suggested unique ID based on existing count
  const suggestedId = `STD-${1000 + (students ? students.length + 1 : 1)}`;

  const [formData, setFormData] = useState({
    studentId: suggestedId,
    name: '',
    fatherName: '',
    motherName: '',
    dob: '2014-06-15',
    phone: '',
    address: '',
    className: classes[0]?.name || 'Hifz Section A',
    section: 'A',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'Active' as StudentStatus,
    boarding: false,
    roomNo: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Photo file size should not exceed 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const sId = formData.studentId.trim();
    const sName = formData.name.trim();
    const sFather = formData.fatherName.trim();
    const sClass = formData.className.trim();
    const sDate = formData.admissionDate.trim();
    const sStatus = formData.status;

    // Strict validation of required fields
    if (!sId) {
      setErrorMessage(t('Student ID is required.'));
      return;
    }
    if (!sName) {
      setErrorMessage(t('Student Name is required.'));
      return;
    }
    if (!sFather) {
      setErrorMessage(t('Father Name is required.'));
      return;
    }
    if (!sClass) {
      setErrorMessage(t('Class selection is required.'));
      return;
    }
    if (!sDate) {
      setErrorMessage(t('Admission Date is required.'));
      return;
    }
    if (!sStatus) {
      setErrorMessage(t('Student Status is required.'));
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check uniqueness of Student ID
      const exists = await checkStudentIdExists(sId);
      if (exists) {
        setErrorMessage(`${t('Student ID')} "${sId}" ${t('already exists.')}`);
        setIsSubmitting(false);
        return;
      }

      // 2. Save new student to Firestore
      await addStudent({
        id: sId,
        name: sName,
        fatherName: sFather,
        motherName: formData.motherName.trim(),
        dob: formData.dob,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        className: sClass,
        section: formData.section.trim() || 'A',
        admissionDate: sDate,
        status: sStatus,
        boarding: formData.boarding,
        roomNo: formData.boarding ? formData.roomNo || 'Dorm-General' : undefined,
        photoUrl: photoPreview || undefined,
      });

      // Redirect to Student List to view the newly enrolled student
      setActiveNav('students', 'student-list');
    } catch (err: any) {
      console.error('Error admitting student:', err);
      setErrorMessage(err.message || 'Failed to save student admission. Please check network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      studentId: `STD-${1000 + (students ? students.length + 1 : 1)}`,
      name: '',
      fatherName: '',
      motherName: '',
      dob: '2014-06-15',
      phone: '',
      address: '',
      className: classes[0]?.name || 'Hifz Section A',
      section: 'A',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      boarding: false,
      roomNo: '',
    });
    setPhotoPreview(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="Students"
        subItemTitle="Student Admission"
        sectionKey="students"
        subItemKey="student-admission"
      />

      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t('Student Admission Form')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('Register new talib-e-ilm directly into the Firestore cloud database')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveNav('students', 'student-list')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          ← {t('Back to Student List')}
        </button>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="flex items-start justify-between rounded-xl bg-red-50 p-4 border border-red-200 text-xs text-red-900 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t('Notice')}</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Admission Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          {/* Section 1: Basic Identity & Photo */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              <span>{t('Student Personal Details')}</span>
            </h3>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo Upload Area */}
              <div className="flex flex-col items-center justify-center sm:w-44 shrink-0">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden hover:bg-slate-100 transition-colors">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Student Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <Camera className="mx-auto h-7 w-7 text-slate-400 mb-1" />
                      <span className="text-[11px] font-medium text-slate-500">
                        {t('Upload Photo')}
                      </span>
                      <span className="block text-[9px] text-slate-400 mt-0.5">{t('Passport size')}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="mt-2 text-[11px] text-red-600 hover:underline"
                  >
                    {t('Remove photo')}
                  </button>
                )}
              </div>

              {/* Identity Form Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{t('Student ID')}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STD-1001"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 font-mono font-semibold focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('Student Name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Zayd Al-Hasan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('Father Name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mawlana Tariq Jameel"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('Mother Name')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fatima Khatun"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('Date of Birth')}
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('Phone')}
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Placement & Status */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              {t('Academic Enrollment Details')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Class')} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden font-medium"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Section')}
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
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
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Status')} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as StudentStatus })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Active">{t('Active')}</option>
                  <option value="Inactive">{t('Inactive')}</option>
                  <option value="Graduated">{t('Graduated')}</option>
                  <option value="Left">{t('Left')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Residence & Boarding */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              {t('Address & Residence Details')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('Residential Address')}
                </label>
                <textarea
                  rows={3}
                  placeholder="Street address, city, postal code..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="boardingCheck"
                    checked={formData.boarding}
                    onChange={(e) => setFormData({ ...formData, boarding: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="boardingCheck" className="font-semibold text-slate-900 cursor-pointer">
                    {t('Boarding Student (Hostel Resident)')}
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-7">
                  {t('Assign hostel dormitory bed and meal plan')}
                </p>

                {formData.boarding && (
                  <div className="mt-3 pl-7">
                    <label className="block font-medium text-slate-700 mb-1">
                      {t('Room Number')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dorm-204"
                      value={formData.roomNo}
                      onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:outline-hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t('Reset Form')}</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors disabled:opacity-50"
          >
            <UserCheck className="h-4 w-4" />
            <span>{isSubmitting ? t('Saving...') : t('Submit Admission')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
