import React, { useState } from 'react';
import { USER_PERSONAS } from '../data/blueprintData';
import { UserPersona } from '../types';
import { Users, CheckCircle2, Target, AlertTriangle } from 'lucide-react';

export const UserJourneysView: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(USER_PERSONAS[0]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-2 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 font-['Playfair_Display',serif]">
          <Users className="h-5 w-5 text-teal-600 font-sans" />
          <span>User Experience & Persona Journey Simulator</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          Understanding how different user segments discover, engage with, and utilize RaphaAtlas.com content and AI tools.
        </p>
      </div>

      {/* Persona Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {USER_PERSONAS.map((persona) => {
          const isSelected = selectedPersona.id === persona.id;
          return (
            <div
              key={persona.id}
              onClick={() => setSelectedPersona(persona)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-white border-2 border-teal-600 shadow-sm'
                  : 'bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{persona.name}</h3>
                  <p className="text-[11px] text-slate-500">{persona.role}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {persona.primaryPillars.map((p, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Persona Detail & Journey Steps */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={selectedPersona.avatar}
              alt={selectedPersona.name}
              className="h-14 w-14 rounded-full object-cover border-2 border-teal-600"
            />
            <div>
              <h3 className="text-xl font-bold font-['Playfair_Display',serif] text-slate-900">{selectedPersona.name}</h3>
              <p className="text-xs text-slate-500">{selectedPersona.role}</p>
            </div>
          </div>
        </div>

        {/* Goals vs Pain Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-teal-800 flex items-center gap-1.5 uppercase text-[11px]">
              <Target className="h-4 w-4 text-teal-600" />
              <span>Core Health Goals</span>
            </span>
            <ul className="space-y-2 text-slate-700">
              {selectedPersona.goals.map((g, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-amber-800 flex items-center gap-1.5 uppercase text-[11px]">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Pain Points & Friction</span>
            </span>
            <ul className="space-y-2 text-slate-700">
              {selectedPersona.painPoints.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-slate-900 font-['Playfair_Display',serif]">
            RaphaAtlas.com User Journey Flow
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {selectedPersona.userJourney.map((step, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs relative"
              >
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-teal-50 text-teal-800 border border-teal-200">
                  Stage {idx + 1}: {step.stage}
                </span>

                <p className="font-semibold text-slate-900 mt-1">{step.action}</p>

                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <span className="text-slate-500 block">Touchpoint:</span>
                  <span className="text-teal-800 font-semibold block">{step.raphaAtlasTouchpoint}</span>
                  <span className="text-slate-600 block mt-1">
                    <strong>Outcome:</strong> {step.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
