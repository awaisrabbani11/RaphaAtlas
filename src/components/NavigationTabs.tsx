import React, { useState, useRef, useEffect } from 'react';
import { Article, PillarCategory } from '../types';
import { 
  BookOpen, Moon, Activity, Stethoscope, Cpu, ChevronDown, 
  Sparkles, ArrowRight, Clock, Layers, FolderTree, ShieldCheck, Users, X
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPillar: PillarCategory | 'ALL';
  setSelectedPillar: (pillar: PillarCategory | 'ALL') => void;
  articles: Article[];
  onSelectArticle: (articleId: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  selectedPillar,
  setSelectedPillar,
  articles,
  onSelectArticle,
}) => {
  const [megaMenuCategory, setMegaMenuCategory] = useState<PillarCategory | 'AI_TOOLS' | 'BLUEPRINT' | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navCategories = [
    {
      id: 'ALL',
      label: 'Front Page',
      subtitle: 'All Publications',
      icon: BookOpen,
      pillar: 'ALL' as const,
      subTopics: ['Cover Stories', 'Trending Research', 'Medically Reviewed', 'Latest AI Reports'],
    },
    {
      id: 'LIFESTYLE',
      label: 'Lifestyle & Longevity',
      subtitle: 'Sleep, Light & Metabolism',
      icon: Moon,
      pillar: 'LIFESTYLE' as const,
      subTopics: ['Sleep Hygiene & Adenosine', 'Circadian Light Timing', 'Metabolic Nutrition & CGM', 'Stress & Breathwork'],
      aiToolName: 'AI Sleep & Circadian Routine Planner',
      aiToolDesc: 'Generate custom sunlight exposure, caffeine cutoffs, and evening wind-down protocols.',
    },
    {
      id: 'FITNESS',
      label: 'Fitness & Mobility',
      subtitle: 'Strength, Prehab & Cardio',
      icon: Activity,
      pillar: 'FITNESS' as const,
      subTopics: ['Gymnastics Strength & Dips', 'Shoulder & Joint Prehab', 'Zone 2 & VO2 Max Base', 'Thoracic Mobility'],
      aiToolName: 'AI Joint Mobility & Workout Coach',
      aiToolDesc: 'Personalized joint warm-ups, ring dip prehab, and stroke volume cardio planning.',
    },
    {
      id: 'MEDICAL',
      label: 'Medical & Lab Science',
      subtitle: 'Biomarkers & Clinical Triage',
      icon: Stethoscope,
      pillar: 'MEDICAL' as const,
      subTopics: ['ApoB & Lipid Panels', 'hs-CRP & Vascular Risk', 'Symptom OPQRST Triage', 'Doctor Visit Question Preparation'],
      aiToolName: 'AI Biomarker & Lab Jargon Decoder',
      aiToolDesc: 'Paste blood test results or physician notes for immediate plain-English analysis.',
    },
    {
      id: 'AI_TOOLS',
      label: 'AI Health Suite',
      subtitle: 'Live Gemini Utilities',
      icon: Cpu,
      pillar: 'AI_TOOLS' as const,
      subTopics: ['Lab Jargon Decoder', 'Symptom Contextualizer', 'Lifestyle Routine Planner', 'Workout & Mobility Coach'],
      aiToolName: 'Gemini 3.6 Multimodal AI Engine',
      aiToolDesc: 'Interactive clinical AI suite powered by server-side Google Gemini models.',
    },
    {
      id: 'BLUEPRINT',
      label: 'Platform Architecture',
      subtitle: 'Hierarchy & System Specs',
      icon: Layers,
      pillar: 'BLUEPRINT' as const,
      subTopics: ['Content Category Matrix', 'Site Architecture & Hierarchy', 'Tech Stack & Compliance', 'User Journey Simulator'],
      aiToolName: 'Architectural Blueprint Exporter',
      aiToolDesc: 'Export complete engineering specifications in Markdown, JSON, and Sitemap format.',
    },
  ];

  const currentCategoryData = navCategories.find(
    (c) => c.pillar === megaMenuCategory
  ) || navCategories[1];

  // Articles filtered for the mega menu category preview
  const categoryArticlesPreview = articles.filter((a) => {
    if (megaMenuCategory === 'ALL' || !megaMenuCategory) return true;
    if (megaMenuCategory === 'AI_TOOLS' || megaMenuCategory === 'BLUEPRINT') return true;
    return a.pillar === megaMenuCategory;
  }).slice(0, 3);

  const handleCategoryClick = (cat: typeof navCategories[0]) => {
    if (cat.pillar === 'AI_TOOLS') {
      setActiveTab('ai_tools');
      setIsMegaMenuOpen(false);
      return;
    }
    if (cat.pillar === 'BLUEPRINT') {
      setActiveTab('architecture');
      setIsMegaMenuOpen(false);
      return;
    }

    // Set publication pillar filter and navigate to journal view
    setSelectedPillar(cat.pillar as PillarCategory | 'ALL');
    setActiveTab('journal');

    // Toggle mega menu if clicking active category, else set mega category and open
    if (megaMenuCategory === cat.pillar && isMegaMenuOpen) {
      setIsMegaMenuOpen(false);
    } else {
      setMegaMenuCategory(cat.pillar);
      setIsMegaMenuOpen(true);
    }
  };

  return (
    <div ref={megaMenuRef} className="relative z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Newspaper Main Category Bar */}
        <div className="flex items-center justify-between overflow-x-auto py-1 scrollbar-none font-sans">
          <div className="flex items-center gap-1 sm:gap-2 py-1">
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              const isPillarSelected = selectedPillar === cat.pillar && activeTab === 'journal';
              const isTabSelected =
                (cat.id === 'AI_TOOLS' && activeTab === 'ai_tools') ||
                (cat.id === 'BLUEPRINT' && ['content', 'architecture', 'tech', 'ux'].includes(activeTab));
              const isActive = isPillarSelected || isTabSelected;
              const isMegaActive = isMegaMenuOpen && megaMenuCategory === cat.pillar;

              return (
                <div key={cat.id} className="relative group">
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    onMouseEnter={() => {
                      setMegaMenuCategory(cat.pillar);
                      setIsMegaMenuOpen(true);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      isActive || isMegaActive
                        ? 'bg-teal-700 text-white border-teal-500 shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-transparent hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive || isMegaActive ? 'text-teal-200' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="leading-tight flex items-center gap-1.5">
                        <span>{cat.label}</span>
                        {(cat.pillar === 'LIFESTYLE' || cat.pillar === 'FITNESS' || cat.pillar === 'MEDICAL') && (
                          <ChevronDown className={`h-3 w-3 transition-transform ${isMegaActive ? 'rotate-180 text-teal-300' : 'text-slate-500'}`} />
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Persistent Mega Menu Drawer Toggle */}
          <button
            onClick={() => {
              if (!megaMenuCategory) setMegaMenuCategory('LIFESTYLE');
              setIsMegaMenuOpen(!isMegaMenuOpen);
            }}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              isMegaMenuOpen
                ? 'bg-white text-slate-900 border-white'
                : 'bg-slate-800 text-teal-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-teal-400" />
            <span>Mega Menu</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* NEWSPAPER MEGA MENU PANEL WITH ARTICLE PREVIEWS & CATEGORY LINKS       */}
      {/* ---------------------------------------------------------------------- */}
      {isMegaMenuOpen && currentCategoryData && (
        <div className="absolute top-full left-0 w-full bg-white text-slate-900 border-b-2 border-slate-900 shadow-2xl animate-fadeIn">
          <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
            {/* Mega Menu Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-teal-400">
                  <currentCategoryData.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-['Playfair_Display',serif] text-slate-900 flex items-center gap-2">
                    <span>{currentCategoryData.label}</span>
                    <span className="text-xs font-mono font-semibold text-teal-700 uppercase px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">
                      Category Edition
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">{currentCategoryData.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => setIsMegaMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mega Menu Multi-Column Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Column 1: Sub-Topics & Quick Filters */}
              <div className="md:col-span-3 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Key Sub-Topics & Sections
                </h4>
                <ul className="space-y-2 text-xs">
                  {currentCategoryData.subTopics.map((topic, i) => (
                    <li key={i}>
                      <button
                        onClick={() => {
                          if (currentCategoryData.pillar === 'AI_TOOLS') {
                            setActiveTab('ai_tools');
                          } else if (currentCategoryData.pillar === 'BLUEPRINT') {
                            setActiveTab('architecture');
                          } else {
                            setSelectedPillar(currentCategoryData.pillar as any);
                            setActiveTab('journal');
                          }
                          setIsMegaMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-100 font-semibold text-slate-800 hover:text-teal-700 transition-colors flex items-center justify-between group"
                      >
                        <span>{topic}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-600" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Small Preview of Articles of that Category (CRITICAL USER REQUEST) */}
              <div className="md:col-span-6 space-y-3 border-l border-slate-200/80 pl-0 md:pl-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Small Article Previews ({currentCategoryData.label})
                  </h4>
                  <span className="text-[11px] text-teal-700 font-semibold">Click to read full story</span>
                </div>

                <div className="space-y-3">
                  {categoryArticlesPreview.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        onSelectArticle(art.id);
                        setIsMegaMenuOpen(false);
                      }}
                      className="group p-3 rounded-2xl border border-slate-200 hover:border-teal-500/60 bg-slate-50/50 hover:bg-white transition-all duration-200 cursor-pointer flex items-center gap-4 shadow-2xs hover:shadow-xs"
                    >
                      {/* Small Article Thumbnail Image */}
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        className="h-14 w-20 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Small Preview Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                            {art.categoryTag}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {art.readTime}
                          </span>
                        </div>

                        <h5 className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                          {art.title}
                        </h5>

                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {art.executiveSummary}
                        </p>
                      </div>

                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Category AI Utility Launcher */}
              <div className="md:col-span-3 space-y-4 border-l border-slate-200/80 pl-0 md:pl-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Category AI Tool
                </h4>

                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>{currentCategoryData.aiToolName}</span>
                  </div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    {currentCategoryData.aiToolDesc}
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('ai_tools');
                      setIsMegaMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Launch AI Tool</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (currentCategoryData.pillar === 'AI_TOOLS') {
                        setActiveTab('ai_tools');
                      } else if (currentCategoryData.pillar === 'BLUEPRINT') {
                        setActiveTab('architecture');
                      } else {
                        setSelectedPillar(currentCategoryData.pillar as any);
                        setActiveTab('journal');
                      }
                      setIsMegaMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Explore All {currentCategoryData.label} Articles</span>
                    <ArrowRight className="h-3.5 w-3.5 text-teal-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
