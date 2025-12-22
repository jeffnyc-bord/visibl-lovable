import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Download,
  Eye,
  Image,
  TrendingUp,
  MessageSquare,
  Globe,
  BarChart3,
  Target,
  Zap,
  Link2,
  Activity,
  Building,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

// Report section definition
interface ReportSection {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

const timePeriods = [
  { id: 'last_7_days', label: '7 days' },
  { id: 'last_30_days', label: '30 days' },
  { id: 'last_90_days', label: '90 days' },
  { id: 'last_year', label: '12 months' },
];

// Mock preview data
const mockData = {
  score: 87,
  scoreTrend: '+5',
  mentions: 12847,
  mentionsTrend: '+12%',
  platforms: [
    { name: 'ChatGPT', value: 92 },
    { name: 'Claude', value: 87 },
    { name: 'Gemini', value: 84 },
    { name: 'Perplexity', value: 91 },
  ],
  distribution: [
    { name: 'ChatGPT', count: 4234, pct: 33 },
    { name: 'Claude', count: 3456, pct: 27 },
    { name: 'Gemini', count: 2847, pct: 22 },
    { name: 'Perplexity', count: 2310, pct: 18 },
  ],
};

const Reports = () => {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState('last_30_days');
  const [reportTitle, setReportTitle] = useState('AI Visibility Report');
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState('#007AFF');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sections, setSections] = useState<ReportSection[]>([
    { id: 'score', label: 'Visibility Score', description: 'Overall AI visibility performance', icon: Target, enabled: true },
    { id: 'mentions', label: 'Mentions', description: 'Total mentions across platforms', icon: MessageSquare, enabled: true },
    { id: 'coverage', label: 'Platform Coverage', description: 'Coverage by AI platform', icon: Globe, enabled: true },
    { id: 'distribution', label: 'Distribution', description: 'Mention distribution breakdown', icon: BarChart3, enabled: true },
    { id: 'prompts', label: 'Prompts', description: 'Tracked prompt performance', icon: Zap, enabled: false },
    { id: 'optimization', label: 'Optimization', description: 'On-site recommendations', icon: Sparkles, enabled: false },
    { id: 'products', label: 'Products', description: 'Optimized product content', icon: Building, enabled: false },
    { id: 'sources', label: 'Sources', description: 'Authority sources & citations', icon: Link2, enabled: false },
    { id: 'actions', label: 'Actions', description: 'Activity log entries', icon: Activity, enabled: false },
  ]);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCustomLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const enabledSections = sections.filter(s => s.enabled);
  const enabledCount = enabledSections.length;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#F5F5F7]/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <Button 
            onClick={() => console.log('Export PDF')}
            className="h-9 px-4 rounded-full bg-[#1d1d1f] text-white hover:bg-[#1d1d1f]/90 text-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#1d1d1f] tracking-tight">
            Create Report
          </h1>
          <p className="text-lg text-[#86868b] mt-2">
            Customize and export your AI visibility insights
          </p>
        </div>

        <div className="grid grid-cols-12 gap-12">
          {/* Left - Configuration */}
          <div className="col-span-5 space-y-10">
            
            {/* Time Period */}
            <section>
              <h2 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-4">
                Time Period
              </h2>
              <div className="flex gap-2">
                {timePeriods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setTimePeriod(period.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      timePeriod === period.id
                        ? "bg-[#1d1d1f] text-white"
                        : "bg-white text-[#1d1d1f] hover:bg-[#1d1d1f]/5"
                    )}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Sections */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Include
                </h2>
                <span className="text-xs text-[#86868b]">
                  {enabledCount} selected
                </span>
              </div>
              <div className="space-y-1">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200",
                      section.enabled
                        ? "bg-white shadow-sm"
                        : "hover:bg-white/50"
                    )}
                    layout
                    transition={{ duration: 0.2 }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      section.enabled
                        ? "bg-[#1d1d1f] text-white"
                        : "bg-[#1d1d1f]/5 text-[#86868b]"
                    )}>
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-[15px] font-medium transition-colors",
                        section.enabled ? "text-[#1d1d1f]" : "text-[#86868b]"
                      )}>
                        {section.label}
                      </p>
                      <p className="text-[13px] text-[#86868b] mt-0.5">
                        {section.description}
                      </p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                      section.enabled
                        ? "bg-[#34C759] text-white"
                        : "bg-[#1d1d1f]/10"
                    )}>
                      {section.enabled && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Customization */}
            <section>
              <h2 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-4">
                Customize
              </h2>
              <div className="bg-white rounded-2xl p-5 space-y-5">
                {/* Title */}
                <div>
                  <label className="text-[13px] font-medium text-[#1d1d1f] mb-2 block">
                    Report Title
                  </label>
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="h-11 rounded-xl border-[#d2d2d7] focus:border-[#0071e3] focus:ring-[#0071e3]/20 text-[15px]"
                    placeholder="Enter title..."
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="text-[13px] font-medium text-[#1d1d1f] mb-2 block">
                    Logo
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {customLogo ? (
                    <div className="flex items-center gap-3">
                      <div className="h-11 px-4 rounded-xl bg-[#f5f5f7] flex items-center">
                        <img src={customLogo} alt="Logo" className="h-6 object-contain" />
                      </div>
                      <button 
                        onClick={() => setCustomLogo(null)}
                        className="text-[13px] text-[#ff3b30] font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="h-11 px-4 rounded-xl border border-dashed border-[#d2d2d7] text-[13px] text-[#86868b] hover:border-[#86868b] hover:text-[#1d1d1f] transition-colors flex items-center gap-2"
                    >
                      <Image className="w-4 h-4" />
                      Upload logo
                    </button>
                  )}
                </div>

                {/* Brand Color */}
                <div>
                  <label className="text-[13px] font-medium text-[#1d1d1f] mb-2 block">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-11 h-11 rounded-xl cursor-pointer border-0 p-1 bg-white"
                    />
                    <span className="text-[13px] text-[#86868b] font-mono">{brandColor}</span>
                  </div>
                </div>

                {/* Page Numbers */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[13px] font-medium text-[#1d1d1f]">
                    Page numbers
                  </span>
                  <Switch
                    checked={showPageNumbers}
                    onCheckedChange={setShowPageNumbers}
                    className="data-[state=checked]:bg-[#34C759]"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right - Live Preview */}
          <div className="col-span-7">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-[#86868b]" />
                <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  Preview
                </span>
              </div>

              {/* Preview Document */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden">
                {/* Document Header */}
                <div 
                  className="px-8 py-6 border-b border-black/5"
                  style={{ background: `linear-gradient(135deg, ${brandColor}08, transparent)` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    {customLogo ? (
                      <img src={customLogo} alt="Logo" className="h-7 object-contain" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${brandColor}15` }}
                        >
                          <BarChart3 className="w-4 h-4" style={{ color: brandColor }} />
                        </div>
                        <span className="font-semibold text-[#1d1d1f]">Board Labs</span>
                      </div>
                    )}
                    <span className="text-[11px] text-[#86868b]">
                      {timePeriod === 'last_7_days' ? 'Dec 15–22, 2024' :
                       timePeriod === 'last_30_days' ? 'Nov 22 – Dec 22, 2024' :
                       timePeriod === 'last_90_days' ? 'Sep 23 – Dec 22, 2024' :
                       'Dec 2023 – Dec 2024'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                    {reportTitle}
                  </h2>
                  <p className="text-[13px] text-[#86868b] mt-1">Nike • Generated December 22, 2024</p>
                </div>

                {/* Document Content */}
                <div className="px-8 py-6 max-h-[480px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {enabledCount === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-16 text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-4">
                          <Eye className="w-7 h-7 text-[#86868b]" />
                        </div>
                        <p className="text-[#86868b]">Select sections to preview</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-8">
                        {/* Score Section */}
                        {sections.find(s => s.id === 'score')?.enabled && (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">
                              Visibility Score
                            </h3>
                            <div className="flex items-center gap-6">
                              <div 
                                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${brandColor}15, ${brandColor}05)` }}
                              >
                                <span 
                                  className="text-4xl font-semibold"
                                  style={{ color: brandColor }}
                                >
                                  {mockData.score}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-[#34C759]" />
                                  <span className="text-[13px] text-[#34C759] font-medium">
                                    {mockData.scoreTrend} from last period
                                  </span>
                                </div>
                                <p className="text-[13px] text-[#86868b] mt-1">
                                  Outperforming 94% of competitors
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Mentions Section */}
                        {sections.find(s => s.id === 'mentions')?.enabled && (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">
                              Mentions
                            </h3>
                            <div className="flex items-baseline gap-3">
                              <span className="text-4xl font-semibold text-[#1d1d1f]">
                                {mockData.mentions.toLocaleString()}
                              </span>
                              <span className="text-[13px] text-[#34C759] font-medium">
                                {mockData.mentionsTrend}
                              </span>
                            </div>
                            <p className="text-[13px] text-[#86868b] mt-1">
                              Total AI platform mentions
                            </p>
                          </motion.div>
                        )}

                        {/* Coverage Section */}
                        {sections.find(s => s.id === 'coverage')?.enabled && (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">
                              Platform Coverage
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                              {mockData.platforms.map((p) => (
                                <div key={p.name} className="text-center p-3 rounded-2xl bg-[#f5f5f7]">
                                  <p className="text-[11px] text-[#86868b] mb-1">{p.name}</p>
                                  <p 
                                    className="text-xl font-semibold"
                                    style={{ color: brandColor }}
                                  >
                                    {p.value}%
                                  </p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Distribution Section */}
                        {sections.find(s => s.id === 'distribution')?.enabled && (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">
                              Distribution
                            </h3>
                            <div className="space-y-3">
                              {mockData.distribution.map((d) => (
                                <div key={d.name} className="flex items-center gap-4">
                                  <span className="text-[13px] text-[#86868b] w-20">{d.name}</span>
                                  <div className="flex-1 h-2 bg-[#f5f5f7] rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${d.pct}%` }}
                                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                      className="h-full rounded-full"
                                      style={{ backgroundColor: brandColor }}
                                    />
                                  </div>
                                  <span className="text-[13px] text-[#1d1d1f] font-medium w-14 text-right">
                                    {d.count.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Other sections placeholder */}
                        {['prompts', 'optimization', 'products', 'sources', 'actions'].map((sectionId) => {
                          const section = sections.find(s => s.id === sectionId);
                          if (!section?.enabled) return null;
                          return (
                            <motion.div
                              key={sectionId}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">
                                {section.label}
                              </h3>
                              <div className="p-6 rounded-2xl bg-[#f5f5f7] flex items-center gap-3">
                                <section.icon className="w-5 h-5 text-[#86868b]" />
                                <span className="text-[13px] text-[#86868b]">{section.description}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Document Footer */}
                {showPageNumbers && enabledCount > 0 && (
                  <div className="px-8 py-4 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[11px] text-[#86868b]">
                      {customLogo ? '' : 'Powered by Board Labs'}
                    </span>
                    <span className="text-[11px] text-[#86868b]">1 / 1</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
