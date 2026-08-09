import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Stethoscope, HeartPulse, ArrowLeft, AlertTriangle } from 'lucide-react';

interface MacroCalculatorViewProps {
  onBackToCalculators?: () => void;
}

export const MacroCalculatorView: React.FC<MacroCalculatorViewProps> = ({ onBackToCalculators }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Run the self-contained Macro Calculator logic inside the container
    const R = containerRef.current.querySelector('#ra-macro-root') as HTMLElement;
    if (!R) return;

    const $ = (id: string) => containerRef.current?.querySelector('#' + id) as HTMLElement;

    const state = {
      units: 'metric',
      sex: 'male',
      goal: 'lose',
      preset: 'optimized',
      proteinPerKg: 1.8,
      userTouchedProtein: false,
    };

    const LB = 2.2046226218;
    const IN = 0.3937007874;

    function toKg(w: number) {
      return state.units === 'metric' ? w : w / LB;
    }
    function toCm(h: number) {
      return state.units === 'metric' ? h : h / IN;
    }

    function bindSeg(wrapId: string, attr: string, key: 'units' | 'sex' | 'goal', after?: () => void) {
      const wrap = $(wrapId);
      if (!wrap) return;
      wrap.addEventListener('click', (e: Event) => {
        const b = (e.target as HTMLElement).closest('button');
        if (!b) return;
        wrap.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        state[key] = b.getAttribute(attr) || '';
        if (after) after();
      });
    }

    function refreshUnitLabels() {
      const hw = R.querySelector('[data-unit="height"]');
      const ww = R.querySelector('[data-unit="weight"]');
      if (!hw || !ww) return;
      if (state.units === 'metric') {
        hw.textContent = 'Height (cm)';
        ww.textContent = 'Weight (kg)';
      } else {
        hw.textContent = 'Height (in)';
        ww.textContent = 'Weight (lb)';
      }
    }

    function goalRateConfig() {
      const perWk = state.units === 'metric' ? 'kg/wk' : 'lb/wk';
      if (state.goal === 'lose') {
        return state.units === 'metric'
          ? { min: 0.25, max: 1.0, step: 0.05, def: 0.5, unit: perWk }
          : { min: 0.5, max: 2.0, step: 0.1, def: 1.0, unit: perWk };
      }
      if (state.goal === 'gain') {
        return state.units === 'metric'
          ? { min: 0.1, max: 0.5, step: 0.05, def: 0.25, unit: perWk }
          : { min: 0.25, max: 1.0, step: 0.05, def: 0.5, unit: perWk };
      }
      return null;
    }

    function updateRateVal() {
      const cfg = goalRateConfig();
      if (!cfg) return;
      const rateEl = $('rc-rate-val');
      const r = $('rc-rate') as HTMLInputElement;
      if (rateEl && r) {
        rateEl.textContent = parseFloat(r.value).toFixed(2).replace(/0$/, '').replace(/\.$/, '') + ' ' + cfg.unit;
      }
    }

    function refreshRateField() {
      const field = $('rc-rate-field');
      const cfg = goalRateConfig();
      const r = $('rc-rate') as HTMLInputElement;
      if (!field || !r) return;
      if (!cfg) {
        field.style.display = 'none';
        return;
      }
      field.style.display = '';
      r.min = String(cfg.min);
      r.max = String(cfg.max);
      r.step = String(cfg.step);
      if (parseFloat(r.value) < cfg.min || parseFloat(r.value) > cfg.max) {
        r.value = String(cfg.def);
      }
      updateRateVal();
      const hint = $('rc-rate-hint');
      if (hint) {
        hint.textContent =
          state.goal === 'lose'
            ? 'Sustainable fat loss is ~0.5–1% of body weight per week. Faster costs muscle and adherence.'
            : 'Lean-gain rates keep fat gain in check. Beginners can push the upper end; advanced lifters should stay low.';
      }
    }

    function computeBMR(kg: number, cm: number, age: number, bf: number, formula: string) {
      const mifflin = 10 * kg + 6.25 * cm - 5 * age + (state.sex === 'male' ? 5 : -161);
      const harris =
        state.sex === 'male'
          ? 88.362 + 13.397 * kg + 4.799 * cm - 5.677 * age
          : 447.593 + 9.247 * kg + 3.098 * cm - 4.330 * age;
      let katch: number | null = null;
      if (bf > 0) {
        const lbm = kg * (1 - bf / 100);
        katch = 370 + 21.6 * lbm;
      }
      let used: number;
      let label: string;
      if (formula === 'mifflin') {
        used = mifflin;
        label = 'Mifflin-St Jeor';
      } else if (formula === 'harris') {
        used = harris;
        label = 'Harris-Benedict (revised)';
      } else if (formula === 'katch') {
        if (katch) {
          used = katch;
          label = 'Katch-McArdle';
        } else {
          used = mifflin;
          label = 'Mifflin-St Jeor (no body fat entered)';
        }
      } else {
        if (katch) {
          used = katch;
          label = 'Katch-McArdle';
        } else {
          used = mifflin;
          label = 'Mifflin-St Jeor';
        }
      }
      return { bmr: Math.round(used), label, katchAvailable: !!katch };
    }

    let last: any = null;

    function drawRing(p: number, c: number, f: number) {
      const C = 2 * Math.PI * 82;
      function seg(id: string, frac: number, offsetFrac: number) {
        const el = $(id);
        if (!el) return;
        el.setAttribute('stroke-dasharray', frac * C + ' ' + C);
        el.setAttribute('stroke-dashoffset', String(-offsetFrac * C));
      }
      seg('rc-arc-pro', p, 0);
      seg('rc-arc-carb', c, p);
      seg('rc-arc-fat', f, p + c);
    }

    function renderMacros() {
      if (!last) return;
      const kcal = last.target;
      const kg = last.kg;
      const bf = last.bf;
      let pKcal: number, cKcal: number, fKcal: number, pG: number, cG: number, fG: number;

      if (state.preset === 'optimized') {
        const basisKg = bf > 0 ? kg * (1 - bf / 100) : kg;
        let perKg = state.proteinPerKg;
        if (bf > 0) perKg = state.proteinPerKg + 0.3;
        pG = Math.round(basisKg * perKg);
        pKcal = pG * 4;
        const fatFloorG = Math.round(kg * 0.8);
        fKcal = Math.max(Math.round(kcal * 0.25), fatFloorG * 9);
        fG = Math.round(fKcal / 9);
        cKcal = Math.max(kcal - pKcal - fKcal, 0);
        cG = Math.round(cKcal / 4);
      } else {
        const splitMap: Record<string, number[]> = {
          balanced: [0.3, 0.4, 0.3],
          highprotein: [0.4, 0.35, 0.25],
          lowcarb: [0.35, 0.25, 0.4],
          keto: [0.3, 0.1, 0.6],
        };
        const split = splitMap[state.preset] || [0.3, 0.4, 0.3];
        pKcal = kcal * split[0];
        cKcal = kcal * split[1];
        fKcal = kcal * split[2];
        pG = Math.round(pKcal / 4);
        cG = Math.round(cKcal / 4);
        fG = Math.round(fKcal / 9);
      }

      const total = Math.max(pKcal + cKcal + fKcal, 1);
      const pPct = Math.round((pKcal / total) * 100);
      const cPct = Math.round((cKcal / total) * 100);
      const fPct = 100 - pPct - cPct;

      if ($('rc-kcal')) $('rc-kcal').textContent = kcal.toLocaleString();
      if ($('rc-maint')) $('rc-maint').textContent = last.maintenance.toLocaleString();
      const d = last.delta;
      if ($('rc-deltalab')) $('rc-deltalab').textContent = d < 0 ? 'deficit' : d > 0 ? 'surplus' : 'even';
      if ($('rc-delta')) $('rc-delta').textContent = Math.abs(d).toLocaleString();

      if ($('rc-p-g')) $('rc-p-g').textContent = String(pG);
      if ($('rc-p-pct')) $('rc-p-pct').textContent = String(pPct);
      if ($('rc-p-kcal')) $('rc-p-kcal').textContent = Math.round(pG * 4).toLocaleString();

      if ($('rc-c-g')) $('rc-c-g').textContent = String(cG);
      if ($('rc-c-pct')) $('rc-c-pct').textContent = String(cPct);
      if ($('rc-c-kcal')) $('rc-c-kcal').textContent = Math.round(cG * 4).toLocaleString();

      if ($('rc-f-g')) $('rc-f-g').textContent = String(fG);
      if ($('rc-f-pct')) $('rc-f-pct').textContent = String(fPct);
      if ($('rc-f-kcal')) $('rc-f-kcal').textContent = Math.round(fG * 9).toLocaleString();

      if ($('rc-bmr')) $('rc-bmr').textContent = last.bmr.toLocaleString();
      if ($('rc-fiber')) $('rc-fiber').textContent = Math.round((kcal / 1000) * 14) + ' g';

      const tv = $('rc-timeline');
      const tk = $('rc-tl-k');
      const targetInput = $('rc-target') as HTMLInputElement;
      const targetW = targetInput && targetInput.value !== '' ? parseFloat(targetInput.value) : 0;
      if (targetW > 0 && state.goal !== 'maintain') {
        const diffUser = Math.abs((state.units === 'metric' ? last.kg : last.kg * LB) - targetW);
        const rateInput = $('rc-rate') as HTMLInputElement;
        const rate = rateInput ? parseFloat(rateInput.value) : 0.5;
        const wks = rate > 0 ? Math.ceil(diffUser / rate) : 0;
        if (tk) tk.textContent = 'Est. timeline';
        if (tv) tv.textContent = wks > 0 ? wks + ' wk' + (wks > 1 ? 's' : '') : '—';
      } else {
        if (tk) tk.textContent = 'Timeline';
        if (tv) tv.textContent = 'set goal wt';
      }

      drawRing(pKcal / total, cKcal / total, fKcal / total);

      const basisNote =
        state.preset === 'optimized'
          ? bf > 0
            ? 'protein from <b>lean mass</b> (' + (state.proteinPerKg + 0.3).toFixed(1) + ' g/kg LBM)'
            : 'protein at <b>' + state.proteinPerKg.toFixed(1) + ' g/kg</b> body weight'
          : '<b>' + state.preset + '</b> percentage split';

      const methodEl = $('rc-method');
      if (methodEl) {
        methodEl.innerHTML =
          'Calculated with <b>' +
          last.label +
          '</b> BMR, then ' +
          basisNote +
          ', fat held to a healthy floor, and carbs filling the remainder.';
      }
    }

    function calculate() {
      const ageInput = $('rc-age') as HTMLInputElement;
      const hInput = $('rc-height') as HTMLInputElement;
      const wInput = $('rc-weight') as HTMLInputElement;
      const bfInput = $('rc-bf') as HTMLInputElement;
      const actInput = $('rc-activity') as HTMLSelectElement;
      const formulaInput = $('rc-formula') as HTMLSelectElement;
      const rateInput = $('rc-rate') as HTMLInputElement;

      if (!ageInput || !hInput || !wInput) return;

      const age = parseFloat(ageInput.value);
      const hRaw = parseFloat(hInput.value);
      const wRaw = parseFloat(wInput.value);
      const bf = bfInput && bfInput.value !== '' ? parseFloat(bfInput.value) : 0;

      const kg = toKg(wRaw);
      const cm = toCm(hRaw);

      if (!(age > 0 && kg > 0 && cm > 0)) return;

      const act = parseFloat(actInput.value);
      const b = computeBMR(kg, cm, age, bf, formulaInput.value);
      const maintenance = Math.round(b.bmr * act);

      let delta = 0;
      let warn = '';
      if (state.goal !== 'maintain') {
        const ratePerWk = parseFloat(rateInput.value);
        const kgPerWk = state.units === 'metric' ? ratePerWk : ratePerWk / LB;
        delta = Math.round((kgPerWk * 7700) / 7);
        if (state.goal === 'lose') delta = -delta;
        if (state.goal === 'gain') delta = Math.round(delta * 1.1);
      }
      let target = maintenance + delta;

      const floor = state.sex === 'male' ? 1500 : 1200;
      if (state.goal === 'lose' && target < floor) {
        target = floor;
        warn =
          'To keep you at or above a safe minimum (' +
          floor +
          ' kcal), your target was raised. Lower your weekly rate for a gentler, more sustainable deficit.';
      }
      if (state.goal === 'lose' && target < b.bmr) {
        warn =
          'Heads up: your target sits below your BMR. That is aggressive — expect fatigue and muscle loss if held for long. Consider a slower rate.';
      }

      last = {
        kg,
        bf,
        maintenance,
        target,
        delta: target - maintenance,
        bmr: b.bmr,
        label: b.label,
        katch: b.katchAvailable,
      };

      if (!state.userTouchedProtein) {
        state.proteinPerKg = state.goal === 'lose' ? 2.2 : state.goal === 'gain' ? 2.0 : 1.8;
        const pSlider = $('rc-protein') as HTMLInputElement;
        if (pSlider) pSlider.value = String(state.proteinPerKg);
        const pVal = $('rc-protein-val');
        if (pVal) pVal.textContent = state.proteinPerKg.toFixed(1);
      }

      renderMacros();

      const w = $('rc-warn');
      if (w) {
        if (warn) {
          w.textContent = warn;
          w.classList.add('is-on');
        } else {
          w.classList.remove('is-on');
        }
      }

      const results = $('rc-results');
      if (results) {
        results.classList.add('is-on');
        results.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'nearest',
        });
      }
    }

    function toast(msg: string) {
      const t = $('rc-toast');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('is-on');
      setTimeout(() => {
        t.classList.remove('is-on');
      }, 1400);
    }

    const copyBtn = $('rc-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!last) return;
        const txt =
          'RaphaAtlas Macro Calculator\n' +
          'Calories: ' +
          last.target +
          ' kcal/day (maintenance ' +
          last.maintenance +
          ')\n' +
          'Protein: ' +
          $('rc-p-g')?.textContent +
          'g  |  Carbs: ' +
          $('rc-c-g')?.textContent +
          'g  |  Fat: ' +
          $('rc-f-g')?.textContent +
          'g\n' +
          'Fiber: ' +
          $('rc-fiber')?.textContent +
          '  |  BMR: ' +
          last.bmr +
          ' (' +
          last.label +
          ')';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(
            () => toast('Results copied'),
            () => toast('Copy failed')
          );
        }
      });
    }

    const shareBtn = $('rc-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const ageVal = ($('rc-age') as HTMLInputElement)?.value || '';
        const hVal = ($('rc-height') as HTMLInputElement)?.value || '';
        const wVal = ($('rc-weight') as HTMLInputElement)?.value || '';
        const bfVal = ($('rc-bf') as HTMLInputElement)?.value || '';
        const actVal = ($('rc-activity') as HTMLSelectElement)?.value || '';
        const rateVal = ($('rc-rate') as HTMLInputElement)?.value || '';
        const targetVal = ($('rc-target') as HTMLInputElement)?.value || '';
        const fmVal = ($('rc-formula') as HTMLSelectElement)?.value || '';

        const p = new URLSearchParams({
          u: state.units,
          s: state.sex,
          g: state.goal,
          a: ageVal,
          h: hVal,
          w: wVal,
          bf: bfVal,
          act: actVal,
          r: rateVal,
          t: targetVal,
          fm: fmVal,
        });
        const url = window.location.origin + window.location.pathname + '?' + p.toString();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(
            () => toast('Link copied'),
            () => toast('Copy failed')
          );
        }
      });
    }

    bindSeg('rc-units', 'data-u', 'units', () => {
      refreshUnitLabels();
      refreshRateField();
      if (last) calculate();
    });

    bindSeg('rc-sex', 'data-s', 'sex', () => {
      if (last) calculate();
    });

    bindSeg('rc-goal', 'data-g', 'goal', () => {
      state.userTouchedProtein = false;
      refreshRateField();
      if (last) calculate();
    });

    const rateSlider = $('rc-rate');
    if (rateSlider) {
      rateSlider.addEventListener('input', () => {
        updateRateVal();
        if (last) calculate();
      });
    }

    const calcBtn = $('rc-calc');
    if (calcBtn) {
      calcBtn.addEventListener('click', calculate);
    }

    ['rc-target', 'rc-activity', 'rc-formula', 'rc-bf'].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener('change', () => {
          if (last) calculate();
        });
      }
    });

    const presetsEl = $('rc-presets');
    if (presetsEl) {
      presetsEl.addEventListener('click', (e: Event) => {
        const b = (e.target as HTMLElement).closest('.rc-preset');
        if (!b) return;
        presetsEl.querySelectorAll('.rc-preset').forEach((x) => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        state.preset = b.getAttribute('data-p') || 'optimized';
        renderMacros();
      });
    }

    const proteinSlider = $('rc-protein') as HTMLInputElement;
    if (proteinSlider) {
      proteinSlider.addEventListener('input', () => {
        state.userTouchedProtein = true;
        state.proteinPerKg = parseFloat(proteinSlider.value);
        const pVal = $('rc-protein-val');
        if (pVal) pVal.textContent = parseFloat(proteinSlider.value).toFixed(1);
        state.preset = 'optimized';
        const pEl = $('rc-presets');
        if (pEl) {
          pEl.querySelectorAll('.rc-preset').forEach((x) => {
            x.setAttribute('aria-pressed', x.getAttribute('data-p') === 'optimized' ? 'true' : 'false');
          });
        }
        renderMacros();
      });
    }

    refreshUnitLabels();
    refreshRateField();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl border border-teal-100 shrink-0">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
              Clinical Macro Calculator
            </h1>
            <p className="text-xs text-slate-500">
              Evidence-based BMR equations with body mass protein anchors &amp; safety floors
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

      {/* Omni Calculator Style Creators & Reviewers Metadata Box */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/30 border border-slate-800 shadow-2xs">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-0.5 border border-white">
              <ShieldCheck className="h-3 w-3" />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Creators</span>
              <span className="font-bold text-teal-700 hover:underline cursor-default">
                Dr. Muhammad Awais Rabbani <span className="text-[10px] text-slate-500 font-semibold">(MBBS)</span>
              </span>
              <span className="text-slate-400">,</span>
              <span className="font-bold text-teal-700 hover:underline cursor-default">
                Dr. Ahmed Humayon
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Reviewers</span>
              <span className="font-bold text-slate-700 hover:underline cursor-default">
                Dr. Muhammad Awais Rabbani <span className="text-[10px] text-slate-500 font-semibold">(MBBS)</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0 self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <span>Evidence-Based &amp; Medically Verified</span>
        </div>
      </div>

      {/* Widget container holding exact HTML and CSS */}
      <div ref={containerRef}>
        <div id="ra-macro-root">
          <style>{`
            #ra-macro-root *{box-sizing:border-box;margin:0;padding:0}
            #ra-macro-root{
              --bg:#0f1419; --panel:#161c24; --panel-2:#1d2530; --line:#2a3542;
              --ink:#eef2f6; --muted:#9aa7b6; --faint:#66748399;
              --pro:#ff6b6b; --carb:#ffb020; --fat:#37d29a; --accent:#5ec8ff;
              --radius:14px;
              --sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
              --mono:ui-monospace,"SF Mono","Cascadia Code","JetBrains Mono",Menlo,Consolas,monospace;
              font-family:var(--sans); color:var(--ink); line-height:1.5;
              background:var(--bg);
              max-width:960px; margin:0 auto; padding:clamp(16px,3vw,32px);
              border-radius:calc(var(--radius) + 6px);
            }
            #ra-macro-root .rc-head{margin-bottom:22px}
            #ra-macro-root .rc-eyebrow{
              font:600 11px/1 var(--mono); letter-spacing:.22em; text-transform:uppercase;
              color:var(--accent); display:inline-block; margin-bottom:10px;
            }
            #ra-macro-root h2.rc-title{
              font-weight:700; font-size:clamp(24px,4vw,34px); letter-spacing:-.02em; line-height:1.08;
            }
            #ra-macro-root .rc-sub{color:var(--muted); font-size:14.5px; max-width:60ch; margin-top:8px}

            #ra-macro-root .rc-grid{display:grid; grid-template-columns:1fr 1fr; gap:14px}
            @media(max-width:760px){#ra-macro-root .rc-grid{grid-template-columns:1fr}}

            #ra-macro-root .rc-card{
              background:var(--panel); border:1px solid var(--line); border-radius:var(--radius); padding:18px;
            }
            #ra-macro-root .rc-card h3{
              font:600 12px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--muted);
              margin-bottom:14px; display:flex; align-items:center; gap:8px;
            }
            #ra-macro-root .rc-card h3 .rc-dot{width:7px;height:7px;border-radius:50%;background:var(--accent)}

            #ra-macro-root .rc-field{margin-bottom:14px}
            #ra-macro-root .rc-field:last-child{margin-bottom:0}
            #ra-macro-root label.rc-lab{display:block; font-size:12.5px; color:var(--muted); margin-bottom:6px; font-weight:500}
            #ra-macro-root .rc-hint{font-size:11.5px; color:var(--faint); margin-top:5px; line-height:1.4}

            #ra-macro-root input[type=number], #ra-macro-root select{
              width:100%; background:var(--panel-2); border:1px solid var(--line); color:var(--ink);
              border-radius:99px; padding:10px 12px; font:500 15px var(--sans); appearance:none;
            }
            #ra-macro-root input[type=number]:focus, #ra-macro-root select:focus{
              outline:2px solid var(--accent); outline-offset:1px; border-color:transparent;
            }
            #ra-macro-root select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239aa7b6' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px}

            #ra-macro-root .rc-dual{display:grid; grid-template-columns:1fr 1fr; gap:10px}

            #ra-macro-root .rc-seg{display:flex; background:var(--panel-2); border:1px solid var(--line); border-radius:9px; padding:3px; gap:3px}
            #ra-macro-root .rc-seg button{
              flex:1; border:0; background:transparent; color:var(--muted); font:600 13px var(--sans);
              padding:8px 4px; border-radius:7px; cursor:pointer; transition:background .15s,color .15s;
            }
            #ra-macro-root .rc-seg button[aria-pressed=true]{background:var(--accent); color:#062230}
            #ra-macro-root .rc-seg button:focus-visible{outline:2px solid var(--accent); outline-offset:2px}

            #ra-macro-root input[type=range]{width:100%; accent-color:var(--accent); height:22px}
            #ra-macro-root .rc-rangerow{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px}
            #ra-macro-root .rc-rangeval{font:600 14px var(--mono); color:var(--ink)}

            #ra-macro-root .rc-cta{
              width:100%; margin-top:16px; border:0; cursor:pointer;
              background:var(--accent); color:#062230; font:700 15px var(--sans); letter-spacing:.01em;
              padding:14px; border-radius:11px; transition:filter .15s;
            }
            #ra-macro-root .rc-cta:hover{filter:brightness(1.08)}
            #ra-macro-root .rc-cta:focus-visible{outline:2px solid #fff; outline-offset:2px}

            #ra-macro-root .rc-results{margin-top:16px; display:none}
            #ra-macro-root .rc-results.is-on{display:block}
            #ra-macro-root .rc-resgrid{display:grid; grid-template-columns:280px 1fr; gap:14px}
            @media(max-width:760px){#ra-macro-root .rc-resgrid{grid-template-columns:1fr}}

            #ra-macro-root .rc-ringwrap{display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center}
            #ra-macro-root .rc-ring{position:relative; width:200px; height:200px}
            #ra-macro-root .rc-ring svg{transform:rotate(-90deg)}
            #ra-macro-root .rc-ringcenter{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center}
            #ra-macro-root .rc-kcal{font:700 40px/1 var(--mono); letter-spacing:-.02em}
            #ra-macro-root .rc-kcal-lab{font:600 11px var(--mono); letter-spacing:.16em; text-transform:uppercase; color:var(--muted); margin-top:4px}
            #ra-macro-root .rc-maint{font-size:12px; color:var(--muted); margin-top:10px}
            #ra-macro-root .rc-maint b{color:var(--ink); font-family:var(--mono)}

            #ra-macro-root .rc-macros{display:grid; grid-template-columns:repeat(3,1fr); gap:10px}
            @media(max-width:460px){#ra-macro-root .rc-macros{grid-template-columns:1fr}}
            #ra-macro-root .rc-mcard{background:var(--panel-2); border:1px solid var(--line); border-radius:12px; padding:14px; border-top:3px solid var(--line)}
            #ra-macro-root .rc-mcard.pro{border-top-color:var(--pro)}
            #ra-macro-root .rc-mcard.carb{border-top-color:var(--carb)}
            #ra-macro-root .rc-mcard.fat{border-top-color:var(--fat)}
            #ra-macro-root .rc-mname{font:600 12px var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--muted)}
            #ra-macro-root .rc-mgram{font:700 30px/1.1 var(--mono); margin-top:8px}
            #ra-macro-root .rc-mmeta{font-size:12px; color:var(--muted); margin-top:4px; font-family:var(--mono)}

            #ra-macro-root .rc-stats{display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:12px}
            @media(max-width:460px){#ra-macro-root .rc-stats{grid-template-columns:1fr 1fr}}
            #ra-macro-root .rc-stat{background:var(--panel-2); border:1px solid var(--line); border-radius:10px; padding:11px 13px}
            #ra-macro-root .rc-stat .k{font-size:11px; color:var(--muted); font-weight:500}
            #ra-macro-root .rc-stat .v{font:600 16px var(--mono); margin-top:3px}

            #ra-macro-root .rc-presets{display:flex; flex-wrap:wrap; gap:7px; margin-bottom:14px}
            #ra-macro-root .rc-preset{
              border:1px solid var(--line); background:var(--panel-2); color:var(--muted);
              font:600 12.5px var(--sans); padding:7px 12px; border-radius:20px; cursor:pointer; transition:.15s;
            }
            #ra-macro-root .rc-preset[aria-pressed=true]{border-color:var(--accent); color:var(--ink); background:#5ec8ff1a}
            #ra-macro-root .rc-preset:focus-visible{outline:2px solid var(--accent); outline-offset:2px}

            #ra-macro-root .rc-actions{display:flex; gap:10px; flex-wrap:wrap; margin-top:14px}
            #ra-macro-root .rc-ghost{
              flex:1; min-width:130px; border:1px solid var(--line); background:transparent; color:var(--ink);
              font:600 13.5px var(--sans); padding:11px; border-radius:10px; cursor:pointer; transition:.15s;
            }
            #ra-macro-root .rc-ghost:hover{border-color:var(--accent)}
            #ra-macro-root .rc-ghost:focus-visible{outline:2px solid var(--accent); outline-offset:2px}

            #ra-macro-root .rc-method{margin-top:14px; font-size:12.5px; color:var(--muted); line-height:1.6}
            #ra-macro-root .rc-method b{color:var(--ink)}
            #ra-macro-root details.rc-more{margin-top:12px; border-top:1px solid var(--line); padding-top:12px}
            #ra-macro-root details.rc-more summary{cursor:pointer; font:600 13px var(--sans); color:var(--accent); list-style:none}
            #ra-macro-root details.rc-more summary::-webkit-details-marker{display:none}
            #ra-macro-root details.rc-more p{font-size:12.5px; color:var(--muted); margin-top:10px; line-height:1.6}

            #ra-macro-root .rc-warn{
              background:#ffb0200f; border:1px solid #ffb02040; color:#ffca6b;
              font-size:12.5px; padding:11px 13px; border-radius:10px; margin-top:12px; line-height:1.5; display:none;
            }
            #ra-macro-root .rc-warn.is-on{display:block}

            #ra-macro-root .rc-disc{font-size:11px; color:var(--faint); margin-top:18px; line-height:1.6; border-top:1px solid var(--line); padding-top:14px}
            #ra-macro-root a.rc-link{color:var(--accent); text-decoration:none}
            #ra-macro-root a.rc-link:hover{text-decoration:underline}
            #ra-macro-root .rc-toast{position:fixed; left:50%; bottom:24px; transform:translateX(-50%) translateY(20px);
              background:var(--ink); color:#0f1419; font:600 13px var(--sans); padding:10px 18px; border-radius:24px;
              opacity:0; pointer-events:none; transition:.25s; z-index:50}
            #ra-macro-root .rc-toast.is-on{opacity:1; transform:translateX(-50%) translateY(0)}
            @media(prefers-reduced-motion:reduce){#ra-macro-root *{transition:none!important}}
          `}</style>

          <div className="rc-head">
            <span className="rc-eyebrow">RaphaAtlas · Nutrition</span>
            <h2 className="rc-title">Macro Calculator</h2>
            <p className="rc-sub">
              Protein set by your body mass and fat-loss goal — not a lazy percentage of calories. Your calorie target
              is built from how fast you actually want to change, with safety floors that most calculators ignore.
            </p>
          </div>

          <div className="rc-grid">
            {/* ABOUT YOU */}
            <div className="rc-card">
              <h3>
                <span className="rc-dot"></span>About You
              </h3>

              <div className="rc-field">
                <label className="rc-lab">Units</label>
                <div className="rc-seg" id="rc-units" role="group" aria-label="Units">
                  <button type="button" data-u="metric" aria-pressed="true">
                    Metric (kg / cm)
                  </button>
                  <button type="button" data-u="imperial" aria-pressed="false">
                    Imperial (lb / in)
                  </button>
                </div>
              </div>

              <div className="rc-field">
                <label className="rc-lab">
                  Biological sex <span className="rc-hint" style={{ display: 'inline' }}>(affects BMR equation)</span>
                </label>
                <div className="rc-seg" id="rc-sex" role="group" aria-label="Sex">
                  <button type="button" data-s="male" aria-pressed="true">
                    Male
                  </button>
                  <button type="button" data-s="female" aria-pressed="false">
                    Female
                  </button>
                </div>
              </div>

              <div className="rc-dual">
                <div className="rc-field">
                  <label className="rc-lab" htmlFor="rc-age">
                    Age
                  </label>
                  <input type="number" id="rc-age" min="14" max="100" defaultValue="27" inputMode="numeric" />
                </div>
                <div className="rc-field">
                  <label className="rc-lab" htmlFor="rc-height">
                    <span data-unit="height">Height (cm)</span>
                  </label>
                  <input type="number" id="rc-height" min="120" max="230" defaultValue="175" inputMode="decimal" />
                </div>
              </div>

              <div className="rc-dual">
                <div className="rc-field">
                  <label className="rc-lab" htmlFor="rc-weight">
                    <span data-unit="weight">Weight (kg)</span>
                  </label>
                  <input type="number" id="rc-weight" min="35" max="300" defaultValue="80" inputMode="decimal" />
                </div>
                <div className="rc-field">
                  <label className="rc-lab" htmlFor="rc-bf">
                    Body fat % <span className="rc-hint" style={{ display: 'inline' }}>(optional)</span>
                  </label>
                  <input type="number" id="rc-bf" min="3" max="65" placeholder="e.g. 18" inputMode="decimal" />
                </div>
              </div>
              <p className="rc-hint">
                Enter body fat % if you know it — the calculator switches to the Katch-McArdle equation and sets protein
                from lean mass, which is far more accurate for lean or higher-fat individuals.
              </p>
            </div>

            {/* GOAL & ACTIVITY */}
            <div className="rc-card">
              <h3>
                <span className="rc-dot"></span>Activity &amp; Goal
              </h3>

              <div className="rc-field">
                <label className="rc-lab" htmlFor="rc-activity">
                  Activity level
                </label>
                <select id="rc-activity" defaultValue="1.375">
                  <option value="1.2">Sedentary — desk job, &lt;5k steps, no training</option>
                  <option value="1.375">Light — light exercise / 1–3 sessions per week</option>
                  <option value="1.55">Moderate — training 3–5 days per week</option>
                  <option value="1.725">Very active — hard training 6–7 days per week</option>
                  <option value="1.9">Extreme — physical job + daily training</option>
                </select>
              </div>

              <div className="rc-field">
                <label className="rc-lab">Goal</label>
                <div className="rc-seg" id="rc-goal" role="group" aria-label="Goal">
                  <button type="button" data-g="lose" aria-pressed="true">
                    Lose fat
                  </button>
                  <button type="button" data-g="maintain" aria-pressed="false">
                    Maintain
                  </button>
                  <button type="button" data-g="gain" aria-pressed="false">
                    Gain muscle
                  </button>
                </div>
              </div>

              <div className="rc-field" id="rc-rate-field">
                <div className="rc-rangerow">
                  <label className="rc-lab" htmlFor="rc-rate" style={{ margin: 0 }}>
                    Target rate of change
                  </label>
                  <span className="rc-rangeval" id="rc-rate-val">
                    0.5 kg/wk
                  </span>
                </div>
                <input type="range" id="rc-rate" min="0.25" max="1" step="0.05" defaultValue="0.5" />
                <p className="rc-hint" id="rc-rate-hint">
                  Sustainable fat loss is ~0.5–1% of body weight per week. Faster costs muscle and adherence.
                </p>
              </div>

              <div className="rc-field">
                <label className="rc-lab" htmlFor="rc-target">
                  Goal weight <span className="rc-hint" style={{ display: 'inline' }}>(optional — enables timeline)</span>
                </label>
                <input type="number" id="rc-target" min="35" max="300" placeholder="e.g. 74" inputMode="decimal" />
              </div>

              <div className="rc-field">
                <label className="rc-lab" htmlFor="rc-formula">
                  BMR formula
                </label>
                <select id="rc-formula" defaultValue="auto">
                  <option value="auto">Auto — best available for your inputs</option>
                  <option value="mifflin">Mifflin-St Jeor</option>
                  <option value="katch">Katch-McArdle (needs body fat %)</option>
                  <option value="harris">Harris-Benedict (revised)</option>
                </select>
              </div>

              <button type="button" className="rc-cta" id="rc-calc">
                Calculate my macros
              </button>
            </div>
          </div>

          {/* RESULTS */}
          <div className="rc-results" id="rc-results" aria-live="polite">
            <div className="rc-warn" id="rc-warn"></div>

            <div className="rc-card" style={{ marginTop: '14px' }}>
              <h3>
                <span className="rc-dot"></span>Your Daily Targets
              </h3>
              <div className="rc-resgrid">
                <div className="rc-ringwrap">
                  <div className="rc-ring">
                    <svg viewBox="0 0 200 200" width="200" height="200" aria-hidden="true">
                      <circle cx="100" cy="100" r="82" fill="none" stroke="var(--line)" strokeWidth="16" />
                      <circle
                        id="rc-arc-pro"
                        cx="100"
                        cy="100"
                        r="82"
                        fill="none"
                        stroke="var(--pro)"
                        strokeWidth="16"
                        strokeLinecap="butt"
                      />
                      <circle
                        id="rc-arc-carb"
                        cx="100"
                        cy="100"
                        r="82"
                        fill="none"
                        stroke="var(--carb)"
                        strokeWidth="16"
                        strokeLinecap="butt"
                      />
                      <circle
                        id="rc-arc-fat"
                        cx="100"
                        cy="100"
                        r="82"
                        fill="none"
                        stroke="var(--fat)"
                        strokeWidth="16"
                        strokeLinecap="butt"
                      />
                    </svg>
                    <div className="rc-ringcenter">
                      <div className="rc-kcal" id="rc-kcal">
                        0
                      </div>
                      <div className="rc-kcal-lab">kcal / day</div>
                    </div>
                  </div>
                  <div className="rc-maint">
                    Maintenance: <b id="rc-maint">0</b> kcal · <span id="rc-deltalab">deficit</span>{' '}
                    <b id="rc-delta">0</b> kcal
                  </div>
                </div>

                <div>
                  <div className="rc-macros">
                    <div className="rc-mcard pro">
                      <div className="rc-mname">Protein</div>
                      <div className="rc-mgram">
                        <span id="rc-p-g">0</span>g
                      </div>
                      <div className="rc-mmeta">
                        <span id="rc-p-pct">0</span>% · <span id="rc-p-kcal">0</span> kcal
                      </div>
                    </div>
                    <div className="rc-mcard carb">
                      <div className="rc-mname">Carbs</div>
                      <div className="rc-mgram">
                        <span id="rc-c-g">0</span>g
                      </div>
                      <div className="rc-mmeta">
                        <span id="rc-c-pct">0</span>% · <span id="rc-c-kcal">0</span> kcal
                      </div>
                    </div>
                    <div className="rc-mcard fat">
                      <div className="rc-mname">Fat</div>
                      <div className="rc-mgram">
                        <span id="rc-f-g">0</span>g
                      </div>
                      <div className="rc-mmeta">
                        <span id="rc-f-pct">0</span>% · <span id="rc-f-kcal">0</span> kcal
                      </div>
                    </div>
                  </div>

                  <div className="rc-stats">
                    <div className="rc-stat">
                      <div className="k">BMR</div>
                      <div className="v" id="rc-bmr">
                        0
                      </div>
                    </div>
                    <div className="rc-stat">
                      <div className="k">Fiber target</div>
                      <div className="v" id="rc-fiber">
                        0 g
                      </div>
                    </div>
                    <div className="rc-stat">
                      <div className="k" id="rc-tl-k">
                        Timeline
                      </div>
                      <div className="v" id="rc-timeline">
                        —
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rc-field" style={{ marginTop: '18px' }}>
                <label className="rc-lab">Dietary style — re-slice the same calories</label>
                <div className="rc-presets" id="rc-presets" role="group" aria-label="Diet preset">
                  <button type="button" className="rc-preset" data-p="optimized" aria-pressed="true">
                    Optimized (default)
                  </button>
                  <button type="button" className="rc-preset" data-p="balanced" aria-pressed="false">
                    Balanced
                  </button>
                  <button type="button" className="rc-preset" data-p="highprotein" aria-pressed="false">
                    High-protein
                  </button>
                  <button type="button" className="rc-preset" data-p="lowcarb" aria-pressed="false">
                    Low-carb
                  </button>
                  <button type="button" className="rc-preset" data-p="keto" aria-pressed="false">
                    Keto
                  </button>
                </div>

                <div className="rc-rangerow">
                  <label className="rc-lab" htmlFor="rc-protein" style={{ margin: 0 }}>
                    Protein
                  </label>
                  <span className="rc-rangeval">
                    <span id="rc-protein-val">1.8</span> g/kg
                  </span>
                </div>
                <input type="range" id="rc-protein" min="1.2" max="3.1" step="0.1" defaultValue="1.8" />
                <p className="rc-hint">
                  Optimized mode anchors protein to your body mass (or lean mass if body fat is set). Presets switch to a
                  percentage split. Calories stay constant either way.
                </p>
              </div>

              <div className="rc-method" id="rc-method"></div>

              <div className="rc-actions">
                <button type="button" className="rc-ghost" id="rc-copy">
                  Copy results
                </button>
                <button type="button" className="rc-ghost" id="rc-share">
                  Copy shareable link
                </button>
              </div>

              <details className="rc-more">
                <summary>How these numbers are built (methodology)</summary>
                <p>
                  <b>BMR</b> uses Mifflin-St Jeor by default — the equation with the lowest average error in validation
                  studies. When you enter body fat %, it switches to Katch-McArdle, which is more accurate at the extremes
                  because it works from lean mass.
                </p>
                <p>
                  <b>Calories</b> come from your maintenance (BMR × activity) adjusted by the deficit or surplus needed to
                  hit your chosen weekly rate — roughly 7,700 kcal per kg. A hard floor prevents unsafe low-calorie
                  targets.
                </p>
                <p>
                  <b>Protein</b> is set per kilogram of body mass (or lean mass), because protein need scales with tissue,
                  not with how many calories you eat. <b>Fat</b> is held at a healthy floor and <b>carbs</b> fill the
                  remainder to fuel training.
                </p>
              </details>

              <p className="rc-disc" id="rc-disc">
                Educational estimate, not medical or dietary advice. Equations are built on population averages — treat
                the output as a starting point and adjust from real progress data. If you have a medical condition, are
                pregnant or breastfeeding, or have a history of disordered eating, speak with a qualified professional
                before changing your intake.
              </p>
            </div>
          </div>

          <div className="rc-toast" id="rc-toast">
            Copied
          </div>
        </div>
      </div>

      {/* Educational Caution Notice below tool */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 leading-relaxed flex items-start gap-3 shadow-2xs font-sans">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          Caution: This tool is provided solely for educational and learning purposes. It is not intended as medical, legal, or professional advice.
        </span>
      </div>

      {/* Complete Educational Guide Article */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6 text-slate-800 leading-relaxed font-sans">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <p className="text-xl sm:text-2xl font-bold text-slate-900">
            Free Macro Calculator: Accurate in Seconds
          </p>
        </div>

        <div className="space-y-6 text-slate-700 text-sm sm:text-base">
          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5">
            What Are Macronutrients (Macros)?
          </h4>

          <p>
            Forget the tired notion that macronutrients exist only to be tallied inside an app. Macros are the chemical compounds your human body demands in large quantities, separating them sharply from micronutrients measured in tiny milligrams.
          </p>

          <p>
            Three distinct types dominate every single plate: proteins, carbohydrates, and fats. Each one delivers bulk energy differently, yet humans also need water, air, and trace dietary minerals like calcium, sodium, and chloride ions for survival.
          </p>

          <p>
            I always tell clients that calories merely measure fuel, but macros decide what that fuel actually builds. Protein supplies raw materials for growth and repair; carbs and fat handle generating energy across your bodily functions.
          </p>

          <p>
            Your daily calorie intake quietly hides three completely separate stories. A gram of protein or carbohydrates yields 4 calories per gram, while fat packs 9 calories per gram, quietly reshaping how your structures rebuild themselves.
          </p>

          <p>
            Nutrition rarely respects the modern vitamin obsession at all. Vitamin A, copper, iron, and iodine genuinely matter, but arrive in milligrams, not grams. Macronutrients stay the essential nutrients consumed in the largest quantities each day.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Protein
          </h5>

          <p>
            Skip the shake-first mentality entirely for now. Proteins are organic compounds built from amino acids, and only certain essential amino acids must come through consumption. Your body quietly assembles the rest, funding muscles and bones.
          </p>

          <p>
            Animal sources clearly still dominate the conversation, yet plant-based eaters thrive perfectly fine. Meat, dairy, fish, eggs, and chicken sit beside beans, legumes, nuts, seeds, and soy. Both camps supply real building blocks for tissue.
          </p>

          <p>
            Not every single protein earns equal respect here. Complete proteins carry all amino acids; incomplete proteins miss some. Whey protein, lean beef, pork, and skinless poultry rank among healthier proteins worth prioritizing during resistance training.
          </p>

          <p>
            Collagen production, protein hormones, and insulin all depend quite heavily on steady intake. I personally target 20 to 40 grams per meal to protect lean muscle mass and genuinely build muscle without any pointless excess.
          </p>

          <p>
            Watch the unhealthier proteins quietly hiding inside everyday modern convenience. Fried meats, processed meats, deli meats, sausages, fast-food burgers, high sugar yogurts, and processed protein bars trade well-being for speed. Moderation, not elimination, quietly wins.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Carbohydrates (Carbs)
          </h5>

          <p>
            Carbs are never really the villain diet culture loudly insists upon today. Carbohydrates are saccharides ranging from monosaccharides and disaccharides to oligosaccharides and polysaccharides, each shaping blood sugar levels and satiety in wildly different ways.
          </p>

          <p>
            Simple carbohydrates spike fast; complex carbohydrates burn far more slowly. Glucose stays the body's preferred energy source, yet cellulose and dietary fibers pass through untouched, quietly steadying digestion and improving stool regularity over enough time.
          </p>

          <p>
            Fiber honestly splits into two camps entirely. Soluble fiber softens cholesterol levels; insoluble fiber adds real bulk. Both hide inside whole grains, vegetables, and fruits, unlike the stripped sugars and starches loading most processed foods.
          </p>

          <p>
            I genuinely distrust the reflexive low-carb dogma today. Carbs deliver 4 calories per gram and should occupy 45% to 65% of intake for most people. Sugar, starch, and fiber together form the wider carbohydrate family.
          </p>

          <p>
            Digestion consistently rewards variety over rigid restriction always. Starches from whole grains behave nothing like refined sugars. Prioritizing intact dietary fibers steadily improves blood sugar levels, sustains real energy, and keeps satiety working between meals.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Fat
          </h5>

          <p>
            Dietary fat spent several long decades being wrongly demonized. Fats are molecules of carbon and hydrogen atoms forming triglycerides, phospholipids, and cholesterol, serving both structural functions and metabolic functions your body cannot manufacture entirely alone.
          </p>

          <p>
            Not all fat behaves quite identically here. Saturated fats differ from unsaturated fats, which split into monounsaturated fats and polyunsaturated fats. The healthy fats everyone chases include omega-3 fatty acids, quietly supporting durable cellular health.
          </p>

          <p>
            Trans fats honestly deserve every bit of their reputation. The Dietary Guidelines for Americans, 2015-2020, capped saturated fats near 10% of calories. I treat that ceiling as sensible, not gospel, adjusting around individual reality instead.
          </p>

          <p>
            Fat is energy dense for good reason. At 9 calories per gram it drives energy storage and enables absorption of fat soluble vitamins: vitamin A, vitamin D, vitamin E, and vitamin K, quietly protecting health.
          </p>

          <p>
            Balance genuinely beats extremes here quite consistently. Most people function drawing 20-35% of calories from fat, keeping trans fats minimal and treating 6% of total fats guidance loosely. Context, not fear, should govern every choice.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            How Does the Macro Calculator Work?
          </h5>

          <p>
            Most people assume a macro calculator reads their body directly. It doesn't. It runs predictive equations against estimates, translating your numbers into daily calories and a rough percentage breakdown nobody should ever treat as gospel.
          </p>

          <p>
            Everything starts with your basal metabolic rate, the energy your body burns at rest. The tool leans on the Mifflin-St Jeor equation, a formula the American Council on Exercise popularized for the everyday average person.
          </p>

          <p>
            There's a quieter second path. If you know your body fat percentage, the Katch-McArdle formula and Cunningham equation compute resting metabolic rate from lean body mass instead, which practitioners find sharper than MacroFactor BMR formulas.
          </p>

          <p>
            From that BMR, the machine layers an activity multiplier, folding in exercise and the thermic effect of food. What emerges is your TDEE, or Total Daily Energy Expenditure, the figure driving every downstream macronutrient percentages.
          </p>

          <p>
            Here's what the interface hides: no registered dietitian nutritionist built your exact profile. The activity factor is a bucket, not a fingerprint. Treat outputs as a starting hypothesis, then verify against scale movement over weeks.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            How to Use the Macro Calculator
          </h5>

          <p>
            Skip the instinct to guess. The inputs demand honesty: gender or sex, age, weight, and height, entered in either imperial or metric units, whichever drop-down menu you actually think in without mentally converting numbers midway.
          </p>

          <p>
            Choose your measurement carefully. Pounds and feet and inches suit some; kilograms and cm suit others. A 150 lb frame reads as 68.18 kg. Enter these data points cleanly, because rounding errors cascade through calculations.
          </p>

          <p>
            Your physical activity selection matters more than people credit. Sedentary desk workers routinely overstate movement. Be brutal about your true activity level, since inflating it silently sabotages whatever goal you actually set, cutting or building.
          </p>

          <p>
            Next comes intent. The weight loss goals field lets you pick maintain weight, lose weight, or gain weight. Each shifts the target away from maintenance calories, producing a deliberate deficit or surplus rather than maintenance.
          </p>

          <p>
            Finally, layer diet type. A Mediterranean diet, high-protein diet, or low fat diet each reshapes your percentages. The macro calculator then returns a personalized breakdown of proteins, carbs, and fats matched against your personal goals.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Daily Calorie Needs
          </h5>

          <p>
            Forget the tired 2000 default plastered on every nutrition label. That 2000-calorie diet describes nobody specifically. Your genuine daily caloric needs depend on stacked variables the Centers for Disease Control and Prevention openly acknowledges elsewhere.
          </p>

          <p>
            Ranges exist for a reason. Most men land between 1600-3000 calories; most women between 1600-2400. The American Dietetic Association clearly frames these as energy needs shaped by body weight, age, height, and honest activity level.
          </p>

          <p>
            Movement outside the gym quietly dominates. NEAT, or non-exercise activity thermogenesis, separates a fidgety 10000 steps person from a 5000 steps one. Two identical bodies at 15000 steps versus a desk job burn different totals.
          </p>

          <p>
            Multipliers make this concrete. Lightly active people use roughly 1.25; moderately active near 1.45; very active around 1.65; extra active athletes stretching toward 1.85 or 2.05. Layered onto BMR, these convert baseline calories into expenditure.
          </p>

          <p>
            Expect drift. Metabolic adaptation means your body defends itself, trimming output during a deficit. Regular strength training blunts that decline. Recheck your daily calories every few weeks, because yesterday's estimates rarely survive sustained energy needs.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            How to Count and Calculate Your Macros
          </h5>

          <p>
            Counting macros without a food scale is guesswork dressed as precision. Eyeballing a chicken breast wrecks your numbers faster than any cheat meal. A cheap kitchen scale and the serving size beat intuition every time.
          </p>

          <p>
            The arithmetic is unforgiving but simple. 1 gram carbohydrates 4 calories, 1 gram protein 4 calories, 1 gram fat 9 calories. That asymmetry, 9 calories per gram for fat, explains why portions matter enormously here.
          </p>

          <p>
            Work the split backward. On a 2000 calories plan at 40% carbs, 30% protein, 30% fat, you land near 200 g carbs, 150 g protein, and 67 g fat. Those grams become your tracking targets.
          </p>

          <p>
            Weight matters cooked or raw. 100g raw chicken shrinks to 75g cooked, and logging the wrong state inflates intake silently. Pull verified entries from FoodData Central by the USDA rather than trusting a random app.
          </p>

          <p>
            Respect the guardrails. Daily percentages allow 45% to 65% carbs, 10% to 35% protein, and 20% to 35% fat. A food journal keeps you inside that macronutrient range while a nutrition label verifies each portion.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Benefits Of Tracking Macros
          </h5>

          <p>
            Most people assume tracking macros exists only for bodybuilders, yet the sharpest benefits surface in ordinary kitchens. Awareness of your everyday food choices reshapes daily behavior far faster than any restrictive rulebook ever really manages.
          </p>

          <p>
            Athletes chasing muscle building obsess over protein intake, but I have watched desk workers gain more from simple portion control. The number on your plate teaches proportion, and proportion quietly rewrites how genuine hunger feels.
          </p>

          <p>
            Flexible dieting, often branded IIFYM or if it fits your macros, dismantles the guilt myth of no bad foods through arithmetic. Balanced nutrition becomes math, not morality, and that quiet reframing sustains real long-term consistency.
          </p>

          <p>
            Clinical value hides here too. People managing diabetes gain tighter blood sugar control, while those with kidney disease monitor protein intake deliberately. Nutrient-dense foods and honest food quality decisions carry genuinely measurable health goals forward.
          </p>

          <p>
            Weight loss rarely fails from ignorance; it fails from invisibility. Once satiety signals connect to actual grams, fiber-rich vegetables and fruits stop being distant abstractions. You finally see why blood sugar levels swing, then adjust.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Potential Risks Of Tracking Macros
          </h5>

          <p>
            Not for everyone is the disclaimer nobody prints loudly enough. The same precision that empowers some tips others toward obsession, where every logged gram feels like a verdict on your personal worth and daily discipline.
          </p>

          <p>
            For anyone with a history of eating disorders, this practice carries genuine danger. Disordered eating thrives on intense focus and control, and macro logging can quietly become fuel rather than a neutral, harmless measurement tool.
          </p>

          <p>
            Eating disorders aside, the ordinary risks are that it stays tedious. Weighing, logging, recalculating demands mental bandwidth many busy lives cannot spare. Sustainability, not accuracy, decides whether the habit survives past a single motivated fortnight.
          </p>

          <p>
            Your medical history matters more than any app algorithm. Before restructuring nutrition goals, consulting a trusted dietitian or nutritionist protects against harm that spreadsheets never flag, especially where clinical complications already exist quietly beneath everything.
          </p>

          <p>
            Mental health deserves the loudest caution. Numbers offer control, and control seduces during chaos. When tracking starts governing your mood instead of merely informing choices, the tool has stopped serving and started silently commanding you.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Using The Calculator For Weight Loss
          </h5>

          <p>
            The scale lies more often than it tells truth, which is why intelligent fat loss starts with a measurable calorie deficit, not a fluctuating morning number that swings wildly with water, salt, and yesterday's sodium.
          </p>

          <p>
            A sensible rate of weight loss sits near 0.5-0.75% body weight per week. Faster promises sell programs but sabotage long-term efficacy. Your macronutrient intake should feel survivable, because adherence beats aggression across every honest timeline.
          </p>

          <p>
            Set protein high first; it defends muscle during any calorie reduction. Then carbohydrate consumption and healthy fats fill remaining energy. Roughly 45% from carbs suits most, though bodies negotiate these ratios individually and stubbornly always.
          </p>

          <p>
            The ketogenic diet, or keto, drops carbs toward 5% to 10% carbs to force fat burning. It works for some, yet safety and enjoyment matter. Extreme restriction rarely outlasts the novelty that first inspired it.
          </p>

          <p>
            Beware rapid weight loss marketing everywhere. Quick drops are mostly water, and painful rebound is nearly guaranteed. A dietitian grounds expectations, translating vanity targets into weight loss your metabolism and schedule can genuinely sustain longer.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Using The Calculator For Weight Maintenance
          </h5>

          <p>
            Weight maintenance is harder than losing, though nobody ever celebrates it. Hitting your ideal weight feels like arrival, yet regaining weight ambushes most people within 12 months because they abandon the very structure that worked.
          </p>

          <p>
            Maintenance simply means eating at your TDEE, total daily energy expenditure. The distribution of protein, carbohydrates, and fat can loosen considerably, but the ceiling cannot vanish, or hard-won sustained weight loss quietly reverses itself completely.
          </p>

          <p>
            The Mediterranean diet ages well precisely because it never punishes. Lean proteins, fruits, vegetables, and minimal red meat create satisfaction without rigid logging. Enjoyment, not restriction, determines whether six months becomes a permanent lifelong pattern.
          </p>

          <p>
            Vegetarian and vegan approaches maintain beautifully when plant-based proteins anchor each meal. Beans and lentils deliver both protein and fiber cheaply. Variety here prevents the boredom that historically sabotages otherwise disciplined long-term eaters almost everywhere.
          </p>

          <p>
            The Atkins diet and similar low-carb structures can hold weight, but rigidity invites rebound. Maintenance rewards flexibility over dogma. Whatever framework you chose, quiet sustainability matters infinitely more than the first dramatic, disciplined losing month.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Using The Calculator For Muscle Gain
          </h5>

          <p>
            Most lifters assume a massive caloric surplus accelerates muscle gain, yet the calculator reveals a leaner reality: a modest 50 calorie surplus frequently outperforms reckless weight gain stacked with pointless fat and predictable regret afterward.
          </p>

          <p>
            Your training age truly dictates everything here. A raw beginner or novice captures building muscle at rates a seasoned advanced lifter envies, since genetic potential narrows sharply once you honestly climb past the intermediate tier.
          </p>

          <p>
            Punch your numbers in and target 0.5-2% body weight per month; anything faster is fat masquerading as lean muscle mass. Aggressive bulking without that ceiling wastes months you later spend dieting the excess back off.
          </p>

          <p>
            Protein intake anchors the equation, roughly 20 to 40 grams protein per feeding, while carbohydrate intake refills muscle glycogen between brutal sessions of hard resistance training that actually earn the surplus you keep eating toward.
          </p>

          <p>
            Dietary fat rarely gets deliberately planned, yet it drives the hormones underpinning growth. Advanced trainees chase recomposition instead, holding weight while shifting composition, though the calculator warns this pathway crawls slower than impatient people accept.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Adjusting Your Macros
          </h5>

          <p>
            Treat the calculator output as a loose hypothesis, never gospel. Every single number rests on estimation and group averages, so your real starting point only emerges after weeks of honest progress tracking against the scale.
          </p>

          <p>
            Metabolic adaptation is the saboteur nobody flags early. Prolonged cutting into a deliberate energy deficit triggers a 5% BMR reduction, occasionally a 3% BMR reduction inside a weight-reduced state, forcing sharper diet adjustments than predicted.
          </p>

          <p>
            Scale weight lies daily through water retention, muscle glycogen, and gut content. Ignore noise; track weekly weight change or monthly weight change as a rolling average weight before touching your calorie needs or macros again.
          </p>

          <p>
            When progress stalls during bulking, add 330 kcal; hard gainers may need 1100 kcal because NEAT and non-exercise activity thermogenesis incinerate caloric surplus. Cutting stalls invert this: subtract 150 kcal, 250 kcal, or 500 kcal.
          </p>

          <p>
            Hold protein near 1 g per pound while recomping, dropping to 0.73 g per pound or 1.6 g per kg at maintenance, climbing to 2.2 g per kg as target body weight approaches through adherence.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Macros Vs Calories
          </h5>

          <p>
            The tired debate frames counting calories against counting macronutrients as rival religions, but practitioners know energy balance governs the scale while macro ratios govern whether the weight you lost is fat or hard-won muscle tissue.
          </p>

          <p>
            CICO, meaning calories in calories out, remains stubborn physics you cannot cheat. A calorie deficit shrinks you regardless of food breakdown, yet food quality decides how miserable, hungry, and hormonally wrecked that whole process feels.
          </p>

          <p>
            Dieting purely by calories completely ignores satiety. Two identical days built from processed foods versus whole foods produce wildly different hunger, meaning the genuinely more effective approach usually layers macro targets over raw energy math.
          </p>

          <p>
            A balanced diet with deliberate protein floors protects the lean tissue that pure counting calories neglects entirely. That is why seasoned coaches treat energy balance as foundation and macro ratios as structural framing above it.
          </p>

          <p>
            My honest field observation: beginners thrive counting calories first, then graduate to counting macronutrients once the daily habit fully sticks. Stacking both systems simultaneously overwhelms most people and torpedoes the consistency that actually determines outcomes.
          </p>

          <h5 className="text-md sm:text-lg font-bold text-slate-900 pt-2">
            Macronutrients In Common Foods
          </h5>

          <p>
            Nutrition apps flatten every meal into three numbers, but staring at the serving size printed on a cheeseburger teaches more than any chart. Real intuition grows from handling actual whole food sources, not scanning barcodes.
          </p>

          <p>
            Fruit confuses anxious dieters constantly. An apple, banana, grapes, orange, pear, peach, pineapple, strawberry, and watermelon all deliver carbs plus fiber, yet nervous people fear their grams of natural sugar while cheerfully ignoring soda entirely.
          </p>

          <p>
            Vegetables anchor sheer volume: asparagus, broccoli, carrots, cucumber, eggplant, lettuce, and tomato flood your plate with complex carbs and satisfying bulk for almost nothing, quietly forming the reliable backbone of any sane fresh produce rotation.
          </p>

          <p>
            Protein sources diverge sharply. Beef, chicken, pork, shrimp, catfish, fish, egg, and tofu each carry wildly different fat per ounces, while a plain cup of yogurt or a cold glass of milk adds surprising grams.
          </p>

          <p>
            The wreckers hide in plain sight: pizza, hamburger, bread, butter, caesar salad, dark chocolate, beer, coca-cola, diet coke, orange juice, apple cider, plus corn, potato, rice, sandwich, tablespoon portions, every slice measured against unprocessed foods.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            How The Calculator Builds Your Daily Macro Targets
          </h4>

          <p>
            Most people assume this tool merely guesses their numbers. It doesn't. Before it can count macros, it anchors every output to your resting daily energy expenditure — the RDEE value describing what your body burns at complete rest.
          </p>

          <p>
            Clinicians once called this basal metabolic activity, and organizations like the ACE still frame the same idea slightly differently. Whatever the label, the engine first estimates calorie needs on a daily basis, then partitions them.
          </p>

          <p>
            Partitioning is where your macronutrient needs appear. The calculator splits total energy into a protein range, a carbohydrate range, and a fat range, each expressed as grams rather than vague percentages you cannot plate.
          </p>

          <p>
            Here is what surprises newcomers: the same RMR can support two goals at once. Choose to maintain and calories hold steady; choose to lose and the tool trims intake beneath the baseline it used to calculate macros.
          </p>

          <p>
            Sanity-check the output against reality. The World Health Organization pegs typical adult intake near 2000-3000 calories; drop toward coma calories and no split saves you. Even steps per day shift the math, tying health and fitness together.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Body Weight, Lean Mass, And The Logic Of Grams Per Pound
          </h4>

          <p>
            Forget scale weight as the master variable. Serious tools weight lean mass far more heavily, because muscle — not fat — dictates how much protein your lean body mass actually demands each day.
          </p>

          <p>
            The gram targets look arbitrary until you see the ratios. A common anchor sits at 1 g per pound of bodyweight, or 2.2 g per kg — identical numbers wearing different measurement clothing.
          </p>

          <p>
            Push harder and the numbers climb. Physique athletes often program 1.14 g per pound, roughly 2.5 g per kg, when cutting. The calculator lets you adjust macros upward without recomputing your entire plan by hand.
          </p>

          <p>
            One detail wrecks more diets than any other: whether you log raw weight or cooked weight. Chicken loses water when heated, so the same breast reads differently, quietly sabotaging your tracking accuracy for weeks.
          </p>

          <p>
            Convenience matters too, which is why the tool expresses protein in both grams per pound and grams per kilogram. Hitting the number through whey protein is fine; the calculator only cares that grams land.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Dietary Fat: Molecules, Structure, And Stored Energy
          </h4>

          <p>
            Fat is not the villain your macro split makes it look like. At the level of molecules, it is elegant engineering — chains of carbon bonded to hydrogen atoms, built for dense, portable fuel.
          </p>

          <p>
            Three forms do the heavy lifting inside you. Triglycerides dominate energy storage, phospholipids shape every cell membrane, and cholesterol — endlessly maligned — underpins hormones. Grouping fat into three types clarifies why it matters.
          </p>

          <p>
            Why does the calculator treat fat grams cautiously? Because fat is energy dense — more than double the calories of protein per gram — so small logging errors here distort totals faster than anywhere else.
          </p>

          <p>
            Beyond fuel, fat runs the quiet metabolic functions most dieters never credit. Enzyme activation, temperature regulation, nerve signalling — none of it happens without adequate lipid intake, regardless of what your aggressive cut suggests.
          </p>

          <p>
            The structural functions deserve equal billing. Every membrane, every myelin sheath, leans on fat architecture. Strip it too low and the body protests long before the scale rewards you for the sacrifice.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Choosing Fats And The Fat-Soluble Vitamins They Deliver
          </h4>

          <p>
            Not all fat grams are moral equals, whatever your macro total pretends. Trans fats behave nothing like omega-3 fatty acids, yet both count identically in the box. Quality hides inside the number.
          </p>

          <p>
            Sort them by chemistry. Saturated fats stack straight and solidify; unsaturated fats kink and stay liquid, splitting further into monounsaturated fats and polyunsaturated fats. Prioritising the latter is what earns the label healthy fats.
          </p>

          <p>
            Numbers ground the advice. The Dietary Guidelines for Americans, in the 2015-2020 edition, capped saturated intake near 10% of calories and pushed total fat into a 20-35% window of daily energy.
          </p>

          <p>
            There is a sharper cut-off worth knowing. Keeping trans intake beneath roughly 6% of total fats protects arteries in ways no supplement reverses. Sources like low-fat dairy products and modest cheese fit comfortably here.
          </p>

          <p>
            Here is the payoff dieters forget. Fat soluble vitamins — vitamin A, vitamin D, vitamin E, and vitamin K — hitch a ride on lipids, so their absorption collapses on a near-zero-fat plan.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Carbohydrates: From Simple Sugars To Complex Chains
          </h4>

          <p>
            Carbs earned a bad reputation they mostly don't deserve. Strip away the fear and carbohydrates are simply saccharides — sugar units your body prefers as its fastest fuel, whatever low-carb marketing insists.
          </p>

          <p>
            Size sorts the family. Monosaccharides like glucose stand alone; disaccharides pair up; oligosaccharides form short chains; and polysaccharides stretch long. That single spectrum explains most confusion around simple carbohydrates versus complexity.
          </p>

          <p>
            The complex carbohydrates camp is where starch lives, dense starches the gut dismantles slowly over hours. Contrast that with free sugars hitting your blood fast, and identical gram counts behave nothing alike.
          </p>

          <p>
            Energy accounting keeps it honest. Each carb gram delivers 4 calories per gram, the same as protein, which is why the calculator can swap them mathematically even though your physiology treats them very differently.
          </p>

          <p>
            Placement, not just amount, guides the range. Most frameworks park carbs at 45% to 65% of intake, generous room that lets athletes fuel training while sedentary users trim without ever hitting zero.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Fiber, Digestion, And Where Carbs Live In Food
          </h4>

          <p>
            The most useful carbohydrate is the one you can't even absorb. Dietary fibers pass through largely intact, yet they govern digestion, appetite, and metabolic health more than any digestible energy source.
          </p>

          <p>
            Fiber itself divides neatly. Soluble fiber gels in water and helps lower cholesterol levels, while insoluble fiber — think cellulose — adds bulk and drives stool regularity. Two mechanisms, one badly underrated macro sub-component.
          </p>

          <p>
            Source quality decides the outcome. Whole grains and legumes carry fiber intact; processed foods strip it out for shelf life, which is precisely why two equal-carb meals can leave you feeling opposite.
          </p>

          <p>
            Now widen the lens to the whole diet. Protein supplements fill gaps, but real food supplies the necessary elements and vitamins that isolated powders cannot replicate at any real scale.
          </p>

          <p>
            Micronutrient density is the quiet tiebreaker. A serving might carry only 100 milligrams of a key mineral, yet across a day those trace amounts compound into the difference between adequate and merely sufficient eating.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            How Do I Calculate My Macronutrient Needs?
          </h4>

          <p>
            Stop hunting one magic number. Your macronutrient needs start from daily caloric needs, then bend around your type of diet, weight goals, and health goals. Set each percentage, watch results, and adjust percentages deliberately as your body honestly responds.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            How Do You Calculate The Macros In Your Food?
          </h4>

          <p>
            Ditch eyeballing entirely. Weigh portions on a food scale, read packaged food labels, and pull nutrition information from FoodData Central by the USDA. A balanced split targets roughly 60% carbohydrates and 30% protein, with the rest from healthy fat.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            How Do You Calculate Macros For Special Diets?
          </h4>

          <p>
            Plant-based never means protein-starved. A macro calculator ignores food origin, so special diets only shift ingredients, not macronutrient distribution. Whether vegan, vegetarian, or gluten-free, lean on beans and lentils for carbohydrates and protein in one filling serving.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Can I Use The Macro Calculator If I Have A Medical Condition?
          </h4>

          <p>
            Here is the blunt truth: a calculator cannot read bloodwork. With any medical condition, treat its macronutrient profile as a draft and let a health care provider approve it. Numbers ignore micronutrients and your genuine individual health needs entirely.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Can The Macro Calculator Help Me Lose Weight?
          </h4>

          <p>
            The tool never causes loss; a deficit does. Most weight loss plans fail on adherence, so do not blindly restrict macronutrients or increase macronutrients. Fit your diet to individual goals, and let a health care provider guide any medical case.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            What Is A Good Macro Ratio For Fat Loss Or Muscle Gain?
          </h4>

          <p>
            Chase adherence, not a perfect macro ratio. For fat loss, prioritize high-quality protein and sensible carbohydrate intake; for muscle gain, raise carbohydrate consumption toward 45% daily calories, keep protein steady, add healthy fat. Match training goals, and consult a dietitian.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            What Are The Downsides Of Counting Macros?
          </h4>

          <p>
            Tracking can quietly backfire. It is tedious, and the intense focus on numbers sometimes tips vulnerable people toward disordered eating. Anyone with a fraught medical history should keep nutrition goals attached to living well, guided by a dietitian or nutritionist.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Does This Calculator Work And Why Should I Trust It?
          </h4>

          <p>
            Trust it only as a starting point. Built on estimations and group averages, it leans on BMR formulas and an activity multiplier that most people misjudge. Respect these calculator limitations, make one informed decision, then let reality overrule the estimate.
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 py-0.5 pt-4">
            Is It Better To Focus On Macros Or Calories?
          </h4>

          <p>
            It is a false binary. Calories decide whether weight moves; macros and food quality decide how you feel. Stack them: set calories, arrange ratios, then favor a balanced diet of whole foods over processed foods whenever you reasonably can.
          </p>
        </div>
      </div>
    </div>
  );
};
