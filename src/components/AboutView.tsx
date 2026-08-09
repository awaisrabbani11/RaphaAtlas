import React from 'react';
import { Building2, Stethoscope, Award, ShieldCheck, Mail, Globe, ArrowRight, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  onNavigateContact: () => void;
  onNavigateCalculators: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateContact, onNavigateCalculators }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 font-sans">
      {/* Hero Header */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 font-mono">
          <Building2 className="h-3.5 w-3.5 text-teal-600" />
          <span>A PROJECT OF GROWTH PARTNERS GLOBAL LLC</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display',serif] text-slate-900 leading-tight">
          About RaphaAtlas
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed font-sans">
          RaphaAtlas is a sovereign clinical health calculator hub, evidence-based publication, and interactive AI suite. Our mission is to translate complex laboratory biomarkers, physiological formulas, and medical literature into clear, actionable health tools.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={onNavigateCalculators}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
          >
            <HeartPulse className="h-4 w-4" />
            <span>Explore Health Calculators</span>
          </button>
          <button
            onClick={onNavigateContact}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            <span>Contact Medical Team</span>
          </button>
        </div>
      </div>

      {/* Parent Organization & Medical Leadership */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Overview */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-2xl text-slate-800">
              <Globe className="h-6 w-6 text-teal-700" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Corporate Entity
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
                Growth Partners Global LLC
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            RaphaAtlas is proudly developed and operated under <strong className="text-slate-900">Growth Partners Global LLC</strong> (<a href="https://growthpartnersgloballlc.com" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline font-semibold hover:text-teal-900">growthpartnersgloballlc.com</a>).
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-900 block">Core Directives:</span>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>Zero-paywall access to evidence-based health formulas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>Server-side privacy-first processing for user inputs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>Rigorous physician-led editorial oversight</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Leadership Credits */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 rounded-2xl text-teal-700 border border-teal-100">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider block">
                Medical & Editorial Oversight
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
                Physician Advisory Board
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All algorithms, medical articles, and AI logic guidelines on RaphaAtlas are reviewed and authored under the clinical leadership of licensed medical practitioners:
          </p>

          <div className="space-y-3 pt-1">
            {/* Dr. Awais */}
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 flex items-start gap-3">
              <div className="p-2 bg-teal-700 text-white rounded-xl text-xs font-bold shrink-0">
                Dr.
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Dr. Muhammad Awais Rabbani</h4>
                <p className="text-xs text-slate-600">Clinical Lead &amp; Medical Content Editor</p>
                <a
                  href="mailto:dr.awais@growthpartnersgloballlc.com"
                  className="inline-block text-[11px] font-mono text-teal-800 hover:underline pt-1"
                >
                  dr.awais@growthpartnersgloballlc.com
                </a>
              </div>
            </div>

            {/* Dr. Ahmed */}
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 flex items-start gap-3">
              <div className="p-2 bg-teal-700 text-white rounded-xl text-xs font-bold shrink-0">
                Dr.
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Dr. Ahmed Humayon</h4>
                <p className="text-xs text-slate-600">Co-Clinical Director &amp; Medical Informatics</p>
                <a
                  href="mailto:dr.ahmed@growthpartnergloballlc.com"
                  className="inline-block text-[11px] font-mono text-teal-800 hover:underline pt-1"
                >
                  dr.ahmed@growthpartnergloballlc.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standards & Philosophy */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-6">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-bold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>EVIDENCE &amp; CLINICAL INTEGRITY STANDARDS</span>
        </div>

        <h3 className="text-2xl font-bold font-['Playfair_Display',serif]">
          Our Commitment to Medical Accuracy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300">
          <div className="space-y-2 p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
            <span className="font-bold text-white block">Peer-Reviewed Science</span>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every calculator formula and article cites established clinical guidelines (AHA, ESC, ISSN, Widmark).
            </p>
          </div>
          <div className="space-y-2 p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
            <span className="font-bold text-white block">No Hidden Paywalls</span>
            <p className="text-slate-400 text-xs leading-relaxed">
              Health tools should be universally accessible. All calculators remain 100% free for patient and public use.
            </p>
          </div>
          <div className="space-y-2 p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
            <span className="font-bold text-white block">Physician Oversight</span>
            <p className="text-slate-400 text-xs leading-relaxed">
              Maintained under the direct guidance of Dr. Muhammad Awais Rabbani and Dr. Ahmed Humayon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
