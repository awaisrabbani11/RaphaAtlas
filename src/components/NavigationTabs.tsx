import React, { useState, useRef, useEffect } from 'react';
import { Article, PillarCategory } from '../types';
import { 
  BookOpen, Moon, Activity, Stethoscope, Calculator, Sparkles, Home, ChevronDown, Flame, Scale, Heart
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
}) => {
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCalcDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculatorItems = [
    {
      id: 'conception_calculator',
      name: 'Conception Calculator',
      badge: 'NEW',
      description: 'Conception date, fertile window, gestational age & EDD',
      icon: Heart,
      href: '/conception-calculator',
    },
    {
      id: 'body_type_calculator',
      name: 'Body Type Calculator',
      badge: 'NEW',
      description: 'Waist-to-hip ratio & body shape classification',
      icon: Scale,
      href: '/body-type-calculator',
    },
    {
      id: 'bac_calculator',
      name: 'BAC Calculator',
      badge: 'POPULAR',
      description: 'Blood alcohol concentration, time to limit & time to sober',
      icon: Activity,
      href: '/bac-calculator',
    },
    {
      id: 'macro_calculator',
      name: 'Macro Calculator',
      badge: 'NEW',
      description: 'Daily protein, carbs, fat & calorie deficit/surplus targets',
      icon: Flame,
      href: '/macro-calculator',
    },
    {
      id: 'ai_tools',
      name: 'All Health Calculators Hub',
      badge: 'AI ENGINE',
      description: 'ApoB risk, VO2 Max, BAC, Body Type & Lab Decoder',
      icon: Calculator,
      href: '/calculators',
    },
  ];

  const navCategories = [
    {
      id: 'ALL',
      label: 'Home & Articles',
      icon: Home,
      pillar: 'ALL' as const,
      href: '/',
    },
    {
      id: 'AI_TOOLS',
      label: 'Health Calculators',
      icon: Calculator,
      pillar: 'AI_TOOLS' as const,
      hasDropdown: true,
      href: '/calculators',
    },
    {
      id: 'LIFESTYLE',
      label: 'Lifestyle & Sleep',
      icon: Moon,
      pillar: 'LIFESTYLE' as const,
      href: '/lifestyle',
    },
    {
      id: 'FITNESS',
      label: 'Fitness & Mobility',
      icon: Activity,
      pillar: 'FITNESS' as const,
      href: '/fitness',
    },
    {
      id: 'MEDICAL',
      label: 'Medical & Biomarkers',
      icon: Stethoscope,
      pillar: 'MEDICAL' as const,
      href: '/medical',
    },
    {
      id: 'ABOUT',
      label: 'About Us',
      icon: BookOpen,
      pillar: 'ABOUT' as const,
      href: '/about',
    },
    {
      id: 'CONTACT',
      label: 'Contact',
      icon: Sparkles,
      pillar: 'CONTACT' as const,
      href: '/contact',
    },
  ];

  const handleCategoryClick = (cat: typeof navCategories[0]) => {
    if (cat.id === 'ALL') {
      setSelectedPillar('ALL');
      setActiveTab('journal');
      return;
    }
    if (cat.id === 'AI_TOOLS') {
      setActiveTab('ai_tools');
      return;
    }
    if (cat.id === 'ABOUT') {
      setActiveTab('about');
      return;
    }
    if (cat.id === 'CONTACT') {
      setActiveTab('contact');
      return;
    }

    setSelectedPillar(cat.pillar as PillarCategory);
    setActiveTab('journal');
  };

  return (
    <div className="bg-white border-b border-slate-200/80 shadow-2xs relative z-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-visible py-2 text-xs font-semibold">
          {navCategories.map((cat) => {
            const Icon = cat.icon;
            const isPillarSelected = selectedPillar === cat.pillar && activeTab === 'journal';
            const isTabSelected =
              (cat.id === 'AI_TOOLS' && (activeTab === 'ai_tools' || activeTab === 'macro_calculator' || activeTab === 'bac_calculator' || activeTab === 'body_type_calculator')) ||
              (cat.id === 'ABOUT' && activeTab === 'about') ||
              (cat.id === 'CONTACT' && activeTab === 'contact') ||
              (cat.id === 'ALL' && activeTab === 'journal' && selectedPillar === 'ALL');

            const isActive = isPillarSelected || isTabSelected;

            if (cat.hasDropdown) {
              return (
                <div key={cat.id} ref={dropdownRef} className="relative inline-block">
                  <button
                    onClick={() => {
                      setCalcDropdownOpen(!calcDropdownOpen);
                    }}
                    onMouseEnter={() => setCalcDropdownOpen(true)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-teal-800 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${calcDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {calcDropdownOpen && (
                    <div
                      onMouseLeave={() => setCalcDropdownOpen(false)}
                      className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 font-mono">
                          Evidence-Based Health Calculators
                        </span>
                      </div>

                      {calculatorItems.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <a
                            key={item.id}
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveTab(item.id);
                              setCalcDropdownOpen(false);
                            }}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50/60 transition-all flex items-start gap-3 group"
                          >
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-teal-700 group-hover:text-white transition-colors shrink-0">
                              <ItemIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs text-slate-900 group-hover:text-teal-800 transition-colors">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-teal-100 text-teal-800">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={cat.id}
                href={cat.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(cat);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-teal-800 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
