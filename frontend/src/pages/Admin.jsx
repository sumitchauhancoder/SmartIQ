import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  BarChart, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  X,
  UserCheck,
  ArrowLeft
} from 'lucide-react';
import { 
  fetchAdminQuestions, 
  createAdminQuestion, 
  updateAdminQuestion, 
  deleteAdminQuestion, 
  fetchAdminStats 
} from '../api';
import { useAuth } from '../context/AuthContext';

export default function Admin({ onOpenAuth, onNavigateHome }) {
  const { user, role, isAdmin, token, loading: authLoading } = useAuth();

  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for Create / Edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
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

  // Load dashboard whenever admin status or token changes
  useEffect(() => {
    if (isAdmin) {
      loadDashboard();
    }
  }, [isAdmin, token]);

  const loadDashboard = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [questionsRes, statsRes] = await Promise.all([
        fetchAdminQuestions(token),
        fetchAdminStats(token)
      ]);

      if (questionsRes?.status === 'success') {
        setQuestions(questionsRes.data);
      }
      if (statsRes?.status === 'success') {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('[Admin Console] Load failure:', err);
      setLoadError(err?.message || 'Failed loading management dashboard. Please verify connection and administrator permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to permanently delete question #${id}?`)) return;
    try {
      await deleteAdminQuestion(id, token);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert('Failed to delete question. Ensure your administrator privileges are active.');
    }
  };

  const handleOpenCreate = () => {
    setEditingQuestionId(null);
    setFormData({
      category_type: 'IQ',
      sub_category: 'Logic',
      question_text: '',
      options: ['', '', '', ''],
      correct_answer_index: 0,
      explanation: '',
      diagram_svg: ''
    });
    setFormStatus({ message: '', isError: false });
    setShowFormModal(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestionId(q.id);
    const opts = Array.isArray(q.options) ? q.options : ['', '', '', ''];
    while (opts.length < 4) opts.push('');

    setFormData({
      category_type: q.category_type || 'IQ',
      sub_category: q.sub_category || 'Logic',
      question_text: q.question_text || '',
      options: opts.slice(0, 4),
      correct_answer_index: q.correct_answer_index !== undefined ? q.correct_answer_index : 0,
      explanation: q.explanation || '',
      diagram_svg: q.diagram_svg || ''
    });
    setFormStatus({ message: '', isError: false });
    setShowFormModal(true);
  };

  const handleFormOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData({ ...formData, options: updated });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ message: '', isError: false });

    if (!formData.question_text || formData.options.some((opt) => !opt.trim())) {
      setFormStatus({ message: 'Please provide question text and all 4 response choices.', isError: true });
      return;
    }

    try {
      const payload = {
        ...formData,
        diagram_svg: formData.diagram_svg.trim() || null
      };

      if (editingQuestionId) {
        await updateAdminQuestion(editingQuestionId, payload, token);
        setFormStatus({ message: 'Question updated successfully!', isError: false });
      } else {
        await createAdminQuestion(payload, token);
        setFormStatus({ message: 'Question created successfully!', isError: false });
      }

      setTimeout(() => {
        setShowFormModal(false);
        loadDashboard();
      }, 700);
    } catch (err) {
      setFormStatus({ message: err.message || 'Operation failed.', isError: true });
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

  // Loading state while auth initializes
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium text-sm">Verifying administrator permissions...</p>
      </div>
    );
  }

  // Access Denied Gate: User is NOT an admin
  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 max-w-md w-full shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/70 border border-rose-700/50 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Administrator Access Required</h2>
          
          {user ? (
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              You are signed in as <span className="font-mono text-indigo-300 font-semibold">{user.email}</span> with role <span className="font-mono text-amber-300 font-semibold uppercase">{role}</span>. Administrator privileges in Supabase <code className="font-mono bg-slate-900 px-1 py-0.5 rounded">public.profiles</code> are required to view this console.
            </p>
          ) : (
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              This area is restricted to authenticated administrators. Please sign in with an account that has the <code className="font-mono text-emerald-400">admin</code> role.
            </p>
          )}

          <div className="space-y-3">
            {!user ? (
              <button
                onClick={() => onOpenAuth(false)}
                className="w-full py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In as Administrator</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth(false)}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
              >
                Switch Account
              </button>
            )}

            <button
              onClick={onNavigateHome}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Assessment Hub</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Content (Admin Authorized)
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
            Persistent cloud question CRUD, performance distributions, and live anti-cheat telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-800/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Admin: {user?.email}</span>
          </span>
          <button
            onClick={loadDashboard}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Live Metrics Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Tests</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats.total_tests}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Submissions</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-blue-500/30">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Avg IQ</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats.average_iq}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Cognitive Logic</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-rose-500/30">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">Avg EQ</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats.average_eq}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Emotional</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-amber-500/30">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Avg SQ</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats.average_sq || 100}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Stoic & Meaning</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Avg AQ</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats.average_aq || 100}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Adaptability</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tab Shifts</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats.tab_switch_rate}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Anti-cheat rate</span>
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
              placeholder="Search questions or sub-category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Category Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
            {['ALL', 'IQ', 'EQ', 'SQ', 'AQ'].map((cat) => (
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
          onClick={handleOpenCreate}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Question</span>
        </button>
      </div>

      {/* Create / Edit Question Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <form 
            onSubmit={handleFormSubmit} 
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 max-w-2xl w-full shadow-2xl my-8 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingQuestionId ? <Edit3 className="w-4 h-4 text-indigo-400" /> : <PlusCircle className="w-4 h-4 text-emerald-400" />}
                <span>{editingQuestionId ? `Edit Question #${editingQuestionId}` : 'Add New Question to Cloud Database'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment Type</label>
                <select
                  value={formData.category_type}
                  onChange={(e) => {
                    const val = e.target.value;
                    let defaultSub = 'Logic';
                    if (val === 'EQ') defaultSub = 'Self-Awareness';
                    else if (val === 'SQ') defaultSub = 'Philosophy & Stoicism';
                    else if (val === 'AQ') defaultSub = 'Crisis Management & Resilience';

                    setFormData({
                      ...formData,
                      category_type: val,
                      sub_category: defaultSub
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="IQ">IQ (Cognitive Intelligence)</option>
                  <option value="EQ">EQ (Emotional Quotient)</option>
                  <option value="SQ">SQ (Spiritual & Stoic Quotient)</option>
                  <option value="AQ">AQ (Adaptability Quotient)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sub-Category</label>
                <select
                  value={formData.sub_category}
                  onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {formData.category_type === 'IQ' && (
                    <>
                      <option value="Logic">Logic</option>
                      <option value="Math">Math</option>
                      <option value="Spatial">Spatial</option>
                    </>
                  )}
                  {formData.category_type === 'EQ' && (
                    <>
                      <option value="Self-Awareness">Self-Awareness</option>
                      <option value="Self-Regulation">Self-Regulation</option>
                      <option value="Empathy">Empathy</option>
                    </>
                  )}
                  {formData.category_type === 'SQ' && (
                    <>
                      <option value="Philosophy & Stoicism">Philosophy & Stoicism</option>
                      <option value="Purpose & Meaning">Purpose & Meaning</option>
                      <option value="Core Values & Wholeness">Core Values & Wholeness</option>
                    </>
                  )}
                  {formData.category_type === 'AQ' && (
                    <>
                      <option value="Crisis Management & Resilience">Crisis Management & Resilience</option>
                      <option value="AI & Tech Disruption">AI & Tech Disruption</option>
                      <option value="Unlearning & Agility">Unlearning & Agility</option>
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
                placeholder="Enter question text or workplace scenario..."
                required
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
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {formData.category_type === 'IQ' ? 'Correct Answer Index' : 'Optimal Answer Index (4-pt Choice)'}
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
                onClick={() => setShowFormModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
              >
                {editingQuestionId ? 'Update Question' : 'Save to Cloud Pool'}
              </button>
            </div>
          </form>
        </div>
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
                      Option {String.fromCharCode(65 + (q.correct_answer_index ?? 0))}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          title="Edit Question"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          title="Delete Question"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
