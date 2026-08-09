import React, { useState } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { BlogPublicationView } from './components/BlogPublicationView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { ArchitectureView } from './components/ArchitectureView';
import { ContentCategoryMatrix } from './components/ContentCategoryMatrix';
import { AiToolsSandbox } from './components/AiToolsSandbox';
import { MacroCalculatorView } from './components/MacroCalculatorView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { TechIntegrationView } from './components/TechIntegrationView';
import { UserJourneysView } from './components/UserJourneysView';
import { BlueprintExportModal } from './components/BlueprintExportModal';
import { FEATURED_ARTICLES } from './data/articlesData';
import { PillarCategory } from './types';
import { Compass, ShieldAlert } from 'lucide-react';
import { AutoHeadManager } from './components/AutoHeadManager';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('journal');
  const [selectedPillar, setSelectedPillar] = useState<PillarCategory | 'ALL'>('ALL');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const selectedArticle = FEATURED_ARTICLES.find((a) => a.id === selectedArticleId);

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setActiveTab('journal');
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
        onNavigateAbout={() => {
          setSelectedArticleId(null);
          setActiveTab('about');
        }}
        onNavigateContact={() => {
          setSelectedArticleId(null);
          setActiveTab('contact');
        }}
        onNavigateCalculators={() => {
          setSelectedArticleId(null);
          setActiveTab('ai_tools');
        }}
      />

      {/* Newspaper Mega Menu Navigation Bar */}
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'journal') {
            setSelectedArticleId(null);
          }
        }}
        selectedPillar={selectedPillar}
        setSelectedPillar={(pillar) => {
          setSelectedPillar(pillar);
          setSelectedArticleId(null);
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
              onBack={() => setSelectedArticleId(null)}
              onSelectArticle={handleSelectArticle}
              allArticles={FEATURED_ARTICLES}
            />
          ) : (
            <BlogPublicationView
              articles={FEATURED_ARTICLES}
              onSelectArticle={handleSelectArticle}
              onOpenAiToolsSandbox={() => setActiveTab('ai_tools')}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedPillar={selectedPillar}
              setSelectedPillar={setSelectedPillar}
            />
          )
        )}

        {activeTab === 'ai_tools' && <AiToolsSandbox onOpenMacroCalculator={() => setActiveTab('macro_calculator')} />}
        {activeTab === 'macro_calculator' && (
          <MacroCalculatorView onBackToCalculators={() => setActiveTab('ai_tools')} />
        )}
        {activeTab === 'about' && (
          <AboutView
            onNavigateContact={() => setActiveTab('contact')}
            onNavigateCalculators={() => setActiveTab('ai_tools')}
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
                onClick={() => {
                  setSelectedArticleId(null);
                  setSelectedPillar('ALL');
                  setActiveTab('journal');
                }}
                className="hover:text-teal-700 font-bold text-teal-900 transition-colors"
              >
                HOME PAGE
              </button>
              <button
                onClick={() => {
                  setSelectedPillar('LIFESTYLE');
                  setSelectedArticleId(null);
                  setActiveTab('journal');
                }}
                className="hover:text-teal-700 transition-colors"
              >
                Lifestyle &amp; Longevity
              </button>
              <button
                onClick={() => {
                  setSelectedPillar('FITNESS');
                  setSelectedArticleId(null);
                  setActiveTab('journal');
                }}
                className="hover:text-teal-700 transition-colors"
              >
                Fitness &amp; Mobility
              </button>
              <button
                onClick={() => {
                  setSelectedPillar('MEDICAL');
                  setSelectedArticleId(null);
                  setActiveTab('journal');
                }}
                className="hover:text-teal-700 transition-colors"
              >
                Medical &amp; Lab Science
              </button>
              <button onClick={() => setActiveTab('ai_tools')} className="hover:text-teal-700 transition-colors">
                Calculators &amp; Tools
              </button>
              <button onClick={() => setActiveTab('about')} className="hover:text-teal-700 transition-colors font-bold text-slate-800">
                About Us
              </button>
              <button onClick={() => setActiveTab('contact')} className="hover:text-teal-700 transition-colors font-bold text-slate-800">
                Contact Us
              </button>
              <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-teal-700 transition-colors font-mono text-[11px]">
                robots.txt
              </a>
              <a href="/llms.txt" target="_blank" rel="noreferrer" className="hover:text-teal-700 transition-colors font-mono text-[11px] font-bold text-teal-700">
                llms.txt
              </a>
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
