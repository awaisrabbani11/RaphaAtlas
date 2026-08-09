import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CONTRIBUTORS_LIST, MEDICAL_BADGE_IMAGE_SRC } from '../constants/contributors';

interface ContributorsSectionProps {
  className?: string;
  badgeImgSrc?: string;
}

export const ContributorsSection: React.FC<ContributorsSectionProps> = ({
  className = '',
  badgeImgSrc = MEDICAL_BADGE_IMAGE_SRC,
}) => {
  return (
    <div
      className={`bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans ${className}`}
    >
      <div className="flex items-start sm:items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={badgeImgSrc}
            alt="Medical Verification Badge"
            className="w-11 h-11 rounded-full object-cover border-2 border-teal-600/30 shadow-2xs bg-slate-900"
            loading="lazy"
            onError={(e) => {
              // Fallback to stylized medical cross badge SVG
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="%232dd4bf" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="background:%230f172a;border-radius:50%25;padding:8px;"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>';
            }}
          />
          <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-0.5 border border-white">
            <ShieldCheck className="h-3 w-3" />
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Creators</span>
            {CONTRIBUTORS_LIST.map((c, idx) => (
              <React.Fragment key={c.id}>
                {idx > 0 && <span className="text-slate-400">,</span>}
                <span className="font-bold text-teal-700 hover:underline cursor-default">
                  {c.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0 self-start sm:self-auto">
        <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
        <span>Evidence-Based &amp; Medically Verified</span>
      </div>
    </div>
  );
};
