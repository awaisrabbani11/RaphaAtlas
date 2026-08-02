import React, { useState } from 'react';
import { RAPHA_ATLAS_PILLARS, CATEGORY_NODES } from '../data/blueprintData';
import { CategorizedContentResult, PillarCategory } from '../types';
import { Layers, Sparkles, Send, CheckCircle2, BookOpen } from 'lucide-react';

interface ContentCategoryMatrixProps {
  searchQuery: string;
}

export const ContentCategoryMatrix: React.FC<ContentCategoryMatrixProps> = ({ searchQuery }) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarCategory | 'ALL'>('ALL');
  
  // Content Ingestion State
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CategorizedContentResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Pre-loaded sample content drafts for quick testing
  const sampleDrafts = [
    {
      label: 'Sample 1: Sleep & Circadian Draft',
      text: 'Draft notes: Need to publish an article on how morning blue light (sunlight exposure within 30 minutes of waking) triggers cortisol awakening response and sets a 16-hour countdown timer for melatonin production in the pineal gland. Mention adenosine accumulation throughout the day.',
    },
    {
      label: 'Sample 2: Calisthenics Joint Rehab Draft',
      text: 'Draft guide: Ring dip shoulder pain protocol. Focus on loaded thoracic extension on a foam roller, German hangs for biceps tendon lengthening, and rotator cuff external rotation with resistance bands before heavy weighted dips.',
    },
    {
      label: 'Sample 3: Medical Lab Bloodwork Draft',
      text: 'Draft explainer: Patient blood test shows elevated ApoB (135 mg/dL) and hs-CRP of 3.2 mg/L. Explain difference between ApoB particle count vs traditional LDL-C. Provide questions patient can ask doctor about coronary calcium scan.',
    },
  ];

  const filteredCategories = CATEGORY_NODES.filter((cat) => {
    const matchesPillar = selectedPillar === 'ALL' || cat.pillar === selectedPillar;
    const matchesQuery =
      !searchQuery ||
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subTopics.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPillar && matchesQuery;
  });

  const handleAnalyzeContent = async (textToAnalyze?: string) => {
    const content = textToAnalyze || inputText;
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/ai/categorize-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentText: content }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to categorize content.');
      }

      setAnalysisResult(resData.data);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'An error occurred during content analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 font-['Playfair_Display',serif]">
            <Layers className="h-5 w-5 text-teal-600 font-sans" />
            <span>RaphaAtlas Content Matrix & Strategy Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            RaphaAtlas organizes medical and health knowledge into 4 primary pillars. Use our live AI content ingestion tool below to paste raw notes, articles, or clinical guidelines and automatically map them to site taxonomy.
          </p>
        </div>

        {/* Pillar Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setSelectedPillar('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedPillar === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            All 4 Pillars
          </button>
          {RAPHA_ATLAS_PILLARS.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPillar(p.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedPillar === p.key
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE CONTENT INGESTION & TAXONOMY MAPPER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Content Strategy Engine
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2 font-['Playfair_Display',serif]">
              Live Content Ingestion & Auto-Categorizer
            </h3>
            <p className="text-xs text-slate-600">
              Paste raw drafts or clinical notes. RaphaAtlas AI will auto-categorize it, extract SEO keywords, assign user personas, and suggest internal AI tool links.
            </p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            Test with Pre-loaded Sample Content Drafts:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleDrafts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sample.text);
                  handleAnalyzeContent(sample.text);
                }}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
              >
                <BookOpen className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Canvas */}
        <div className="space-y-3">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your raw content, topic idea, or article draft here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 transition-all font-sans"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              {inputText.length} characters • Ready for Gemini AI Engine
            </span>
            <button
              onClick={() => handleAnalyzeContent()}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Analyzing & Categorizing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Ingest & Categorize Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis Output Result */}
        {analysisError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {analysisError}
          </div>
        )}

        {analysisResult && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-teal-200 space-y-4 text-xs shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-teal-50 text-teal-800 border border-teal-200">
                  {analysisResult.primaryCategory}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2 font-['Playfair_Display',serif]">{analysisResult.suggestedTitle}</h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 uppercase font-medium">Quality Score:</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-900 font-mono font-bold text-xs rounded-lg border border-teal-200">
                  {analysisResult.contentQualityScore}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="font-semibold text-slate-700 text-[11px] block uppercase">Executive Summary</span>
                <p className="text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                  {analysisResult.executiveSummary}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-700 text-[11px] block uppercase">Target User Persona & Sub-Category</span>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <p className="text-slate-700"><strong className="text-slate-900">Sub-Category:</strong> {analysisResult.subCategory}</p>
                  <p className="text-slate-700"><strong className="text-slate-900">Target Persona:</strong> {analysisResult.targetPersona}</p>
                  <p className="text-slate-700"><strong className="text-slate-900">Recommended Format:</strong> {analysisResult.recommendedFormat}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <span className="font-semibold text-slate-700 text-[11px] block uppercase mb-1">SEO Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.seoKeywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white text-slate-700 rounded-lg text-[11px] font-mono border border-slate-200">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 text-[11px] block uppercase mb-1">Internal Tool Linking Strategy</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.internalLinkingOpportunities.map((link, i) => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg text-[11px] border border-indigo-200 flex items-center gap-1 font-medium">
                      <Sparkles className="h-3 w-3 text-indigo-600" />
                      {link}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Pillars Detailed Category Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-['Playfair_Display',serif] text-slate-900">
          RaphaAtlas Content Pillars Matrix ({filteredCategories.length} Categories)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((cat) => {
            return (
              <div
                key={cat.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-teal-500/40 transition-all duration-300 space-y-4 flex flex-col justify-between shadow-2xs hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                      {cat.pillar}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Audience: {cat.targetAudience}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 font-['Playfair_Display',serif]">{cat.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">Sub-topics & Protocols</span>
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
                      {cat.subTopics.map((sub, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          <span className="truncate">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>AI Tool: <strong className="text-slate-900">{cat.aiToolsAssociated[0]}</strong></span>
                  </div>
                  {cat.monetizationHook && (
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      {cat.monetizationHook}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
