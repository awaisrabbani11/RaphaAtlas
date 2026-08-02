import { useState } from 'react';
import { Article } from '../types';
import { 
  ArrowLeft, Clock, Calendar, ShieldCheck, Sparkles, Copy, Check, 
  Share2, Bookmark, CheckCircle2, AlertTriangle, BookOpen, MessageSquare, RefreshCw, ChevronRight
} from 'lucide-react';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  onSelectArticle: (articleId: string) => void;
  allArticles: Article[];
}

export const ArticleDetailView = ({
  article,
  onBack,
  onSelectArticle,
  allArticles,
}: ArticleDetailViewProps) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Embedded AI Tool State
  const [aiInput, setAiInput] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedAiText, setCopiedAiText] = useState(false);

  const relatedArticles = allArticles.filter((a) =>
    article.relatedArticleIds.includes(a.id)
  );

  const handleRunEmbeddedTool = async (customQuery?: string) => {
    const query = customQuery || aiInput;
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAiError(null);
    setAiOutput(null);

    try {
      const response = await fetch('/api/ai/tool-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: article.embeddedAiTool.demoType,
          query,
          userContext: aiContext || article.embeddedAiTool.contextHint,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process AI request.');
      }

      setAiOutput(data.answer);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error connecting to RaphaAtlas AI server.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyAi = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopiedAiText(true);
    setTimeout(() => setCopiedAiText(false), 2000);
  };

  return (
    <article className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Back Button & Top Action Bar */}
      <div className="flex items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-200/80">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 transition-all shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Editorial Library</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
              bookmarked
                ? 'bg-teal-50 text-teal-800 border-teal-200'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-teal-700 text-teal-700' : ''}`} />
            <span>{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
            {article.categoryTag}
          </span>
          <span className="text-xs text-slate-500 font-mono">• Pillar: {article.pillar}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Playfair_Display',serif] text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans font-normal">
          {article.subtitle}
        </p>

        {/* Authorship & Clinical Review Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="h-11 w-11 rounded-full object-cover border-2 border-slate-200"
            />
            <div>
              <div className="font-bold text-xs text-slate-900">{article.author.name}</div>
              <div className="text-[11px] text-slate-500">{article.author.role}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs">
            {article.reviewer && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-medium">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Medically Reviewed by <strong>{article.reviewer.name}</strong></span>
              </div>
            )}

            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {article.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {article.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 aspect-video max-h-[420px] w-full shadow-xs">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Executive Summary & Key Takeaways Card */}
      <div className="p-6 bg-teal-50/70 rounded-3xl border border-teal-200/80 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="h-4 w-4 text-teal-700" />
          <span>Executive Summary & Clinical Highlights</span>
        </div>

        <p className="text-sm text-slate-800 leading-relaxed font-sans font-medium">
          {article.executiveSummary}
        </p>

        <div className="pt-3 border-t border-teal-200/80 space-y-2">
          <span className="text-xs font-semibold text-teal-900 block">Core Takeaways:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-800">
            {article.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-teal-100 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INLINE EMBEDDED AI TOOL WIDGET (Apple Intelligence / Google AI design) */}
      <div className="my-10 p-6 sm:p-8 bg-white rounded-3xl border-2 border-indigo-200 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              INTEGRATED AI ASSISTANT FOR THIS ARTICLE
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">{article.embeddedAiTool.toolName}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{article.embeddedAiTool.toolDescription}</p>
          </div>
        </div>

        {/* Preset Query Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            Sample Interactive Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {article.embeddedAiTool.presetQueries.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAiInput(preset);
                  handleRunEmbeddedTool(preset);
                }}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs transition-all text-left truncate max-w-sm flex items-center gap-2"
              >
                <MessageSquare className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">"{preset}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Your Personal Input / Lab Values / Symptoms:
            </label>
            <textarea
              rows={3}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder={article.embeddedAiTool.inputPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <input
              type="text"
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
              placeholder={`Context (optional): e.g. ${article.embeddedAiTool.contextHint}`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600"
            />

            <button
              onClick={() => handleRunEmbeddedTool()}
              disabled={isAiLoading || !aiInput.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Run AI Tool</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Output Box */}
        {aiError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {aiError}
          </div>
        )}

        {aiOutput && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-indigo-200 space-y-3 text-xs relative shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-semibold text-teal-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span>RaphaAtlas AI Clinical Insight</span>
              </span>
              <button
                onClick={handleCopyAi}
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] border border-slate-200"
              >
                {copiedAiText ? <Check className="h-3 w-3 text-teal-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedAiText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm">
              {aiOutput}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Educational Notice:</strong> This AI analysis provides educational context only and does not replace professional medical evaluation.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Article Content Sections */}
      <div className="space-y-8 text-slate-800 font-sans leading-relaxed text-base">
        {article.sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-slate-900 pt-4 border-t border-slate-200/80">
              {section.heading}
            </h2>

            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans text-sm sm:text-base space-y-4">
              {section.content}
            </div>

            {section.calloutBox && (
              <div
                className={`p-5 rounded-2xl border my-5 space-y-1.5 ${
                  section.calloutBox.type === 'warning'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : section.calloutBox.type === 'protocol_step'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : section.calloutBox.type === 'evidence_summary'
                    ? 'bg-sky-50 border-sky-200 text-sky-950'
                    : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{section.calloutBox.title}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-medium">{section.calloutBox.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-mono">Article Tags:</span>
        {article.tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono border border-slate-200">
            #{tag}
          </span>
        ))}
      </div>

      {/* Related Articles Cards */}
      {relatedArticles.length > 0 && (
        <div className="pt-8 border-t border-slate-200/80 space-y-4">
          <h3 className="text-xl font-bold font-['Playfair_Display',serif] text-slate-900">
            Related Sound Health Publications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectArticle(rel.id)}
                className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 transition-all cursor-pointer space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-sm"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    {rel.categoryTag}
                  </span>
                  <h4 className="font-bold text-base font-['Playfair_Display',serif] text-slate-900 mt-2 line-clamp-2">{rel.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{rel.subtitle}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                  <span>{rel.readTime}</span>
                  <span className="text-teal-700 font-semibold flex items-center gap-1">
                    <span>Read Article</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
