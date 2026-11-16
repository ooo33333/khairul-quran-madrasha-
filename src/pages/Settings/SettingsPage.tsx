import React, { useState } from 'react';
import {
  Building2,
  Users,
  Calendar,
  Layers,
  Tag,
  LogOut,
  RotateCcw,
  RefreshCw,
  Power,
  PowerOff,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Shield,
  UserCheck,
  School,
  Lock,
  Edit2,
  Trash2,
  Globe,
  Image,
  FileText,
  Download,
  Database,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SubNavigationItem, UserAccount, AcademicClass, AcademicYear, AccountCategory } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import { compressImage } from '../../lib/firestoreService';

export const SettingsPage: React.FC = () => {
  const { logout: authLogout, adminProfile } = useAuth();
  const {
    activeSubItem,
    setActiveNav,
    madrasaInfo,
    updateMadrasaInfo,
    users,
    addUser,
    updateUser,
    deleteUser,
    classes,
    addClass,
    updateClass,
    deleteClass,
    academicYears,
    addAcademicYear,
    setActiveAcademicYear,
    deactivateAcademicYear,
    deleteAcademicYear,
    accountCategories,
    accountCategoriesFull,
    addAccountCategory,
    updateAccountCategory,
    deleteAccountCategory,
    currentUser,
    setCurrentUser,
    resetWebsiteData,
    refreshData,
    isRefreshing,
    systemRestart,
    isRestarting,
    students,
    fees,
    transactions,
    boardingStudents,
    boardingTransactions,
    teachers,
    addNotification,
    t,
  } = useApp();

  // Safety Confirmation Modals State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // User Edit State
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserAccount['role']>('Accountant');
  const [editUserStatus, setEditUserStatus] = useState<'Active' | 'Inactive'>('Active');

  // Deletion States for Modals
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);
  const [deletingAy, setDeletingAy] = useState<AcademicYear | null>(null);
  const [deletingClass, setDeletingClass] = useState<AcademicClass | null>(null);
  const [deletingCat, setDeletingCat] = useState<AccountCategory | null>(null);

  // Academic Year State
  const [isAddAyModalOpen, setIsAddAyModalOpen] = useState(false);
  const [newAyYear, setNewAyYear] = useState('');

  // Classes State
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AcademicClass | null>(null);
  const [classFormName, setClassFormName] = useState('');
  const [classFormTeacher, setClassFormTeacher] = useState('');
  const [classFormFee, setClassFormFee] = useState<number>(50);
  const [classFormSections, setClassFormSections] = useState('A, B');

  // Account Categories State
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [isEditCatModalOpen, setIsEditCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<AccountCategory | null>(null);
  const [catFormName, setCatFormName] = useState('');
  const [catFormType, setCatFormType] = useState<'income' | 'expense'>('income');
  const [catFormDesc, setCatFormDesc] = useState('');
  const [catFormStatus, setCatFormStatus] = useState<'Active' | 'Inactive'>('Active');

  // Form states
  const [infoForm, setInfoForm] = useState(madrasaInfo);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserAccount['role']>('Accountant');

  // Sync infoForm with madrasaInfo when loaded
  React.useEffect(() => {
    setInfoForm(madrasaInfo);
  }, [madrasaInfo]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminProfile?.role === 'staff') {
      addNotification('error', 'অ্যাক্সেস অস্বীকৃত', 'স্টাফ ব্যবহারকারীরা প্রাতিষ্ঠানিক সেটিংস পরিবর্তন করতে পারবেন না।');
      return;
    }
    updateMadrasaInfo(infoForm);
    addNotification('success', 'সংরক্ষিত', 'মাদ্রাসা তথ্য সফলভাবে আপডেট করা হয়েছে।');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      lastActive: 'এইমাত্র',
    });
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    addNotification('success', 'সফল', 'নতুন ব্যবহারকারী অ্যাকাউন্ট যোগ করা হয়েছে।');
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editUserName,
      email: editUserEmail,
      role: editUserRole,
      status: editUserStatus,
    });
    setIsEditUserModalOpen(false);
    setEditingUser(null);
    addNotification('success', 'আপডেট সফল', 'ব্যবহারকারী অ্যাকাউন্ট আপডেট করা হয়েছে।');
  };

  const handleCreateAy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAyYear.trim()) return;
    addAcademicYear(newAyYear.trim());
    setIsAddAyModalOpen(false);
    setNewAyYear('');
    addNotification('success', 'সফল', 'নতুন শিক্ষাবর্ষ যোগ করা হয়েছে।');
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormName.trim()) return;
    addClass({
      name: classFormName.trim(),
      classTeacher: classFormTeacher.trim() || 'নির্ধারিত নয়',
      monthlyFee: Number(classFormFee) || 0,
      sections: classFormSections.split(',').map(s => s.trim()).filter(Boolean),
    });
    setIsAddClassModalOpen(false);
    setClassFormName('');
    setClassFormTeacher('');
    setClassFormFee(50);
    setClassFormSections('A, B');
    addNotification('success', 'সফল', 'নতুন শ্রেণী যোগ করা হয়েছে।');
  };

  const handleUpdateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    updateClass(editingClass.id, {
      name: classFormName.trim(),
      classTeacher: classFormTeacher.trim(),
      monthlyFee: Number(classFormFee),
      sections: classFormSections.split(',').map(s => s.trim()).filter(Boolean),
    });
    setIsEditClassModalOpen(false);
    setEditingClass(null);
    addNotification('success', 'সফল', 'শ্রেণীর তথ্য আপডেট করা হয়েছে।');
  };

  const handleCreateCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) return;
    addAccountCategory({
      name: catFormName.trim(),
      type: catFormType,
      description: catFormDesc.trim(),
      status: catFormStatus,
    });
    setIsAddCatModalOpen(false);
    setCatFormName('');
    setCatFormDesc('');
    setCatFormType('income');
    setCatFormStatus('Active');
    addNotification('success', 'সফল', 'হিসাব ক্যাটাগরি যোগ করা হয়েছে।');
  };

  const handleUpdateCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    updateAccountCategory(editingCat.id, {
      name: catFormName.trim(),
      type: catFormType,
      description: catFormDesc.trim(),
      status: catFormStatus,
    });
    setIsEditCatModalOpen(false);
    setEditingCat(null);
    addNotification('success', 'সফল', 'হিসাব ক্যাটাগরি আপডেট করা হয়েছে।');
  };

  const openEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setEditUserStatus(user.status);
    setIsEditUserModalOpen(true);
  };

  const openEditClass = (cls: AcademicClass) => {
    setEditingClass(cls);
    setClassFormName(cls.name);
    setClassFormTeacher(cls.classTeacher);
    setClassFormFee(cls.monthlyFee);
    setClassFormSections(cls.sections.join(', '));
    setIsEditClassModalOpen(true);
  };

  const openEditCat = (cat: AccountCategory) => {
    setEditingCat(cat);
    setCatFormName(cat.name);
    setCatFormType(cat.type);
    setCatFormDesc(cat.description);
    setCatFormStatus(cat.status);
    setIsEditCatModalOpen(true);
  };

  const handleConfirmReset = () => {
    if (adminProfile?.role !== 'admin') {
      addNotification('error', 'অ্যাক্সেস অস্বীকৃত', 'শুধুমাত্র অ্যাডমিন ওয়েবসাইট ডাটা রিসেট করতে পারবেন।');
      return;
    }
    resetWebsiteData();
    setIsResetModalOpen(false);
    addNotification('success', 'রিসেট সম্পন্ন', 'ওয়েবসাইট ডাটা সফলভাবে রিসেট করা হয়েছে।');
  };

  const handleConfirmRestart = async () => {
    if (adminProfile?.role !== 'admin') {
      addNotification('error', 'অ্যাক্সেস অস্বীকৃত', 'শুধুমাত্র অ্যাডমিন সিস্টেম রিস্টার্ট করতে পারবেন।');
      return;
    }
    setIsRestartModalOpen(false);
    await systemRestart();
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await authLogout();
      addNotification('info', 'লগআউট', 'অ্যাডমিনিস্ট্রেটিভ সেশন লক করা হয়েছে।');
    } catch {
      // fallback
    }
  };

  // --- DATA BACKUP & EXPORT FUNCTIONS ---
  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportStudentsJSON = () => {
    const dataStr = JSON.stringify(students, null, 2);
    downloadFile(dataStr, `madrasa_students_backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    addNotification('success', 'এক্সপোর্ট সফল', 'শিক্ষার্থী ডাটা JSON ফাইল হিসেবে ডাউনলোড হয়েছে।');
  };

  const exportStudentsCSV = () => {
    if (students.length === 0) {
      addNotification('error', 'খালি ডাটা', 'কোনো শিক্ষার্থী ডাটা পাওয়া যায়নি।');
      return;
    }
    const headers = ['ID', 'Name', 'Class', 'Section', 'Father Name', 'Phone', 'Address'];
    const rows = students.map((s) => [
      s.id,
      `"${s.name || ''}"`,
      `"${s.className || ''}"`,
      `"${s.section || ''}"`,
      `"${s.fatherName || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.address || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csvContent, `madrasa_students_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
    addNotification('success', 'এক্সপোর্ট সফল', 'শিক্ষার্থী তালিকা CSV ফাইল হিসেবে ডাউনলোড হয়েছে।');
  };

  const exportFinancialJSON = () => {
    const financialData = {
      fees,
      transactions,
      boardingTransactions,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(financialData, null, 2);
    downloadFile(dataStr, `madrasa_financial_records_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    addNotification('success', 'এক্সপোর্ট সফল', 'আর্থিক হিসাব JSON ফাইল হিসেবে ডাউনলোড হয়েছে।');
  };

  const exportFinancialCSV = () => {
    const combined = [
      ...fees.map((f) => ({ Date: f.lastPaymentDate, Type: 'Fee: ' + f.feeType, Category: f.feeType, Description: f.studentName + ' (' + f.studentId + ')', Amount: f.paid, Method: f.paymentMethod })),
      ...transactions.map((tx) => ({ Date: tx.date, Type: tx.type, Category: tx.category, Description: tx.description, Amount: tx.amount, Method: tx.paymentMethod })),
    ];
    if (combined.length === 0) {
      addNotification('error', 'খালি ডাটা', 'কোনো আর্থিক লেনদেন পাওয়া যায়নি।');
      return;
    }
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Method'];
    const rows = combined.map((item) => [
      `"${item.Date || ''}"`,
      `"${item.Type || ''}"`,
      `"${item.Category || ''}"`,
      `"${item.Description || ''}"`,
      item.Amount || 0,
      `"${item.Method || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csvContent, `madrasa_financial_ledger_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
    addNotification('success', 'এক্সপোর্ট সফল', 'আর্থিক লেনদেন CSV ফাইল হিসেবে ডাউনলোড হয়েছে।');
  };

  const exportFullSystemBackup = () => {
    const fullBackup = {
      madrasaInfo,
      students,
      fees,
      transactions,
      boardingStudents,
      boardingTransactions,
      teachers,
      classes,
      academicYears,
      accountCategoriesFull,
      users,
      backupDate: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(fullBackup, null, 2);
    downloadFile(dataStr, `madrasa_full_system_backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    addNotification('success', 'ব্যাকআপ সফল', 'সম্পূর্ণ সিস্টেমের ব্যাকআপ ফাইল ডাউনলোড হয়েছে।');
  };

  const settingsTabs: { id: SubNavigationItem; label: string; icon: React.ComponentType<{ className?: string }> }[] = ([
    { id: 'madrasa-information', label: 'মাদ্রাসা তথ্য', icon: Building2 },
    { id: 'user-management', label: 'ব্যবহারকারী নিয়ন্ত্রণ', icon: Users },
    { id: 'academic-year', label: 'শিক্ষাবর্ষ', icon: Calendar },
    { id: 'classes', label: 'শ্রেণীসমূহ', icon: Layers },
    { id: 'account-categories', label: 'হিসাব শ্রেণী', icon: Tag },
    { id: 'data-backup', label: 'ডাটা ব্যাকআপ ও এক্সপোর্ট', icon: Database },
    { id: 'login-logout', label: 'লগইন / লগআউট', icon: LogOut },
    { id: 'reset-website-data', label: 'ওয়েবসাইট ডাটা রিসেট', icon: RotateCcw },
    { id: 'refresh-reload', label: 'রিফ্রেশ / রিলোড', icon: RefreshCw },
    { id: 'system-restart-reboot', label: 'সিস্টেম রিস্টার্ট', icon: Power },
  ] as { id: SubNavigationItem; label: string; icon: React.ComponentType<{ className?: string }> }[]).filter((tab) => {
    const isStaff = adminProfile?.role === 'staff';
    if (isStaff) {
      return (
        tab.id !== 'user-management' &&
        tab.id !== 'reset-website-data' &&
        tab.id !== 'system-restart-reboot'
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <Breadcrumb
        sectionTitle="সেটিংস"
        subItemTitle={settingsTabs.find((t) => t.id === activeSubItem)?.label || 'মাদ্রাসা তথ্য'}
        sectionKey="settings"
        subItemKey={activeSubItem}
      />

      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">সেটিংস</h2>
          <p className="text-xs text-slate-500">
            প্রাতিষ্ঠানিক প্রোফাইল, শিক্ষাবর্ষ, ভূমিকা, ডাটা ব্যাকআপ এবং প্রশাসনিক নিয়ন্ত্রণ কনফিগার করুন
          </p>
        </div>
      </div>

      {/* Horizontal Category Switcher */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-2">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubItem === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'reset-website-data') {
                  setIsResetModalOpen(true);
                } else if (tab.id === 'system-restart-reboot') {
                  setIsRestartModalOpen(true);
                } else if (tab.id === 'refresh-reload') {
                  refreshData();
                } else if (tab.id === 'login-logout') {
                  setIsLogoutModalOpen(true);
                }
                setActiveNav('settings', tab.id);
              }}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Madrasa Information */}
      {activeSubItem === 'madrasa-information' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span>মাদ্রাসা প্রোফাইল ও প্রাতিষ্ঠানিক বিবরণ</span>
          </h3>

          <form onSubmit={handleInfoSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">মাদ্রাসার প্রাতিষ্ঠানিক নাম</label>
                <input
                  type="text"
                  required
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">রেজিস্ট্রেশন নং</label>
                <input
                  type="text"
                  required
                  value={infoForm.regNumber}
                  onChange={(e) => setInfoForm({ ...infoForm, regNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">মুহতামিম / প্রিন্সিপাল</label>
                <input
                  type="text"
                  required
                  value={infoForm.principal}
                  onChange={(e) => setInfoForm({ ...infoForm, principal: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">অফিসিয়াল ফোন</label>
                <input
                  type="text"
                  required
                  value={infoForm.phone}
                  onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">অফিসিয়াল ইমেইল</label>
                <input
                  type="email"
                  required
                  value={infoForm.email}
                  onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ব্যাংকের নাম</label>
                <input
                  type="text"
                  required
                  value={infoForm.bankName}
                  onChange={(e) => setInfoForm({ ...infoForm, bankName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ব্যাংক হিসাব নম্বর</label>
                <input
                  type="text"
                  required
                  value={infoForm.accountNumber}
                  onChange={(e) => setInfoForm({ ...infoForm, accountNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

               <div>
                <label className="block font-semibold text-slate-700 mb-1">প্রতিষ্ঠিত সন</label>
                <input
                  type="text"
                  required
                  value={infoForm.established}
                  onChange={(e) => setInfoForm({ ...infoForm, established: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ওয়েবসাইট ঠিকানা</label>
                <input
                  type="text"
                  value={infoForm.website || ''}
                  onChange={(e) => setInfoForm({ ...infoForm, website: e.target.value })}
                  placeholder="যেমন: www.madrasa.org"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">মাদ্রাসা লোগো</label>
                <div className="flex items-center gap-3 p-1 border border-slate-200 rounded-lg bg-slate-50">
                  {infoForm.logo ? (
                    <img
                      src={infoForm.logo}
                      alt="Logo"
                      className="h-10 w-10 rounded-lg border border-slate-200 object-contain p-0.5 bg-white shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200 shrink-0">
                      লোগো
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                      <Image className="h-3.5 w-3.5 text-slate-500" />
                      <span>লোগো আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await compressImage(file, 300, 300, 0.7);
                              setInfoForm({ ...infoForm, logo: compressed });
                            } catch (err) {
                              console.error('Logo compression error:', err);
                            }
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {infoForm.logo && (
                      <button
                        type="button"
                        onClick={() => setInfoForm({ ...infoForm, logo: '' })}
                        className="text-left text-[10px] text-red-600 hover:underline cursor-pointer"
                      >
                        লোগো সরান
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">মাদ্রাসা ভবন / ক্যাম্পাসের ছবি (ড্যাশবোর্ড ব্যানার)</label>
                <div className="flex items-center gap-3 p-1 border border-slate-200 rounded-lg bg-slate-50">
                  {infoForm.buildingPhoto ? (
                    <img
                      src={infoForm.buildingPhoto}
                      alt="Building"
                      className="h-10 w-16 rounded-lg border border-slate-200 object-cover p-0.5 bg-white shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-16 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] border border-blue-200 shrink-0">
                      ভবন ছবি
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                      <Image className="h-3.5 w-3.5 text-slate-500" />
                      <span>ক্যাম্পাস ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await compressImage(file, 1200, 800, 0.75);
                              setInfoForm({ ...infoForm, buildingPhoto: compressed });
                            } catch (err) {
                              console.error('Building photo compression error:', err);
                            }
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {infoForm.buildingPhoto && (
                      <button
                        type="button"
                        onClick={() => setInfoForm({ ...infoForm, buildingPhoto: '' })}
                        className="text-left text-[10px] text-red-600 hover:underline cursor-pointer"
                      >
                        ছবি সরান
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">পূর্ণ ঠিকানা</label>
                <input
                  type="text"
                  required
                  value={infoForm.address}
                  onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">প্রাতিষ্ঠানিক বিবরণী</label>
                <textarea
                  rows={3}
                  value={infoForm.description || ''}
                  onChange={(e) => setInfoForm({ ...infoForm, description: e.target.value })}
                  placeholder="মাদ্রাসার সংক্ষিপ্ত ইতিহাস বা লক্ষ্য..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={adminProfile?.role === 'staff'}
                className="rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {adminProfile?.role === 'staff' ? 'রিড-অনলি (অ্যাক্সেস সীমিত)' : 'পরিবর্তন সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section 2: User Management */}
      {activeSubItem === 'user-management' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">অফিস ব্যবহারকারী ও প্রশাসনিক ভূমিকা</h3>
              <p className="text-xs text-slate-500">অফিস স্টাফ এবং হিসাবরক্ষকদের জন্য অনুমতি স্তর নির্ধারণ করুন</p>
            </div>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>নতুন ব্যবহারকারী যোগ করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">ব্যবহারকারী</th>
                  <th className="px-5 py-3.5">ইমেইল</th>
                  <th className="px-5 py-3.5">সিস্টেম রোল</th>
                  <th className="px-5 py-3.5">স্ট্যাটাস</th>
                  <th className="px-5 py-3.5">সর্বশেষ সক্রিয়</th>
                  <th className="px-5 py-3.5 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-mono">
                      {u.email}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-block rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${u.status === 'Active' ? 'text-emerald-700' : 'text-slate-400'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                        {u.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-400">
                      {u.lastActive}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditUser(u)}
                          className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="সম্পাদনা"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => setDeletingUser(u)}
                            className="p-1 text-slate-500 hover:text-red-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 3: Academic Year */}
      {activeSubItem === 'academic-year' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">শিক্ষাবর্ষ ও টার্ম কনফিগারেশন</h3>
              <p className="text-xs text-slate-500">শিক্ষাবর্ষ এবং বর্তমান সক্রিয় টার্ম পরিচালনা করুন</p>
            </div>
            {adminProfile?.role !== 'staff' ? (
              <button
                onClick={() => setIsAddAyModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>শিক্ষাবর্ষ যোগ করুন</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-semibold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                রিড-অনলি মোড
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">সেশন / বছর</th>
                  <th className="px-5 py-3.5">স্ট্যাটাস</th>
                  <th className="px-5 py-3.5">তৈরির তারিখ</th>
                  {adminProfile?.role !== 'staff' && <th className="px-5 py-3.5 text-right">কার্যক্রম</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {academicYears.map((ay) => (
                  <tr key={ay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900">
                      সেশন {ay.year}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {ay.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium text-[10px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          সক্রিয় টার্ম (Current)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full font-medium text-[10px]">
                          নিষ্ক্রিয়
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono">
                      {ay.createdAt ? new Date(ay.createdAt).toLocaleDateString() : 'প্রযোজ্য নয়'}
                    </td>
                    {adminProfile?.role !== 'staff' && (
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ay.status !== 'Active' ? (
                            <button
                              onClick={() => setActiveAcademicYear(ay.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md px-2 py-1 transition-colors cursor-pointer"
                            >
                              <Power className="h-3 w-3" />
                              <span>টার্ম সক্রিয় করুন</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => deactivateAcademicYear(ay.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2 py-1 transition-colors cursor-pointer"
                            >
                              <PowerOff className="h-3 w-3" />
                              <span>নিষ্ক্রিয় করুন</span>
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingAy(ay)}
                            className="p-1 text-slate-400 hover:text-red-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="সেশন মুছে ফেলুন"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 4: Classes */}
      {activeSubItem === 'classes' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">একাডেমিক শ্রেণী ও সেকশন</h3>
              <p className="text-xs text-slate-500">শ্রেণী তালিকা এবং দায়িত্বপ্রাপ্ত শ্রেণী শিক্ষক পরিচালনা করুন</p>
            </div>
            {adminProfile?.role !== 'staff' ? (
              <button
                onClick={() => {
                  setEditingClass(null);
                  setClassFormName('');
                  setClassFormTeacher('');
                  setClassFormFee(50);
                  setClassFormSections('A, B');
                  setIsAddClassModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>শ্রেণী যোগ করুন</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-semibold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                রিড-অনলি মোড
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">শ্রেণীর নাম</th>
                  <th className="px-5 py-3.5">সেকশনসমূহ</th>
                  <th className="px-5 py-3.5">শ্রেণী শিক্ষক</th>
                  <th className="px-5 py-3.5 text-right">মাসিক ফি (৳)</th>
                  <th className="px-5 py-3.5 text-right">ছাত্র সংখ্যা</th>
                  {adminProfile?.role !== 'staff' && <th className="px-5 py-3.5 text-right">কার্যক্রম</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900">
                      {c.name}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {c.sections.map((sec) => (
                        <span
                          key={sec}
                          className="mr-1.5 inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700"
                        >
                          সেকশন {sec}
                        </span>
                      ))}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                      {c.classTeacher}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono tabular-nums font-bold text-emerald-800">
                      ৳{c.monthlyFee}/মাস
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right text-slate-600">
                      <span className="font-mono">{c.totalStudents} জন ছাত্র</span>
                    </td>
                    {adminProfile?.role !== 'staff' && (
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditClass(c)}
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="সম্পাদনা"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingClass(c)}
                            className="p-1 text-slate-400 hover:text-red-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 5: Account Categories */}
      {activeSubItem === 'account-categories' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setCatFormName('');
                setCatFormDesc('');
                setCatFormType('income');
                setCatFormStatus('Active');
                setIsAddCatModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>হিসাব ক্যাটাগরি যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                আয়ের খাতসমূহ (Income Ledger Heads)
              </h4>
              <ul className="space-y-2 text-xs">
                {accountCategoriesFull
                  .filter((cat) => cat.type === 'income')
                  .map((cat, i) => (
                    <li
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                    >
                      <div className="flex flex-col">
                        <span>{cat.name}</span>
                        {cat.description && (
                          <span className="text-[10px] text-slate-400 font-normal">{cat.description}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                          {cat.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openEditCat(cat)}
                            className="p-1 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                            title="সম্পাদনা"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setDeletingCat(cat)}
                            className="p-1 text-slate-400 hover:text-red-700 rounded-md hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                ব্যয়ের খাতসমূহ (Expense Voucher Heads)
              </h4>
              <ul className="space-y-2 text-xs">
                {accountCategoriesFull
                  .filter((cat) => cat.type === 'expense')
                  .map((cat, i) => (
                    <li
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                    >
                      <div className="flex flex-col">
                        <span>{cat.name}</span>
                        {cat.description && (
                          <span className="text-[10px] text-slate-400 font-normal">{cat.description}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${cat.status === 'Active' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                          {cat.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openEditCat(cat)}
                            className="p-1 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                            title="সম্পাদনা"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setDeletingCat(cat)}
                            className="p-1 text-slate-400 hover:text-red-700 rounded-md hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Section 6: Data Backup & Export (NEW) */}
      {activeSubItem === 'data-backup' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-600" />
              <span>ডাটা ব্যাকআপ ও এক্সপোর্ট (Data Backup & Export)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              মাদ্রাসার শিক্ষার্থী, হিসাব এবং আর্থিক রেকর্ডসমূহ JSON অথবা CSV ফাইল হিসেবে ডাউনলোড করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Students Backup Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                  🎓
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase">শিক্ষার্থী তালিকা ব্যাকআপ</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  সকল শিক্ষার্থীর প্রোফাইল, আইডি, শ্রেণী এবং যোগাযোগের তথ্য এক্সপোর্ট করুন।
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-200/60">
                <button
                  onClick={exportStudentsJSON}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>JSON ডাউনলোড</span>
                </button>
                <button
                  onClick={exportStudentsCSV}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span>CSV ডাউনলোড</span>
                </button>
              </div>
            </div>

            {/* 2. Financial & Account Records Backup */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                  💰
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase">আর্থিক হিসাব ও লেনদেন</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  শিক্ষার্থী ফি, আয়, ব্যয় এবং বোর্ডিং লেনদেনের সমস্ত হিসাব এক্সপোর্ট করুন।
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-200/60">
                <button
                  onClick={exportFinancialJSON}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>JSON ডাউনলোড</span>
                </button>
                <button
                  onClick={exportFinancialCSV}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span>CSV ডাউনলোড</span>
                </button>
              </div>
            </div>

            {/* 3. Full System Backup */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
                  📦
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase">সম্পূর্ণ সিস্টেম ব্যাকআপ</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  মাদ্রাসার সমস্ত ডাটা (শিক্ষার্থী, ফি, হিসাব, বোর্ডিং, শিক্ষক, সেটিংস) একত্রিত করে JSON ব্যাকআপ নিন।
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60">
                <button
                  onClick={exportFullSystemBackup}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-purple-600 py-2.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>সম্পূর্ণ সিস্টেম ব্যাকআপ ডাউনলোড</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-item: Login / Logout view */}
      {activeSubItem === 'login-logout' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs max-w-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span>অথেন্টিকেশন ও সেশন কন্ট্রোল</span>
          </h3>

          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">বর্তমান সেশন ব্যবহারকারী:</span>
              <strong className="text-slate-900">{currentUser?.name || 'অ্যাডমিনিস্ট্রেটর'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ইমেইল:</span>
              <span className="font-mono text-slate-700">{currentUser?.email || 'admin@madrasa.org'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">অ্যাসাইনকৃত রোল:</span>
              <span className="font-semibold text-emerald-700">{currentUser?.role || 'সুপার অ্যাডমিন'}</span>
            </div>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>{currentUser ? 'সাইন আউট / সেশন লক' : 'অ্যাডমিন হিসেবে সাইন ইন'}</span>
          </button>
        </div>
      )}

      {/* Sub-item: Reset Website Data trigger card */}
      {activeSubItem === 'reset-website-data' && (
        <div className="rounded-xl border border-red-200 bg-red-50/40 p-6 shadow-xs max-w-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-100 p-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-950">ওয়েবসাইট ডাটা রিসেট</h3>
              <p className="text-xs text-red-700 mt-1">
                সকল ডেমো ডাটা (শিক্ষার্থী, ফি, লেনদেন, বোর্ডিং এবং সেটিংস) প্রাথমিক ডিফল্ট অবস্থায় পুনরুদ্ধার করে।
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>রিসেট প্রক্রিয়া শুরু করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Website Data Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="ওয়েবসাইট ডাটা রিসেট নিশ্চিতকরণ"
        subtitle="সতর্কতা: এই পদক্ষেপটি অপরিবর্তনীয়।"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3.5 text-red-800 border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-1">সমস্ত বর্তমান পরিবর্তন মুছে ফেলা হবে!</strong>
              আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা রিসেট করতে চান?
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              হ্যাঁ, রিসেট করুন
            </button>
          </div>
        </div>
      </Modal>

      {/* System Restart Modal */}
      <Modal
        isOpen={isRestartModalOpen}
        onClose={() => setIsRestartModalOpen(false)}
        title="সিস্টেম রিস্টার্ট / রিবুট"
        subtitle="সেশন পুনরায় লোড ও ইনিশিয়ালাইজ করুন"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            সিস্টেম রিস্টার্ট করলে সমস্ত ক্যাশ রিফ্রেশ হবে এবং সেশন রি-ইনিশিয়ালাইজ হবে। আপনি কি রিস্টার্ট করতে চান?
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRestartModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleConfirmRestart}
              className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
            >
              হ্যাঁ, রিস্টার্ট করুন
            </button>
          </div>
        </div>
      </Modal>

      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="সাইন আউট / লক সেশন"
        subtitle="অ্যাডমিনিস্ট্রেটিভ অ্যাকাউন্ট থেকে প্রস্থান করুন"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            আপনি কি বর্তমান অ্যাকাউন্ট থেকে লগআউট করতে চান?
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              লগআউট করুন
            </button>
          </div>
        </div>
      </Modal>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <Modal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          title="নতুন ব্যবহারকারী অ্যাকাউন্ট যোগ করুন"
          subtitle="অফিস স্টাফ বা অ্যাকাউন্ট্যান্টের জন্য লগইন অ্যাক্সেস দিন"
          maxWidth="sm"
        >
          <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ব্যবহারকারীর নাম *</label>
              <input
                type="text"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="পূর্ণ নাম..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
              <input
                type="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="email@madrasa.org"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">সিস্টেম রোল *</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
              >
                <option value="Admin">অ্যাডমিন (Admin)</option>
                <option value="Accountant">হিসাবরক্ষক (Accountant)</option>
                <option value="Staff">স্টাফ (Staff)</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
              >
                ব্যবহারকারী তৈরি করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && editingUser && (
        <Modal
          isOpen={isEditUserModalOpen}
          onClose={() => setIsEditUserModalOpen(false)}
          title="ব্যবহারকারী অ্যাকাউন্ট সম্পাদনা"
          subtitle="নাম, রোল এবং স্ট্যাটাস পরিবর্তন করুন"
          maxWidth="sm"
        >
          <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ব্যবহারকারীর নাম *</label>
              <input
                type="text"
                required
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
              <input
                type="email"
                required
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">রোল *</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="Admin">অ্যাডমিন</option>
                  <option value="Accountant">হিসাবরক্ষক</option>
                  <option value="Staff">স্টাফ</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">স্ট্যাটাস *</label>
                <select
                  value={editUserStatus}
                  onChange={(e) => setEditUserStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="Active">সক্রিয়</option>
                  <option value="Inactive">নিষ্ক্রিয়</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditUserModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
              >
                আপডেট করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Class Modal */}
      {isAddClassModalOpen && (
        <Modal
          isOpen={isAddClassModalOpen}
          onClose={() => setIsAddClassModalOpen(false)}
          title="নতুন শ্রেণী যোগ করুন"
          subtitle="মাদ্রাসার নতুন শ্রেণী এবং সেকশন কনফিগার করুন"
          maxWidth="sm"
        >
          <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">শ্রেণীর নাম *</label>
              <input
                type="text"
                required
                value={classFormName}
                onChange={(e) => setClassFormName(e.target.value)}
                placeholder="যেমন: মিজান, হেদায়া, তাকমীল..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">শ্রেণীর শিক্ষক / ত্ত্বাবধায়ক</label>
              <input
                type="text"
                value={classFormTeacher}
                onChange={(e) => setClassFormTeacher(e.target.value)}
                placeholder="শিক্ষকের নাম..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">মাসিক টিউশন ফি (৳)</label>
                <input
                  type="number"
                  min={0}
                  value={classFormFee}
                  onChange={(e) => setClassFormFee(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">সেকশনসমূহ</label>
                <input
                  type="text"
                  value={classFormSections}
                  onChange={(e) => setClassFormSections(e.target.value)}
                  placeholder="A, B, C"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddClassModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
              >
                শ্রেণী সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Class Modal */}
      {isEditClassModalOpen && editingClass && (
        <Modal
          isOpen={isEditClassModalOpen}
          onClose={() => setIsEditClassModalOpen(false)}
          title="শ্রেণী তথ্য সম্পাদনা"
          subtitle="শ্রেণীর নাম, শিক্ষক ও ফি পরিবর্তন করুন"
          maxWidth="sm"
        >
          <form onSubmit={handleUpdateClassSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">শ্রেণীর নাম *</label>
              <input
                type="text"
                required
                value={classFormName}
                onChange={(e) => setClassFormName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">শ্রেণীর শিক্ষক</label>
              <input
                type="text"
                value={classFormTeacher}
                onChange={(e) => setClassFormTeacher(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">মাসিক টিউশন ফি (৳)</label>
                <input
                  type="number"
                  min={0}
                  value={classFormFee}
                  onChange={(e) => setClassFormFee(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">সেকশনসমূহ</label>
                <input
                  type="text"
                  value={classFormSections}
                  onChange={(e) => setClassFormSections(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditClassModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
              >
                আপডেট করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Account Category Modal */}
      {isAddCatModalOpen && (
        <Modal
          isOpen={isAddCatModalOpen}
          onClose={() => setIsAddCatModalOpen(false)}
          title="নতুন হিসাব ক্যাটাগরি যোগ করুন"
          subtitle="আয় বা ব্যয়ের নতুন হিসাব খাত তৈরি করুন"
          maxWidth="sm"
        >
          <form onSubmit={handleCreateCat} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">খাতের নাম *</label>
              <input
                type="text"
                required
                value={catFormName}
                onChange={(e) => setCatFormName(e.target.value)}
                placeholder="যেমন: যাকাত ফান্ড, বিদ্যুৎ বিল..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">খাতের ধরণ *</label>
                <select
                  value={catFormType}
                  onChange={(e) => setCatFormType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="income">আয় (Income)</option>
                  <option value="expense">ব্যয় (Expense)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">স্ট্যাটাস *</label>
                <select
                  value={catFormStatus}
                  onChange={(e) => setCatFormStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="Active">সক্রিয়</option>
                  <option value="Inactive">নিষ্ক্রিয়</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">বিবরণ</label>
              <input
                type="text"
                value={catFormDesc}
                onChange={(e) => setCatFormDesc(e.target.value)}
                placeholder="সংক্ষিপ্ত বিবরণ..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddCatModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
              >
                ক্যাটাগরি সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Account Category Modal */}
      {isEditCatModalOpen && editingCat && (
        <Modal
          isOpen={isEditCatModalOpen}
          onClose={() => setIsEditCatModalOpen(false)}
          title="হিসাব ক্যাটাগরি সম্পাদনা"
          subtitle="খাতের নাম ও বিবরণ পরিবর্তন করুন"
          maxWidth="sm"
        >
          <form onSubmit={handleUpdateCatSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">খাতের নাম *</label>
              <input
                type="text"
                required
                value={catFormName}
                onChange={(e) => setCatFormName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">খাতের ধরণ *</label>
                <select
                  value={catFormType}
                  onChange={(e) => setCatFormType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="income">আয়</option>
                  <option value="expense">ব্যয়</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">স্ট্যাটাস *</label>
                <select
                  value={catFormStatus}
                  onChange={(e) => setCatFormStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:outline-hidden"
                >
                  <option value="Active">সক্রিয়</option>
                  <option value="Inactive">নিষ্ক্রিয়</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">বিবরণ</label>
              <input
                type="text"
                value={catFormDesc}
                onChange={(e) => setCatFormDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditCatModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
              >
                আপডেট করুন
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
