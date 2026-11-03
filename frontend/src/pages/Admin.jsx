import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  BarChart, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { 
  fetchAdminQuestions, 
  createAdminQuestion, 
  deleteAdminQuestion, 
  fetchAdminStats 
} from '../api';

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('smartiq_admin_key') || '');
  const [keyInput, setKeyInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // New question form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    category_type: 'IQ',
    sub_category: 'Logic',
    question_text: '',
    options: ['', '', '', ''],
    correct_answer_index: 0,
    explanation: '',
    diagram_svg: ''
  });
  const [formStatus, setFormStatus] = useState({ message: '', isError: false });

  // Check initial authentication
  useEffect(() => {
    if (adminKey) {
      loadDashboard(adminKey);
    }
  }, [adminKey]);

  const loadDashboard = async (key) => {
    setLoading(true);
    setAuthError('');
    try {
      const [questionsRes, statsRes] = await Promise.all([
        fetchAdminQuestions(key),
        fetchAdminStats(key)
      ]);

      if (questionsRes?.status === 'success') {
        setQuestions(questionsRes.data);
      }
      if (statsRes?.status === 'success') {
        setStats(statsRes.data);
      }
      setAuthenticated(true);
      sessionStorage.setItem('smartiq_admin_key', key);
    } catch (err) {
      console.error(err);
      setAuthenticated(false);
      setAuthError('Authentication failed. Please verify your administrative security key.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAdminKey(keyInput.trim());
    loadDashboard(keyInput.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('smartiq_admin_key');
    setAdminKey('');
    setAuthenticated(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to permanently delete question #${id}?`)) return;
    try {
      await deleteAdminQuestion(id, adminKey);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert('Failed to delete question.');
    }
  };

  const handleFormOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData({ ...formData, options: updated });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ message: '', isError: false });

    if (!formData.question_text || formData.options.some((opt) => !opt.trim())) {
      setFormStatus({ message: 'Please populate question text and all 4 response choices.', isError: true });
      return;
    }

    try {
      const payload = {
        ...formData,
        diagram_svg: formData.diagram_svg.trim() || null
      };
      const res = await createAdminQuestion(payload, adminKey);
      if (res.status === 'success') {
        setFormStatus({ message: 'Question created successfully!', isError: false });
        setShowCreateForm(false);
        setFormData({
          category_type: 'IQ',
          sub_category: 'Logic',
          question_text: '',
          options: ['', '', '', ''],
          correct_answer_index: 0,
          explanation: '',
          diagram_svg: ''
        });
        loadDashboard(adminKey);
      }
    } catch (err) {
      setFormStatus({ message: err.message || 'Creation failed.', isError: true });
    }
  };

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    const matchesCat = categoryFilter === 'ALL' || q.category_type === categoryFilter;
    const matchesSearch = 
      q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.sub_category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Password / Login Modal
  if (!authenticated) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-md w-full shadow-2xl relative">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2">Admin Intelligence Console</h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            Enter the authorized <code className="text-indigo-400 font-mono">X-Admin-Key</code> to manage psychometric question banks and examine bell curves.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Secret Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="e.g. smartiq-admin-secret-2026"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              {loading ? 'Verifying Credentials...' : 'Authenticate Console'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 font-mono">
              Default Key: smartiq-admin-secret-2026
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Shield className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">SmartIQ Admin Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Psychometric pool management, live telemetry distributions, and anti-cheat audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadDashboard(adminKey)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Live Metrics Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tests</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.total_tests}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Completed dual assessments</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average IQ</span>
              <BarChart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.average_iq}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Population mean baseline: 100</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average EQ</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.average_eq}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Emotional resonance index</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tab Shift Rate</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.tab_switch_rate}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Avg switches / assessment</span>
          </div>
        </div>
      )}

      {/* Action / Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question text or category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Category Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
            {['ALL', 'IQ', 'EQ'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  categoryFilter === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showCreateForm ? 'Cancel Creation' : 'Create New Question'}</span>
        </button>
      </div>

      {/* Question Creation Drawer / Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateSubmit} className="glass-panel p-6 rounded-3xl border border-indigo-500/40 mb-8 space-y-4">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>Add New Psychometric Assessment Item</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment Type</label>
              <select
                value={formData.category_type}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    category_type: val,
                    sub_category: val === 'IQ' ? 'Logic' : 'Self-Awareness'
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="IQ">IQ (Cognitive)</option>
                <option value="EQ">EQ (Emotional)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sub-Category</label>
              <select
                value={formData.sub_category}
                onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {formData.category_type === 'IQ' ? (
                  <>
                    <option value="Logic">Logic</option>
                    <option value="Math">Math</option>
                    <option value="Spatial">Spatial</option>
                  </>
                ) : (
                  <>
                    <option value="Self-Awareness">Self-Awareness</option>
                    <option value="Self-Regulation">Self-Regulation</option>
                    <option value="Empathy">Empathy</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Question Prompt / Scenario</label>
            <textarea
              rows={3}
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              placeholder="Enter comprehensive scenario or deductive problem..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.options.map((opt, i) => (
              <div key={i}>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Option {String.fromCharCode(65 + i)}
                </label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleFormOptionChange(i, e.target.value)}
                  placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {formData.category_type === 'IQ' ? 'Correct Answer Index (0 to 3)' : 'Optimal Answer Index (4-pt Choice)'}
              </label>
              <select
                value={formData.correct_answer_index}
                onChange={(e) => setFormData({ ...formData, correct_answer_index: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={0}>Option A (Index 0)</option>
                <option value={1}>Option B (Index 1)</option>
                <option value={2}>Option C (Index 2)</option>
                <option value={3}>Option D (Index 3)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Explanation</label>
              <input
                type="text"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Psychometric reasoning..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Optional Diagram SVG Code (for Spatial puzzles)
            </label>
            <textarea
              rows={2}
              value={formData.diagram_svg}
              onChange={(e) => setFormData({ ...formData, diagram_svg: e.target.value })}
              placeholder="<svg viewBox='0 0 200 100'>...</svg>"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {formStatus.message && (
            <div className={`p-3 rounded-xl text-xs ${formStatus.isError ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'}`}>
              {formStatus.message}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              Save Item to Pool
            </button>
          </div>
        </form>
      )}

      {/* Question Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Master Question Pool ({filteredQuestions.length} Items)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Sub-Category</th>
                <th className="py-3 px-6">Question Text</th>
                <th className="py-3 px-4 text-center">Correct Key</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No questions match the current criteria.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{q.id}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.category_type === 'IQ' ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/40' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                      }`}>
                        {q.category_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">{q.sub_category}</td>
                    <td className="py-3.5 px-6 text-slate-200 max-w-md truncate" title={q.question_text}>
                      {q.question_text}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                      Option {String.fromCharCode(65 + q.correct_answer_index)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(q.id)}
                        title="Delete Question"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
