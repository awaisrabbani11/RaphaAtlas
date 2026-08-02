import React, { useState } from 'react';
import { SITE_MAP_TREE, CATEGORY_NODES, TECH_STACK_LAYERS, USER_PERSONAS } from '../data/blueprintData';
import { X, Copy, Check, Download } from 'lucide-react';

interface BlueprintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintExportModal: React.FC<BlueprintExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<'markdown' | 'json' | 'sitemap'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownBlueprint = (): string => {
    return `# RaphaAtlas.com — All-in-One Health Platform Blueprint

## Executive Overview
RaphaAtlas.com is a next-generation health platform unifying four primary pillars:
1. **LIFESTYLE & LONGEVITY**: Sleep hygiene, circadian optimization, stress reduction, biohacking.
2. **FITNESS & MOVEMENT**: Functional strength, calisthenics, joint mobility, injury rehabilitation.
3. **MEDICAL & CLINICAL KNOWLEDGE**: Medical jargon simplification, lab result decoding, preventive screening timelines.
4. **AI HEALTH UTILITIES**: Live generative AI tools for real-time symptom context, meal protocols, and workout coaching.

---

## 1. Website Architecture & Hierarchy

- **Domain**: RaphaAtlas.com
- **Homepage**: / (Central Launchpad & Global Search)
- **Lifestyle Hub**: /lifestyle
  - /lifestyle/sleep (Sleep Optimization)
  - /lifestyle/stress (Stress & Breathwork)
  - /lifestyle/nutrition (Metabolic Nutrition)
- **Fitness Hub**: /fitness
  - /fitness/strength (Functional Strength)
  - /fitness/calisthenics (Bodyweight Mastery)
  - /fitness/mobility (Mobility & Rehab)
- **Medical Hub**: /medical
  - /medical/labs (Lab Results Decoded)
  - /medical/preventive (Preventive Screenings)
  - /medical/directory (Telehealth Directory)
- **AI Tools Suite**: /ai-tools
  - /ai-tools/jargon-simplifier (AI Medical Jargon Simplifier)
  - /ai-tools/symptom-triage (AI Symptom Contextualizer)
  - /ai-tools/routine-generator (AI Lifestyle Routine Planner)
  - /ai-tools/workout-coach (AI Workout & Mobility Coach)

---

## 2. Content Categorization Matrix (4 Pillars)

${CATEGORY_NODES.map(
  (cat) => `### ${cat.title} [Pillar: ${cat.pillar}]
- **Audience**: ${cat.targetAudience}
- **Description**: ${cat.description}
- **Sub-topics**: ${cat.subTopics.join(', ')}
- **Associated AI Tool**: ${cat.aiToolsAssociated.join(', ')}
`
).join('\n')}

---

## 3. Technical Stack & Integration Strategy

${TECH_STACK_LAYERS.map(
  (t) => `- **${t.layer}**: ${t.technology} | *${t.purpose}*`
).join('\n')}

---

## 4. Medical Safety & Compliance Guardrails
- **Educational Disclaimers**: Automatic disclaimer banners attached to all AI output and clinical guides.
- **System Prompt Guardrails**: Strictly instructs model to clarify non-diagnostic informational context.
- **Emergency Escalation**: Automatic 911/ER redirect triggers for acute symptoms.
`;
  };

  const generateJsonBlueprint = (): string => {
    return JSON.stringify(
      {
        appName: 'RaphaAtlas.com',
        version: '1.0.0',
        siteHierarchy: SITE_MAP_TREE,
        categories: CATEGORY_NODES,
        techStack: TECH_STACK_LAYERS,
        personas: USER_PERSONAS,
      },
      null,
      2
    );
  };

  const generateSitemapText = (): string => {
    return `RaphaAtlas.com Sitemap Tree:
/
├── /lifestyle (Lifestyle Hub)
│   ├── /lifestyle/sleep
│   ├── /lifestyle/stress
│   └── /lifestyle/nutrition
├── /fitness (Fitness Hub)
│   ├── /fitness/strength
│   ├── /fitness/calisthenics
│   └── /fitness/mobility
├── /medical (Medical Hub)
│   ├── /medical/labs
│   ├── /medical/preventive
│   └── /medical/directory
└── /ai-tools (AI Health Tools Suite)
    ├── /ai-tools/jargon-simplifier
    ├── /ai-tools/symptom-triage
    ├── /ai-tools/routine-generator
    └── /ai-tools/workout-coach
`;
  };

  const getExportText = () => {
    if (format === 'markdown') return generateMarkdownBlueprint();
    if (format === 'json') return generateJsonBlueprint();
    return generateSitemapText();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getExportText();
    const ext = format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RaphaAtlas_Blueprint_Specification.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-['Playfair_Display',serif] text-slate-900">Export RaphaAtlas.com Architecture Specification</h3>
            <p className="text-xs text-slate-500">Download or copy the full platform blueprint document.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Format Selectors */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
          <div className="flex items-center gap-2">
            {[
              { id: 'markdown', label: 'Markdown Report (.md)' },
              { id: 'json', label: 'JSON Schema (.json)' },
              { id: 'sitemap', label: 'Sitemap Tree (.txt)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  format === f.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shadow-2xs transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-800 bg-slate-50/50 scrollbar-thin">
          <pre className="whitespace-pre-wrap">{getExportText()}</pre>
        </div>
      </div>
    </div>
  );
};
