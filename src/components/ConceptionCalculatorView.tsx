import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Heart, Info, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface ConceptionCalculatorViewProps {
  onBackToCalculators?: () => void;
}

const DAY_MS = 86400000;

function parseYmdUtc(str: string): Date | null {
  if (!str) return null;
  const parts = str.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
}

function addDays(dt: Date, n: number): Date {
  return new Date(dt.getTime() + n * DAY_MS);
}

function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / DAY_MS);
}

function todayUtcYmd(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

const FMT = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' } as const;
const FMT_SHORT = { month: 'short', day: 'numeric', timeZone: 'UTC' } as const;

function formatDate(dt: Date): string {
  return dt.toLocaleDateString('en-US', FMT);
}

function formatDateShort(dt: Date): string {
  return dt.toLocaleDateString('en-US', FMT_SHORT);
}

export const ConceptionCalculatorView: React.FC<ConceptionCalculatorViewProps> = ({
  onBackToCalculators,
}) => {
  // Method State
  const [method, setMethod] = useState<'edd' | 'lmp' | 'us' | 'ivf' | 'conc'>('edd');

  // Input States
  const [dateStr, setDateStr] = useState<string>(todayUtcYmd());
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [usWeeks, setUsWeeks] = useState<number | ''>(12);
  const [usDays, setUsDays] = useState<number | ''>(0);
  const [embAge, setEmbAge] = useState<number>(5);
  const [asOfDateStr, setAsOfDateStr] = useState<string>(todayUtcYmd());
  const [plurality, setPlurality] = useState<number>(1);

  // Calculation Results State
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    lmpAnchor: Date;
    conceptionDate: Date;
    estimatedDueDate: Date;
    fertileStart: Date;
    fertileEnd: Date;
    asOfDate: Date;
    gaDays: number;
    cycle: number;
    plurality: number;
  } | null>(null);

  // Perform Calculation
  const calculate = () => {
    setError(null);
    const d1 = parseYmdUtc(dateStr);
    if (!d1) {
      setError('Please select a valid date.');
      setResult(null);
      return;
    }

    const cycle = Math.max(20, Math.min(45, cycleLength || 28));

    let anchor: Date;
    if (method === 'edd') {
      anchor = addDays(d1, -280);
    } else if (method === 'lmp') {
      anchor = addDays(d1, cycle - 28);
    } else if (method === 'conc') {
      anchor = addDays(d1, -14);
    } else if (method === 'us') {
      const w = typeof usWeeks === 'number' ? usWeeks : Number(usWeeks);
      const d = typeof usDays === 'number' ? usDays : Number(usDays) || 0;
      if (isNaN(w) || usWeeks === '') {
        setError('Please enter the gestational age (weeks) from your ultrasound scan.');
        setResult(null);
        return;
      }
      if (d < 0 || d > 6) {
        setError('Days must be between 0 and 6.');
        setResult(null);
        return;
      }
      anchor = addDays(d1, -(w * 7 + d));
    } else if (method === 'ivf') {
      anchor = addDays(d1, -embAge - 14);
    } else {
      anchor = addDays(d1, -280);
    }

    const asOf = parseYmdUtc(asOfDateStr) || parseYmdUtc(todayUtcYmd())!;
    const gaDays = diffDays(asOf, anchor);

    if (gaDays < -30) {
      setError('Selected date is over a month before conception — please check your inputs.');
      setResult(null);
      return;
    }
    if (gaDays > 336) {
      setError("That's beyond 48 weeks of gestation — please check your inputs.");
      setResult(null);
      return;
    }

    const conceptionDate = addDays(anchor, 14);
    const estimatedDueDate = addDays(anchor, 280);
    const fertileStart = addDays(conceptionDate, -5);
    const fertileEnd = addDays(conceptionDate, 1);

    setResult({
      lmpAnchor: anchor,
      conceptionDate,
      estimatedDueDate,
      fertileStart,
      fertileEnd,
      asOfDate: asOf,
      gaDays,
      cycle,
      plurality,
    });
  };

  // Run calculation on mount or parameter changes
  useEffect(() => {
    calculate();
  }, [method, dateStr, cycleLength, usWeeks, usDays, embAge, asOfDateStr, plurality]);

  const handleReset = () => {
    setMethod('edd');
    setDateStr(todayUtcYmd());
    setCycleLength(28);
    setUsWeeks(12);
    setUsDays(0);
    setEmbAge(5);
    setAsOfDateStr(todayUtcYmd());
    setPlurality(1);
    setError(null);
  };

  // Trimester & Gestational Details
  const getTrimesterText = (gaDays: number) => {
    if (gaDays < 0) return 'Pre-conception / Trying to conceive';
    if (gaDays <= 97) return 'First Trimester';
    if (gaDays <= 195) return 'Second Trimester';
    return 'Third Trimester';
  };

  const methodLabelMap = {
    edd: 'Due date',
    lmp: 'Last period',
    us: 'Ultrasound',
    ivf: 'IVF transfer',
    conc: 'Conception date',
  };

  // Wheel SVG geometry
  const renderWheelSvg = () => {
    if (!result) return null;
    const { gaDays, estimatedDueDate } = result;
    const cx = 170;
    const cy = 170;
    const rOuter = 140;
    const rBand = 120;
    const band = 17;
    const TOTAL = 42;

    const ang = (w: number) => -90 + (w / TOTAL) * 360;
    const pol = (rr: number, a: number) => [
      cx + rr * Math.cos((a * Math.PI) / 180),
      cy + rr * Math.sin((a * Math.PI) / 180),
    ];

    const arcPath = (rr: number, a0: number, a1: number) => {
      const large = a1 - a0 > 180 ? 1 : 0;
      const [x0, y0] = pol(rr, a0);
      const [x1, y1] = pol(rr, a1);
      return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${rr} ${rr} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    };

    const gaW = Math.max(0, Math.min(TOTAL, gaDays / 7));
    const gw = Math.floor(Math.max(0, gaDays) / 7);
    const gd = Math.max(0, gaDays) % 7;

    return (
      <svg
        className="w-full max-w-[320px] h-auto mx-auto block drop-shadow-xs"
        viewBox="0 0 340 340"
        role="img"
        aria-label="Pregnancy Progress Wheel"
      >
        {/* Trimester Color Arcs */}
        <path d={arcPath(rBand, ang(0), ang(13))} fill="none" stroke="#e9c2c6" strokeWidth={band} strokeLinecap="round" />
        <path d={arcPath(rBand, ang(13), ang(27))} fill="none" stroke="#bcd6ca" strokeWidth={band} strokeLinecap="round" />
        <path d={arcPath(rBand, ang(27), ang(40))} fill="none" stroke="#e6d3a3" strokeWidth={band} strokeLinecap="round" />
        <path d={arcPath(rBand, ang(40), ang(42))} fill="none" stroke="#d8ddd6" strokeWidth={band} strokeLinecap="round" />

        {/* Current Gestational Progress Arc */}
        {gaW > 0 && (
          <path
            d={arcPath(rOuter, ang(0.15), ang(gaW))}
            fill="none"
            stroke="#26786c"
            strokeWidth={5}
            strokeLinecap="round"
          />
        )}

        {/* Ticks and Week Labels */}
        {[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((w) => {
          const [x0, y0] = pol(rBand + band / 2 + 4, ang(w));
          const [x1, y1] = pol(rBand + band / 2 + 9, ang(w));
          const [tx, ty] = pol(rBand + band / 2 + 20, ang(w));
          return (
            <g key={w}>
              <line
                x1={x0.toFixed(1)}
                y1={y0.toFixed(1)}
                x2={x1.toFixed(1)}
                y2={y1.toFixed(1)}
                stroke="#b9c5bd"
                strokeWidth={1.5}
              />
              <text
                x={tx.toFixed(1)}
                y={ty.toFixed(1)}
                fontFamily="ui-monospace, monospace"
                fontSize={9}
                fill="#7c8a84"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {w}
              </text>
            </g>
          );
        })}

        {/* Markers for key milestones */}
        {/* Conception ~2w */}
        {(() => {
          const [mx, my] = pol(rBand, ang(2));
          return <circle cx={mx.toFixed(1)} cy={my.toFixed(1)} r={5} fill="#fff" stroke="#cf6670" strokeWidth={3} />;
        })()}
        {/* Viability ~24w */}
        {(() => {
          const [mx, my] = pol(rBand, ang(24));
          return <circle cx={mx.toFixed(1)} cy={my.toFixed(1)} r={5} fill="#fff" stroke="#6f9b8a" strokeWidth={3} />;
        })()}
        {/* Due date ~40w */}
        {(() => {
          const [mx, my] = pol(rBand, ang(40));
          return <circle cx={mx.toFixed(1)} cy={my.toFixed(1)} r={5} fill="#fff" stroke="#26786c" strokeWidth={3} />;
        })()}

        {/* Center Pointer Needle */}
        {gaW > 0 && (() => {
          const [hx, hy] = pol(rBand - band / 2 - 2, ang(gaW));
          return (
            <g>
              <line
                x1={cx}
                y1={cy}
                x2={hx.toFixed(1)}
                y2={hy.toFixed(1)}
                stroke="#16302b"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <circle cx={hx.toFixed(1)} cy={hy.toFixed(1)} r={5} fill="#cf6670" />
            </g>
          );
        })()}

        <circle cx={cx} cy={cy} r={4} fill="#16302b" />

        {/* Center Text Display */}
        <text
          x={cx}
          y={cy - 30}
          fontFamily="ui-monospace, monospace"
          fontSize={9}
          letterSpacing={1}
          fill="#7c8a84"
          textAnchor="middle"
        >
          GESTATIONAL AGE
        </text>
        <text
          x={cx}
          y={cy + 4}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight={700}
          fontSize={42}
          fill="#16302b"
          textAnchor="middle"
        >
          {gaDays < 0 ? '—' : `${gw}w`}
        </text>
        <text
          x={cx}
          y={cy + 26}
          fontFamily="ui-monospace, monospace"
          fontSize={12}
          fill="#4c5c56"
          textAnchor="middle"
        >
          {gaDays < 0 ? 'Pre-conception' : `${gd} days`}
        </text>
        <text
          x={cx}
          y={cy + 68}
          fontFamily="sans-serif"
          fontSize={11}
          fill="#7c8a84"
          textAnchor="middle"
        >
          Due {formatDateShort(estimatedDueDate)}
        </text>
      </svg>
    );
  };

  // Milestone Timeline
  const renderTimeline = () => {
    if (!result) return null;
    const { lmpAnchor, gaDays } = result;
    const marks = [
      { w: 0, lbl: 'Conception window' },
      { w: 13, lbl: 'End of 1st tri' },
      { w: 20, lbl: 'Anatomy scan' },
      { w: 24, lbl: 'Viability' },
      { w: 28, lbl: '3rd trimester' },
      { w: 37, lbl: 'Full term' },
      { w: 40, lbl: 'Due date' },
    ];

    const nowW = gaDays / 7;
    const pct = Math.max(0, Math.min(100, (nowW / 40) * 100));

    return (
      <div className="space-y-4">
        <div className="relative pt-6 pb-2">
          {/* Track line */}
          <div className="absolute left-0 right-0 top-3 h-1 bg-slate-200 rounded-full" />
          <div
            className="absolute left-0 top-3 h-1 bg-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />

          <div className="flex justify-between relative">
            {marks.map((m) => {
              const markDate = addDays(lmpAnchor, m.w * 7);
              const done = nowW >= m.w;
              const isNow = Math.abs(nowW - m.w) < 1.6;

              return (
                <div key={m.w} className="flex-1 text-center relative px-0.5">
                  <div className="text-[10px] font-mono text-slate-400 font-semibold">{m.w}w</div>
                  <div
                    className={`w-3 h-3 rounded-full mx-auto my-1.5 transition-all ${
                      isNow
                        ? 'bg-rose-500 ring-4 ring-rose-100 scale-125'
                        : done
                        ? 'bg-teal-600 border-2 border-teal-600'
                        : 'bg-white border-2 border-slate-300'
                    }`}
                  />
                  <div className="text-[11px] font-semibold text-slate-700 leading-tight">{m.lbl}</div>
                  <div className="text-[10px] font-mono text-slate-400 hidden sm:block mt-0.5">
                    {formatDateShort(markDate)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Plurality Delivery Table
  const renderPluralityTable = () => {
    if (!result) return null;
    const { lmpAnchor, plurality: currentPlurality } = result;
    const rows = [
      { name: 'Singleton', weeks: 39, id: 1 },
      { name: 'Twins', weeks: 35, id: 2 },
      { name: 'Triplets', weeks: 32, id: 3 },
      { name: 'Quadruplets', weeks: 30, id: 4 },
      { name: 'Quintuplets+', weeks: 27, id: 5 },
    ];

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-500">
              <th className="py-2 px-3">Pregnancy</th>
              <th className="py-2 px-3">Avg. Weeks</th>
              <th className="py-2 px-3 text-right">Est. Delivery Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((row) => {
              const estDate = addDays(lmpAnchor, row.weeks * 7);
              const isSelected = row.id === currentPlurality;
              return (
                <tr
                  key={row.id}
                  className={isSelected ? 'bg-teal-50/80 font-bold text-teal-900' : 'hover:bg-slate-50'}
                >
                  <td className="py-2 px-3">{row.name}</td>
                  <td className="py-2 px-3">{row.weeks} wks</td>
                  <td className="py-2 px-3 text-right font-mono text-teal-800">{formatDateShort(estDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16 font-sans">
      {/* Top Navigation & Single H1 Title Header */}
      <div className="space-y-4">
        {onBackToCalculators && (
          <button
            onClick={onBackToCalculators}
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-full transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Health Calculators</span>
          </button>
        )}

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 font-mono">
            <Heart className="h-3.5 w-3.5 text-rose-600" />
            <span>FERTILITY & PREGNANCY CLINICAL CALCULATOR</span>
          </div>

          {/* STRICTLY THE ONLY H1 ON THE PAGE */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Playfair_Display',serif] text-slate-900 tracking-tight leading-tight">
            Pregnancy Conception Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Work backward from any date you already know — your due date, last period, ultrasound, or IVF transfer —
            to find the most likely day you conceived, your fertile window, how far along you are, and when the baby is due.
          </p>
        </div>
      </div>

      {/* Main Interactive Calculator Section */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-slate-900">
              What do you know?
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pick the date method you are most confident about. The calculator fills in the rest.
            </p>
          </div>

          {/* Method Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'edd', label: 'Due date' },
              { id: 'lmp', label: 'Last period' },
              { id: 'us', label: 'Ultrasound' },
              { id: 'ivf', label: 'IVF transfer' },
              { id: 'conc', label: 'Conception date' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMethod(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  method === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Inputs based on Method */}
          <div className="space-y-4 pt-2">
            {method === 'edd' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Your estimated due date</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <p className="text-[11px] text-slate-500 font-mono">
                  We reverse-calculate: conception = due date − 266 days.
                </p>
              </div>
            )}

            {method === 'lmp' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">First day of your last period</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Average cycle length (days)</label>
                  <input
                    type="number"
                    min={20}
                    max={45}
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                  <p className="text-[11px] text-slate-500 font-mono">
                    Corrects ovulation timing. 28 = textbook. Longer cycle ⇒ later ovulation.
                  </p>
                </div>
              </>
            )}

            {method === 'us' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Date the ultrasound was done</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Gestational age at that scan</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min={0}
                      max={45}
                      placeholder="weeks (e.g. 12)"
                      value={usWeeks}
                      onChange={(e) => setUsWeeks(e.target.value === '' ? '' : Number(e.target.value))}
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                    <input
                      type="number"
                      min={0}
                      max={6}
                      placeholder="days (e.g. 3)"
                      value={usDays}
                      onChange={(e) => setUsDays(e.target.value === '' ? '' : Number(e.target.value))}
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    e.g. 12 weeks 3 days. Shown on your scan report.
                  </p>
                </div>
              </>
            )}

            {method === 'ivf' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Embryo transfer date</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Embryo age at transfer</label>
                  <select
                    value={embAge}
                    onChange={(e) => setEmbAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  >
                    <option value={3}>Day 3 (cleavage stage)</option>
                    <option value={5}>Day 5 (blastocyst stage)</option>
                    <option value={6}>Day 6 (blastocyst stage)</option>
                  </select>
                </div>
              </>
            )}

            {method === 'conc' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Known conception / ovulation date</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <p className="text-[11px] text-slate-500 font-mono">
                  Due date = conception + 266 days. Cycle length isn't needed when conception is known.
                </p>
              </div>
            )}

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-700">Calculate how far along as of</label>
              <input
                type="date"
                value={asOfDateStr}
                onChange={(e) => setAsOfDateStr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Defaults to today. Change it to date a past or future point.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Number of babies (adjusts typical delivery week)
              </label>
              <select
                value={plurality}
                onChange={(e) => setPlurality(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              >
                <option value={1}>Singleton</option>
                <option value={2}>Twins</option>
                <option value={3}>Triplets</option>
                <option value={4}>Quadruplets</option>
                <option value={5}>Quintuplets+</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={calculate}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Calculate Dates</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Right Results Output Panel */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between min-h-[500px]">
          {result ? (
            <div className="space-y-6">
              {/* Wheel SVG */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 flex items-center justify-center">
                {renderWheelSvg()}
              </div>

              {/* Data Tiles Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>Most Likely Conception</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 font-['Playfair_Display',serif]">
                    {formatDate(result.conceptionDate)}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Fertile Window</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {formatDateShort(result.fertileStart)} – {formatDateShort(result.fertileEnd)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">6-day window around ovulation</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                    <span>Estimated Due Date</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-teal-900 font-['Playfair_Display',serif]">
                    {formatDate(result.estimatedDueDate)}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-500 font-bold">
                    <Clock className="h-3 w-3 text-slate-600" />
                    <span>Gestational Age</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-900">
                    {result.gaDays < 0
                      ? 'Pre-conception'
                      : `${Math.floor(result.gaDays / 7)}w ${result.gaDays % 7}d`}
                  </div>
                  <div className="text-[10px] font-semibold text-teal-700">
                    {getTrimesterText(result.gaDays)}
                  </div>
                </div>

                <div className="col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">
                    Calculated Last Menstrual Period (LMP Anchor)
                  </div>
                  <div className="text-sm font-bold text-slate-900">{formatDate(result.lmpAnchor)}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    All dates derive from this anchor. Conceptional age ≈{' '}
                    {result.gaDays >= 0
                      ? `${Math.max(0, Math.floor((result.gaDays - 14) / 7))}w ${(result.gaDays - 14) % 7}d`
                      : '—'}{' '}
                    (approx. 2 weeks less than gestational age).
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 text-slate-400 space-y-3 my-auto">
              <Calendar className="h-12 w-12 text-slate-300" />
              <p className="text-sm">Select your inputs and click Calculate Dates to view your pregnancy wheel and breakdown.</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>RaphaAtlas Fertility Engine</span>
            <span>Method: {methodLabelMap[method]}</span>
          </div>
        </div>
      </div>

      {/* Milestone Timeline Card */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-slate-900">
              Gestational Milestone Timeline
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {result.gaDays < 0
                ? 'Estimated timeline once pregnancy begins.'
                : `You're roughly ${Math.round(Math.max(0, Math.min(100, (result.gaDays / 280) * 100)))}% through a 40-week gestation.`}
            </p>
          </div>
          {renderTimeline()}
        </div>
      )}

      {/* Context Notes & Plurality Table Card */}
      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 space-y-2">
              <h3 className="text-sm font-bold text-amber-900">When an ultrasound overrules your dates</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                First-trimester ultrasound (crown-rump length up to 13w6d) is the most accurate way to date a pregnancy.
                Clinicians re-date from the scan when it disagrees with your last period by more than the accepted margin for that stage.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Conception vs. Gestational Age</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gestational age is counted from the first day of your last period. Fetal (conceptional) age is counted from
                conception — about two weeks less. Most medical timelines use gestational age.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Typical Delivery by Number of Babies</h3>
            {renderPluralityTable()}
            <p className="text-[11px] text-slate-500 font-mono mt-2">
              Multiples usually arrive earlier. This does not change how the due date is first assigned.
            </p>
          </div>
        </div>
      )}

      {/* VERBATIM EDUCATIONAL GUIDE & ARTICLE SECTION */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-8 text-slate-800 leading-relaxed font-sans">
        {/* Article Header & Feature Image */}
        <div className="border-b border-slate-200 pb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
                Evidence-Based Clinical Conception Guide
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Obstetric dating formulas, Naegele's rule, ultrasound CRL thresholds &amp; fertile window science
              </p>
            </div>
          </div>

          {/* Feature Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 my-6 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80"
              alt="Clinical fertility, ultrasound, and prenatal conception guide"
              className="w-full h-64 sm:h-80 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
              <span>Obstetric Gestational Age &amp; Fertile Window Clinical Guide</span>
              <span className="font-semibold text-teal-700">RaphaAtlas Health Engine</span>
            </div>
          </div>
        </div>

        {/* Verbatim Article Content */}
        <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Playfair_Display',serif]">
              Introductions
            </h2>
            <p>
              Most people expect a Pregnancy Conception Calculator to hand over one exact date, yet biology resists that request. What it truly returns is an estimate, a narrow date range where conception most plausibly occurred inside.
            </p>
            <p>
              A developing baby cannot announce the day it began, so competent practice works backward. We read your last period date, an ultrasound date, or an IVF transfer date toward the true date of conception instead.
            </p>
            <p>
              Clinicians rarely trust one method alone. Your LMP, your ultrasound results, and your fertility timing each estimate the approximate conception date differently, and honest counseling means admitting these figures vary from person to person noticeably.
            </p>
            <p>
              Why does knowing how far along you are matter so much? Because a defensible gestational age shapes every prenatal decision ahead, from screening windows to the expected due date your provider will eventually calculate together.
            </p>
            <p>
              Treat the Conception Calculator as a compass, never a guarantee of timing. It estimates when you likely conceived, offering a reliable estimate and corresponding due date rather than a promise about your actual birth date.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
              When Did I Conceive / When Did I Get Pregnant
            </h3>
            <p>
              Forget the tidy assumption that conception matches the night of sexual intercourse. Sperm stays viable several days inside you, so fertilization may occur far later, quietly widening the plausible range of possible conception dates here.
            </p>
            <p>
              Reverse arithmetic anchors most estimation here. Since a 40-week pregnancy counts roughly 266 days from conception, we subtract backward from any estimated due date, producing an estimated conception date your healthcare provider can independently sanity-check.
            </p>
            <p>
              Your cycle length quietly rewrites everything. Textbook logic assumes a regular 28-day cycle with ovulation on day 14, yet irregular periods, longer phases, and shorter ones each shift when conception genuinely occurred within your body.
            </p>
            <p>
              Numbers make this concrete. A 25-day cycle places ovulation near day 11, while a 35-day cycle pushes it toward day 21, so a corrected LMP matters before trusting any estimated conception date blindly, frankly, today.
            </p>
            <p>
              Practitioners weigh a sonogram against dates. When your first day memory is fuzzy, an early ultrasound measuring gestational age overrides shaky counting, because accurate recall of a regular period frankly fails many patients seeking honesty.
            </p>

            <div className="space-y-4 pl-4 border-l-2 border-teal-200 my-6">
              <h4 className="text-base font-bold text-slate-900">Last Menstrual Period (LMP)</h4>
              <p>
                The Last Menstrual Period dominates because it is simple, not because it is truly accurate. Providers still adore it, yet LMP silently assumes textbook normal cycles that most real living human bodies never actually keep.
              </p>
              <p>
                Mechanically, the LMP method takes the first day of your last period and applies add 280 days, roughly 40 weeks or 9 months and 7 days, generating a fast, defensible due date almost instantly today.
              </p>
              <p>
                Here lies the buried flaw everyone ignores. The formula presumes ovulation at day 14 of a regular cycle, so anyone with irregular cycles or unusual cycle lengths inherits a quietly wrong gestational age immediately onward.
              </p>
              <p>
                Correction beats blind faith. Using Conception Date = LMP + (Cycle Length - 14 days) lets us subtract 14 days intelligently, adjusting the number of days whenever your average cycle length strays past 28 days.
              </p>
              <p>
                Boundaries matter clinically here. Normal cycles span 21 to 35 days, and beyond that range the LMP estimate frays badly. That is precisely why thoughtful family planning pairs recall with ultrasound, never recall alone honestly.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Due Date Method</h4>
              <p>
                Working from a known due date feels backward, yet it is often the cleanest path. If a sonogram already fixed your EDD, we simply reverse the math toward a corresponding window of possible conception dates.
              </p>
              <p>
                The arithmetic stays blunt. Conception Date = Due Date - 266 Days reflects that a full 40-week pregnancy runs 2 weeks shorter in real embryonic terms, landing near 38 weeks of genuine post-fertilization growth inside.
              </p>
              <p>
                Worked example beats abstraction every time. Take a due date of August 9; subtract the 266 days and you arrive around November 16 of the previous year as the most plausible estimated conception date overall.
              </p>
              <p>
                This method shines when earlier data exists already. A confirmed IVF transfer or a first-trimester ultrasound yields a sturdier due date than shaky LMP recall, so back-calculating from it produces a more accurate final answer.
              </p>
              <p>
                Never oversell the output though, ever. Even a polished Due Date Calculation delivers a range, not a verdict, because natural variation means barely 5% of babies actually arrive on the precise estimated due date printed.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Conception Date Method</h4>
              <p>
                Forget the notion that one remembered night pins your conception date. Because live sperm linger inside the reproductive tract, real fertilization can arrive five days earlier than the intercourse you keep blaming and counting on.
              </p>
              <p>
                The cleanest Conception Date Method runs backward from a known due date, since the sound calculation adds 266 days from fertilization rather than counting from your imprecise last menstrual period and its usual two-week padding.
              </p>
              <p>
                I trust this most when a patient logged ovulation deliberately. Ovulation predictor kits, ovulation test strips, and a disciplined basal body temperature chart mark the ovulation window far tighter than any generic assumed 28-day cycle.
              </p>
              <p>
                Fertility treatments rewrite the arithmetic completely. Under IUI or in vitro fertilization, the human egg meets sperm at a scheduled hour, so the brief 12 to 24 hours of viability, not vague memory, fixes conception.
              </p>
              <p>
                Skeptics demand one exact day, yet biology declines politely. An honest conception date is really a range of days, anchored wherever ovulation occurs, then quietly confirmed later through ultrasound dating instead of the wall calendar.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Ultrasound / Gestational Age</h4>
              <p>
                Your LMP date is a guess wearing the costume of fact, and the obstetric ultrasound overrules it without apology. Sound waves assemble images of internal body structures, and those measurements date the pregnancy more honestly.
              </p>
              <p>
                Early pregnancy ultrasounds earn trust between 6 and 8 weeks, when crown-rump length, read from top of head to bottom, predicts gestational age within 5 to 7 days, the most accurate window you will get.
              </p>
              <p>
                Practitioners convert a raw crown rump length into weeks and days through a sonographic method, never intuition. A first-trimester scan reading 7 weeks 5 days lets me count backward toward the truly genuine ovulation window.
              </p>
              <p>
                I have watched one early pregnancy scan quietly adjust a due date by ten days. Once fetal size outpaces the calculated LMP, the ultrasound-based EDD wins, because living tissue grows on a reliable biological schedule.
              </p>
              <p>
                Past 12 weeks the growing baby varies too widely for precise dating, which is why first trimester timing matters. A pregnancy confirmation ultrasound at five or six weeks merely proves viability, never the exact age.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">IVF / ART Embryo Transfer</h4>
              <p>
                Couples using IVF often assume their dating stays fuzzy, yet the reverse holds. Because the embryo transfer date and embryo age sit documented in a chart, IVF/ART yields obstetrics' single most precise conception timeline overall.
              </p>
              <p>
                The math hinges entirely on which transfer date occurred. A day-three embryo transfer at the cleavage stage, meaning Day 3, and a day-five embryo transfer at the blastocyst stage, meaning Day 5, carry distinct offsets.
              </p>
              <p>
                For the estimated due date, clinicians reckon from transfer, never from a phantom period. In Vitro Fertilization records replace the menstrual cycles and ovulation dates muddying natural conception, so the calculator needs one clean number.
              </p>
              <p>
                A blastocyst embryo transfer adds fewer days than a cleavage transfer, while a Day 6 transfer shifts the sum yet again. This is precisely why I forbid patients reusing a generic pregnancy due date widget.
              </p>
              <p>
                Fertility treatments strip out the customary adjustment guesswork entirely. Where a natural cycle forces some hazy estimated date range, a logged embryo transfer hands you a fixed origin, rendering gestational age almost stubbornly, accurately knowable.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Reverse-Calculate from Date of Birth</h4>
              <p>
                Working forward toward a due date feels intuitive, yet reversing from an actual date of birth is where precision hides. The formula Conception Date = Date of Birth - 266 Days anchors this entire reconstruction.
              </p>
              <p>
                The logic rests on gestation in humans spanning roughly 38 to 42 weeks, or 38 x 7 counted days from conception. Full-term pregnancies cluster there, though plus or minus two weeks stays ordinary, never alarming.
              </p>
              <p>
                Take one date of birth of April 2 1990; the subtraction lands conception near the prior July 10 1989. Repeating that same operation against any birth date exposes the likely conception date with surprising cleanliness.
              </p>
              <p>
                Because delivery arrives early, late, or precisely on schedule, the reversed figure is a window, not a pinpoint. A June 26 birth against a July 24 birth swings the exact date of conception measurably apart.
              </p>
              <p>
                Remember the first two weeks of the menstrual cycle predate the true fertilization of the egg entirely. Counting from birth ignores that clinical fiction, delivering an estimated date range grounded in the egg meeting sperm.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Ovulation Method</h4>
              <p>
                Most people assume conception happens the exact moment you have sex, yet fertilization actually follows ovulation by hours, not days. Pinpointing your day of ovulation matters far more than any single bedroom date you half-remember.
              </p>
              <p>
                Your ovaries release a single egg roughly 14 days before your next period arrives, though real cycles scatter this across an 11-21 days range. That is why lazy cycle length - 28 assumptions wreck estimates.
              </p>
              <p>
                Once the ovaries let go, the egg travels down the fallopian tubes awaiting sperm. When a sperm fertilizes it, that newly fertilized cell implants into the uterus wall roughly a week afterward, certainly not immediately.
              </p>
              <p>
                The most commonly used shortcut simply adds 280 days onto your last period, but the ovulation route runs sharper. Count backward, add two weeks onto your calculated ovulation moment, and the fertile window tightens considerably.
              </p>
              <p>
                I tell patients that tracking ovulation cycles beats memory every single time. Note your menstrual period start, subtract two weeks, and you land on the ovulation day when you were most likely to conceive successfully.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Intercourse / Last Sexual Contact</h4>
              <p>
                Dating a pregnancy from the last time you had sex feels perfectly logical, yet it misleads more couples than it helps. Sperm stay alive far longer than the encounter itself, quietly distorting the whole process.
              </p>
              <p>
                A man's sperm can survive up to a week inside the reproductive tract, just patiently waiting around. So the day you had intercourse rarely marks the day you genuinely ovulated or actually became pregnant afterward.
              </p>
              <p>
                This takes time to accept, particularly with more than one partner across a cycle. Because sperm linger, identifying which partner or encounter truly led to conception becomes genuinely difficult without any hard ovulation timing data.
              </p>
              <p>
                Assuming birth control kept you fully safe is another common trap. No method sits 100% effective at preventing pregnancy, and people who were ovulating while lapsing on protection conceive far more often than they expected.
              </p>
              <p>
                Your ovaries release the egg into the fallopian tubes, and then can pregnant status begin. Add two weeks past your menstrual period; irregular body cycles and ovulation cycles shift this by two or three days.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">When To Prefer Ultrasound Dating Over LMP</h4>
              <p>
                Trusting your last period to date a pregnancy sounds sensible until you learn how often it misleads prenatal care. LMP dating quietly assumes textbook regular 28-day cycles, yet most real bodies refuse to cooperate neatly.
              </p>
              <p>
                An early ultrasound scan never guesses; it takes a real-time measure of the fetus to confirm gestational age within a few days. Reading CRL size, the standard procedure across obstetric ultrasounds, reliably beats recalled dates.
              </p>
              <p>
                The clinical question is discrepancy size, not preference. When your scan and LMP dating diverge past the recommended thresholds, providers redate you. Blindly adding 280 days onto an uncertain period only compounds that original error.
              </p>
              <p>
                Here are the ACOG bands I actually follow: before 9 0/7 weeks, redate beyond 5 days; across 9 0/7-15 6/7 weeks, seven days; then 16 0/7-21 6/7 weeks loosens to 10 days before correction applies.
              </p>
              <p>
                Past that, 22 0/7-27 6/7 weeks tolerates 14 days, while 28 0/7 weeks onward permits 21 days. CRL fades beyond 13 weeks 6 days, so the exam date anchors how software back-calculates and derives EDD.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Determining The Estimated Due Date (EDD)</h4>
              <p>
                Your estimated due date offers only a general idea of when you will give birth, never a hard deadline. Treating it as exact timing invites disappointment, since few babies arrive born on exact due date.
              </p>
              <p>
                The standard clinical method begins by adding 280 days to your last period, setting a rough baseline. That crude midpoint ignores your actual biology, so clinicians refine it well before trusting the final printed number.
              </p>
              <p>
                We refine using early ultrasound measurements plus a cycle length - 28 days correction to improve the estimate. Longer cycles mean you ovulate later, and ignoring such quiet factors skews the entire projection badly downstream.
              </p>
              <p>
                For conception-based cases the arithmetic differs sharply: IVF procedures with known embryo transfer dates subtract precisely, yielding 263 days or 261 days by blastocyst age. That calculated precision beats estimating from a fuzzy recalled period.
              </p>
              <p>
                Accept the accuracy limits honestly. Individual differences, timing, and discrepancies between ultrasound methods and fetal measurements mean your actual due date lands a week or two before or after the true spontaneous onset of labor.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Playfair_Display',serif]">
              Fertile Window, Ovulation, Fertilization &amp; Conception
            </h2>
            <p>
              The day you had sex rarely marks conceiving. Clinically, the initiation of pregnancy follows a strict scientific definition where fertilization and implantation occur separately, leaving you not considered pregnant until the embryo develops and settles.
            </p>
            <p>
              Timing drives probability. Your fertile window spans roughly 5 days, yet the highest odds combine into a three-day window ending at ovulation. Couples attempting to conceive should target the most fertile days, not blind guesswork.
            </p>
            <p>
              Studies show regular sexual intercourse across the last 3 days before ovulation gives the sharpest increase in successfully conceiving. Understand that five days before ovulation sperm still survive; pregnancy can begin from earlier contact, surprisingly.
            </p>
            <p>
              Once sperm fertilizes the waiting egg, that fertilized egg travels the fallopian tube. The egg fertilized moment isn't pregnancy yet. People use these terms interchangeably, but medical precision matters when tracking becoming pregnant accurately here.
            </p>
            <p>
              Shortly after ovulation, the implanted embryo burrows into the uterine lining, gripping the wall of the uterus. Only after implantation does pregnancy officially begins. Roughly 30% of cases fail silently before you get pregnant knowingly.
            </p>

            <div className="space-y-4 pl-4 border-l-2 border-teal-200 my-6">
              <h4 className="text-base font-bold text-slate-900">Regular Lovemaking &amp; Childbearing</h4>
              <p>
                Scheduling sex around the ovulation day often backfires. Couples fixated on trying to have a baby invite stress that suppresses fertility. The best preparation is regular sex, not military precision aimed at one fertile morning.
              </p>
              <p>
                Lovemaking roughly 2 to 3 times a week keeps sperm life span overlapping your fertile window naturally. This rhythm quietly raises chances of conception while extending the fertile window, since fresh sperm await the egg.
              </p>
              <p>
                Desire fades when work, chores, and daily distractions dominate life. A couple who only make love on command drains intimacy. Protect your relationships first; a partner feeling pressured rarely brings feelings of sexuality to bed.
              </p>
              <p>
                Childbearing depends heavily on lifestyle. A skewed hormonal level or chronic worry produces low fertility signals inside the woman's body. Wanting a child intensely never overrides favorable conditions built through rest, nutrition, and steady calm.
              </p>
              <p>
                Fertile-quality, egg-white cervical mucus signals ready vaginal conditions. Healthy vagina chemistry aids protecting the sperm during transit. Love the process itself; couples who relax read these bodily cues sharper than any rigid calendar ever manages.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Making The Fertility Window Work (Basal Body Temperature &amp; Cervical Mucus)</h4>
              <p>
                Forget generic app predictions. Your own biological cycle speaks louder. Serious tracking blends a basal body temperature chart with cervical mucus reading to predict ovulation from real signals, not from a phone's crudely averaged guess.
              </p>
              <p>
                Take your body temperature every morning before rising, same 24-hour period rhythm, using a basal thermometer from most pharmacies. Consistency delivers an accurate reading; even minute changes distinguish the lowest body temperature from a rise.
              </p>
              <p>
                Before you ovulate, readings hover near 97.2 degrees, inside a normal range. Roughly two or three days after the day of ovulation, temperature climbs one-half to one degree toward 97.7 degrees Fahrenheit, confirming the shift.
              </p>
              <p>
                Mucus tells the forward story. Dry days, then sticky paste, then cloudy mucus, finally clear, slippery, raw egg white strands mark your fertility window. These become the best days for regular lovemaking, sex, or insemination.
              </p>
              <p>
                Chart both patterns across one full length of the cycle, roughly day 12 through day 17, and a biological pattern emerges. Predicting your next period sharpens chances of conception and best days to get pregnant.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Follow Your Feelings</h4>
              <p>
                Charts can betray you. When the tracking process becomes stressful, it sabotages the very bodies you monitor. Worry and stress flood your system, and the woman's body responds by delaying the favorable hormonal moment entirely.
              </p>
              <p>
                I tell couples to loosen the charting grip. Have sex roughly every two days as a comfortable minimum, never a chore. This keeps you closer without turning intimacy into a clinical process ruled by spreadsheets.
              </p>
              <p>
                Feeling good matters physiologically. Relaxed body conditions create favorable chemistry across the crucial seven days surrounding ovulation. A loving, unhurried contact does more for conception than any anxious, obsessively logged temperature reading ever truly could.
              </p>
              <p>
                Getting closer emotionally shifts biology. Partners who stay loving and present, skin contact frequent, report calmer cycles. The woman's body rewards safety, not surveillance; that is the truth most fertility apps quietly refuse to mention.
              </p>
              <p>
                Trust your own bodies over borrowed rules. Feeling good, low worry, steady contact every few days, this natural process carries couples through seven days of possibility while the rigid tracking process crowd stays anxious enough.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
              How The Tool Estimates Your Dates
            </h3>
            <p>
              Most people assume you can pinpoint exactly when you became pregnant. Biologically, that's difficult. A pregnancy conception date varies across women because multiple ways exist to measure it, and each gives slightly different conception dates.
            </p>
            <p>
              A conception calculator works by entering dates — usually the mother's last menstrual period — then applying the average menstrual cycle length. From these factors it estimates when real conception most likely happened for you.
            </p>
            <p>
              This is why a pregnancy calculator stays the number one, most popular starting point for anyone unsure how many weeks pregnant they are, or trying to track pregnancy week by week.
            </p>
            <p>
              The age of the baby — its gestational age on date selected — differs from the moment conception took place by roughly two weeks, since clinicians count from your last period, not fertilization.
            </p>
            <p>
              Whether it's a planned baby or an unplanned pregnancy, the woman's body works identically. Sperm linger 3-5 days, while implantation follows conception by roughly 10 days, shifting your fertile map.
            </p>

            <div className="space-y-4 pt-2">
              <h5 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider text-teal-800">When Did I Conceive?</h5>
              <p>
                At your first prenatal visit, the clinician often estimates when you ovulated. If your period started April 24, ovulation near May 7 — about 13 days later — marks the likeliest window.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Estimating Conception From An Ultrasound</h4>
              <p>
                Beyond dating methods built purely on cycles, a last ultrasound reads the embryo directly, checking its progress and the health of both mother and child through precise, measurable early growth.
              </p>
              <p>
                Timing is everything here. On a 30-day cycle, a scan reading 38 days points to conception about 16 days after your period — noticeably earlier than clumsy tracking ovulation guesswork suggests.
              </p>
              <p>
                Software then back-calculates the fuller picture: a January 15 scan showing 54 days of growth sets conception near December 8, sharpening ovulation timing into a single, dependable, dated estimate you can trust.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">IVF, Delivery, And Why Ranges Beat Single Dates</h4>
              <p>
                For IVF embryo transfer, the calculator skips guesswork entirely — the transfer date fixes conception precisely. Natural pregnancy timing windows stay wider, which is why the tool shows ranges, not one rigid day.
              </p>
              <p>
                That range matters because few babies actually deliver on the exact calculated date. Knowing your true conception window simply helps you plan care, testing, and expectations across the pregnancy realistically.
              </p>

              <h5 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider text-teal-800 pt-4">How Accurate Is the Due Date?</h5>
              <p>
                Treat your due date as a probability, not a promise. Fewer than one in twenty babies arrive on it. Still, it anchors pregnancy planning and early preparations with useful, workable structure.
              </p>

              <h5 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider text-teal-800 pt-4">Can My Due Date Change?</h5>
              <p>
                Due dates change; that's normal. A shift means accuracy, not error. Fetal measurements convert your cycle-based general estimate into due date adjustment. New information, baby's growth, natural variability nudge pregnancy toward its actual due date.
              </p>

              <h5 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider text-teal-800 pt-4">What If I Already Know My Due Date?</h5>
              <p>
                Knowing the date is the beginning, not the answer. Entering it into the Pregnancy Due Date Calculator stays helpful, generating a detailed pregnancy timeline with key milestones, symptoms, prenatal tests, reminders, and scheduled prenatal visits.
              </p>

              <h4 className="text-base font-bold text-slate-900 pt-4">Gestational Age at Delivery by Plurality</h4>
              <p>
                Forty weeks fits singleton pregnancies alone. Multiple gestations deliver earlier: twins 35 weeks, triplets 32 weeks, quadruplets 30 weeks, quintuplets 27 weeks. Plurality sets the average gestational age assigned, while the singleton reaches 39 weeks.
              </p>
            </div>
          </section>

          {/* Clinical FAQ Accordion Section */}
          <section className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Playfair_Display',serif]">
              Frequently Asked Clinical Questions
            </h2>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">How is the estimated due date calculated?</h5>
                <p className="text-xs text-slate-600">
                  Most tools apply Naegele's rule: add 280 days to your last menstrual period, assuming a 28-day cycle and ovulation around day fourteen. That fixed formula yields forty weeks of gestation.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">What if I don't know my last period / LMP date?</h5>
                <p className="text-xs text-slate-600">
                  Irregular or unknown? A dating ultrasound or clinical scan measures baby's length, yielding ultrasound gestational age. That becomes an accurate due date, established due date, or known conception date to estimate EDD and pregnancy timeline.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">How accurate is an estimated due date?</h5>
                <p className="text-xs text-slate-600">
                  Think helpful target, never fixed deadline. Only about four percent are born on the date. Most healthy pregnancies are delivered full-term, anywhere between 37 and 42 weeks, and that spread is completely normal.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">Can my due date change during pregnancy?</h5>
                <p className="text-xs text-slate-600">
                  Your calendar is a roadmap, not a contract. As your baby grows, ultrasound measurements and fresh clinical data let your provider track development and, when warranted, the estimate is adjusted.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">How many weeks pregnant am I today?</h5>
                <p className="text-xs text-slate-600">
                  The clinical standard, measured from last period, makes you two weeks pregnant before conception occurs. Gestational weeks precede the day of conception. Your doctor uses this timeline to set your prenatal appointment schedule for pregnancy.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">Can I find out the exact day I got pregnant?</h5>
                <p className="text-xs text-slate-600">
                  Rarely with certainty. Sperm can live up to five days, so the fertile window, not one exact day, is when you likely got pregnant. Conception timing varies, which is why it's estimated, never precisely calculated.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">What is conception date?</h5>
                <p className="text-xs text-slate-600">
                  It's the day sperm fertilized the egg — biologically when you actually became pregnant. Unlike the LMP-based estimate, it reflects the real fertilization event, though it usually can't be pinpointed to a single calendar day.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">How long after conception until pregnancy officially begins?</h5>
                <p className="text-xs text-slate-600">
                  Fertilization isn't the official start. The fertilized egg travels for roughly 6-12 days before it can implant in the uterine wall. Only after that implantation, clinically speaking, does pregnancy officially begin.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">How does ultrasound dating calculate a due date?</h5>
                <p className="text-xs text-slate-600">
                  It measures the embryo or fetus — crown-rump length early on — and converts that size into gestational age expressed in weeks and days, then projects forty weeks forward to estimate delivery.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">When should ultrasound dating be preferred over LMP?</h5>
                <p className="text-xs text-slate-600">
                  When a discrepancy between LMP dating and ultrasound exceeds recommended thresholds — often five to seven days in the first trimester — the ultrasound estimate should replace the period-based date for accuracy.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">How is EDD calculated for IVF/ART?</h5>
                <p className="text-xs text-slate-600">
                  With IVF, dating is unusually precise because the embryo's age is known. Providers add 266 days to egg retrieval for fresh transfers, or adjust by the embryo's age at transfer for frozen cycles.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="text-sm font-bold text-slate-900">Difference between gestational age and fetal (conceptional) age?</h5>
                <p className="text-xs text-slate-600">
                  Gestational age is counted from your last period; fetal age, also called conceptional age, starts at fertilization. Because ovulation follows menstruation by about two weeks, fetal age runs 2 weeks less than gestational age.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
