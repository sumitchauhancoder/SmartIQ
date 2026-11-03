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
import { Radar as RadarIcon, BarChart2 } from 'lucide-react';

export default function PerformanceChart({ iqBreakdown = {}, eqBreakdown = {}, iqScore = 100, eqScore = 100 }) {
  const [chartType, setChartType] = useState('radar'); // 'radar' or 'bar'

  // Normalize sub-scores for the 6-dimensional radar chart (scaled 0-100 or relative index)
  // IQ dimensions typically scale based on accuracy in Logic, Math, Spatial
  // EQ dimensions scale based on competency points in Self-Awareness, Self-Regulation, Empathy
  const radarData = [
    {
      dimension: 'Deductive Logic',
      score: iqBreakdown['Logic'] || Math.round((iqScore / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Quantitative Math',
      score: iqBreakdown['Math'] || Math.round((iqScore / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Spatial Abstract',
      score: iqBreakdown['Spatial'] || Math.round((iqScore / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Self-Awareness',
      score: eqBreakdown['Self-Awareness'] || Math.round((eqScore / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Self-Regulation',
      score: eqBreakdown['Self-Regulation'] || Math.round((eqScore / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
    {
      dimension: 'Social Empathy',
      score: eqBreakdown['Empathy'] || Math.round((eqScore / 140) * 100),
      benchmark: 70,
      fullMark: 100,
    },
  ];

  const barData = [
    { name: 'Overall IQ', score: iqScore, benchmark: 100, color: '#6366f1' },
    { name: 'Overall EQ', score: eqScore, benchmark: 100, color: '#10b981' },
    { name: 'Logic', score: (iqBreakdown['Logic'] || 75) * 1.3, benchmark: 100, color: '#818cf8' },
    { name: 'Math', score: (iqBreakdown['Math'] || 75) * 1.3, benchmark: 100, color: '#38bdf8' },
    { name: 'Spatial', score: (iqBreakdown['Spatial'] || 75) * 1.3, benchmark: 100, color: '#c084fc' },
    { name: 'Empathy', score: (eqBreakdown['Empathy'] || 75) * 1.3, benchmark: 100, color: '#34d399' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs">
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
            <span>Cognitive & Emotional Symmetry</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic cross-mapping of cognitive processing vs. emotional regulation
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'radar'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RadarIcon className="w-3.5 h-3.5" />
            Radar Synthesis
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Comparative Bar
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        {chartType === 'radar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
              <Radar
                name="Your Capability Index"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.35}
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
    </div>
  );
}
