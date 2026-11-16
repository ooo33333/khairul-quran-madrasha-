import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { RevolvingFundTransaction } from '../../types';
import {
  RotateCcw,
  Plus,
  Search,
  Calendar,
  DollarSign,
  User,
  FileText,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Filter,
} from 'lucide-react';

export const RevolvingFundPage: React.FC = () => {
  const {
    revolvingFund,
    addRevolvingFund,
    updateRevolvingFund,
    deleteRevolvingFund,
    activeSubItem,
    setActiveNav,
    t,
  } = useApp();
  const { adminProfile } = useAuth();
  const isAdmin = adminProfile?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<RevolvingFundTransaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<RevolvingFundTransaction | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'collection' as 'collection' | 'distribution' | 'return',
    personName: '',
    description: '',
    amount: '',
    paymentMethod: 'Cash',
    status: 'Completed',
    reference: '',
    note: '',
  });

  const handleOpenAdd = (typeOverride?: 'collection' | 'distribution' | 'return') => {
    setEditingTx(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: typeOverride || (activeSubItem === 'fund-distribution' ? 'distribution' : activeSubItem === 'fund-return' ? 'return' : 'collection'),
      personName: '',
      description: '',
      amount: '',
      paymentMethod: 'Cash',
      status: 'Completed',
      reference: '',
      note: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (tx: RevolvingFundTransaction) => {
    setEditingTx(tx);
    setFormData({
      date: tx.date || new Date().toISOString().split('T')[0],
      type: (tx.type ? String(tx.type).toLowerCase() : 'collection') as 'collection' | 'distribution' | 'return',
      personName: tx.personName || '',
      description: tx.description || '',
      amount: String(tx.amount || ''),
      paymentMethod: tx.paymentMethod || 'Cash',
      status: tx.status || 'Completed',
      reference: tx.reference || '',
      note: tx.note || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.personName || !formData.amount) {
      alert('দয়া করে নাম এবং টাকার পরিমাণ পূরণ করুন।');
      return;
    }

    const payload = {
      date: formData.date,
      type: formData.type as any,
      personName: formData.personName,
      beneficiaryOrContributor: formData.personName,
      description: formData.description,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      reference: formData.reference,
      note: formData.note,
    };

    if (editingTx) {
      await updateRevolvingFund(editingTx.id, payload);
    } else {
      await addRevolvingFund(payload);
    }

    setIsAddModalOpen(false);
    setEditingTx(null);
  };

  const handleDeleteConfirm = async () => {
    if (!isAdmin) {
      alert('দুঃখিত! শুধুমাত্র অ্যাডমিন গোরাবা তহবিলের রেকর্ড মুছে ফেলতে পারবেন।');
      setDeletingTx(null);
      return;
    }
    if (deletingTx) {
      await deleteRevolvingFund(deletingTx.id);
      setDeletingTx(null);
    }
  };

  // Filter logic
  const filteredTransactions = revolvingFund.filter((tx) => {
    const matchesSearch =
      (tx.personName && tx.personName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.reference && tx.reference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === 'all' ||
      (filterType === 'collection' && tx.type === 'collection') ||
      (filterType === 'distribution' && tx.type === 'distribution') ||
      (filterType === 'return' && tx.type === 'return');

    const matchesSubItem =
      activeSubItem === 'fund-collection' ? tx.type === 'collection' :
      activeSubItem === 'fund-distribution' ? tx.type === 'distribution' :
      activeSubItem === 'fund-return' ? tx.type === 'return' : true;

    const matchesDate =
      (!startDate || tx.date >= startDate) &&
      (!endDate || tx.date <= endDate);

    return matchesSearch && matchesType && matchesSubItem && matchesDate;
  });

  // Calculations
  const totalCollection = revolvingFund
    .filter((tx) => tx.type === 'collection' && tx.status === 'Completed')
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  const totalDistribution = revolvingFund
    .filter((tx) => tx.type === 'distribution' && tx.status === 'Completed')
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  const totalReturn = revolvingFund
    .filter((tx) => tx.type === 'return' && tx.status === 'Completed')
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  const currentBalance = totalCollection + totalReturn - totalDistribution;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-green-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
              <RotateCcw className="h-3.5 w-3.5 text-emerald-200" />
              <span>গোরাবা তহবিল ব্যবস্থাপনা (Ghoraba Fund)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight font-sans">
              গোরাবা তহবিল অ্যাকাউন্ট
            </h1>
            <p className="text-emerald-100 text-xs md:text-sm mt-1 max-w-xl">
              গোরাবা তহবিলের সংগ্রহ, বিতরণ, ফেরত এবং বর্তমান স্থিতি নিখুঁতভাবে পরিচালনা ও সংরক্ষণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAdd()}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>নতুন এন্ট্রি যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">মোট সংগ্রহ</p>
            <h3 className="text-xl font-bold font-mono text-emerald-700 mt-1">
              ৳{totalCollection.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            📥
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">মোট বিতরণ</p>
            <h3 className="text-xl font-bold font-mono text-amber-700 mt-1">
              ৳{totalDistribution.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            📤
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">ফেরত প্রাপ্তি</p>
            <h3 className="text-xl font-bold font-mono text-blue-700 mt-1">
              ৳{totalReturn.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            🔄
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">বর্তমান জের / স্থিতি</p>
            <h3 className="text-xl font-bold font-mono text-teal-700 mt-1">
              ৳{currentBalance.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            💰
          </div>
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveNav('revolving-fund', 'fund-collection')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubItem === 'fund-collection'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          তহবিল সংগ্রহ
        </button>
        <button
          onClick={() => setActiveNav('revolving-fund', 'fund-distribution')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubItem === 'fund-distribution'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          তহবিল বিতরণ
        </button>
        <button
          onClick={() => setActiveNav('revolving-fund', 'fund-return')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubItem === 'fund-return'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          তহবিল ফেরত
        </button>
        <button
          onClick={() => setActiveNav('revolving-fund', 'fund-balance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubItem === 'fund-balance'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          তহবিল ব্যালেন্স
        </button>
        <button
          onClick={() => setActiveNav('revolving-fund', 'fund-transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubItem === 'fund-transactions'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          সকল লেনদেন
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="নাম বা বিবরণ দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">ধরণ:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল ধরণ</option>
              <option value="collection">সংগ্রহ</option>
              <option value="distribution">বিতরণ</option>
              <option value="return">ফেরত</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-4 py-3">তারিখ</th>
                <th className="px-4 py-3">লেনদেনের ধরণ</th>
                <th className="px-4 py-3">ব্যক্তি / প্রতিষ্ঠানের নাম</th>
                <th className="px-4 py-3">বিবরণ / কারণ</th>
                <th className="px-4 py-3">পেমেন্ট মাধ্যম</th>
                <th className="px-4 py-3 text-right">টাকা (৳)</th>
                <th className="px-4 py-3 text-center">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    কোনো গোরাবা তহবিলের রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-600">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold capitalize ${
                          tx.type === 'collection'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.type === 'distribution'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tx.type === 'collection' ? 'সংগ্রহ' : tx.type === 'distribution' ? 'বিতরণ' : 'ফেরত'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{tx.personName}</td>
                    <td className="px-4 py-3 text-slate-600">{tx.description || '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{tx.paymentMethod || 'Cash'}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ৳{Number(tx.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        {tx.status || 'Completed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(tx)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="সম্পাদনা"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setDeletingTx(tx)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingTx ? 'গোরাবা তহবিল রেকর্ড সম্পাদনা' : 'নতুন গোরাবা তহবিল এন্ট্রি'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">লেনদেনের ধরণ</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="collection">তহবিল সংগ্রহ (Collection)</option>
                  <option value="distribution">তহবিল বিতরণ (Distribution)</option>
                  <option value="return">তহবিল ফেরত (Return)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">টাকার পরিমাণ (৳)</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ব্যক্তি বা প্রতিষ্ঠানের নাম</label>
                <input
                  type="text"
                  required
                  placeholder="নাম লিখুন..."
                  value={formData.personName}
                  onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">বিবরণ / কারণ</label>
                <input
                  type="text"
                  placeholder="যেমন: মাসিক অনুদান বা দরিদ্র ছাত্র সহায়তা..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পেমেন্ট মাধ্যম</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Cash">নগদ (Cash)</option>
                    <option value="Bank">ব্যাংক (Bank)</option>
                    <option value="Bkash">বিকাশ (Bkash)</option>
                    <option value="Nagad">নগদ (Nagad)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রেফারেন্স</label>
                  <input
                    type="text"
                    placeholder="রশিদ বা চেক নং..."
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              ⚠️
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">মুছে ফেলা নিশ্চিত করুন</h3>
            <p className="text-xs text-slate-500 mb-4">
              আপনি কি নিশ্চিতভাবে এই গোরাবা তহবিলের রেকর্ডটি মুছে ফেলতে চান?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
