import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { BlogPublicationView } from './components/BlogPublicationView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { ArchitectureView } from './components/ArchitectureView';
import { ContentCategoryMatrix } from './components/ContentCategoryMatrix';
import { AiToolsSandbox } from './components/AiToolsSandbox';
import { MacroCalculatorView } from './components/MacroCalculatorView';
import { BacCalculatorView } from './components/BacCalculatorView';
import { BodyTypeCalculatorView } from './components/BodyTypeCalculatorView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { TechIntegrationView } from './components/TechIntegrationView';
import { UserJourneysView } from './components/UserJourneysView';
import { BlueprintExportModal } from './components/BlueprintExportModal';
import { FEATURED_ARTICLES } from './data/articlesData';
import { PillarCategory } from './types';
import { ShieldAlert } from 'lucide-react';
import { AutoHeadManager } from './components/AutoHeadManager';

function parseRoute(pathname: string): { activeTab: string; selectedPillar: PillarCategory | 'ALL'; selectedArticleId: string | null } {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  if (cleanPath.startsWith('/article/')) {
    const articleId = cleanPath.replace('/article/', '');
    return { activeTab: 'journal', selectedPillar: 'ALL', selectedArticleId: articleId };
  }

  switch (cleanPath) {
    case '/body-type-calculator':
      return { activeTab: 'body_type_calculator', selectedPillar: 'ALL', selectedArticleId: null };
    case '/macro-calculator':
      return { activeTab: 'macro_calculator', selectedPillar: 'ALL', selectedArticleId: null };
    case '/bac-calculator':
      return { activeTab: 'bac_calculator', selectedPillar: 'ALL', selectedArticleId: null };
    case '/calculators':
    case '/ai-tools':
      return { activeTab: 'ai_tools', selectedPillar: 'ALL', selectedArticleId: null };
    case '/about':
      return { activeTab: 'about', selectedPillar: 'ALL', selectedArticleId: null };
    case '/contact':
      return { activeTab: 'contact', selectedPillar: 'ALL', selectedArticleId: null };
    case '/lifestyle':
      return { activeTab: 'journal', selectedPillar: 'LIFESTYLE', selectedArticleId: null };
    case '/fitness':
      return { activeTab: 'journal', selectedPillar: 'FITNESS', selectedArticleId: null };
    case '/medical':
      return { activeTab: 'journal', selectedPillar: 'MEDICAL', selectedArticleId: null };
    case '/content-matrix':
      return { activeTab: 'content', selectedPillar: 'ALL', selectedArticleId: null };
    case '/architecture':
      return { activeTab: 'architecture', selectedPillar: 'ALL', selectedArticleId: null };
    case '/tech-integration':
      return { activeTab: 'tech', selectedPillar: 'ALL', selectedArticleId: null };
    case '/user-journeys':
      return { activeTab: 'ux', selectedPillar: 'ALL', selectedArticleId: null };
    default:
      return { activeTab: 'journal', selectedPillar: 'ALL', selectedArticleId: null };
  }
}

function getPathForState(activeTab: string, selectedPillar: PillarCategory | 'ALL', selectedArticleId: string | null): string {
  if (selectedArticleId) {
    return `/article/${selectedArticleId}`;
  }
  if (activeTab === 'body_type_calculator') return '/body-type-calculator';
  if (activeTab === 'macro_calculator') return '/macro-calculator';
  if (activeTab === 'bac_calculator') return '/bac-calculator';
  if (activeTab === 'ai_tools') return '/calculators';
  if (activeTab === 'about') return '/about';
  if (activeTab === 'contact') return '/contact';
  if (activeTab === 'content') return '/content-matrix';
  if (activeTab === 'architecture') return '/architecture';
  if (activeTab === 'tech') return '/tech-integration';
  if (activeTab === 'ux') return '/user-journeys';

  if (selectedPillar === 'LIFESTYLE') return '/lifestyle';
  if (selectedPillar === 'FITNESS') return '/fitness';
  if (selectedPillar === 'MEDICAL') return '/medical';

  return '/';
}

export default function App() {
  const initialRoute = parseRoute(window.location.pathname);
  const [activeTab, setActiveTab] = useState<string>(initialRoute.activeTab);
  const [selectedPillar, setSelectedPillar] = useState<PillarCategory | 'ALL'>(initialRoute.selectedPillar);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialRoute.selectedArticleId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Sync state to URL and respond to popstate (browser back/forward)
  const navigateTo = (newTab: string, newPillar: PillarCategory | 'ALL' = 'ALL', newArticleId: string | null = null) => {
    setActiveTab(newTab);
    setSelectedPillar(newPillar);
    setSelectedArticleId(newArticleId);

    const targetPath = getPathForState(newTab, newPillar, newArticleId);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ activeTab: newTab, selectedPillar: newPillar, selectedArticleId: newArticleId }, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = parseRoute(window.location.pathname);
      setActiveTab(route.activeTab);
      setSelectedPillar(route.selectedPillar);
      setSelectedArticleId(route.selectedArticleId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const selectedArticle = FEATURED_ARTICLES.find((a) => a.id === selectedArticleId);

  const handleSelectArticle = (articleId: string) => {
    navigateTo('journal', 'ALL', articleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Automated Dynamic HTML Head Tag & Metadata Manager */}
      <AutoHeadManager
        activeTab={activeTab}
        selectedArticle={selectedArticle}
        selectedPillar={selectedPillar}
      />

      {/* Top Header & Masthead */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigateAbout={() => navigateTo('about')}
        onNavigateContact={() => navigateTo('contact')}
        onNavigateCalculators={() => navigateTo('ai_tools')}
      />

      {/* Newspaper Mega Menu Navigation Bar */}
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'journal') {
            navigateTo('journal', selectedPillar, null);
          } else {
            navigateTo(tab, 'ALL', null);
          }
        }}
        selectedPillar={selectedPillar}
        setSelectedPillar={(pillar) => {
          navigateTo('journal', pillar, null);
        }}
        articles={FEATURED_ARTICLES}
        onSelectArticle={handleSelectArticle}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {activeTab === 'journal' && (
          selectedArticle ? (
            <ArticleDetailView
              article={selectedArticle}
              onBack={() => navigateTo('journal', selectedPillar, null)}
              onSelectArticle={handleSelectArticle}
              allArticles={FEATURED_ARTICLES}
            />
          ) : (
            <BlogPublicationView
              articles={FEATURED_ARTICLES}
              onSelectArticle={handleSelectArticle}
              onOpenAiToolsSandbox={() => navigateTo('ai_tools')}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedPillar={selectedPillar}
              setSelectedPillar={(pillar) => navigateTo('journal', pillar, null)}
            />
          )
        )}

        {activeTab === 'ai_tools' && (
          <AiToolsSandbox
            onOpenMacroCalculator={() => navigateTo('macro_calculator')}
            onOpenBacCalculator={() => navigateTo('bac_calculator')}
            onOpenBodyTypeCalculator={() => navigateTo('body_type_calculator')}
          />
        )}
        {activeTab === 'body_type_calculator' && (
          <BodyTypeCalculatorView onBackToCalculators={() => navigateTo('ai_tools')} />
        )}
        {activeTab === 'macro_calculator' && (
          <MacroCalculatorView onBackToCalculators={() => navigateTo('ai_tools')} />
        )}
        {activeTab === 'bac_calculator' && (
          <BacCalculatorView onBackToCalculators={() => navigateTo('ai_tools')} />
        )}
        {activeTab === 'about' && (
          <AboutView
            onNavigateContact={() => navigateTo('contact')}
            onNavigateCalculators={() => navigateTo('ai_tools')}
          />
        )}
        {activeTab === 'contact' && <ContactView />}
        {activeTab === 'content' && <ContentCategoryMatrix searchQuery={searchQuery} />}
        {activeTab === 'architecture' && <ArchitectureView searchQuery={searchQuery} />}
        {activeTab === 'tech' && <TechIntegrationView />}
        {activeTab === 'ux' && <UserJourneysView />}
      </main>


      {/* Production Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 lg:px-8 py-10 mt-16 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="RaphaAtlas" className="h-10 w-10 object-contain" />
              <div>
                <span className="font-['Playfair_Display',serif] text-xl font-bold text-slate-900">
                  RAPHA<span className="text-teal-700">ATLAS</span><span className="text-slate-500 font-sans text-xs">.com</span>
                </span>
                <p className="text-xs text-slate-500">
                  The Complete Map of Healing &amp; Health AI
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
              <button
                onClick={() => navigateTo('journal', 'ALL', null)}
                className="hover:text-teal-700 font-bold text-teal-900 transition-colors"
              >
                HOME PAGE
              </button>
              <button
                onClick={() => navigateTo('journal', 'LIFESTYLE', null)}
                className="hover:text-teal-700 transition-colors"
              >
                Lifestyle &amp; Longevity
              </button>
              <button
                onClick={() => navigateTo('journal', 'FITNESS', null)}
                className="hover:text-teal-700 transition-colors"
              >
                Fitness &amp; Mobility
              </button>
              <button
                onClick={() => navigateTo('journal', 'MEDICAL', null)}
                className="hover:text-teal-700 transition-colors"
              >
                Medical &amp; Lab Science
              </button>
              <button onClick={() => navigateTo('ai_tools')} className="hover:text-teal-700 transition-colors">
                Calculators &amp; Tools
              </button>
              <button onClick={() => navigateTo('about')} className="hover:text-teal-700 transition-colors font-bold text-slate-800">
                About Us
              </button>
              <button onClick={() => navigateTo('contact')} className="hover:text-teal-700 transition-colors font-bold text-slate-800">
                Contact Us
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
              <span>
                Sovereign Journal of Clinical Medicine &amp; Health AI. Educational guidance does not replace formal medical evaluation.
              </span>
            </div>
            <div>© {new Date().getFullYear()} RaphaAtlas.com. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <BlueprintExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
