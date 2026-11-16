import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { LoginPage } from './pages/Auth/LoginPage';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { StudentListPage } from './pages/Students/StudentListPage';
import { StudentAdmissionPage } from './pages/Students/StudentAdmissionPage';
import { StudentInfoPage } from './pages/Students/StudentInfoPage';
import { TeacherRecruitmentPage } from './pages/Teachers/TeacherRecruitmentPage';
import { FeesManagerPage } from './pages/StudentFees/FeesManagerPage';
import { RevolvingFundPage } from './pages/RevolvingFund/RevolvingFundPage';
import { BoardingPage } from './pages/Boarding/BoardingPage';
import { AccountsPage } from './pages/Accounts/AccountsPage';
import { YearlyMonthlyDailyAccountsPage } from './pages/Accounts/YearlyMonthlyDailyAccountsPage';
import { ExamMarksPage } from './pages/Exams/ExamMarksPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { RefreshCw, School, Shield } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser: authUser, loading: authLoading } = useAuth();
  const { activeSection, activeSubItem, isSidebarCollapsed, isRestarting } = useApp();

  // 1. Loading State while Firebase verifies session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg mb-4">
          <School className="h-6 w-6" />
        </div>
        <h1 className="text-base font-black tracking-widest text-emerald-400 font-mono">
          MADRASA
        </h1>
        <p className="text-xs font-semibold text-slate-300">Office Management System</p>
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
          <span>Verifying Firebase Authentication...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate: Redirect to secure Login page
  if (!authUser) {
    return <LoginPage />;
  }

  // 3. Authenticated: Render Main Dashboard Application
  const getPageTitle = (): string => {
    switch (activeSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'students':
        if (activeSubItem === 'student-admission') return 'Student Admission';
        if (activeSubItem === 'student-information') return 'Student Information';
        return 'Student List';
      case 'student-fees':
        if (activeSubItem === 'admission-fees') return 'Admission Fees';
        if (activeSubItem === 'other-fees') return 'Other Fees';
        if (activeSubItem === 'fee-collection') return 'Fee Collection';
        if (activeSubItem === 'due-fees') return 'Due Fees';
        return 'Monthly Fees';
      case 'boarding':
        if (activeSubItem === 'boarding-fees') return 'Boarding Fees';
        if (activeSubItem === 'food-expense') return 'Food Expense';
        if (activeSubItem === 'other-expenses') return 'Other Expenses';
        if (activeSubItem === 'boarding-balance') return 'Boarding Balance';
        return 'Boarding Students';
      case 'accounts':
        if (activeSubItem === 'expense') return 'Expense';
        if (activeSubItem === 'transactions') return 'Transactions';
        if (activeSubItem === 'balance') return 'Balance';
        if (activeSubItem === 'yearly-monthly-daily') return 'Yearly, Monthly & Daily Reports';
        return 'Income';
      case 'exams':
        if (activeSubItem === 'report-cards') return 'Report Cards';
        return 'Exam Marks';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderActivePage = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'students':
        if (activeSubItem === 'teacher-recruitment') return <TeacherRecruitmentPage />;
        if (activeSubItem === 'student-admission') return <StudentAdmissionPage />;
        if (activeSubItem === 'student-information') return <StudentInfoPage />;
        return <StudentListPage />;
      case 'student-fees':
        return <FeesManagerPage />;
      case 'revolving-fund':
        return <RevolvingFundPage />;
      case 'boarding':
        return <BoardingPage />;
      case 'accounts':
        if (activeSubItem === 'yearly-monthly-daily') return <YearlyMonthlyDailyAccountsPage />;
        return <AccountsPage />;
      case 'exams':
        return <ExamMarksPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 text-slate-900 flex relative overflow-hidden">
      {/* Toast Notifications */}
      <NotificationToast />

      {/* System Restart Screen Overlay */}
      {isRestarting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 text-white backdrop-blur-sm">
          <RefreshCw className="h-10 w-10 animate-spin text-emerald-400 mb-4" />
          <h2 className="text-lg font-bold font-mono tracking-wider">
            REBOOTING MADRASA OFFICE SYSTEM
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Safely restarting session & re-initializing local storage...
          </p>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 z-10 ${
          isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-0'
        }`}
      >
        {/* Top Header */}
        <Header pageTitle={getPageTitle()} />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
