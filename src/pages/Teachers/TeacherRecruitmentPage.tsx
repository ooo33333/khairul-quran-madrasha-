import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher, TeacherNote } from '../../types';
import {
  UserPlus,
  Search,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  Trash2,
  Edit,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  Award,
  BookOpen,
  DollarSign,
  UserCheck,
  ShieldAlert,
  FileCheck,
  Camera,
  Upload,
  PhoneCall,
  ShieldUser,
  Link,
} from 'lucide-react';

export const TeacherRecruitmentPage: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, teacherNotes, addTeacherNote, deleteTeacherNote } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education: '',
    previousEmployment: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 10000,
    phone: '',
    phonesStr: '',
    address: '',
    photoUrl: '',
    idCardPhotoUrl: '',
    certificatePhotoUrl: '',
    guarantorName: '',
    guarantorAddress: '',
    guarantorPhone: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Leave',
  });

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteType, setNoteType] = useState<'Good' | 'Bad' | 'Warning' | 'Appreciation' | 'General'>('General');

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.education.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Robust Image File to Base64 reader helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'idCardPhotoUrl' | 'certificatePhotoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ছবির সাইজ ২ মেগাবাইটের কম হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        age: String(teacher.age || ''),
        education: teacher.education,
        previousEmployment: teacher.previousEmployment,
        joiningDate: teacher.joiningDate,
        salary: teacher.salary,
        phone: teacher.phone,
        phonesStr: teacher.phones ? teacher.phones.join(', ') : '',
        address: teacher.address,
        photoUrl: teacher.photoUrl || '',
        idCardPhotoUrl: teacher.idCardPhotoUrl || '',
        certificatePhotoUrl: teacher.certificatePhotoUrl || '',
        guarantorName: teacher.guarantor?.name || '',
        guarantorAddress: teacher.guarantor?.address || '',
        guarantorPhone: teacher.guarantor?.phone || '',
        status: teacher.status,
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        age: '',
        education: '',
        previousEmployment: '',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: 10000,
        phone: '',
        phonesStr: '',
        address: '',
        photoUrl: '',
        idCardPhotoUrl: '',
        certificatePhotoUrl: '',
        guarantorName: '',
        guarantorAddress: '',
        guarantorPhone: '',
        status: 'Active',
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('দয়া করে উস্তাদের নাম এবং প্রধান ফোন নম্বর প্রদান করুন।');
      return;
    }

    const phonesArray = formData.phonesStr
      ? formData.phonesStr.split(',').map((p) => p.trim()).filter(Boolean)
      : [formData.phone];

    const payload = {
      name: formData.name,
      age: formData.age,
      education: formData.education,
      previousEmployment: formData.previousEmployment,
      joiningDate: formData.joiningDate,
      salary: formData.salary,
      phone: formData.phone,
      phones: phonesArray,
      address: formData.address,
      photoUrl: formData.photoUrl,
      idCardPhotoUrl: formData.idCardPhotoUrl,
      certificatePhotoUrl: formData.certificatePhotoUrl,
      guarantor: {
        name: formData.guarantorName,
        address: formData.guarantorAddress,
        phone: formData.guarantorPhone,
      },
      status: formData.status,
    };

    if (editingTeacher) {
      await updateTeacher(editingTeacher.id, payload);
    } else {
      await addTeacher({
        ...payload,
        id: `TCH-${Date.now().toString().slice(-4)}`,
        certificates: [],
      });
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteTeacherRecord = async (teacher: Teacher) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে উস্তাদ "${teacher.name}" কে সিস্টেম থেকে মুছে ফেলতে চান?`)) {
      if (viewingTeacher?.id === teacher.id) {
        setViewingTeacher(null);
      }
      await deleteTeacher(teacher.id);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingTeacher || !noteTitle || !noteDesc) return;

    await addTeacherNote({
      id: `NOTE-${Date.now()}`,
      teacherId: viewingTeacher.id,
      date: new Date().toISOString().split('T')[0],
      title: noteTitle,
      description: noteDesc,
      noteType: noteType,
      createdAt: new Date().toISOString(),
    });

    setNoteTitle('');
    setNoteDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                উস্তাদ নিয়োগ ও ব্যবস্থাপনা
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                শিক্ষক নিয়োগ, একাধিক ফোন নম্বর, সরাসরি কল লিংক, ছবি আপলোড ও জামিনদার রেফারেন্স
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>নতুন উস্তাদ নিয়োগ ফর্ম</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="উস্তাদের নাম, ফোন নম্বর বা শিক্ষাগত যোগ্যতা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="All">সকল অবস্থা (All Status)</option>
            <option value="Active">সক্রিয় (Active)</option>
            <option value="Leave">ছুটিতে (On Leave)</option>
            <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Teacher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => {
          const tNotes = teacherNotes.filter((n) => n.teacherId === teacher.id);
          const phonesList = teacher.phones && teacher.phones.length > 0 ? teacher.phones : [teacher.phone];
          return (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {teacher.photoUrl ? (
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-xl shadow-xs shrink-0">
                      {teacher.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                        {teacher.id}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          teacher.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : teacher.status === 'Leave'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <BookOpen className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{teacher.education}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">বয়স:</span>
                    <span className="font-semibold text-slate-800">{teacher.age} বছর</span>
                  </div>
                  
                  {/* Multiple Phone Numbers with Direct Call Links */}
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400">যোগাযোগ নম্বরসমূহ:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {phonesList.map((ph, idx) => (
                        <a
                          key={idx}
                          href={`tel:${ph}`}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-mono font-semibold transition-colors"
                          title="সরাসরি কল করতে ক্লিক করুন"
                        >
                          <PhoneCall className="h-3 w-3 text-emerald-600" />
                          <span>{ph}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">মাসিক বেতন:</span>
                    <span className="font-semibold text-emerald-700 font-mono">৳{teacher.salary.toLocaleString()}</span>
                  </div>

                  {teacher.guarantor?.name && (
                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400">জামিনদার/রেফারেন্স:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {teacher.guarantor.name} ({teacher.guarantor.phone})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setViewingTeacher(teacher)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>প্রোফাইল ও নোট ({tNotes.length})</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenAddModal(teacher)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-blue-600 transition-colors cursor-pointer"
                    title="সম্পাদনা"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacherRecord(teacher)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-rose-600 transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <UserPlus className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">কোনো উস্তাদ পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 mt-1">নতুন উস্তাদ নিয়োগ করতে উপরের "নতুন উস্তাদ নিয়োগ ফর্ম" বাটনে ক্লিক করুন।</p>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingTeacher ? 'উস্তাদ তথ্য সংশোধন' : 'নতুন উস্তাদ নিয়োগ ফর্ম ও ডকুমেন্টস'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">১. ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">উস্তাদের পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মাওলানা আব্দুল্লাহ আল মামুন"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">বয়স</label>
                    <input
                      type="number"
                      placeholder="যেমন: ৩২"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা / পড়ালেখা *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: দাওরায়ে হাদিস, তাকমীল"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">প্রধান ফোন নম্বর * (সরাসরি কলের জন্য)</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: 01811223344"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">একাধিক ফোন নম্বরসমূহ (কমা দিয়ে আলাদা করুন)</label>
                    <input
                      type="text"
                      placeholder="যেমন: 01811223344, 01799887766"
                      value={formData.phonesStr}
                      onChange={(e) => setFormData({ ...formData, phonesStr: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">আগে কোথায় চাকরি করছে / অভিজ্ঞতা</label>
                    <input
                      type="text"
                      placeholder="যেমন: জামিয়া ইসলামিয়া দারুল উলুম (৫ বছর শিক্ষকতা)"
                      value={formData.previousEmployment}
                      onChange={(e) => setFormData({ ...formData, previousEmployment: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">যোগদানের তারিখ</label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">মাসিক বেতন / সম্মানী (টাকা)</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">বর্তমান ঠিকানা</label>
                    <input
                      type="text"
                      placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">স্ট্যাটাস</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden"
                    >
                      <option value="Active">সক্রিয় (Active)</option>
                      <option value="Leave">ছুটিতে (On Leave)</option>
                      <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Three Photo Upload Options (with file picker + direct URL/paste backup) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">২. ছবি ও ডকুমেন্টস আপলোড (৩টি অপশন)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Passport Photo */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                    <label className="block text-xs font-bold text-slate-700">পাসপোর্ট সাইজের ছবি</label>
                    {formData.photoUrl ? (
                      <div className="relative mx-auto h-24 w-24 rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                        <img src={formData.photoUrl} alt="Passport" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, photoUrl: '' })}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-[10px] cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 w-24 mx-auto rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white">
                        <Camera className="h-6 w-6" />
                      </div>
                    )}
                    <label className="inline-block px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-emerald-700 transition-colors">
                      <Upload className="h-3.5 w-3.5 inline mr-1" /> ফাইল চুজ করুন
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'photoUrl')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="বা ছবির লিংক পেস্ট করুন..."
                      value={formData.photoUrl.startsWith('data:') ? '' : formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="w-full mt-1 px-2 py-1 text-[10px] bg-white rounded border border-slate-200 text-slate-600"
                    />
                  </div>

                  {/* ID Card Photo */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                    <label className="block text-xs font-bold text-slate-700">আইডি কার্ডের ফটোকপি</label>
                    {formData.idCardPhotoUrl ? (
                      <div className="relative mx-auto h-24 w-full rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                        <img src={formData.idCardPhotoUrl} alt="ID Card" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, idCardPhotoUrl: '' })}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-[10px] cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 w-full mx-auto rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white">
                        <FileCheck className="h-6 w-6" />
                      </div>
                    )}
                    <label className="inline-block px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-emerald-700 transition-colors">
                      <Upload className="h-3.5 w-3.5 inline mr-1" /> ফাইল চুজ করুন
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'idCardPhotoUrl')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="বা ছবির লিংক পেস্ট করুন..."
                      value={formData.idCardPhotoUrl.startsWith('data:') ? '' : formData.idCardPhotoUrl}
                      onChange={(e) => setFormData({ ...formData, idCardPhotoUrl: e.target.value })}
                      className="w-full mt-1 px-2 py-1 text-[10px] bg-white rounded border border-slate-200 text-slate-600"
                    />
                  </div>

                  {/* Certificate / Sanad Photo */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                    <label className="block text-xs font-bold text-slate-700">সনদপত্র / সার্টিফিকেট ছবি</label>
                    {formData.certificatePhotoUrl ? (
                      <div className="relative mx-auto h-24 w-full rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                        <img src={formData.certificatePhotoUrl} alt="Certificate" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, certificatePhotoUrl: '' })}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-[10px] cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 w-full mx-auto rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white">
                        <Award className="h-6 w-6" />
                      </div>
                    )}
                    <label className="inline-block px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-emerald-700 transition-colors">
                      <Upload className="h-3.5 w-3.5 inline mr-1" /> ফাইল চুজ করুন
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'certificatePhotoUrl')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="বা ছবির লিংক পেস্ট করুন..."
                      value={formData.certificatePhotoUrl.startsWith('data:') ? '' : formData.certificatePhotoUrl}
                      onChange={(e) => setFormData({ ...formData, certificatePhotoUrl: e.target.value })}
                      className="w-full mt-1 px-2 py-1 text-[10px] bg-white rounded border border-slate-200 text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Guarantor / Reference Form */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">৩. জামিনদার / রেফারেন্সের তথ্য (Guarantor Reference)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">রেফারেন্স / জামিনদারের নাম</label>
                    <input
                      type="text"
                      placeholder="যেমন: হাজি আব্দুল কুদ্দুস"
                      value={formData.guarantorName}
                      onChange={(e) => setFormData({ ...formData, guarantorName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">রেফারেন্সের ঠিকানা</label>
                    <input
                      type="text"
                      placeholder="গ্রাম ও উপজেলা"
                      value={formData.guarantorAddress}
                      onChange={(e) => setFormData({ ...formData, guarantorAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">রেফারেন্সের ফোন নম্বর</label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={formData.guarantorPhone}
                      onChange={(e) => setFormData({ ...formData, guarantorPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Details & Notes Modal */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                {viewingTeacher.photoUrl ? (
                  <img src={viewingTeacher.photoUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {viewingTeacher.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingTeacher.name}</h3>
                  <p className="text-xs text-slate-500">আইডি: {viewingTeacher.id} | {viewingTeacher.education}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingTeacher(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block">বয়স</span>
                  <span className="font-bold text-slate-800">{viewingTeacher.age} বছর</span>
                </div>
                <div>
                  <span className="text-slate-400 block">যোগাযোগ নম্বরসমূহ</span>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {(viewingTeacher.phones || [viewingTeacher.phone]).map((p, idx) => (
                      <a key={idx} href={`tel:${p}`} className="font-bold text-emerald-700 font-mono flex items-center gap-1 hover:underline">
                        <PhoneCall className="h-3 w-3" />
                        <span>{p}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block">যোগদানের তারিখ</span>
                  <span className="font-bold text-slate-800">{viewingTeacher.joiningDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">মাসিক বেতন</span>
                  <span className="font-bold text-emerald-700">৳{viewingTeacher.salary.toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">পূর্বের অভিজ্ঞতা / চাকরি</span>
                  <span className="font-bold text-slate-800">{viewingTeacher.previousEmployment || 'নেই'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">বর্তমান ঠিকানা</span>
                  <span className="font-bold text-slate-800">{viewingTeacher.address || 'উল্লেখ নেই'}</span>
                </div>

                {viewingTeacher.guarantor && viewingTeacher.guarantor.name && (
                  <div className="col-span-4 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-900 block">জামিনদার / রেফারেন্সের তথ্য:</span>
                    <p className="text-slate-800 font-semibold">
                      নাম: {viewingTeacher.guarantor.name} | ঠিকানা: {viewingTeacher.guarantor.address} | ফোন: <a href={`tel:${viewingTeacher.guarantor.phone}`} className="text-emerald-700 underline font-mono">{viewingTeacher.guarantor.phone}</a>
                    </p>
                  </div>
                )}
              </div>

              {/* Photos Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-center">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">পাসপোর্ট সাইজ ছবি</h4>
                  {viewingTeacher.photoUrl ? (
                    <img src={viewingTeacher.photoUrl} alt="Passport" className="h-32 w-32 mx-auto object-cover rounded-xl border border-slate-200 shadow-xs" />
                  ) : (
                    <p className="text-xs text-slate-400 py-8 italic">ছবি নেই</p>
                  )}
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-center">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">আইডি কার্ডের ফটোকপি</h4>
                  {viewingTeacher.idCardPhotoUrl ? (
                    <img src={viewingTeacher.idCardPhotoUrl} alt="ID Card" className="h-32 w-full object-cover rounded-xl border border-slate-200 shadow-xs" />
                  ) : (
                    <p className="text-xs text-slate-400 py-8 italic">আইডি কার্ড নেই</p>
                  )}
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-center">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">সনদপত্র / সার্টিফিকেট</h4>
                  {viewingTeacher.certificatePhotoUrl ? (
                    <img src={viewingTeacher.certificatePhotoUrl} alt="Certificate" className="h-32 w-full object-cover rounded-xl border border-slate-200 shadow-xs" />
                  ) : (
                    <p className="text-xs text-slate-400 py-8 italic">সনদপত্র নেই</p>
                  )}
                </div>
              </div>

              {/* Teacher Notes & History Section */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span>উস্তাদের নোট ও পারফরম্যান্স হিস্টরি (ভালো-মন্দ মূল্যায়ন)</span>
                  </h4>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-3">
                  <h5 className="text-xs font-bold text-emerald-900">নতুন নোট বা মন্তব্য যোগ করুন</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="নোটের শিরোনাম (যেমন: পাঠদানে বিশেষ উৎকর্ষ বা সতর্কতা)"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-emerald-200 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <select
                        value={noteType}
                        onChange={(e) => setNoteType(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-emerald-200 focus:outline-hidden"
                      >
                        <option value="General">সাধারণ (General)</option>
                        <option value="Good">ভালো / প্রশংসা (Good)</option>
                        <option value="Appreciation">পুরস্কার / সম্মাননা</option>
                        <option value="Warning">সতর্কবার্তা (Warning)</option>
                        <option value="Bad">অপরাধ / অবহেলা (Bad)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <textarea
                        required
                        rows={2}
                        placeholder="বিস্তারিত বর্ণনা লিখুন..."
                        value={noteDesc}
                        onChange={(e) => setNoteDesc(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-emerald-200 focus:outline-hidden"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      নোট সংরক্ষণ করুন
                    </button>
                  </div>
                </form>

                {/* Existing Notes List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {teacherNotes
                    .filter((n) => n.teacherId === viewingTeacher.id)
                    .map((note) => (
                      <div key={note.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                note.noteType === 'Good' || note.noteType === 'Appreciation'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : note.noteType === 'Warning'
                                  ? 'bg-amber-100 text-amber-800'
                                  : note.noteType === 'Bad'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {note.noteType}
                            </span>
                            <h6 className="text-xs font-bold text-slate-900">{note.title}</h6>
                            <span className="text-[10px] text-slate-400 font-mono">{note.date}</span>
                          </div>
                          <p className="text-xs text-slate-600">{note.description}</p>
                        </div>
                        <button
                          onClick={() => deleteTeacherNote(note.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="নোট মুছুন"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}

                  {teacherNotes.filter((n) => n.teacherId === viewingTeacher.id).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4 italic">কোনো নোট বা মন্তব্য সংরক্ষণ করা হয়নি।</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
