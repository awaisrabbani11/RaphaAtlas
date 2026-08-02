import React, { useState } from 'react';
import { SITE_MAP_TREE, RAPHA_ATLAS_PILLARS } from '../data/blueprintData';
import { SiteNode } from '../types';
import { FolderTree, Layout, ChevronRight, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface ArchitectureViewProps {
  searchQuery: string;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ searchQuery }) => {
  const [activeSubView, setActiveSubView] = useState<'sitemap' | 'wireframes'>('sitemap');
  const [selectedNode, setSelectedNode] = useState<SiteNode | null>(SITE_MAP_TREE.children?.[0] || SITE_MAP_TREE);
  const [activeWireframe, setActiveWireframe] = useState<'homepage' | 'pillar_hub' | 'ai_tool' | 'article'>('homepage');

  // Filter site map tree
  const filterTree = (node: SiteNode, query: string): boolean => {
    if (!query) return true;
    const matchesNode =
      node.title.toLowerCase().includes(query.toLowerCase()) ||
      node.description.toLowerCase().includes(query.toLowerCase()) ||
      node.path.toLowerCase().includes(query.toLowerCase());

    const matchesChildren = node.children ? node.children.some((child) => filterTree(child, query)) : false;
    return matchesNode || matchesChildren;
  };

  const renderSitemapNode = (node: SiteNode, depth: number = 0) => {
    if (searchQuery && !filterTree(node, searchQuery)) return null;

    const isSelected = selectedNode?.id === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="relative">
        <div
          onClick={() => setSelectedNode(node)}
          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
            isSelected
              ? 'bg-white border-2 border-teal-600 text-slate-900 shadow-sm'
              : 'bg-white border border-slate-200/80 hover:border-slate-300 text-slate-700 shadow-2xs'
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                node.type === 'hub'
                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                  : node.type === 'tool'
                  ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                  : node.type === 'portal'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {node.type}
            </span>
            <div className="truncate">
              <span className="font-semibold text-xs text-slate-900">{node.title}</span>
              <span className="ml-2 font-mono text-[11px] text-slate-400">{node.path}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                node.status === 'core_v1'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : node.status === 'v2_expansion'
                  ? 'bg-sky-50 text-sky-800 border border-sky-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {node.status === 'core_v1' ? 'v1 Launch' : node.status === 'v2_expansion' ? 'v2 Roadmap' : 'Pro Feature'}
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-teal-600 rotate-90' : 'text-slate-400'}`} />
          </div>
        </div>

        {hasChildren && (
          <div className="mt-2 space-y-2 relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
            {node.children!.map((child) => renderSitemapNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-slate-900 flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-teal-600" />
            <span>Website Architecture & Page Hierarchy</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Structured layout blueprint for RaphaAtlas.com mapping URL paths, page types, and wireframes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubView('sitemap')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubView === 'sitemap'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            <span>Interactive Sitemap</span>
          </button>
          <button
            onClick={() => setActiveSubView('wireframes')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubView === 'wireframes'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="h-3.5 w-3.5" />
            <span>Page Layout Wireframes</span>
          </button>
        </div>
      </div>

      {activeSubView === 'sitemap' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sitemap Tree View */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Site Taxonomy & Node Hierarchy
              </span>
              <span className="text-[11px] font-mono font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                domain: RaphaAtlas.com
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              {renderSitemapNode(SITE_MAP_TREE)}
            </div>
          </div>

          {/* Node Inspector Panel */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
            {selectedNode ? (
              <>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-teal-50 text-teal-800 border border-teal-200">
                      {selectedNode.type.toUpperCase()} SPECIFICATION
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-['Playfair_Display',serif] mt-2">{selectedNode.title}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedNode.path}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1">Node Purpose & Description</h4>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      {selectedNode.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Technical & Content Attributes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase block font-mono">Launch Status</span>
                        <span className="text-xs font-semibold text-teal-800">
                          {selectedNode.status === 'core_v1' ? 'V1 Core Launch' : 'V2 Expansion'}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase block font-mono">Pillar Category</span>
                        <span className="text-xs font-semibold text-slate-800">
                          {selectedNode.pillar || 'Platform Core'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Recommended UX Layout Components</h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                        <span>Sticky Header with RaphaAtlas Search & Pillar Filter Bar</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                        <span>Interactive AI Tool Drawer widget embedded in sidebar</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                        <span>Clinical Disclaimer & Evidence Rating Badge</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveSubView('wireframes')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                    >
                      <span>Preview Page Layout Wireframe</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select any node on the left to inspect its specifications.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Wireframes Visualizer */
        <div className="space-y-6">
          {/* Wireframe Type Picker */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            {[
              { id: 'homepage', label: 'RaphaAtlas Homepage Wireframe' },
              { id: 'pillar_hub', label: 'Pillar Hub (e.g. /lifestyle)' },
              { id: 'ai_tool', label: 'AI Health Tool Suite (/ai-tools)' },
              { id: 'article', label: 'Article & Clinical Guide Layout' },
            ].map((wf) => (
              <button
                key={wf.id}
                onClick={() => setActiveWireframe(wf.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeWireframe === wf.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {wf.label}
              </button>
            ))}
          </div>

          {/* Wireframe Mock Canvas */}
          <div className="bg-slate-100/90 p-8 rounded-3xl border border-slate-200 space-y-6 font-sans shadow-inner">
            {activeWireframe === 'homepage' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* Mock Header */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 shadow-xs">
                  <div className="font-bold text-slate-900 text-sm">RaphaAtlas<span className="text-teal-600">.com</span></div>
                  <div className="flex items-center gap-4 font-medium">
                    <span>Lifestyle</span>
                    <span>Fitness</span>
                    <span>Medical</span>
                    <span>AI Tools</span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-semibold border border-teal-200">Pro Portal</span>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                    All-in-One Health Intelligence Platform
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',serif] text-slate-900">
                    Master Your Lifestyle, Fitness & Clinical Health with AI Precision
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                    Evidence-informed protocols for sleep optimization, functional fitness, medical jargon simplification, and real-time AI tools.
                  </p>

                  <div className="max-w-lg mx-auto flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs">
                    <input
                      disabled
                      placeholder="Ask RaphaAtlas AI or search labs, workouts, symptoms..."
                      className="bg-transparent flex-1 text-slate-800 px-3 outline-none"
                    />
                    <button className="px-4 py-2 bg-teal-700 text-white font-semibold rounded-xl">Search</button>
                  </div>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {RAPHA_ATLAS_PILLARS.map((p) => (
                    <div key={p.key} className="p-4 bg-white rounded-2xl border border-slate-200 text-left space-y-2 shadow-2xs">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">PILLAR</span>
                      <h4 className="font-bold text-xs text-slate-900">{p.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{p.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeWireframe === 'pillar_hub' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                  <span className="text-xs text-teal-700 font-mono font-semibold">RaphaAtlas.com / Lifestyle Hub</span>
                  <h3 className="text-xl font-bold font-['Playfair_Display',serif] text-slate-900">Lifestyle & Longevity Architecture</h3>
                  <p className="text-xs text-slate-600">Circadian optimization, sleep hygiene, stress mitigation, and metabolic wellness protocols.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-3">
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                      <span className="text-[10px] text-teal-700 font-mono font-semibold uppercase">FEATURED GUIDE</span>
                      <h4 className="text-base font-bold text-slate-900">The Adenosine & Light Timing Protocol for Deep REM Sleep</h4>
                      <p className="text-xs text-slate-600">A step-by-step breakdown of how morning photons trigger evening melatonin synthesis...</p>
                    </div>
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                      <span className="text-[10px] text-teal-700 font-mono font-semibold uppercase">GUIDE</span>
                      <h4 className="text-base font-bold text-slate-900">Physiological Sigh Mechanics & Acute Cortisol Dampening</h4>
                      <p className="text-xs text-slate-600">How double-inhalation triggers immediate autonomic nervous system reset...</p>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 text-xs shadow-2xs">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Associated AI Tools</span>
                    </h5>
                    <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-150">
                      <span className="font-semibold text-indigo-900 block">AI Sleep Routine Generator</span>
                      <span className="text-[10px] text-indigo-700">Generates custom bedtime wind-down schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeWireframe === 'ai_tool' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center space-y-2 shadow-xs">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    RAPHAATLAS AI ENGINE
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">AI Medical Jargon & Lab Result Simplifier</h3>
                  <p className="text-xs text-slate-600">Paste your lab values or medical report to receive a clear, plain-English translation.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-700">Input Lab Result / Term</span>
                    <div className="h-28 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono">
                      "Serum ApoB: 125 mg/dL, hs-CRP: 2.8 mg/L..."
                    </div>
                    <button className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs">
                      Simplify with RaphaAtlas AI
                    </button>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                    <span className="text-xs font-semibold text-teal-800">AI Plain-English Output</span>
                    <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-2 border border-slate-200">
                      <p><strong className="text-slate-900">ApoB (125 mg/dL):</strong> Measures the total number of cholesterol-carrying particles. 125 is slightly elevated...</p>
                      <p><strong className="text-slate-900">Questions to ask doctor:</strong> "Should we consider a coronary calcium scan or lifestyle intervention?"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeWireframe === 'article' && (
              <div className="space-y-6 max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-xs shadow-xs">
                <div className="space-y-2 pb-4 border-b border-slate-200">
                  <span className="text-teal-700 font-mono font-semibold">FITNESS & REHAB PROTOCOL</span>
                  <h3 className="text-2xl font-bold text-slate-900 font-['Playfair_Display',serif]">
                    Restoring Shoulder Extension & Scapular Stability for Heavy Ring Dips
                  </h3>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span>Reviewed by Dr. Marcus Vance, DPT</span>
                    <span>•</span>
                    <span>5 Min Read</span>
                  </div>
                </div>

                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-slate-800 space-y-1">
                  <span className="font-bold text-teal-900 block">EXECUTIVE SUMMARY</span>
                  <p>Ring dips place high stress on the anterior joint capsule. Incorporating thoracic extension and subscapularis loaded mobility prevents impingement...</p>
                </div>

                <div className="space-y-2 text-slate-700 leading-relaxed">
                  <h4 className="text-base font-bold text-slate-900">1. Anatomic Mechanics of Ring Instability</h4>
                  <p>Unlike fixed parallel bars, gymnastics rings allow 3 degrees of freedom...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
