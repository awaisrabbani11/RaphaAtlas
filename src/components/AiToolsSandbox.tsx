import React, { useState } from 'react';
import { AI_TOOL_SPECS } from '../data/blueprintData';
import { AiToolSpec } from '../types';
import { Cpu, Sparkles, ShieldAlert, CheckCircle2, MessageSquare, RefreshCw, Copy, Check } from 'lucide-react';

export const AiToolsSandbox: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AiToolSpec>(AI_TOOL_SPECS[0]);
  const [userInput, setUserInput] = useState('');
  const [userContext, setUserContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Chat Mode State
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Welcome to RaphaAtlas AI. I can assist with decoding clinical biomarkers, creating sleep protocols, outlining exercise mobility prehab, or simplifying medical study abstracts.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const presetQueries: Record<string, string[]> = {
    jargon_simplifier: [
      'Serum ApoB is 128 mg/dL, hs-CRP is 2.4 mg/L, HbA1c is 5.7%. What does this mean?',
      'Spine MRI shows mild L4-L5 disc protrusion without neural foraminal stenosis.',
      'Lab result shows Thyroid Stimulating Hormone (TSH) at 4.8 mIU/L with normal Free T4.',
    ],
    symptom_contextualizer: [
      'Sharp right shoulder pain when pressing overhead into full extension.',
      'Midday brain fog, afternoon energy crash around 3 PM, and restless sleep.',
      'Mild tension headache after 8 hours of screen work with tight upper traps.',
    ],
    lifestyle_habit_planner: [
      'Night-shift worker waking up at 4 PM wanting to maximize deep sleep and energy.',
      'Desk worker wanting a 15-minute morning circadian routine for focus and fat loss.',
      'High-cortisol executive wanting an evening wind-down routine for better REM sleep.',
    ],
    workout_mobility_coach: [
      '15-minute thoracic spine & shoulder mobility routine before heavy ring dips.',
      'Calisthenics beginner progression for handstand pushups and dip strength.',
      'Lower back stiffness prehab routine using loaded hip hinges and psoas releases.',
    ],
  };

  const handleRunTool = async (customQuery?: string) => {
    const query = customQuery || userInput;
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setToolOutput(null);

    try {
      const response = await fetch('/api/ai/tool-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: activeTool.demoType,
          query,
          userContext,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate output.');
      }

      setToolOutput(data.answer);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while connecting to RaphaAtlas AI server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch reply.');
      }

      setChatMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Error: ${err.message || 'Unable to connect.'}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopy = () => {
    if (!toolOutput) return;
    navigator.clipboard.writeText(toolOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Apple / Google Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Cpu className="h-3.5 w-3.5 text-indigo-600" />
            CLINICAL AI UTILITIES ENGINE
          </span>
          <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-slate-900 mt-2">
            RaphaAtlas AI Health Suite
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Interactive, server-side AI tools for patient guidance, lab analysis, and performance protocols.
          </p>
        </div>

        <button
          onClick={() => setChatMode(!chatMode)}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-2xs ${
            chatMode
              ? 'bg-teal-700 text-white shadow-sm'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{chatMode ? 'Switch to Focused AI Tools' : 'Open RaphaAtlas Conversational AI'}</span>
        </button>
      </div>

      {chatMode ? (
        /* CHAT MODE */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span>RaphaAtlas Intelligence Suite Chat</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Powered by Gemini 3.6 Flash
            </span>
          </div>

          <div className="space-y-3 h-96 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200/80 scrollbar-thin">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal-700 text-white font-medium rounded-br-xs shadow-2xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-600 p-3.5 rounded-2xl text-xs flex items-center gap-2 border border-slate-200 shadow-2xs">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-600" />
                  <span>RaphaAtlas AI is interpreting medical context...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Ask anything about blood markers, sleep timing, or fitness prehab..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 font-sans shadow-2xs"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={chatLoading || !chatInput.trim()}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors shadow-2xs"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        /* INDIVIDUAL AI TOOLS MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tool Selection List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
              Select AI Utility
            </span>

            {AI_TOOL_SPECS.map((tool) => {
              const isSelected = activeTool.id === tool.id;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool);
                    setUserInput('');
                    setToolOutput(null);
                    setErrorMsg(null);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-2 border-indigo-600 shadow-sm'
                      : 'bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {tool.pillar}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Safety: {tool.medicalSafetyLevel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{tool.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{tool.description}</p>
                </div>
              );
            })}
          </div>

          {/* Tool Execution Panel */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">{activeTool.name}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{activeTool.description}</p>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                Preset Test Queries:
              </span>
              <div className="flex flex-wrap gap-2">
                {presetQueries[activeTool.demoType]?.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserInput(preset);
                      handleRunTool(preset);
                    }}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs transition-all text-left truncate max-w-xs"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Query or Clinical Data:
                </label>
                <textarea
                  rows={3}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter laboratory markers, symptoms, exercise goals, or sleep parameters..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  User Context (Optional):
                </label>
                <input
                  type="text"
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="e.g. 35yo male, desk job, beginner fitness level"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <button
                onClick={() => handleRunTool()}
                disabled={isLoading || !userInput.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Processing with Gemini AI Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-indigo-200" />
                    <span>Generate Clinical Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Tool Output Result */}
            {toolOutput && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-teal-200 space-y-4 text-xs relative shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-semibold text-teal-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    <span>RaphaAtlas AI Output Analysis</span>
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] border border-slate-200"
                  >
                    {copied ? <Check className="h-3 w-3 text-teal-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm">
                  {toolOutput}
                </div>

                {/* Medical Safety Disclaimer Footer */}
                <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Educational Disclaimer:</strong> RaphaAtlas AI utilities provide general educational insights and contextual guidance only. They do not constitute formal medical diagnosis or treatment plans. Always consult a licensed medical professional.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
