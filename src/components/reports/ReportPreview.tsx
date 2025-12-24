import React from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Import AI logos
import chatGPTLogo from '@/assets/chatGPT_logo.png';
import geminiLogo from '@/assets/gemini_logo.png';
import claudeLogo from '@/assets/claude_logo.png';
import perplexityLogo from '@/assets/perplexity_logo.png';
import grokLogo from '@/assets/grok_logo_new.png';

const platformLogos: Record<string, string> = {
  chatgpt: chatGPTLogo,
  gemini: geminiLogo,
  claude: claudeLogo,
  perplexity: perplexityLogo,
  grok: grokLogo,
};

interface ReportPreviewProps {
  reportTitle: string;
  dateRange: { start: Date | undefined; end: Date | undefined };
  customLogo: string | null;
  brandName: string;
  sections: {
    score: { enabled: boolean };
    mentions: { enabled: boolean };
    platformCoverage: { enabled: boolean; items?: string[] };
    prompts: { enabled: boolean; items?: string[] };
    products: { enabled: boolean; items?: string[] };
    optimizations: { enabled: boolean; items?: string[] };
    actions: { enabled: boolean; items?: string[] };
  };
  platforms: { id: string; name: string; mentions: number }[];
}

export const ReportPreview = ({
  reportTitle,
  dateRange,
  customLogo,
  brandName,
  sections,
  platforms,
}: ReportPreviewProps) => {
  const formatDate = (date: Date | undefined) => 
    date ? format(date, "MMM d, yyyy") : "—";

  const hasContent = sections.score.enabled || 
    sections.mentions.enabled || 
    (sections.platformCoverage.items?.length || 0) > 0 ||
    (sections.prompts.items?.length || 0) > 0 ||
    (sections.products.items?.length || 0) > 0 ||
    (sections.optimizations.items?.length || 0) > 0 ||
    (sections.actions.items?.length || 0) > 0;

  // Mock trend data for visualization
  const trendData = [35, 42, 38, 51, 49, 62, 58, 71, 68, 79, 85, 87];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ fontFamily: "'Google Sans', system-ui, sans-serif" }}>
      {/* Cover Page Preview */}
      <div className="aspect-[8.5/11] bg-white p-8 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {customLogo ? (
            <img src={customLogo} alt="Logo" className="h-6 object-contain" />
          ) : (
            <span className="text-[10px] text-[#86868b] tracking-wide">{brandName}</span>
          )}
          <span className="text-[8px] text-[#86868b]">
            {formatDate(dateRange.start)} — {formatDate(dateRange.end)}
          </span>
        </div>

        {/* Title Section */}
        <div className="flex-1 flex flex-col justify-start pt-2">
          <h1 
            className="text-xl font-light text-[#1d1d1f] tracking-tight leading-tight mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            {reportTitle}
          </h1>
          <p className="text-[10px] text-[#86868b]">
            AI Visibility Report • {brandName}
          </p>
        </div>

        {/* Preview Content - Visibility Score */}
        {sections.score.enabled && (
          <div className="mb-6">
            <div className="flex items-end gap-3 mb-3">
              <span className="text-3xl font-light text-[#1d1d1f]" style={{ letterSpacing: '-0.03em' }}>87</span>
              <div className="flex items-center gap-1 text-emerald-600 text-[10px] pb-1">
                <TrendingUp className="w-3 h-3" />
                <span>+5 pts</span>
              </div>
            </div>
            
            {/* Mini Trend Chart */}
            <div className="h-8 flex items-end gap-0.5">
              {trendData.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-primary/40 to-primary/80 rounded-t-sm"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[7px] text-[#86868b]">Jan</span>
              <span className="text-[7px] text-[#86868b]">Dec</span>
            </div>
          </div>
        )}

        {/* Mentions */}
        {sections.mentions.enabled && (
          <div className="mb-6">
            <span className="text-2xl font-light text-[#1d1d1f]" style={{ letterSpacing: '-0.02em' }}>12,847</span>
            <p className="text-[9px] text-[#86868b] mt-0.5">total brand mentions across AI platforms</p>
          </div>
        )}

        {/* Platform Coverage with Logos */}
        {(sections.platformCoverage.items?.length || 0) > 0 && (
          <div className="mb-4">
            <p className="text-[8px] text-[#86868b] uppercase tracking-wider mb-2">Platform Coverage</p>
            <div className="flex flex-wrap gap-2">
              {sections.platformCoverage.items?.slice(0, 5).map((platformId) => {
                const platform = platforms.find(p => p.id === platformId);
                const logo = platformLogos[platformId];
                if (!platform) return null;
                return (
                  <div key={platformId} className="flex items-center gap-1.5 bg-[#f5f5f7] rounded-full px-2 py-1">
                    {logo && (
                      <img src={logo} alt={platform.name} className="w-3 h-3 object-contain rounded-sm" />
                    )}
                    <span className="text-[8px] text-[#1d1d1f]">{platform.name}</span>
                    <span className="text-[7px] text-[#86868b]">{(platform.mentions / 1000).toFixed(1)}k</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Sections Summary */}
        <div className="mt-auto pt-4 border-t border-[#f5f5f7]">
          <div className="flex flex-wrap gap-2 text-[7px]">
            {(sections.prompts.items?.length || 0) > 0 && (
              <span className="text-[#86868b]">{sections.prompts.items?.length} prompts</span>
            )}
            {(sections.products.items?.length || 0) > 0 && (
              <span className="text-[#86868b]">{sections.products.items?.length} products</span>
            )}
            {(sections.optimizations.items?.length || 0) > 0 && (
              <span className="text-[#86868b]">{sections.optimizations.items?.length} optimizations</span>
            )}
            {(sections.actions.items?.length || 0) > 0 && (
              <span className="text-[#86868b]">{sections.actions.items?.length} actions</span>
            )}
          </div>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 right-4 text-[8px] text-[#86868b]">01</div>
      </div>

      {/* Empty State */}
      {!hasContent && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90">
          <p className="text-[10px] text-[#86868b] text-center">
            Select sections to see preview
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;
