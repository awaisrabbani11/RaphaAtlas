import React from 'react';
import { TECH_STACK_LAYERS } from '../data/blueprintData';
import { ShieldCheck, Database, DollarSign, Lock, Server, CheckCircle2 } from 'lucide-react';

export const TechIntegrationView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-2 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 font-['Playfair_Display',serif]">
          <ShieldCheck className="h-5 w-5 text-teal-600 font-sans" />
          <span>Technical Architecture, Integration & Monetization Strategy</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          Complete engineering specification for RaphaAtlas.com covering API gateway topology, database schemas, medical safety guardrails, and revenue drivers.
        </p>
      </div>

      {/* Tech Stack Layers Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-['Playfair_Display',serif]">
          <Server className="h-4 w-4 text-teal-600 font-sans" />
          <span>1. Core System Stack & Integration Strategy</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <th className="py-3 px-3">System Layer</th>
                <th className="py-3 px-3">Technology Choice</th>
                <th className="py-3 px-3">Functional Purpose</th>
                <th className="py-3 px-3">Integration Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              {TECH_STACK_LAYERS.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap">{item.layer}</td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-teal-800">{item.technology}</td>
                  <td className="py-3.5 px-3 text-slate-600">{item.purpose}</td>
                  <td className="py-3.5 px-3 text-slate-800">{item.integrationStrategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Schema Blueprint */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-['Playfair_Display',serif]">
          <Database className="h-4 w-4 text-teal-600 font-sans" />
          <span>2. Database Entity Schema Blueprint (Firestore / Cloud SQL)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-teal-800 font-bold block">Entity: users</span>
            <ul className="text-slate-600 space-y-1">
              <li>id: string (PK)</li>
              <li>email: string</li>
              <li>subscriptionTier: 'free' | 'pro'</li>
              <li>aiCreditsRemaining: number</li>
              <li>createdAt: timestamp</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-teal-800 font-bold block">Entity: content_articles</span>
            <ul className="text-slate-600 space-y-1">
              <li>id: string (PK)</li>
              <li>title: string</li>
              <li>pillar: 'LIFESTYLE' | 'FITNESS' | 'MEDICAL'</li>
              <li>seoKeywords: string[]</li>
              <li>draftContent: text</li>
              <li>medicalReviewed: boolean</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-teal-800 font-bold block">Entity: ai_reports</span>
            <ul className="text-slate-600 space-y-1">
              <li>id: string (PK)</li>
              <li>userId: string (FK)</li>
              <li>toolType: string</li>
              <li>inputQuery: string</li>
              <li>aiResponseText: text</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-teal-800 font-bold block">Entity: saved_routines</span>
            <ul className="text-slate-600 space-y-1">
              <li>id: string (PK)</li>
              <li>userId: string (FK)</li>
              <li>routineType: 'sleep' | 'workout' | 'nutrition'</li>
              <li>scheduleData: JSON</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance & Monetization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compliance */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-['Playfair_Display',serif]">
            <Lock className="h-4 w-4 text-teal-600 font-sans" />
            <span>3. Medical Compliance & Safety Framework</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Persistent Disclaimers:</strong> Every AI tool output and clinical guide automatically appends medical safety disclosures.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>System Prompt Guardrails:</strong> Gemini 3.6 system instructions explicitly instruct the model to provide educational information rather than clinical diagnoses.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Emergency Triage Triggers:</strong> Acute symptoms (e.g. chest pain) automatically trigger immediate emergency care (911) guidance.</span>
            </li>
          </ul>
        </div>

        {/* Monetization */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-['Playfair_Display',serif]">
            <DollarSign className="h-4 w-4 text-teal-600 font-sans" />
            <span>4. RaphaAtlas Monetization Strategy</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Freemium AI Credits:</strong> 5 free AI queries/day. RaphaAtlas Pro membership ($19/mo) grants unlimited queries & saved lab history.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Affiliate Integrations:</strong> Curated recommendations for sleep trackers, gymnastics rings, bloodwork testing kits (Function Health, InsideTracker).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Directory Listing Fees:</strong> Verified telehealth clinics and physical therapists pay monthly featured listing fees on RaphaAtlas.com.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
