import React, { useState } from 'react';
import { Mail, Building2, User, Send, CheckCircle2, MessageSquare, ShieldCheck, Globe, Stethoscope } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 font-sans">
      {/* Top Banner */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 font-mono">
          <Mail className="h-3.5 w-3.5 text-teal-600" />
          <span>DIRECTORY &amp; DIRECT CLINICAL CONTACT</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display',serif] text-slate-900">
          Contact RaphaAtlas
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Have questions about our clinical calculators, medical articles, or AI tools? Reach out directly to our medical leadership and corporate team at Growth Partners Global LLC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Direct Email Cards & Corporate Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider block">
                Direct Physician Contact
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif] mt-1">
                Medical Directorate
              </h3>
            </div>

            {/* Email 1: Dr. Awais */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-900">Dr. Muhammad Awais Rabbani (MBBS)</span>
              </div>
              <p className="text-[11px] text-slate-500">Clinical Lead &amp; Medical Content Director</p>
              <a
                href="mailto:dr.awais@growthpartnersgloballlc.com"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-800 hover:text-teal-900 hover:underline pt-1"
              >
                <Mail className="h-3.5 w-3.5 text-teal-600" />
                <span>dr.awais@growthpartnersgloballlc.com</span>
              </a>
            </div>

            {/* Email 2: Dr. Ahmed */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-900">Dr. Ahmed Humayon (MBBS)</span>
              </div>
              <p className="text-[11px] text-slate-500">Co-Clinical Director &amp; Medical Informatics</p>
              <a
                href="mailto:dr.ahmed@growthpartnergloballlc.com"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-800 hover:text-teal-900 hover:underline pt-1"
              >
                <Mail className="h-3.5 w-3.5 text-teal-600" />
                <span>dr.ahmed@growthpartnergloballlc.com</span>
              </a>
            </div>

            {/* Parent Company Info */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Building2 className="h-4 w-4 text-slate-600" />
                <span>Growth Partners Global LLC</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                RaphaAtlas is a sovereign digital health project owned and operated by Growth Partners Global LLC.
              </p>
              <a
                href="https://growthpartnersgloballlc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 underline"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>growthpartnersgloballlc.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-teal-50/60 rounded-2xl border border-teal-200 my-auto">
              <div className="h-12 w-12 rounded-full bg-teal-700 text-white flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
                Message Received
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting RaphaAtlas. Your inquiry has been dispatched to Dr. Muhammad Awais Rabbani (MBBS) and Dr. Ahmed Humayon (MBBS). We will respond to <strong className="text-slate-900">{formData.email}</strong> as quickly as possible.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                }}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider block">
                  Send a Message
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif] mt-0.5">
                  General &amp; Clinical Inquiries
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Topic / Category:
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-teal-600"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Medical Editorial Feedback">Medical Editorial Feedback</option>
                  <option value="Calculator Accuracy & Formulas">Calculator Accuracy &amp; Formulas</option>
                  <option value="AI Suite & Lab Jargon Decoder">AI Suite &amp; Lab Jargon Decoder</option>
                  <option value="Partnership / Growth Partners Global">Partnership / Growth Partners Global</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Message Details:
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your feedback, question, or inquiry here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-teal-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Submit Inquiry to Medical Team</span>
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                <span>Your contact information is strictly handled for response purposes and never sold.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
