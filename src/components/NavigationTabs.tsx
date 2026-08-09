import React from 'react';
import { Article, PillarCategory } from '../types';
import { 
  BookOpen, Moon, Activity, Stethoscope, Calculator, Sparkles, Home
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
  const navCategories = [
    {
      id: 'ALL',
      label: 'Home & Articles',
      icon: Home,
      pillar: 'ALL' as const,
    },
    {
      id: 'AI_TOOLS',
      label: 'Health Calculators',
      icon: Calculator,
      pillar: 'AI_TOOLS' as const,
    },
    {
      id: 'LIFESTYLE',
      label: 'Lifestyle & Sleep',
      icon: Moon,
      pillar: 'LIFESTYLE' as const,
    },
    {
      id: 'FITNESS',
      label: 'Fitness & Mobility',
      icon: Activity,
      pillar: 'FITNESS' as const,
    },
    {
      id: 'MEDICAL',
      label: 'Medical & Biomarkers',
      icon: Stethoscope,
      pillar: 'MEDICAL' as const,
    },
    {
      id: 'ABOUT',
      label: 'About Us',
      icon: BookOpen,
      pillar: 'ABOUT' as const,
    },
    {
      id: 'CONTACT',
      label: 'Contact',
      icon: Sparkles,
      pillar: 'CONTACT' as const,
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
    <div className="bg-white border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none text-xs font-semibold">
          {navCategories.map((cat) => {
            const Icon = cat.icon;
            const isPillarSelected = selectedPillar === cat.pillar && activeTab === 'journal';
            const isTabSelected =
              (cat.id === 'AI_TOOLS' && activeTab === 'ai_tools') ||
              (cat.id === 'ABOUT' && activeTab === 'about') ||
              (cat.id === 'CONTACT' && activeTab === 'contact') ||
              (cat.id === 'ALL' && activeTab === 'journal' && selectedPillar === 'ALL');

            const isActive = isPillarSelected || isTabSelected;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-teal-800 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

