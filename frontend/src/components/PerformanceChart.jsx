import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { Radar as RadarIcon, BarChart2, Shield } from 'lucide-react';

export default function PerformanceChart({
  iqScore = null,
  eqScore = null,
  sqScore = null,
  aqScore = null,
  iqBreakdown = {},
  eqBreakdown = {},
  sqBreakdown = {},
  aqBreakdown = {}
}) {
  const [chartType, setChartType] = useState('radar'); // 'radar' or 'bar'

  // Default benchmarks if scores not yet recorded
  const safeIQ = iqScore || 100;
  const safeEQ = eqScore || 100;
  const safeSQ = sqScore || 100;
  const safeAQ = aqScore || 100;

  // 8-Axis Full Spectrum Radar Data
  const radarData = [
    {
      dimension: 'Deductive Logic (IQ)',
      score: iqBreakdown['Logic'] || Math.round((safeIQ / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Spatial & Math (IQ)',
      score: Math.round(((iqBreakdown['Math'] || 70) + (iqBreakdown['Spatial'] || 70)) / 2),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Affective Empathy (EQ)',
      score: eqBreakdown['Empathy'] || Math.round((safeEQ / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Self-Regulation (EQ)',
      score: eqBreakdown['Self-Regulation'] || Math.round((safeEQ / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Stoic Equanimity (SQ)',
      score: sqBreakdown['Philosophy & Stoicism'] || Math.round((safeSQ / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Purpose & Values (SQ)',
      score: sqBreakdown['Purpose & Meaning'] || Math.round((safeSQ / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Crisis Velocity (AQ)',
      score: aqBreakdown['Crisis Management & Resilience'] || Math.round((safeAQ / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Unlearning & AI (AQ)',
      score: Math.round(((aqBreakdown['AI & Tech Disruption'] || 75) + (aqBreakdown['Unlearning & Agility'] || 75)) / 2),
      benchmark: 70,
      fullMark: 100,
    },
  ];

  // 4 Primary Pillars Bar Data
  const barData = [
    { name: 'IQ (Cognitive)', score: safeIQ, benchmark: 100, color: '#38bdf8' },
    { name: 'EQ (Emotional)', score: safeEQ, benchmark: 100, color: '#f43f5e' },
    { name: 'SQ (Spiritual)', score: safeSQ, benchmark: 100, color: '#f59e0b' },
    { name: 'AQ (Adaptability)', score: safeAQ, benchmark: 100, color: '#10b981' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <p className="font-semibold text-slate-200 mb-1">{label || payload[0]?.payload?.dimension}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
              {entry.name}: <span className="font-mono font-bold">{Math.round(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-400 via-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
              4D Intelligence Matrix
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-mapping Cognitive (IQ), Emotional (EQ), Spiritual (SQ), and Adaptability (AQ) vectors
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'radar'
                ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RadarIcon className="w-3.5 h-3.5" />
            <span>4D Radar</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Pillar Comparison</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-80 sm:h-96">
        {chartType === 'radar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
              <Radar
                name="Your Capability Index"
                dataKey="score"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Radar
                name="Population Norm (Median)"
                dataKey="benchmark"
                stroke="#64748b"
                strokeDasharray="4 4"
                fill="#64748b"
                fillOpacity={0.08}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#94a3b8' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis domain={[0, 160]} stroke="#64748b" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar name="Your Score" dataKey="score" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Bar name="Population Baseline (100)" dataKey="benchmark" fill="#334155" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Color Legend for 4 Dimensions */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-around gap-2 text-[11px]">
        <span className="flex items-center gap-1.5 text-blue-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          IQ: Cognitive & Logic
        </span>
        <span className="flex items-center gap-1.5 text-rose-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          EQ: Emotional Acuity
        </span>
        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          SQ: Stoic & Existential
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          AQ: Adaptability & Crisis
        </span>
      </div>
    </div>
  );
}