import React, { useState, useEffect } from 'react';
import { ArrowLeft, HeartPulse, AlertTriangle, Clock, Activity, Scale } from 'lucide-react';
import { ContributorsSection } from './ContributorsSection';

interface BacCalculatorViewProps {
  onBackToCalculators?: () => void;
}

export const BacCalculatorView: React.FC<BacCalculatorViewProps> = ({ onBackToCalculators }) => {
  // --- CALCULATOR STATE ---
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(70);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');

  // Drink counts
  const [beerCount, setBeerCount] = useState<number>(0);
  const [wineCount, setWineCount] = useState<number>(0);
  const [shotCount, setShotCount] = useState<number>(0);

  // Custom drink
  const [customVol, setCustomVol] = useState<number>(0);
  const [customAbv, setCustomAbv] = useState<number>(0);
  const [customCount, setCustomCount] = useState<number>(0);

  // Context
  const [hours, setHours] = useState<number>(1);
  const [stomachFactor, setStomachFactor] = useState<number>(1); // 1 = Empty, 0.92 = Light meal, 0.85 = Full
  const [legalLimit, setLegalLimit] = useState<number>(0.08);

  // --- CONSTANTS & CALCULATION ---
  const DENSITY = 0.789; // g/ml
  const BETA = 0.015; // % BAC reduction per hour
  const R = { male: 0.68, female: 0.55 };
  const STD = 14; // grams per US standard drink

  // Calculate total grams of alcohol
  const gramsBeer = beerCount * 355 * (5 / 100) * DENSITY;
  const gramsWine = wineCount * 148 * (12 / 100) * DENSITY;
  const gramsShot = shotCount * 44 * (40 / 100) * DENSITY;
  const gramsCustom = customCount * customVol * (customAbv / 100) * DENSITY;

  const rawGrams = gramsBeer + gramsWine + gramsShot + gramsCustom;
  const absorbedGrams = rawGrams * stomachFactor;

  const weightKg = weightUnit === 'lb' ? weight * 0.453592 : weight;
  const weightGrams = weightKg * 1000;

  let bac = 0;
  if (weightGrams > 0) {
    bac = Math.max(0, (absorbedGrams / (R[sex] * weightGrams)) * 100 - BETA * hours);
  }

  // Format time helper
  const fmtTime = (h: number): string => {
    if (h <= 0) return '0 min';
    let H = Math.floor(h);
    let M = Math.round((h - H) * 60);
    if (M === 60) {
      H++;
      M = 0;
    }
    return (H ? `${H}h ` : '') + (M ? `${M}m` : H ? '' : '0m') || '0m';
  };

  // Stage details
  const getStage = (b: number): [string, string] => {
    if (b <= 0) return ['No alcohol detected', 'Add your drinks above to see an estimate.'];
    if (b < 0.03) return ['Minimal', 'Little obvious impairment; subtle effects only.'];
    if (b < 0.06) return ['Mild', 'Relaxed and less inhibited; focus and coordination dip slightly.'];
    if (b < 0.10) return ['Impaired', 'Judgment, reasoning and depth perception affected; reaction time slows.'];
    if (b < 0.20) return ['Heavily impaired', 'Slurred speech and poor motor control; nausea possible.'];
    if (b < 0.30) return ['Severe', 'Disorientation and vomiting likely; risk of memory blackout.'];
    if (b < 0.40) return ['Dangerous', 'Stupor; possible loss of consciousness. Seek help.'];
    return ['Life-threatening', 'Risk of coma or death. Call emergency services.'];
  };

  const [stageTitle, stageDesc] = getStage(bac);

  // Meter fill color
  const getZoneColor = (b: number): string => {
    if (b < 0.03) return '#1a9e5f'; // Green
    if (b < 0.08) return '#d99100'; // Amber
    if (b < 0.20) return '#d23b2f'; // Red
    return '#7c1a12'; // Critical dark red
  };

  const meterColor = getZoneColor(bac);
  const meterPct = Math.min(bac / 0.30, 1) * 100;
  const limitMarkPct = Math.min(legalLimit / 0.30, 1) * 100;

  // Time metrics
  const timeToLegal = bac <= legalLimit ? 'Under now' : fmtTime((bac - legalLimit) / BETA);
  const timeToSober = bac <= 0 ? '—' : fmtTime(bac / BETA);
  const stdDrinks = (rawGrams / STD).toFixed(1);
  const gramsFormatted = `${Math.round(rawGrams)} g`;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto font-sans">
      {/* Top Title & Omni Calculator Style Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl border border-teal-100 shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Blood Alcohol Concentration (BAC) Calculator
            </h1>
            <p className="text-xs text-slate-500">
              Widmark Equation Metabolism Engine &amp; Legal Threshold Tracker
            </p>
          </div>
        </div>

        {onBackToCalculators && (
          <button
            onClick={onBackToCalculators}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Calculators</span>
          </button>
        )}
      </div>

      {/* Medical Contributors Section */}
      <ContributorsSection />

      {/* Main Embed Widget Container */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="ra-bac" id="raBac" role="group" aria-label="Blood Alcohol Concentration Calculator">
          <style>{`
            .ra-bac {
              --ra-bg: #ffffff;
              --ra-surface: #f7f8f9;
              --ra-ink: #14181d;
              --ra-muted: #5b6672;
              --ra-line: #e2e6ea;
              --ra-accent: #0f766e;
              --ra-green: #1a9e5f;
              --ra-amber: #d99100;
              --ra-red: #d23b2f;
              --ra-crit: #7c1a12;
              --ra-radius: 12px;
              --ra-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

              all: unset;
              display: block;
              box-sizing: border-box;
              font-family: var(--ra-font);
              color: var(--ra-ink);
              background: var(--ra-bg);
              border: 1px solid var(--ra-line);
              border-radius: var(--ra-radius);
              padding: 24px;
              max-width: 640px;
              margin: 0 auto;
              line-height: 1.45;
            }
            .ra-bac * { box-sizing: border-box; }
            .ra-bac h2 { font-size: 1.35rem; margin: 0 0 4px; font-weight: 700; letter-spacing: -.01em; color: #0f172a; }
            .ra-bac .ra-sub { font-size: .85rem; color: var(--ra-muted); margin: 0 0 20px; }
            .ra-bac fieldset { border: 0; margin: 0 0 16px; padding: 0; }
            .ra-bac legend { font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--ra-muted); font-weight: 700; padding: 0; margin-bottom: 8px; }
            .ra-bac label { font-size: .8rem; color: var(--ra-muted); display: block; margin-bottom: 4px; font-weight: 500; }

            .ra-bac .ra-row { display: flex; gap: 10px; flex-wrap: wrap; }
            .ra-bac .ra-row > div { flex: 1; min-width: 120px; }

            .ra-bac .ra-seg { display: inline-flex; border: 1px solid var(--ra-line); border-radius: 8px; overflow: hidden; background: var(--ra-surface); }
            .ra-bac .ra-seg button { all: unset; cursor: pointer; padding: 8px 16px; font-size: .85rem; color: var(--ra-muted); text-align: center; font-weight: 600; transition: all 0.15s ease; }
            .ra-bac .ra-seg button[aria-pressed="true"] { background: var(--ra-accent); color: #fff; font-weight: 700; }

            .ra-bac input, .ra-bac select {
              width: 100%; font: inherit; font-size: .92rem; color: var(--ra-ink);
              background: var(--ra-bg); border: 1px solid var(--ra-line); border-radius: 8px;
              padding: 9px 10px; -moz-appearance: textfield;
            }
            .ra-bac input:focus, .ra-bac select:focus { outline: 2px solid var(--ra-accent); outline-offset: 1px; border-color: var(--ra-accent); }

            .ra-bac .ra-drink { display: flex; align-items: center; justify-between; gap: 10px; background: var(--ra-surface); border: 1px solid var(--ra-line); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
            .ra-bac .ra-drink .ra-d-name { font-size: .88rem; font-weight: 700; color: #0f172a; }
            .ra-bac .ra-drink .ra-d-meta { font-size: .74rem; color: var(--ra-muted); }
            .ra-bac .ra-step { display: flex; align-items: center; gap: 8px; }
            .ra-bac .ra-step button { all: unset; cursor: pointer; width: 32px; height: 32px; line-height: 32px; text-align: center; border: 1px solid var(--ra-line); border-radius: 8px; font-size: 1.1rem; font-weight: 700; color: var(--ra-ink); background: var(--ra-bg); user-select: none; transition: all 0.15s ease; }
            .ra-bac .ra-step button:hover { border-color: var(--ra-accent); color: var(--ra-accent); background: #f0fdfa; }
            .ra-bac .ra-step .ra-count { min-width: 24px; text-align: center; font-variant-numeric: tabular-nums; font-weight: 800; font-size: 0.95rem; }

            .ra-bac .ra-custom { display: flex; gap: 8px; align-items: end; flex-wrap: wrap; margin-top: 4px; background: var(--ra-surface); border: 1px solid var(--ra-line); border-radius: 10px; padding: 10px 12px; }
            .ra-bac .ra-custom > div { flex: 1; min-width: 80px; }

            .ra-bac .ra-out { margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--ra-line); }
            .ra-bac .ra-bac-num { font-size: 3.2rem; font-weight: 900; line-height: 1; font-variant-numeric: tabular-nums; letter-spacing: -.03em; color: #0f172a; }
            .ra-bac .ra-bac-unit { font-size: 1.1rem; font-weight: 700; color: var(--ra-muted); margin-left: 6px; }
            .ra-bac .ra-stage { font-size: 1rem; font-weight: 700; margin: 6px 0 2px; color: #0f172a; }
            .ra-bac .ra-stage-desc { font-size: .84rem; color: var(--ra-muted); margin: 0; }

            .ra-bac .ra-meter { position: relative; height: 18px; border-radius: 10px; background: var(--ra-surface); margin: 20px 0 6px; overflow: hidden; border: 1px solid var(--ra-line); }
            .ra-bac .ra-meter-fill { position: absolute; left: 0; top: 0; bottom: 0; transition: width .25s ease, background .25s ease; border-radius: 10px; }
            .ra-bac .ra-meter-mark { position: absolute; top: -4px; bottom: -4px; width: 2px; background: var(--ra-ink); z-index: 10; }
            .ra-bac .ra-meter-mark::after { content: attr(data-label); position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: .65rem; white-space: nowrap; color: var(--ra-ink); font-weight: 800; background: #ffffff; padding: 1px 4px; border-radius: 4px; border: 1px solid var(--ra-line); }
            .ra-bac .ra-scale { display: flex; justify-between; font-size: .65rem; color: var(--ra-muted); font-variant-numeric: tabular-nums; font-weight: 600; }

            .ra-bac .ra-verdict { font-size: .92rem; font-weight: 800; margin: 16px 0 14px; padding: 12px; border-radius: 10px; text-align: center; }

            .ra-bac .ra-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .ra-bac .ra-stat { background: var(--ra-surface); border: 1px solid var(--ra-line); border-radius: 10px; padding: 12px; }
            .ra-bac .ra-stat .ra-k { font-size: .7rem; text-transform: uppercase; letter-spacing: .06em; color: var(--ra-muted); font-weight: 700; }
            .ra-bac .ra-stat .ra-v { font-size: 1.1rem; font-weight: 800; font-variant-numeric: tabular-nums; margin-top: 3px; color: #0f172a; }

            .ra-bac .ra-note { font-size: .75rem; color: var(--ra-muted); margin-top: 16px; padding: 12px; background: var(--ra-surface); border-radius: 10px; border: 1px solid var(--ra-line); line-height: 1.5; }
            .ra-bac .ra-note strong { color: var(--ra-red); }

            @media (max-width:420px){ .ra-bac .ra-bac-num { font-size: 2.5rem; } }
          `}</style>

          <h2>Blood Alcohol Concentration Calculator</h2>
          <p className="ra-sub">Estimate your BAC, time to the legal limit, and time to sober — updates as you type.</p>

          <fieldset>
            <legend>Biological sex</legend>
            <div className="ra-seg" role="group" aria-label="Sex">
              <button
                type="button"
                aria-pressed={sex === 'male'}
                onClick={() => setSex('male')}
              >
                Male
              </button>
              <button
                type="button"
                aria-pressed={sex === 'female'}
                onClick={() => setSex('female')}
              >
                Female
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend>Body weight</legend>
            <div className="ra-row">
              <div>
                <label htmlFor="raW">Weight</label>
                <input
                  id="raW"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label htmlFor="raWU">Unit</label>
                <select
                  id="raWU"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}
                >
                  <option value="kg">Kilograms</option>
                  <option value="lb">Pounds</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Drinks consumed</legend>
            <div className="ra-drink">
              <div>
                <div className="ra-d-name">Beer</div>
                <div className="ra-d-meta">12 oz (355 ml) · 5% ABV</div>
              </div>
              <div className="ra-step">
                <button type="button" onClick={() => setBeerCount((c) => Math.max(0, c - 1))}>–</button>
                <span className="ra-count">{beerCount}</span>
                <button type="button" onClick={() => setBeerCount((c) => c + 1)}>+</button>
              </div>
            </div>

            <div className="ra-drink">
              <div>
                <div className="ra-d-name">Wine</div>
                <div className="ra-d-meta">5 oz (148 ml) · 12% ABV</div>
              </div>
              <div className="ra-step">
                <button type="button" onClick={() => setWineCount((c) => Math.max(0, c - 1))}>–</button>
                <span className="ra-count">{wineCount}</span>
                <button type="button" onClick={() => setWineCount((c) => c + 1)}>+</button>
              </div>
            </div>

            <div className="ra-drink">
              <div>
                <div className="ra-d-name">Shot / spirit</div>
                <div className="ra-d-meta">1.5 oz (44 ml) · 40% ABV</div>
              </div>
              <div className="ra-step">
                <button type="button" onClick={() => setShotCount((c) => Math.max(0, c - 1))}>–</button>
                <span className="ra-count">{shotCount}</span>
                <button type="button" onClick={() => setShotCount((c) => c + 1)}>+</button>
              </div>
            </div>

            <div className="ra-custom" aria-label="Custom drink">
              <div>
                <label htmlFor="raCV">Custom vol (ml)</label>
                <input
                  id="raCV"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="10"
                  value={customVol || ''}
                  onChange={(e) => setCustomVol(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label htmlFor="raCA">ABV %</label>
                <input
                  id="raCA"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.5"
                  value={customAbv || ''}
                  onChange={(e) => setCustomAbv(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label htmlFor="raCC">Qty</label>
                <input
                  id="raCC"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={customCount || ''}
                  onChange={(e) => setCustomCount(parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Context</legend>
            <div className="ra-row">
              <div>
                <label htmlFor="raT">Hours since first drink</label>
                <input
                  id="raT"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.25"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label htmlFor="raS">Stomach</label>
                <select
                  id="raS"
                  value={stomachFactor}
                  onChange={(e) => setStomachFactor(parseFloat(e.target.value))}
                >
                  <option value={1}>Empty</option>
                  <option value={0.92}>Light meal</option>
                  <option value={0.85}>Full</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label htmlFor="raL">Legal driving limit</label>
              <select
                id="raL"
                value={legalLimit}
                onChange={(e) => setLegalLimit(parseFloat(e.target.value))}
              >
                <option value={0.08}>0.08% — US, Canada, England &amp; Wales</option>
                <option value={0.05}>0.05% — Scotland, most of Europe, Australia, Utah</option>
                <option value={0.03}>0.03% — India, Japan</option>
                <option value={0.02}>0.02% — Sweden, Poland, Norway</option>
                <option value={0.00}>0.00% — Zero tolerance</option>
              </select>
            </div>
          </fieldset>

          <div className="ra-out" aria-live="polite">
            <div>
              <span className="ra-bac-num" id="raNum">{bac.toFixed(3)}</span>
              <span className="ra-bac-unit">% BAC</span>
            </div>
            <div className="ra-stage" id="raStage">{stageTitle}</div>
            <p className="ra-stage-desc" id="raDesc">{stageDesc}</p>

            <div className="ra-meter" aria-hidden="true">
              <div className="ra-meter-fill" style={{ width: `${meterPct}%`, backgroundColor: meterColor }} />
              {legalLimit > 0 && (
                <div
                  className="ra-meter-mark"
                  style={{ left: `${limitMarkPct}%` }}
                  data-label={legalLimit.toFixed(2)}
                />
              )}
            </div>
            <div className="ra-scale">
              <span>0</span>
              <span>0.10</span>
              <span>0.20</span>
              <span>0.30+</span>
            </div>

            <div
              className="ra-verdict"
              style={{
                backgroundColor: bac <= 0 ? 'var(--ra-surface)' : bac <= legalLimit ? 'var(--ra-green)' : 'var(--ra-red)',
                color: bac <= 0 ? 'var(--ra-ink)' : '#ffffff',
              }}
            >
              {bac <= 0
                ? 'Enter your details'
                : bac <= legalLimit
                ? `Under the ${legalLimit.toFixed(2)}% limit — but likely still impaired`
                : `OVER the ${legalLimit.toFixed(2)}% limit — do not drive`}
            </div>

            <div className="ra-stats">
              <div className="ra-stat">
                <div className="ra-k">Time to legal limit</div>
                <div className="ra-v">{timeToLegal}</div>
              </div>
              <div className="ra-stat">
                <div className="ra-k">Time to sober (0.00)</div>
                <div className="ra-v">{timeToSober}</div>
              </div>
              <div className="ra-stat">
                <div className="ra-k">Standard drinks</div>
                <div className="ra-v">{stdDrinks}</div>
              </div>
              <div className="ra-stat">
                <div className="ra-k">Pure alcohol</div>
                <div className="ra-v">{gramsFormatted}</div>
              </div>
            </div>

            <p className="ra-note">
              <strong>Estimate only — never use this to decide whether to drive.</strong> Real BAC varies with genetics, hydration, medication, drinking pace and food. Impairment happens below every legal limit. If you've been drinking, don't drive.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Caution Notice below tool */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 leading-relaxed flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          Caution: This tool is provided solely for educational and learning purposes. It is not intended as medical, legal, or professional advice.
        </span>
      </div>

      {/* Comprehensive Educational Article Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-8 text-slate-800 leading-relaxed font-sans">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            BAC Calculator: Know Before You Drive
          </h2>
          <h3 className="text-lg font-semibold text-slate-600 mt-1">
            Blood Alcohol Concentration (BAC) Calculator &amp; Widmark Engine Guide
          </h3>
        </div>

        {/* Feature Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80"
            alt="Blood Alcohol Concentration metabolism and safety awareness guide"
            className="w-full h-64 sm:h-80 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Widmark Formula &amp; Alcohol Metabolism Clinical Guide</span>
            <span className="font-semibold text-teal-700">RaphaAtlas Health Engine</span>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            Most drivers assume a BAC readout confirms they are fit to drive. It never does. This educational tool delivers a rough calculation, an approximate estimate of blood alcohol content — not permission to start driving home.
          </p>
          <p>
            Behind every percentage sits an algorithm built on population averages. Feed it your current weight, biological sex, and time since first drink, and it will predict roughly how much alcohol currently floats in your bloodstream.
          </p>
          <p>
            Gender matters more than bravado here. A male and female of identical body weight reach different intoxication levels from the same standard drinks, because body water distribution shifts how alcohol by volume ultimately disperses internally.
          </p>
          <p>
            The legal limit of 0.08% dominates conversation in the United States, yet penalties begin far lower. Under 21, zero tolerance applies; some states enforce 0.01%. The legal drinking age and thresholds vary by state constantly.
          </p>
          <p>
            Your body metabolizes at a fixed rate; coffee, cold showers, and water will not sober up anyone faster. Only time alone returns BAC to zero. Use this to plan a taxi, never to justify driving.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Alcohol And Health</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Forget the red wine myth. The supposed health benefits of moderation shrink sharply under scrutiny, while long-term effects — liver disease, cardiovascular disease, several cancers — stack quietly across many years of even moderate drinkers daily routines.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Short-term effects arrive faster: dehydration, blunted metabolism, and impaired mental health within a single night. The brain registers alcohol as a depressant, not a stimulant, despite how light drinkers describe that first inviting loosening glass.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Heavy drinking carries defined thresholds. Mayo Clinic flags three drinks a day or 14 drinks a week for men younger than 65. Cross that line and high blood pressure, stroke, and heart failure risks climb.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Excessive drinking damages the organ people forget: the heart. Heart muscle damage, heart disease, and sudden death trace directly back to heavy alcohol use. Even diabetes and ischemic stroke correlate with sustained alcohol consumption patterns.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Guidelines split by women and men over 65, whose elimination rate slows. Before trusting any 1 drink per day allowance, consult a doctor. No health benefits offset the accidental injury, brain damage, and death risk.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Effects By Blood Alcohol Concentration</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            You cannot feel your BAC accurately. At 0.001–0.029 a drinker appears normal, showing only subtle effects detectable through special tests. Confidence rises long before real impairment does — which is why early drinking feels genuinely deceptive.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            By 0.060–0.099, reasoning and depth perception erode. 0.100–0.199 brings slurred speech, staggering, and nausea. The friendly euphoria of 0.030–0.059 — that mild euphoria, relaxation, talkativeness, and decreased inhibition — has already quietly begun reversing its course entirely.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Beyond 0.200–0.299, dangerous stupor sets in — loss of consciousness, vomiting, memory blackout. At 0.300–0.399 comes coma and genuine possibility of death. Past 0.400–0.500, respiratory arrest and central nervous system depression turn frequently fatal without help.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The mid-zone genuinely deserves respect. 0.100–0.199 wrecks motor coordination, balance, and vision, while triggering violent emotional swings — anger, sadness, over-expression. Reaction time and gross motor control collapse, yet many still insist they feel in control.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            0.05% carries reduced coordination and lowered alertness; 0.02% already dulls divided attention and visual functions. These are not moral failings but measurable degree of impairment, mapped precisely across nearly every BAC chart researchers regularly publish.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">What Is One Standard Drink?</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            A &quot;drink&quot; is a marketing word, not a measurement. One standard drink means 14 grams of pure alcohol — roughly 0.6 fluid ounces — regardless of whether it arrives as beer, wine, or spirits in your glass.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The equivalence surprises people. 12 fl oz regular beer at 5% alcohol, 5 fl oz table wine near 12% alcohol, 1.5 fl oz distilled spirits at 40% alcohol deliver the same amount of alcohol identically.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            This is why standard drinks matter for any BAC estimate. A tall pint of 8-9 fl oz malt liquor can hide nearly two servings, quietly outpacing the one standard drink per hour your liver metabolized.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your body needs roughly one hour to process each unit. NIAAA sets the recommended weekly limit at 14 for male, 7 for female. Exceeding it consistently is where the % ABV on labels stops being trivia.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Regional measures muddy things. A can holds 12 oz (341 mL); a standard shot pours 1.5 oz (43 mL). Knowing ounces per drink beats guessing, because identical volume rarely means identical alcohol content across bottles.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Drive Limits (BAC)</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Most drivers assume falling below the legal limit means safe roads. Wrong. Impaired driving prevention starts far beneath 0.08. Across the US, that standard legal BAC hides how badly reflexes and decision-making quietly collapse first.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your license type, age, and jurisdiction rewrite the rulebook. A fully licenced driver faces 0.08, yet a 21 years or under motorist meets zero tolerance. Utah dropped its legal BAC limit to 0.05, breaking rank.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Canada runs a warn range between 0.05-0.079, triggering immediate driver&apos;s licence suspension under the Highway Traffic Act. Ontario sets harsher rules for G1, G2, M1, M2 licence holders. Australia and many countries sit nearer 0.05%.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Cross into 0.08 or more and penalties turn administrative into a criminal offence. Expect an enhanced penalty, and for repeat offenders or underage non-legal drinkers, escalating consequences. The DWAI limit near .05 traps sober drivers.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Wikipedia logs how the 0.05% and 0.08% split fractures across Alabama, California, New York, Texas. Every jurisdiction and circumstance shifts the threshold, so treating one number as universal safe ground is exactly how licences vanish.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Widmark Formula</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Treat the Widmark Equation as gospel and you&apos;ll misjudge yourself badly. Every Widmark&apos;s formula output is a generalized mathematical model, not a verdict. It converts your dose in grams into an estimate, never a certainty.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Classic Widmark divides A, your liquid ounces of alcohol, by W weight in pounds multiplied by r, the distribution ratio or sex constant. Then subtract .015 x H, where H counts hours since first drink.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            That r splits by sex: r(male)=.68 against r(female)=.55. Older tables list .73 for men and .66 for women. These distribution ratio constants exist because a volume of blood genuinely differs, not because arithmetic favours anyone.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your body burns alcohol at a constant rate, roughly -0.016 BAC per hour, some models cite 0.017% per hour. That metabolism rate, tagged mr, means t, elapsed hours, steadily trims your %BAC toward absolute zero.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Because it runs on user-provided information, the simplified version stays only as honest as your inputs. Convert body weight in grams or kilograms, respect total weight, and remember: A x 5.14 models one clean scenario.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Additional Factors</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Weight gets the credit, but it&apos;s the least interesting variable. A 25-year-old in good health and an identical-weight peer with hidden health issues process alcohol differently. Genetics and liver function quietly dominate the final outcome.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            An empty stomach betrays you fastest. The type of food eaten and sheer amount of food slow absorption; non-alcoholic beverages and steady hydration buy time. Timing of consumption matters more than most drinkers ever concede.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Body composition outranks the bathroom scale. Higher body fat holds less water, spiking concentration; leaner body size and better fitness level blunt it. Two people, same age, wildly different absorption curves from raw genetics alone.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Stack drugs or medications onto alcohol and your metabolism rewrites its own rules. A long history of alcohol consumption shifts tolerance; drink strength and serving size decide dose. Fatigue silently amplifies every single measurable effect.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Elimination isn&apos;t fixed. Textbooks quote 0.015 mg/100 mL/hour, yet real bodies swing between 0.01 and 0.025. Your rate varies with health, sipping speed, and overall condition; no single clean number survives contact with raw biology.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Understanding BAC</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Blood alcohol concentration isn&apos;t about how much you drank; it&apos;s about pace. Two key factors rule everything: how much alcohol enters the amount of alcohol in bloodstream, and how quickly consumed that intake actually was.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Pour more standard drinks into a shorter period of time and you manufacture a higher BAC, fast. The math is unforgiving: volume compressed against the clock, not spread across it, is what wrecks your reading.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Here&apos;s the delayed trap: after your last drink, BAC continues to rise. Alcohol still waiting in your gut hasn&apos;t been metabolized yet, so levels climb for thirty-plus minutes after you&apos;ve set the glass firmly down.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your liver clears roughly one standard drink per hour, no negotiating. Everything above that pace stacks, because intake outruns elimination. That widening gap, not your total volume, is the story a calculator captures for you.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            This is why blood alcohol concentration behaves less like a fuel gauge and more like a tide. The key factors aren&apos;t mysterious; they&apos;re just consistently underestimated by everyone certain they can eyeball their own limit.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Colour Legend</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Most users assume the green band signals permission to drive. It does not. Our colour legend maps risk, not clearance, and even green carries residual impairment worth respecting before you touch any steering wheel again.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Green spans 0.00 to 0.049, the calculator&apos;s lowest tier. Practitioners read this as minimal measurable effect, yet reaction time already softens here. Treat the shade purely as information about your body, never as legal absolution.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Yellow marks the warn range, 0.05 to 0.079. Judgment slips here before you notice it slipping, which is exactly why the shade exists: self-assessment fails precisely when you most need honest, external, unemotional feedback here.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Red begins at .08, where a criminal offence and real penalties enter the picture. Yet the calculator refuses to celebrate lower numbers, because danger is a gradient, and red simply names where consequences turn legal.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Read the legend against your current BAC and peak BAC together, not in isolation. A green result now can slide upward minutes later. The intoxication level you see is a snapshot, not a fixed verdict.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Safety First Approach</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            A calculator does not make drinking safe; it renders risks visible. The safest reading is the one you never produce, because you built a plan before the first pour and refused to operate machinery afterward.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Driving while intoxicated kills predictably, so treat the tool as safety guidance, not a permission slip. Practitioners who&apos;ve seen the aftermath don&apos;t drive on a hopeful guess; they arrange transport while still sober and clear-headed.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Bars practicing responsible alcohol service cut patrons off for a reason. Every number the calculator returns should be read at your own risk, a phrase that sounds legalistic until the danger is your own body.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Informed decision-making means accepting the ugly answer. The only reliable method for genuine zero is to abstain, everything else being harm reduction. When numbers climb, get help without embarrassment and simply concede the night ended.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            When judgment has already gone, let someone who hasn&apos;t been drive you home. The bravest move at that point is admitting the estimate was right, surrendering your keys, and choosing tomorrow&apos;s clear head over stubbornness.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Free Blood Alcohol Calculator</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            A free tool sounds like a gimmick until you realize paid breathalyzers fail too. This one is free, accurate enough for decisions, and easy-to-use, letting everyone estimate exposure before the open road becomes a coffin.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Its purpose is blunt: prevent alcohol-related death. Every year alcohol-related fatalities cluster around people who felt fine after few drinks. The gap between feeling sober and being sober is precisely where this tool truly matters.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Zero-tolerance policies exist because impaired driving kills at low readings. Enter your inputs honestly and the model will estimate blood alcohol content without flinching, handing you a figure to act on rather than false comfort.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Once you see the number, plan an alternative way home. Call an uber, walk, or crash on a couch. The dangers of driving buzzed are not abstract; driving while drunk turns ordinary streets genuinely lethal.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            No tool guarantees safety, yet an honest, quick estimate shifts the odds toward survival. That is the entire point here: fewer bodies on the highway, fewer families rebuilt around an empty chair, more people home.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Fast Blood Alcohol Level Estimate</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Speed is usually the enemy of accuracy, but not here. A fast result beats a perfect result you calculate after you&apos;ve already driven off. This estimated blood alcohol level arrives before your keys ever move.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            You feed it a few details and wait roughly 60 seconds. No lab, no needle, no appointment. The average user underestimates their own impairment badly, which is precisely why a rapid external number outperforms guessing.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Accurate enough matters more than laboratory-perfect. Field practitioners learned long ago that a defensible ballpark, delivered instantly, changes behaviour, while a flawless figure computed tomorrow morning changes nothing except the wording on a police report.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Being easy-to-use is no cosmetic feature; it decides whether a drunk person actually finishes the check. Complexity kills adoption exactly when adoption matters most, so simplicity here operates as a quiet, underrated safety mechanism itself.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Do not mistake a quick reading for permission. The fast estimate buys you a decision window, nothing more. Sixty honest seconds now can spare you decades of regret, so run it before, never after, driving.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Features</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Forget the single figure that everyone always fixates upon. The genuine strength lives inside the chart feature, plotting your time to reach peak and the precise moment when BAC reaches 0% across one long night.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Before trusting any tool at all, ask what is a BAC calculator actually gauging. It weighs height, weight, biological sex, and hunger level against drinks consumed, translating messy inputs into a single readable, honest curve.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            People rarely stop to question how does a BAC calculator work until output surprises them completely. The engine cross-references time drinking with body variables, exposing why two friends sharing rounds land at wildly separate places.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The honest reason why do I need a BAC calculator seldom appears in glossy marketing copy. Curiosity aside, these tools quietly surface links between casual habits and alcohol and drug addiction almost nobody discusses openly.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Good platforms tend to bury one underrated asset entirely: resources. Beyond the graph they point toward real help, folding physical health context and alcoholism awareness into what most users treat as a throwaway novelty widget.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">How to Use Blood Alcohol Calculator</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Skip the instructions that everyone ignores anyway. Begin by entering your sex and body weight, because a male at 90 kilos will process rounds differently than the 165 grams benchmark that many tools quietly assume.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Log the number of beers first, then wine glasses and vodka shots separately right afterward. Three large beers consumed 8 hrs ago produce lower percentage readings than the same 3 downed within one reckless hour.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The field for time started drinking trips people up constantly and quite badly. Enter it precisely, since raw alcohol measured in grams decays predictably, and one sloppy timestamp corrupts the exact amount your algorithm returns.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Watch how just 50 grams of ethanol converts into a 0.6‰ reading onscreen. That deceptively small blood alcohol content value still hides real alcohol intoxication, which is why entering 0 drinks clarifies your sober baseline.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Precision beats guesswork here almost every single time. The tool wants 5 honest fields, never rounded lies, because amount of alcohol consumed drives everything downstream, and metabolism quietly reshapes those numbers after your final shot.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Why Use the BAC Calculator</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Nobody ever really admits the actual quiet motive: curiosity. Long before any hangover arrives, people run the estimate to compare readings with friends, treating alcohol content math like a strange party spectator sport again tonight.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The dangerous myth wrongly says this simply replaces a breathalyzer test. It does not, ever. A store-bought breathalyzer from pharmacies will always measure actual breath, while software merely estimates who feels under the influence now.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Planning matters so much more than reaction afterward. Couples building a wedding alcohol calculator budget lean on the exact identical engine, forecasting how many guests drift drunk before the drive home conversation ever becomes relevant.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Pair the estimate with a solid BMR calculator and patterns emerge quickly. Your metabolism and physical tolerance shape almost everything, so the tool exposes drinking pattern truths that gut feeling and bravado consistently get wrong.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The comparison game teaches restraint indirectly and almost accidentally. Watching predicted numbers climb toward high BAC levels makes abstract drunkenness suddenly concrete, reframing the next bottle as a measurable choice rather than harmless weekend fun.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Sobriety Calculator</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            A sobriety tool completely inverts the entire question. Instead of asking how high you climbed, it estimates time to get alcohol out of system, projecting the hour your current blood alcohol level finally flattens completely.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The type of drinks chosen just hours earlier still dictates almost everything right now. A heavy liquor night and a light beer evening reach fully sober status on wildly divergent timelines despite identical starting counts.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            What people genuinely crave here is the estimate of blood alcohol content equal 0. That single projected timestamp, more than any peak reading, governs whether tomorrow&apos;s early morning meeting survives last night&apos;s questionable decisions intact.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Understand that the concentration of alcohol falls only one single way: through patient waiting. The body drains it away at a stubborn fixed elimination rate, so no clever trick accelerates the march toward zero faster.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The countdown reframes your drinking as borrowed time entirely. Every additional shot pushes your return to zero further out, and the calculator makes that quiet arithmetic uncomfortably, usefully visible long before regret finally sets in.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">In Conclusion, the BAC Calculator Can Tell You</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            The heading itself misleads slightly, honestly speaking. This tool concludes nothing; it reveals how drunk you are at one snapshot while ignoring the messier arc your alcohol consumption pattern actually traces across a full evening.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            It clearly flags the three most common alcohol types driving your reading right now, translating beer, wine, and spirits into one comparable blood alcohol content figure that strips away marketing and proof-number confusion almost instantly.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Pair its output with an audit score calculator and something quietly shifts deep inside. Individual nights matter far less than trajectory, and WHO thresholds reframe casual weekly habits as data worth genuinely examining, not dismissing.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Total sobriety always appears as a distant destination, never a default state. The projection clearly shows how far that point sits, quietly challenging the assumption that feeling fine equals being measured truly safe by anyone.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            What it cannot ever tell you matters just equally much. No estimate captures fatigue, hydration, or the medications silently amplifying each single drink, which is precisely why blind faith in a green number stays reckless.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Important Disclaimer</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Read this carefully before the calculator, never after. Every output serves educational purposes and informational purposes only, never legal advice or professional medical advice, because no calculator 100% accurate enough to actually trust blindly exists.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The generalized formulas rest almost entirely on user-provided information, meaning that honesty determines everything downstream. Numerous factors including genetics, body composition, liver function, and drink strength introduce complexities these tidy estimated numbers quietly flatten away.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            A doctor or a health care provider interprets your medical condition better than software ever could. Your history of alcohol consumption, current health issues, and legal counsel questions belong with real humans, not anonymous code.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Legal BAC limits vary widely by jurisdiction and license type, so treat each figure as rough estimation only. Only a breath test, blood test, or laboratory tests run on calibrated equipment carry genuine evidentiary weight.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            We remain not liable; this exists for demonstration purposes alone. Research from the Homewood Research Institute and Peter Boris Centre for Addiction Research informs it, yet food, timing, and serving size still defeat clean prediction.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">What Your Blood Alcohol Number Actually Measures</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Here&apos;s what trips people up before they ever open a calculator: a 12 fl oz beer, a 5 fl oz wine, and 1.5 fl oz distilled spirits are not three different amounts of alcohol — they are the same effect wearing three costumes. Each delivers roughly 0.6 ounces, about 17 mL pure alcohol, into your body. That equivalence is the whole game, and almost every argument about &quot;I only had a beer&quot; dies right there.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The confusion lives in drink volume. A tall 16 oz pour in a can is not one drink; it is closer to one and a half. A generous cup past the standard 5 oz (142 mL) counts as more. What matters is never the glass, only the ABV — alcohol by volume — multiplied by how much liquid you actually swallowed, whether you measure it in oz or ml.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Spirits distort this further. 80-proof liquor — most gin, rum, tequila, vodka, and whiskey — hovers near 40% ABV, while cider runs low and table wine sits in the middle. One measure knocked back in 20-minutes hits harder than the same amount grazed over an hour. Advice like four drinks per day means nothing when your &quot;drink&quot; is quietly two, which is why pacing with non-alcoholic beverages is the single most underused trick at any table.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">How the Calculator Guesses, and Why It Can Only Guess</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Every online estimator is running some version of the same equation. The modern form is BAC = A/(bw × Wt) × 100% − mr × t; the original 1930s version was closer to W x r applied to weight in pounds. The output is your blood alcohol concentration — reported casually as your blood alcohol level — the fraction of alcohol saturating your blood at that instant.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Break the variables open. Wt is body mass, which the tool takes in kilograms or pounds along with a few personal details so it can approximate bw, your body-water ratio, typically near 0.50 and scaled by 100% into a percentage. Your sex assigned at birth matters here biologically rather than socially; trans and non-binary users get the roughest reading unless the calculator was built on validated equations rather than a single default. Age shifts the arithmetic again — and note that plain age is a separate factor from the drinking-age question entirely.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Time is the part people ignore. Alcohol does not teleport into your blood stream; alcohol absorption peaks 30-70 minutes after your time of consumption, so any reading pulled mid-absorption understates the truth. The mr term is your elimination rate — around 0.015 per hour, but realistically 0.01 to 0.025 depending on the body. That is why both time spent drinking and total elapsed hours (t) feed the model, and why, at any given time, only patience — never coffee — lets a number fall below legal limit.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            This is also why a breathalyzer and a calculator openly disagree: one samples breath, the other simulates it, and both are approximate by nature. No formula finds your personal sweet spot of pleasurable effects, and none can predict how the estimate will work against your live chemistry. Drivers especially should read the result as a rough model, not a verdict.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">The Stages, From First Sip to Medical Crisis</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your number only means something once you know what each band does to a human being. The table below is the rough universal progression; treat the edges as blurry, because tolerance smears them, but the sequence itself does not change. Individual biology decides where you land, not bravado.
          </p>

          <div className="overflow-x-auto my-4 rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 border-r border-slate-200">BAC band</th>
                  <th className="p-3 border-r border-slate-200">What is happening</th>
                  <th className="p-3">How it shows up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.00%-0.02% (.00, .01, .02)</td>
                  <td className="p-3 border-r border-slate-200">only measurable alcohol, no obvious side effects</td>
                  <td className="p-3">a faint warmth, nothing more</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.02%-0.04% (band .01%-.06%)</td>
                  <td className="p-3 border-r border-slate-200">joyousness, reduced shyness</td>
                  <td className="p-3">relaxed, mildly happy, early reduced sensitivity to pain</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.04%-0.06%</td>
                  <td className="p-3 border-r border-slate-200">disinhibition, extraversion</td>
                  <td className="p-3">blunted feelings, reduced inhibitions, decreased libido, and in men temporary erectile dysfunction despite feeling confident</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.06%-0.10% (crossing 0.08%, the .05–0.08 legal zone)</td>
                  <td className="p-3 border-r border-slate-200">impairment of judgement, impaired judgment, weakened reason, slipping concentration</td>
                  <td className="p-3">fading small-muscle control, peripheral vision, and glare recovery; rising boisterousness and exaggerated behaviour</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.10%-0.13% (0.10%, .10)</td>
                  <td className="p-3 border-r border-slate-200">impairment of speech, impaired speech, slowed thinking</td>
                  <td className="p-3">loss of balance, poor muscle coordination, loss of coordination, blurred vision, impaired vision, difficulty focusing eyes — the classic sloppy drunk</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.13%-0.16% (0.15%, .15, .16), inside the .07%-.20% band</td>
                  <td className="p-3 border-r border-slate-200">major loss of balance, dysequilibrium, positional alcohol nystagmus</td>
                  <td className="p-3">mental confusion, impaired sensations, partial loss of understanding, unreliable movement</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.16%-0.20% (.17, .18)</td>
                  <td className="p-3 border-r border-slate-200">needs assistance walking</td>
                  <td className="p-3">emotional instability, reduced memory, nausea, deepening impairment of every motion</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.20%-0.25% (.20, opening the .21%-.40% band)</td>
                  <td className="p-3 border-r border-slate-200">severe motor impairment, blackouts, loss of memory, failing memory</td>
                  <td className="p-3">loss of bladder control as bladder function slips, cold skin, high-risk intoxication — a genuinely dangerous level</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.25%-0.40%</td>
                  <td className="p-3 border-r border-slate-200">lapses in and out of consciousness, low possibility of death</td>
                  <td className="p-3">depressed breathing and slow breathing, dropping heart rate, alcohol poisoning, fading hearing, self-control gone</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">0.40%</td>
                  <td className="p-3 border-r border-slate-200">high possibility of death</td>
                  <td className="p-3">unresponsive, near-coma, a medical emergency</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            The two faculties the law cares about most are judgment and coordination: the first fails before you can feel it, the second fails where everyone can see it. That gap — feeling fine while testing impaired — is exactly what the calculator exists to expose.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            People never narrate this in clinical terms. They say they are feeling it, then buzzed, tipsy, talkative, emotional, briefly unstoppable and over-confident; later groggy, uncoordinated, out of it, dizzy, disoriented, the room spinning. Push past that and the vocabulary curdles: angry, irrational, jumpy, sick, sleepy, exhausted; then lost, confused, unaware, words gone unintelligible; finally wasted, gone, uncontrollable, uncooperative, unable to stand (can&apos;t stand) or walk (can&apos;t walk), puking, and eventually unresponsive.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xl font-bold text-slate-900">Legal Limits, New Drivers, and the Line Where You Call for Help</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Now the part with legal teeth. Across the United States the default ceiling for drivers is 0.08%, written by police as grams of alcohol per 100 mL of blood. The states carried in this reference share that framework or something stricter: Alaska, Arizona, Arkansas, Colorado, Connecticut, Delaware, District of Columbia, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, South Dakota, Tennessee, Vermont, Virginia, Washington, West Virginia, Wisconsin, and Wyoming.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The ceiling is not uniform. Anyone under age 21, and anyone holding a provisional driver&apos;s license, typically faces a near-zero limit — often .00 or a whisper above — because zero-tolerance rules bind new and young drivers hardest. A charge of driving while intoxicated does not require feeling drunk; it only requires crossing a line your senses may never announce.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Read this next part carefully, because it is the actual point: everything here is not medical advice. A calculator&apos;s estimate is no legal defense and no health verdict. If a person is unresponsive, breathing slowly, or cannot be woken, that is an emergency — call for help instead of waiting for a figure to drop. Responsible alcohol service and informed decision-making exist precisely because no algorithm can make the call for you.
          </p>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-200 mt-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">BAC Calculator: FAQs</h3>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="text-base font-bold text-slate-900">FAQ: What Does BAC Stand For?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Most assume a breathalyzer just says how drunk you are. Wrong. BAC — blood alcohol concentration — quantifies the percentage of alcohol in blood. Every test, whether a breath test or lab chemical tests, exists to measure exactly that.
              </p>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="text-base font-bold text-slate-900">FAQ: How Can I Calculate BAC?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Skip the apps. Widmark&apos;s formula does it: BAC = A/(bw × Wt) × 100% − mr × t. Here A = amount of alcohol in grams, Wt = body weight in kilograms, bw = ratio of body water to total weight, t = time in hours, and mr = metabolism rate at 0.017% per hour.
              </p>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="text-base font-bold text-slate-900">FAQ: Which Factor Is the Only Way to Lower BAC?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Here&apos;s what nobody wants to hear: nothing speeds it up. Coffee, a cold shower, a glass of water — every trick to sober up fast is a myth, not true. Only spending time without drinking lets your system finish what it absorbs and get rid of alcohol.
              </p>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="text-base font-bold text-slate-900">FAQ: What BAC Means That I Am Drunk?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Legally, 0.08% BAC marks where you can&apos;t drive under the influence across the United States — though Utah sets it lower. But effects of being drunk begin earlier: mild impairment of speech, vision, coordination, and reaction times.
              </p>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="text-base font-bold text-slate-900">FAQ: Which Factors Affect BAC Levels?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                It&apos;s not only the number of standard drinks. Weight matters — a heavier person gets a lower BAC. Sex too: men metabolize faster than women. Add medications, drugs, liver health, speed of sipping, and food — an empty stomach speeds alcohol absorption and intoxication.
              </p>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="text-base font-bold text-slate-900">FAQ: What Is My BAC After 2 Beers?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Take a US man at 180 lbs drinking two large beers — roughly 50 grams of raw alcohol. After about 4 hours to metabolize, his reading lands near 0.06%, or 0.6‰.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
