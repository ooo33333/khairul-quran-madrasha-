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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SubNavigationItem, UserAccount, AcademicClass, AcademicYear, AccountCategory } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';

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

  // Academic year state
  const [academicSession, setAcademicSession] = useState({
    hijriYear: '1447–1448 AH',
    solarYear: '2026–2027',
    termStatus: 'Mid-Year Term 1 (Active)',
    examDate: 'December 15, 2026',
    vacationDate: 'Shawwal Eid Recess (March 2027)',
  });

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminProfile?.role === 'staff') {
      addNotification('error', 'Access Denied', 'Staff users cannot modify institutional settings.');
      return;
    }
    updateMadrasaInfo(infoForm);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      lastActive: 'Just now',
    });
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
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
  };

  const handleCreateAy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAyYear.trim()) return;
    addAcademicYear(newAyYear.trim());
    setIsAddAyModalOpen(false);
    setNewAyYear('');
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormName.trim()) return;
    addClass({
      name: classFormName.trim(),
      classTeacher: classFormTeacher.trim() || 'Unassigned',
      monthlyFee: Number(classFormFee) || 0,
      sections: classFormSections.split(',').map(s => s.trim()).filter(Boolean),
    });
    setIsAddClassModalOpen(false);
    setClassFormName('');
    setClassFormTeacher('');
    setClassFormFee(50);
    setClassFormSections('A, B');
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
      addNotification('error', 'Access Denied', 'Only administrators can reset website data.');
      return;
    }
    resetWebsiteData();
    setIsResetModalOpen(false);
  };

  const handleConfirmRestart = async () => {
    if (adminProfile?.role !== 'admin') {
      addNotification('error', 'Access Denied', 'Only administrators can reboot the system.');
      return;
    }
    setIsRestartModalOpen(false);
    await systemRestart();
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await authLogout();
      addNotification('info', 'Logged Out', 'Administrative session locked.');
    } catch {
      // fallback
    }
  };

  const settingsTabs: { id: SubNavigationItem; label: string; icon: React.ComponentType<{ className?: string }> }[] = ([
    { id: 'madrasa-information', label: t('Madrasa Information'), icon: Building2 },
    { id: 'user-management', label: t('User Management'), icon: Users },
    { id: 'academic-year', label: t('Academic Year'), icon: Calendar },
    { id: 'classes', label: t('Classes'), icon: Layers },
    { id: 'account-categories', label: t('Account Categories'), icon: Tag },
    { id: 'login-logout', label: t('Login / Logout'), icon: LogOut },
    { id: 'reset-website-data', label: t('Reset Website Data'), icon: RotateCcw },
    { id: 'refresh-reload', label: t('Refresh / Reload'), icon: RefreshCw },
    { id: 'system-restart-reboot', label: t('System Restart / Reboot'), icon: Power },
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
        sectionTitle="Settings"
        subItemTitle={settingsTabs.find((t) => t.id === activeSubItem)?.label || t('Madrasa Information')}
        sectionKey="settings"
        subItemKey={activeSubItem}
      />

      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{t('Settings')}</h2>
          <p className="text-xs text-slate-500">
            {t('Configure institutional profile, academic terms, roles, and administrative controls')}
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
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
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
            <span>Madrasa Profile & Institutional Details</span>
          </h3>

          <form onSubmit={handleInfoSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Madrasa Official Name</label>
                <input
                  type="text"
                  required
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registration #</label>
                <input
                  type="text"
                  required
                  value={infoForm.regNumber}
                  onChange={(e) => setInfoForm({ ...infoForm, regNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Principal / Muhtamim</label>
                <input
                  type="text"
                  required
                  value={infoForm.principal}
                  onChange={(e) => setInfoForm({ ...infoForm, principal: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Phone</label>
                <input
                  type="text"
                  required
                  value={infoForm.phone}
                  onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={infoForm.email}
                  onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={infoForm.bankName}
                  onChange={(e) => setInfoForm({ ...infoForm, bankName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={infoForm.accountNumber}
                  onChange={(e) => setInfoForm({ ...infoForm, accountNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

               <div>
                <label className="block font-semibold text-slate-700 mb-1">Established Year</label>
                <input
                  type="text"
                  required
                  value={infoForm.established}
                  onChange={(e) => setInfoForm({ ...infoForm, established: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={infoForm.website || ''}
                  onChange={(e) => setInfoForm({ ...infoForm, website: e.target.value })}
                  placeholder="e.g. www.darululoom-madrasa.org"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Madrasa Logo</label>
                <div className="flex items-center gap-3 p-1 border border-slate-200 rounded-lg bg-slate-50">
                  {infoForm.logo ? (
                    <img
                      src={infoForm.logo}
                      alt="Madrasa Logo"
                      className="h-10 w-10 rounded-lg border border-slate-200 object-contain p-0.5 bg-white shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200 shrink-0">
                      LOGO
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                      <Image className="h-3.5 w-3.5 text-slate-500" />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1.5 * 1024 * 1024) {
                              addNotification('error', 'Image too large', 'Logo size must not exceed 1.5MB.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setInfoForm({ ...infoForm, logo: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {infoForm.logo && (
                      <button
                        type="button"
                        onClick={() => setInfoForm({ ...infoForm, logo: '' })}
                        className="text-left text-[10px] text-red-600 hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  value={infoForm.address}
                  onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Institutional Description</label>
                <textarea
                  rows={3}
                  value={infoForm.description || ''}
                  onChange={(e) => setInfoForm({ ...infoForm, description: e.target.value })}
                  placeholder="Brief description of the Madrasa, its mission, or history..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={adminProfile?.role === 'staff'}
                className="rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adminProfile?.role === 'staff' ? 'Read-Only (Access Restricted)' : 'Save Institutional Changes'}
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
              <h3 className="text-sm font-bold text-slate-900">Office Users & Administrative Roles</h3>
              <p className="text-xs text-slate-500">Assign permission levels for office staff and accountants</p>
            </div>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add User Account</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">System Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Last Active</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
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
                        {u.status}
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
                          title="Edit User"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => setDeletingUser(u)}
                            className="p-1 text-slate-500 hover:text-red-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Delete User"
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
              <h3 className="text-sm font-bold text-slate-900">Academic Year & Term Config</h3>
              <p className="text-xs text-slate-500">Manage academic sessions, current active terms, and system-wide dates</p>
            </div>
            {adminProfile?.role !== 'staff' ? (
              <button
                onClick={() => setIsAddAyModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Academic Year</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-semibold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                Read-Only Mode
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Session / Year</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created At</th>
                  {adminProfile?.role !== 'staff' && <th className="px-5 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {academicYears.map((ay) => (
                  <tr key={ay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900">
                      Session {ay.year}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {ay.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium text-[10px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          Current Term (Active)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full font-medium text-[10px]">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono">
                      {ay.createdAt ? new Date(ay.createdAt).toLocaleDateString() : 'N/A'}
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
                              <span>Activate Term</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => deactivateAcademicYear(ay.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2 py-1 transition-colors cursor-pointer"
                            >
                              <PowerOff className="h-3 w-3" />
                              <span>Deactivate</span>
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingAy(ay)}
                            className="p-1 text-slate-400 hover:text-red-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Delete Session"
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
              <h3 className="text-sm font-bold text-slate-900">{t('Academic Classes & Enrolled Sections')}</h3>
              <p className="text-xs text-slate-500">{t('Official class catalog and assigned class teachers')}</p>
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
                <span>{t('Add Class')}</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-semibold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                {t('Read-Only Mode')}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">{t('Class Name')}</th>
                  <th className="px-5 py-3.5">{t('Sections')}</th>
                  <th className="px-5 py-3.5">{t('Class Teacher')}</th>
                  <th className="px-5 py-3.5 text-right">{t('Standard Monthly Fee')}</th>
                  <th className="px-5 py-3.5 text-right">{t('Capacity / Status')}</th>
                  {adminProfile?.role !== 'staff' && <th className="px-5 py-3.5 text-right">{t('Actions')}</th>}
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
                          Sec {sec}
                        </span>
                      ))}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                      {c.classTeacher}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono tabular-nums font-bold text-emerald-800">
                      ৳{c.monthlyFee}/mo
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right text-slate-600">
                      <span className="font-mono">{c.totalStudents} {t('students')}</span>
                    </td>
                    {adminProfile?.role !== 'staff' && (
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditClass(c)}
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title={t('Edit Class')}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingClass(c)}
                            className="p-1 text-slate-400 hover:text-red-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title={t('Delete Class')}
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
              <span>{t('Add Account Category')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                {t('Income Categories (Ledger Heads)')}
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
                        <span>{t(cat.name)}</span>
                        {cat.description && (
                          <span className="text-[10px] text-slate-400 font-normal">{cat.description}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                          {t(cat.status)}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openEditCat(cat)}
                            className="p-1 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                            title={t('Edit')}
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setDeletingCat(cat)}
                            className="p-1 text-slate-400 hover:text-red-700 rounded-md hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                            title={t('Delete')}
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
                {t('Expense Categories (Voucher Heads)')}
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
                        <span>{t(cat.name)}</span>
                        {cat.description && (
                          <span className="text-[10px] text-slate-400 font-normal">{cat.description}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${cat.status === 'Active' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                          {t(cat.status)}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openEditCat(cat)}
                            className="p-1 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                            title={t('Edit')}
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setDeletingCat(cat)}
                            className="p-1 text-slate-400 hover:text-red-700 rounded-md hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                            title={t('Delete')}
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

      {/* Sub-item: Login / Logout view */}
      {activeSubItem === 'login-logout' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs max-w-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span>Authentication & Session Control</span>
          </h3>

          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Current Session User:</span>
              <strong className="text-slate-900">{currentUser?.name || 'Administrator'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-mono text-slate-700">{currentUser?.email || 'admin@madrasa.org'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Role:</span>
              <span className="font-semibold text-emerald-700">{currentUser?.role || 'Super Admin'}</span>
            </div>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-xs"
          >
            <LogOut className="h-4 w-4" />
            <span>{currentUser ? 'Sign Out / Lock Session' : 'Sign In as Administrator'}</span>
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
              <h3 className="text-sm font-bold text-red-950">Reset Website Data</h3>
              <p className="text-xs text-red-700 mt-1">
                Restores all demo data (students, fees, transactions, boarding, and settings) back
                to their initial default state.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-xs transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Initiate Reset Data Flow</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-item: Refresh / Reload trigger card */}
      {activeSubItem === 'refresh-reload' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-emerald-600" />
            <span>Refresh / Reload Website State</span>
          </h3>
          <p className="text-xs text-slate-600">
            Triggers a clean sync and refreshes local office records without altering any stored
            entries.
          </p>
          <button
            onClick={() => refreshData()}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Reloading...' : 'Reload Office Records'}</span>
          </button>
        </div>
      )}

      {/* Sub-item: System Restart / Reboot trigger card */}
      {activeSubItem === 'system-restart-reboot' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs max-w-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
              <Power className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">System Restart / Reboot</h3>
              <p className="text-xs text-amber-700 mt-1">
                Safely reboots the application runtime environment and clears volatile memory
                caches.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsRestartModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 shadow-xs transition-colors"
            >
              <Power className="h-4 w-4" />
              <span>Initiate System Restart</span>
            </button>
          </div>
        </div>
      )}

      {/* IMPORTANT SAFETY MODAL: Reset Website Data */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Are you sure you want to reset the website data?"
        subtitle="This action is destructive and irreversible."
        isDestructive={true}
        maxWidth="md"
        footer={
          <>
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReset}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Confirm Reset
            </button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            You are about to restore the Madrasa Office Management System data to the original
            demonstration snapshot.
          </p>
          <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-red-800">
            <strong>Warning:</strong> Any newly added students, fee collection receipts, Aib
            transactions, and custom configuration entries will be permanently erased.
          </div>
        </div>
      </Modal>

      {/* IMPORTANT SAFETY MODAL: System Restart / Reboot */}
      <Modal
        isOpen={isRestartModalOpen}
        onClose={() => setIsRestartModalOpen(false)}
        title="Are you sure you want to restart / reboot the system?"
        subtitle="Office management system session will safely restart."
        maxWidth="md"
        footer={
          <>
            <button
              onClick={() => setIsRestartModalOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRestart}
              className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700"
            >
              Confirm Reboot
            </button>
          </>
        }
      >
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            Rebooting will briefly cycle the office management system session and re-initialize the
            local cache. No stored student records or ledger entries will be lost.
          </p>
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Sign Out of Madrasa Office?"
        subtitle="Confirm locking your administrative workstation."
        maxWidth="sm"
        footer={
          <>
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLogout}
              className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              {currentUser ? 'Sign Out' : 'Sign In'}
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          {currentUser
            ? 'Are you sure you want to lock the active session? You will be prompted to re-authenticate.'
            : 'Click Sign In to resume administrative workstation access.'}
        </p>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New Administrative User"
        subtitle="Grant office credentials to staff or teachers"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Mufti Kamaluddin"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@darululoom-madrasa.org"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role & Permissions</label>
            <select
              value={newUserRole}
              onChange={(e) =>
                setNewUserRole(e.target.value as UserAccount['role'])
              }
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Accountant">Accountant (Accounts & Fees)</option>
              <option value="Admission Officer">Admission Officer (Students)</option>
              <option value="Warden">Warden (Boarding & Mess)</option>
              <option value="Viewer">Viewer (Read Only)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setEditingUser(null);
        }}
        title="Edit Administrative User"
        subtitle={`Update settings for ${editingUser?.name}`}
        maxWidth="sm"
      >
        <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={editUserEmail}
              onChange={(e) => setEditUserEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role & Permissions</label>
            <select
              value={editUserRole}
              onChange={(e) => setEditUserRole(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Accountant">Accountant (Accounts & Fees)</option>
              <option value="Admission Officer">Admission Officer (Students)</option>
              <option value="Warden">Warden (Boarding & Mess)</option>
              <option value="Viewer">Viewer (Read Only)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Account Status</label>
            <select
              value={editUserStatus}
              onChange={(e) => setEditUserStatus(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive (Disabled)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsEditUserModalOpen(false);
                setEditingUser(null);
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Academic Year Modal */}
      <Modal
        isOpen={isAddAyModalOpen}
        onClose={() => setIsAddAyModalOpen(false)}
        title="Add New Academic Year"
        subtitle="Introduce a new institutional session head"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateAy} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Session Year</label>
            <input
              type="text"
              required
              placeholder="e.g. 2027 or 1448"
              value={newAyYear}
              onChange={(e) => setNewAyYear(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
            <p className="text-[10px] text-slate-400 mt-1">E.g., enter 2027 to start the AY-2027 term identifier.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddAyModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
            >
              Add Session
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Class Modal */}
      <Modal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        title={t('Add Academic Class')}
        subtitle={t('Define a new curriculum level')}
        maxWidth="sm"
      >
        <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('Class Name')}</label>
            <input
              type="text"
              required
              placeholder="e.g. Hifzul Quran or Class Six"
              value={classFormName}
              onChange={(e) => setClassFormName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('Class Teacher')}</label>
            <input
              type="text"
              placeholder="e.g. Maulana Ibrahim"
              value={classFormTeacher}
              onChange={(e) => setClassFormTeacher(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('Standard Monthly Fee (৳)')}</label>
            <input
              type="number"
              min="0"
              required
              value={classFormFee}
              onChange={(e) => setClassFormFee(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('Allowed Sections (Comma separated)')}</label>
            <input
              type="text"
              required
              placeholder="A, B, C"
              value={classFormSections}
              onChange={(e) => setClassFormSections(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddClassModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
            >
              {t('Create Class')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Class Modal */}
      <Modal
        isOpen={isEditClassModalOpen}
        onClose={() => {
          setIsEditClassModalOpen(false);
          setEditingClass(null);
        }}
        title={t('Edit Academic Class')}
        subtitle={`Update configurations for ${editingClass?.name}`}
        maxWidth="sm"
      >
        <form onSubmit={handleUpdateClassSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('Class Name')}</label>
            <input
              type="text"
              required
              value={classFormName}
              onChange={(e) => setClassFormName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('Class Teacher')}</label>
            <input
              type="text"
              value={classFormTeacher}
              onChange={(e) => setClassFormTeacher(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('Standard Monthly Fee (৳)')}</label>
            <input
              type="number"
              min="0"
              required
              value={classFormFee}
              onChange={(e) => setClassFormFee(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('Allowed Sections (Comma separated)')}</label>
            <input
              type="text"
              required
              value={classFormSections}
              onChange={(e) => setClassFormSections(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsEditClassModalOpen(false);
                setEditingClass(null);
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
            >
              {t('Save Changes')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCatModalOpen}
        onClose={() => setIsAddCatModalOpen(false)}
        title="Add Account Category"
        subtitle="Create a new voucher or ledger head"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateCat} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Utility Bills or Admission Fee"
              value={catFormName}
              onChange={(e) => setCatFormName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category Type</label>
            <select
              value={catFormType}
              onChange={(e) => setCatFormType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden"
            >
              <option value="income">Income Head</option>
              <option value="expense">Expense Head</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="Brief description of transactions under this head..."
              value={catFormDesc}
              onChange={(e) => setCatFormDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={catFormStatus}
              onChange={(e) => setCatFormStatus(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddCatModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
            >
              Create Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditCatModalOpen}
        onClose={() => {
          setIsEditCatModalOpen(false);
          setEditingCat(null);
        }}
        title="Edit Account Category"
        subtitle={`Update configurations for ${editingCat?.name}`}
        maxWidth="sm"
      >
        <form onSubmit={handleUpdateCatSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={catFormName}
              onChange={(e) => setCatFormName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category Type</label>
            <select
              value={catFormType}
              onChange={(e) => setCatFormType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden"
            >
              <option value="income">Income Head</option>
              <option value="expense">Expense Head</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={catFormDesc}
              onChange={(e) => setCatFormDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={catFormStatus}
              onChange={(e) => setCatFormStatus(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-hidden"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsEditCatModalOpen(false);
                setEditingCat(null);
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        title={t('Delete User Account')}
        subtitle={`Are you sure you want to revoke/delete the user account for "${deletingUser?.name}"?`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            This action will remove user access from the console.
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeletingUser(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                if (deletingUser) {
                  deleteUser(deletingUser.id);
                  setDeletingUser(null);
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              {t('Delete')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Academic Year Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingAy)}
        onClose={() => setDeletingAy(null)}
        title={t('Delete Academic Year')}
        subtitle={`Are you sure you want to permanently delete Academic Year "${deletingAy?.year}"?`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeletingAy(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                if (deletingAy) {
                  deleteAcademicYear(deletingAy.id);
                  setDeletingAy(null);
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              {t('Delete')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Class Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingClass)}
        onClose={() => setDeletingClass(null)}
        title={t('Delete Academic Class')}
        subtitle={`Are you sure you want to delete class "${deletingClass?.name}"? This action is permanent.`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            This will remove the class from the curriculum catalog.
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeletingClass(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              type="button"
              onClick={async () => {
                if (deletingClass) {
                  try {
                    await deleteClass(deletingClass.id);
                    setDeletingClass(null);
                  } catch (err: any) {
                    alert(err.message || 'Failed to delete class.');
                  }
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              {t('Delete')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingCat)}
        onClose={() => setDeletingCat(null)}
        title={t('Delete Account Category')}
        subtitle={`Are you sure you want to delete category "${deletingCat?.name}"?`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            This will remove the account category head.
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeletingCat(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              type="button"
              onClick={async () => {
                if (deletingCat) {
                  try {
                    await deleteAccountCategory(deletingCat.id);
                    setDeletingCat(null);
                  } catch (err: any) {
                    alert(err.message || 'Failed to delete category.');
                  }
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              {t('Delete')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
