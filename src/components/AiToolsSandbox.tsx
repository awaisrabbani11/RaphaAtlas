import React, { useState } from 'react';
import { AI_TOOL_SPECS } from '../data/blueprintData';
import { AiToolSpec } from '../types';
import { 
  Calculator, Cpu, Sparkles, ShieldAlert, CheckCircle2, MessageSquare, 
  RefreshCw, Copy, Check, Activity, Moon, Heart, Stethoscope, Scale, ArrowRight 
} from 'lucide-react';

export const AiToolsSandbox: React.FC = () => {
  const [viewMode, setViewMode] = useState<'CALCULATORS' | 'AI_SUITE'>('CALCULATORS');
  const [activeCalc, setActiveCalc] = useState<'APOB' | 'VO2' | 'SLEEP' | 'PROTEIN'>('APOB');

  // --- APOB CALCULATOR STATE ---
  const [apobValue, setApobValue] = useState<number>(95);
  const [ldlValue, setLdlValue] = useState<number>(110);
  const [hscrpValue, setHscrpValue] = useState<number>(1.2);

  // --- VO2 MAX CALCULATOR STATE ---
  const [age, setAge] = useState<number>(35);
  const [restingHr, setRestingHr] = useState<number>(62);
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'athlete'>('intermediate');

  // --- SLEEP CALCULATOR STATE ---
  const [wakeTime, setWakeTime] = useState<string>('06:30');

  // --- PROTEIN & CALORIE CALCULATOR STATE ---
  const [weightLbs, setWeightLbs] = useState<number>(165);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [healthGoal, setHealthGoal] = useState<'longevity' | 'fat_loss' | 'hypertrophy'>('longevity');

  // --- AI SUITE STATE ---
  const [activeTool, setActiveTool] = useState<AiToolSpec>(AI_TOOL_SPECS[0]);
  const [userInput, setUserInput] = useState('');
  const [userContext, setUserContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Chat Mode State
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Welcome to RaphaAtlas AI. I can assist with decoding clinical biomarkers, creating sleep protocols, outlining exercise mobility prehab, or simplifying medical study abstracts.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const presetQueries: Record<string, string[]> = {
    jargon_simplifier: [
      'Serum ApoB is 128 mg/dL, hs-CRP is 2.4 mg/L, HbA1c is 5.7%. What does this mean?',
      'Spine MRI shows mild L4-L5 disc protrusion without neural foraminal stenosis.',
      'Lab result shows Thyroid Stimulating Hormone (TSH) at 4.8 mIU/L with normal Free T4.',
    ],
    symptom_contextualizer: [
      'Sharp right shoulder pain when pressing overhead into full extension.',
      'Midday brain fog, afternoon energy crash around 3 PM, and restless sleep.',
      'Mild tension headache after 8 hours of screen work with tight upper traps.',
    ],
    lifestyle_habit_planner: [
      'Night-shift worker waking up at 4 PM wanting to maximize deep sleep and energy.',
      'Desk worker wanting a 15-minute morning circadian routine for focus and fat loss.',
      'High-cortisol executive wanting an evening wind-down routine for better REM sleep.',
    ],
    workout_mobility_coach: [
      '15-minute thoracic spine & shoulder mobility routine before heavy ring dips.',
      'Calisthenics beginner progression for handstand pushups and dip strength.',
      'Lower back stiffness prehab routine using loaded hip hinges and psoas releases.',
    ],
  };

  const handleRunTool = async (customQuery?: string) => {
    const query = customQuery || userInput;
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setToolOutput(null);

    try {
      const response = await fetch('/api/ai/tool-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: activeTool.demoType,
          query,
          userContext,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate output.');
      }

      setToolOutput(data.answer);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while connecting to RaphaAtlas AI server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch reply.');
      }

      setChatMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Error: ${err.message || 'Unable to connect.'}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopy = () => {
    if (!toolOutput) return;
    navigator.clipboard.writeText(toolOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- APOB CALCULATION LOGIC ---
  const getApobRiskCategory = () => {
    if (apobValue < 60) return { category: 'Optimal (Optimal Longevity)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', percentile: '< 20th percentile' };
    if (apobValue <= 80) return { category: 'Low Risk (Primary Prevention Goal)', color: 'text-teal-700 bg-teal-50 border-teal-200', percentile: '20th - 40th percentile' };
    if (apobValue <= 100) return { category: 'Moderate Risk (Average Population)', color: 'text-amber-700 bg-amber-50 border-amber-200', percentile: '50th - 70th percentile' };
    return { category: 'Elevated Atherogenic Burden', color: 'text-rose-700 bg-rose-50 border-rose-200', percentile: '> 80th percentile' };
  };

  // --- VO2 MAX CALCULATION LOGIC ---
  const maxHr = 220 - age;
  const hrReserve = maxHr - restingHr;
  const zone2Min = Math.round(restingHr + hrReserve * 0.60);
  const zone2Max = Math.round(restingHr + hrReserve * 0.70);
  const zone5Min = Math.round(restingHr + hrReserve * 0.90);
  const estVo2Max = Math.round(15.3 * (maxHr / Math.max(restingHr, 40)));

  // --- SLEEP CALCULATION LOGIC ---
  const parseTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
  };
  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const wakeDate = parseTime(wakeTime);

  const morningSunDate = new Date(wakeDate.getTime() + 30 * 60000); // 30 min after wake
  const caffeineCutoffDate = new Date(wakeDate.getTime() + 8.5 * 3600000); // 8.5 hours after wake
  const eveningDimDate = new Date(wakeDate.getTime() + 14 * 3600000); // 14 hours after wake
  const sleepTime9Hrs = new Date(wakeDate.getTime() - 9 * 3600000); // 6 sleep cycles
  const sleepTime7Point5Hrs = new Date(wakeDate.getTime() - 7.5 * 3600000); // 5 sleep cycles

  // --- PROTEIN CALCULATION LOGIC ---
  const weightKg = weightLbs * 0.453592;
  const proteinMultiplier = healthGoal === 'hypertrophy' ? 1.0 : healthGoal === 'fat_loss' ? 0.9 : 0.8;
  const targetProteinGrams = Math.round(weightLbs * proteinMultiplier);
  const dailyCaloriesBase = Math.round(weightKg * 22 * (activityLevel === 'active' ? 1.55 : activityLevel === 'moderate' ? 1.35 : 1.2));

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <Calculator className="h-3.5 w-3.5 text-teal-600" />
            <span>CLINICAL HEALTH CALCULATORS & AI ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',serif] text-slate-900">
            Clinical Health Calculators & AI Suite
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Evidence-based tools for vascular biomarkers, VO2 max zones, circadian sleep windows, and Gemini AI analysis.
          </p>
        </div>

        {/* View Mode Switcher Buttons */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setViewMode('CALCULATORS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'CALCULATORS'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Interactive Calculators</span>
          </button>
          <button
            onClick={() => setViewMode('AI_SUITE')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'AI_SUITE'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-indigo-300" />
            <span>AI Clinical Suite</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* VIEW MODE 1: INTERACTIVE HEALTH CALCULATORS                           */}
      {/* ==================================================================== */}
      {viewMode === 'CALCULATORS' && (
        <div className="space-y-6">
          {/* Calculator Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'APOB', label: 'ApoB Lipid Risk Estimator', icon: Heart },
              { id: 'VO2', label: 'VO2 Max & Heart Rate Zones', icon: Activity },
              { id: 'SLEEP', label: 'Circadian Sleep Window Calculator', icon: Moon },
              { id: 'PROTEIN', label: 'Daily Macro & Protein Optimizer', icon: Scale },
            ].map((calc) => {
              const Icon = calc.icon;
              const isSelected = activeCalc === calc.id;
              return (
                <button
                  key={calc.id}
                  onClick={() => setActiveCalc(calc.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{calc.label}</span>
                </button>
              );
            })}
          </div>

          {/* CALCULATOR 1: APOB & LIPID CARDIOVASCULAR RISK ESTIMATOR */}
          {activeCalc === 'APOB' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-[11px] font-mono font-bold text-teal-800 uppercase tracking-wider">
                    Atherogenic Particle Count
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif] mt-1">
                    ApoB &amp; Cardiovascular Risk Estimator
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    ApoB measures the exact number of atherogenic lipoproteins (LDL, VLDL, IDL, Lp(a)) capable of trapping inside arterial walls.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <label>ApoB Concentration (mg/dL):</label>
                      <span className="font-mono text-teal-800 font-bold">{apobValue} mg/dL</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="180"
                      value={apobValue}
                      onChange={(e) => setApobValue(Number(e.target.value))}
                      className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <label>Serum LDL Cholesterol (mg/dL):</label>
                      <span className="font-mono text-slate-900 font-bold">{ldlValue} mg/dL</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="220"
                      value={ldlValue}
                      onChange={(e) => setLdlValue(Number(e.target.value))}
                      className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <label>hs-CRP Vascular Inflammation (mg/L):</label>
                      <span className="font-mono text-slate-900 font-bold">{hscrpValue} mg/L</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="5.0"
                      step="0.1"
                      value={hscrpValue}
                      onChange={(e) => setHscrpValue(Number(e.target.value))}
                      className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* ApoB Calculation Results Panel */}
              <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                      Clinical Category
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getApobRiskCategory().color}`}>
                      {getApobRiskCategory().category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-mono block uppercase">ApoB Percentile</span>
                      <span className="text-base font-bold text-slate-900">{getApobRiskCategory().percentile}</span>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-mono block uppercase">Inflammation Level</span>
                      <span className="text-base font-bold text-slate-900">
                        {hscrpValue < 1.0 ? 'Low Risk (<1.0)' : hscrpValue <= 3.0 ? 'Moderate (1.0-3.0)' : 'High (>3.0)'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-slate-900 block">Evidence-Based Clinical Guidance:</span>
                    <p className="text-slate-600 leading-relaxed">
                      {apobValue < 60
                        ? 'Optimal physiological range for prevention of atherosclerotic plaque progression. Maintain current dietary and exercise regimen.'
                        : apobValue <= 80
                        ? 'Meets standard cardiovascular prevention targets. Consider optimizing dietary saturated fat to lower particle density further.'
                        : apobValue <= 100
                        ? 'Average risk profile. Vascular endothelial plaque trapping can occur over decades. Discuss lipid-lowering lifestyle or pharmacology with your physician.'
                        : 'Elevated particle concentration. Sub-endothelial lipid retention risk is heightened. Consult a cardiologist for comprehensive lipid panel and CIMT scan evaluation.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 font-mono">
                  Calculated based on European Society of Cardiology &amp; AHA Clinical Biomarker Guidelines.
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 2: VO2 MAX & HEART RATE ZONE CALCULATOR */}
          {activeCalc === 'VO2' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-[11px] font-mono font-bold text-teal-800 uppercase tracking-wider">
                    Aerobic Capacity &amp; Endurance
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif] mt-1">
                    VO2 Max &amp; Heart Rate Zone Calculator
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Zone 2 aerobic exercise stimulates mitochondrial density and stroke volume, predicting long-term all-cause mortality prevention.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <label>Current Age (Years):</label>
                      <span className="font-mono text-slate-900 font-bold">{age} yrs</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="85"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <label>Resting Heart Rate (BPM):</label>
                      <span className="font-mono text-teal-800 font-bold">{restingHr} BPM</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={restingHr}
                      onChange={(e) => setRestingHr(Number(e.target.value))}
                      className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* VO2 Calculation Results Panel */}
              <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Cardiorespiratory Metrics
                  </span>
                  <span className="px-3 py-1 bg-teal-50 text-teal-800 font-bold rounded-full text-xs border border-teal-200">
                    Est. VO2 Max: {estVo2Max} mL/kg/min
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] text-emerald-800 font-mono block font-bold uppercase">
                      Zone 2 Heart Rate Target
                    </span>
                    <span className="text-xl font-bold text-emerald-950">
                      {zone2Min} - {zone2Max} <span className="text-xs font-normal">BPM</span>
                    </span>
                    <p className="text-[11px] text-emerald-800 leading-tight pt-1">
                      Mitochondrial stroke volume &amp; fat oxidation ceiling.
                    </p>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
                    <span className="text-[10px] text-rose-800 font-mono block font-bold uppercase">
                      Zone 5 Peak Aerobic
                    </span>
                    <span className="text-xl font-bold text-rose-950">
                      {zone5Min} - {maxHr} <span className="text-xs font-normal">BPM</span>
                    </span>
                    <p className="text-[11px] text-rose-800 leading-tight pt-1">
                      Maximal lactate threshold &amp; VO2 max expansion.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">Training Prescription:</span>
                  <p className="text-slate-600">
                    Perform 150-180 minutes per week in <strong>Zone 2 ({zone2Min}-{zone2Max} BPM)</strong> split across 3-4 sessions, plus 1 session of Zone 5 high-intensity intervals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 3: CIRCADIAN SLEEP WINDOW CALCULATOR */}
          {activeCalc === 'SLEEP' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-[11px] font-mono font-bold text-teal-800 uppercase tracking-wider">
                    Sleep Architecture &amp; Light
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif] mt-1">
                    Circadian Sleep &amp; Light Exposure Calculator
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Timely morning photons reset Suprachiasmatic Nucleus (SCN) circadian clocks and optimize nocturnal melatonin secretion.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Wake-Up Time:
                    </label>
                    <input
                      type="time"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Sleep Calculation Results Panel */}
              <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
                    Circadian Protocol Timeline
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Morning Sunlight Window</span>
                      <span className="text-slate-500 text-[11px]">View 10k lux photons outdoor</span>
                    </div>
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {formatTime(wakeDate)} - {formatTime(morningSunDate)}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Caffeine Cutoff Time</span>
                      <span className="text-slate-500 text-[11px]">Protect adenosine receptor binding</span>
                    </div>
                    <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      {formatTime(caffeineCutoffDate)}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Evening Light Dimming</span>
                      <span className="text-slate-500 text-[11px]">Dim overhead LED lights</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {formatTime(eveningDimDate)}
                    </span>
                  </div>

                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-teal-950 block">Ideal Bedtime (5-6 Sleep Cycles)</span>
                      <span className="text-teal-800 text-[11px]">7.5 to 9 hours of restorative REM/Deep</span>
                    </div>
                    <span className="font-mono font-bold text-teal-900 bg-white px-2.5 py-1 rounded-lg border border-teal-200">
                      {formatTime(sleepTime9Hrs)} - {formatTime(sleepTime7Point5Hrs)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 4: DAILY MACRO & PROTEIN OPTIMIZER */}
          {activeCalc === 'PROTEIN' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-[11px] font-mono font-bold text-teal-800 uppercase tracking-wider">
                    Sarcopenia Prevention &amp; Muscle Mass
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif] mt-1">
                    Daily Macro &amp; Protein Intake Optimizer
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Adequate essential amino acids (leucine threshold 3g/meal) preserve lean skeletal muscle tissue and metabolic independence with aging.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <label>Body Weight (lbs):</label>
                      <span className="font-mono text-teal-800 font-bold">{weightLbs} lbs</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="300"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Number(e.target.value))}
                      className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Goal Profile:</label>
                      <select
                        value={healthGoal}
                        onChange={(e) => setHealthGoal(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                      >
                        <option value="longevity">Longevity &amp; Sarcopenia</option>
                        <option value="fat_loss">Fat Loss Preservation</option>
                        <option value="hypertrophy">Muscle Hypertrophy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Activity Level:</label>
                      <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                      >
                        <option value="sedentary">Desk Work / Sedentary</option>
                        <option value="moderate">3-4 Workouts/Week</option>
                        <option value="active">High Daily Activity</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Protein Calculation Results Panel */}
              <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Target Macro Distribution
                  </span>
                  <span className="px-3 py-1 bg-teal-50 text-teal-800 font-bold rounded-full text-xs border border-teal-200">
                    Est. Caloric Target: {dailyCaloriesBase} kcal/day
                  </span>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-slate-700">Recommended Daily Protein:</span>
                    <span className="text-2xl font-bold font-mono text-teal-800">
                      {targetProteinGrams} <span className="text-xs font-normal text-slate-500">grams/day</span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Per Meal Target (3 meals/day):</span>
                      <span className="font-bold text-slate-900">{Math.round(targetProteinGrams / 3)}g / meal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Leucine Trigger Threshold:</span>
                      <span className="font-bold text-teal-700">2.8 - 3.5g Leucine/meal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* VIEW MODE 2: AI CLINICAL SUITE & GEMINI DECODER                       */}
      {/* ==================================================================== */}
      {viewMode === 'AI_SUITE' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-bold text-slate-900">Gemini 3.6 Multimodal Clinical AI Suite</span>
            </div>

            <button
              onClick={() => setChatMode(!chatMode)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                chatMode
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{chatMode ? 'Switch to Focused AI Tools' : 'Open Conversational Chat'}</span>
            </button>
          </div>

          {chatMode ? (
            /* CHAT MODE */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span>RaphaAtlas Intelligence Suite Chat</span>
                </h3>
                <span className="text-[11px] font-mono font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Powered by Gemini 3.6 Flash
                </span>
              </div>

              <div className="space-y-3 h-96 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200/80 scrollbar-thin">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-teal-700 text-white font-medium rounded-br-xs shadow-2xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-600 p-3.5 rounded-2xl text-xs flex items-center gap-2 border border-slate-200 shadow-2xs">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-600" />
                      <span>RaphaAtlas AI is interpreting medical context...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Ask anything about blood markers, sleep timing, or fitness prehab..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 font-sans shadow-2xs"
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors shadow-2xs"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            /* INDIVIDUAL AI TOOLS MODE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tool Selection List */}
              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
                  Select AI Utility
                </span>

                {AI_TOOL_SPECS.map((tool) => {
                  const isSelected = activeTool.id === tool.id;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool);
                        setUserInput('');
                        setToolOutput(null);
                        setErrorMsg(null);
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-white border-2 border-indigo-600 shadow-sm'
                          : 'bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {tool.pillar}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Safety: {tool.medicalSafetyLevel}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{tool.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{tool.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Tool Execution Panel */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">{activeTool.name}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{activeTool.description}</p>
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Preset Test Queries:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {presetQueries[activeTool.demoType]?.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUserInput(preset);
                          handleRunTool(preset);
                        }}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs transition-all text-left truncate max-w-xs"
                      >
                        "{preset}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Query or Clinical Data:
                    </label>
                    <textarea
                      rows={3}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter laboratory markers, symptoms, exercise goals, or sleep parameters..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      User Context (Optional):
                    </label>
                    <input
                      type="text"
                      value={userContext}
                      onChange={(e) => setUserContext(e.target.value)}
                      placeholder="e.g. 35yo male, desk job, beginner fitness level"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600"
                    />
                  </div>

                  <button
                    onClick={() => handleRunTool()}
                    disabled={isLoading || !userInput.trim()}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Processing with Gemini AI Engine...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-indigo-200" />
                        <span>Generate Clinical Analysis</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                    {errorMsg}
                  </div>
                )}

                {/* Tool Output Result */}
                {toolOutput && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-teal-200 space-y-4 text-xs relative shadow-2xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="font-semibold text-teal-800 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-teal-600" />
                        <span>RaphaAtlas AI Output Analysis</span>
                      </span>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] border border-slate-200"
                      >
                        {copied ? <Check className="h-3 w-3 text-teal-600" /> : <Copy className="h-3 w-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm">
                      {toolOutput}
                    </div>

                    {/* Medical Safety Disclaimer Footer */}
                    <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                      <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Educational Disclaimer:</strong> RaphaAtlas AI utilities provide general educational insights and contextual guidance only. They do not constitute formal medical diagnosis or treatment plans. Always consult a licensed medical professional.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
