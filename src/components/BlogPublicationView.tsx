import React, { useState } from 'react';
import { Article, PillarCategory } from '../types';
import { 
  BookOpen, Sparkles, Clock, ShieldCheck, ArrowRight, Search, 
  Flame, ChevronRight, Stethoscope, Moon, Activity, Award, Calculator
} from 'lucide-react';

interface BlogPublicationViewProps {
  articles: Article[];
  onSelectArticle: (articleId: string) => void;
  onOpenAiToolsSandbox: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPillar: PillarCategory | 'ALL';
  setSelectedPillar: (pillar: PillarCategory | 'ALL') => void;
}

export const BlogPublicationView: React.FC<BlogPublicationViewProps> = ({
  articles,
  onSelectArticle,
  onOpenAiToolsSandbox,
  searchQuery,
  setSearchQuery,
  selectedPillar,
  setSelectedPillar,
}) => {


  // Filter articles based on pillar and search query
  const filteredArticles = articles.filter((art) => {
    const matchesPillar = selectedPillar === 'ALL' || art.pillar === selectedPillar;
    const matchesSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPillar && matchesSearch;
  });

  const featuredArticle = articles.find((a) => a.featured) || articles[0];

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      {/* Editorial Header Banner - Apple / Google Health Standard */}
      <div className="relative rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-sm overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/80">
            <Award className="h-3.5 w-3.5 text-teal-600" />
            <span>CLINICAL EDITORIAL JOURNAL & AI ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Playfair_Display',serif] text-slate-900 tracking-tight leading-tight">
            Evidence-Based Health & Fitness — Amplified by Clinical AI
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans font-normal max-w-2xl">
            Every publication in RaphaAtlas combines rigorously peer-reviewed clinical research with an <strong>embedded interactive AI assistant</strong> — allowing you to decode laboratory results, optimize sleep architecture, and personalize longevity protocols in real time.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onSelectArticle(featuredArticle.id)}
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Featured Cover Story ({featuredArticle.readTime})</span>
            </button>

            <button
              onClick={onOpenAiToolsSandbox}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm"
            >
              <Calculator className="h-4 w-4 text-teal-300" />
              <span>Launch Health Calculators &amp; AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Lead Article Hero Card */}
      {featuredArticle && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Featured Journal Cover Story</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Medically Reviewed & Verified</span>
          </div>

          <div
            onClick={() => onSelectArticle(featuredArticle.id)}
            className="group relative rounded-3xl bg-white border border-slate-200/80 hover:border-teal-500/40 transition-all duration-300 cursor-pointer overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8 shadow-sm hover:shadow-md"
          >
            <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    {featuredArticle.categoryTag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',serif] text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {featuredArticle.executiveSummary}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                {/* Embedded Tool Callout Badge */}
                <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl text-xs text-indigo-950 flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-indigo-900 block">Interactive AI Tool Included</span>
                    <span className="text-indigo-700 text-[11px]">{featuredArticle.embeddedAiTool.toolName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="h-8 w-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-slate-900 font-semibold text-xs">{featuredArticle.author.name}</div>
                      <div className="text-[10px] text-slate-400">{featuredArticle.author.role}</div>
                    </div>
                  </div>

                  <span className="text-teal-700 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1.5 text-xs">
                    <span>Read Story & Run AI Tool</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200/80 aspect-video md:aspect-auto">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Publication Filter Tabs & Search Bar */}
      <div className="space-y-6 pt-6 border-t border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            {[
              { id: 'ALL', label: 'All Journal Articles', icon: BookOpen },
              { id: 'MEDICAL', label: 'Medical & Biomarkers', icon: Stethoscope },
              { id: 'LIFESTYLE', label: 'Sleep & Circadian', icon: Moon },
              { id: 'FITNESS', label: 'Fitness & Mobility', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedPillar === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPillar(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword or lab test..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600 font-sans shadow-2xs"
            />
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="group bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-teal-500/40 rounded-2xl p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-100">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-teal-800 border border-teal-200 backdrop-blur-md shadow-xs">
                    {art.categoryTag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{art.publishedAt}</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="font-bold text-lg font-['Playfair_Display',serif] text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {art.executiveSummary}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                {/* Embedded Tool Tag */}
                <div className="px-2.5 py-1.5 bg-indigo-50/70 border border-indigo-100 rounded-lg text-[11px] text-indigo-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 truncate">
                    <Sparkles className="h-3 w-3 text-indigo-600 shrink-0" />
                    <span className="truncate font-medium">{art.embeddedAiTool.toolName}</span>
                  </span>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold shrink-0 ml-1">AI</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-medium">{art.author.name}</span>
                  <span className="text-teal-700 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read Article</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <p className="text-slate-600 text-sm">No articles matched your search query "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-teal-600 hover:underline font-semibold"
            >
              Clear Search Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
