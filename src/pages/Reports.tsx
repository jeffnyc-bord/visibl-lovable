import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Check,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Hash,
  Image,
  Palette,
  Settings2,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Globe,
  BarChart3,
  Target,
  Zap,
  Link2,
  Activity,
  Building,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Report section types
interface ReportSection {
  id: string;
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  subsections?: {
    id: string;
    label: string;
    enabled: boolean;
  }[];
}

// Mock data for preview
const mockScoreData = {
  overall: 87,
  trend: '+5',
  platforms: [
    { name: 'ChatGPT', score: 92 },
    { name: 'Claude', score: 87 },
    { name: 'Gemini', score: 84 },
    { name: 'Perplexity', score: 91 },
  ]
};

const mockMentionsData = {
  total: 12847,
  change: '+12%',
  byPlatform: [
    { name: 'ChatGPT', count: 4234, percentage: 33 },
    { name: 'Claude', count: 3456, percentage: 27 },
    { name: 'Gemini', count: 2847, percentage: 22 },
    { name: 'Perplexity', count: 2310, percentage: 18 },
  ]
};

const Reports = () => {
  const [timePeriod, setTimePeriod] = useState('last_30_days');
  const [reportTitle, setReportTitle] = useState('AI Visibility Report');
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState('#22D3EE');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sections, setSections] = useState<ReportSection[]>([
    {
      id: 'score',
      key: 'score',
      label: 'Visibility Score',
      description: 'Overall AI visibility score with trend analysis',
      icon: Target,
      enabled: true,
    },
    {
      id: 'mentions',
      key: 'mentions',
      label: 'Mentions Overview',
      description: 'Total mentions across all platforms',
      icon: MessageSquare,
      enabled: true,
    },
    {
      id: 'platforms_coverage',
      key: 'platforms_coverage',
      label: 'Platforms Coverage',
      description: 'Coverage percentage across AI platforms',
      icon: Globe,
      enabled: true,
    },
    {
      id: 'platform_distribution',
      key: 'platform_distribution',
      label: 'Platform Distribution',
      description: 'Breakdown of mentions by platform',
      icon: BarChart3,
      enabled: true,
    },
    {
      id: 'prompts',
      key: 'prompts',
      label: 'Prompts Analysis',
      description: 'Performance of tracked prompts',
      icon: Zap,
      enabled: true,
      subsections: [
        { id: 'prompts_top', label: 'Top performing prompts', enabled: true },
        { id: 'prompts_low', label: 'Low confidence prompts', enabled: false },
        { id: 'prompts_all', label: 'All tracked prompts', enabled: false },
      ]
    },
    {
      id: 'onsite',
      key: 'onsite',
      label: 'On-Site Optimization',
      description: 'Content optimization recommendations',
      icon: Sparkles,
      enabled: false,
    },
    {
      id: 'products',
      key: 'products',
      label: 'Products Optimized',
      description: 'Products with their optimized content',
      icon: Building,
      enabled: false,
      subsections: [
        { id: 'products_list', label: 'Product list with scores', enabled: true },
        { id: 'products_prompts', label: 'Associated prompts', enabled: true },
        { id: 'products_content', label: 'Generated content', enabled: false },
      ]
    },
    {
      id: 'sources',
      key: 'sources',
      label: 'Authority Sources',
      description: 'Sources with traffic and citations data',
      icon: Link2,
      enabled: false,
      subsections: [
        { id: 'sources_list', label: 'Source list with traffic', enabled: true },
        { id: 'sources_citations', label: 'LLM citations count', enabled: true },
        { id: 'sources_prompts', label: 'Prompts that surfaced sources', enabled: false },
      ]
    },
    {
      id: 'actions_log',
      key: 'actions_log',
      label: 'Actions Log',
      description: 'Selected actions and activities',
      icon: Activity,
      enabled: false,
    },
  ]);

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const toggleSubsection = (sectionId: string, subsectionId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId && s.subsections) {
        return {
          ...s,
          subsections: s.subsections.map(sub => 
            sub.id === subsectionId ? { ...sub, enabled: !sub.enabled } : sub
          )
        };
      }
      return s;
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const enabledSections = sections.filter(s => s.enabled);

  const handleExportPDF = () => {
    // PDF export logic would go here
    console.log('Exporting PDF with sections:', enabledSections);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Create and export custom AI visibility reports
            </p>
          </div>
          <Button 
            onClick={handleExportPDF}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Panel - Configuration */}
          <div className="col-span-4 space-y-6">
            {/* Time Period */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Time Period</Label>
                </div>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">Last 7 days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 days</SelectItem>
                    <SelectItem value="last_year">Last year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Sections to Include */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Sections to Include</Label>
                </div>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <div 
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200",
                          section.enabled 
                            ? "bg-primary/5 border border-primary/20" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => toggleSection(section.id)}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors",
                          section.enabled 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted border border-border"
                        )}>
                          {section.enabled && <Check className="w-3 h-3" />}
                        </div>
                        <section.icon className={cn(
                          "w-4 h-4 flex-shrink-0",
                          section.enabled ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            section.enabled ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {section.label}
                          </p>
                        </div>
                      </div>
                      
                      {/* Subsections */}
                      {section.enabled && section.subsections && (
                        <div className="ml-10 mt-1 space-y-1">
                          {section.subsections.map((sub) => (
                            <div 
                              key={sub.id}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors text-sm",
                                sub.enabled ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubsection(section.id, sub.id);
                              }}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded flex items-center justify-center flex-shrink-0",
                                sub.enabled 
                                  ? "bg-primary/20 text-primary" 
                                  : "border border-border"
                              )}>
                                {sub.enabled && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span>{sub.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* White Label Settings */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">White Label</Label>
                  </div>
                  <Switch 
                    checked={whiteLabelMode} 
                    onCheckedChange={setWhiteLabelMode}
                  />
                </div>
                
                <AnimatePresence>
                  {whiteLabelMode && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Report Title</Label>
                        <Input 
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                          placeholder="Enter report title"
                          className="h-9"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Custom Logo</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full justify-start"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          {customLogo ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                        {customLogo && (
                          <div className="mt-2 p-2 bg-muted/50 rounded-md">
                            <img src={customLogo} alt="Custom logo" className="h-8 object-contain" />
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Brand Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={brandColor}
                            onChange={(e) => setBrandColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0"
                          />
                          <Input 
                            value={brandColor}
                            onChange={(e) => setBrandColor(e.target.value)}
                            className="h-9 flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Page Settings */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Page Settings</Label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Show page numbers</span>
                  <Switch 
                    checked={showPageNumbers}
                    onCheckedChange={setShowPageNumbers}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="col-span-8">
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {enabledSections.length} sections
                </Badge>
              </div>
              
              {/* Preview Container */}
              <div className="bg-white rounded-xl border border-border shadow-lg overflow-hidden">
                {/* Report Header */}
                <div 
                  className="p-6 border-b"
                  style={{ 
                    background: whiteLabelMode 
                      ? `linear-gradient(135deg, ${brandColor}15, ${brandColor}05)` 
                      : 'linear-gradient(135deg, hsl(var(--primary)/0.1), transparent)' 
                  }}
                >
                  <div className="flex items-center justify-between">
                    {whiteLabelMode && customLogo ? (
                      <img src={customLogo} alt="Logo" className="h-8 object-contain" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-semibold text-foreground">Board Labs</span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {timePeriod === 'last_7_days' ? 'Dec 15 - Dec 22, 2024' :
                       timePeriod === 'last_30_days' ? 'Nov 22 - Dec 22, 2024' :
                       timePeriod === 'last_90_days' ? 'Sep 23 - Dec 22, 2024' :
                       'Dec 22, 2023 - Dec 22, 2024'}
                    </span>
                  </div>
                  <h1 className="text-xl font-semibold text-foreground mt-4">{reportTitle}</h1>
                  <p className="text-sm text-muted-foreground mt-1">Nike • Generated Dec 22, 2024</p>
                </div>

                {/* Preview Sections */}
                <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {enabledSections.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <EyeOff className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-muted-foreground">No sections selected</p>
                        <p className="text-sm text-muted-foreground/60 mt-1">
                          Select sections from the left panel to preview
                        </p>
                      </motion.div>
                    ) : (
                      enabledSections.map((section, index) => (
                        <motion.div
                          key={section.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="border-b border-border/50 pb-6 last:border-0"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <section.icon className="w-4 h-4" style={{ color: whiteLabelMode ? brandColor : 'hsl(var(--primary))' }} />
                            <h3 className="font-medium text-foreground">{section.label}</h3>
                          </div>
                          
                          {/* Section-specific preview content */}
                          {section.key === 'score' && (
                            <div className="flex items-center gap-6">
                              <div 
                                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                                style={{ 
                                  background: whiteLabelMode 
                                    ? `linear-gradient(135deg, ${brandColor}20, ${brandColor}05)` 
                                    : 'linear-gradient(135deg, hsl(var(--primary)/0.15), hsl(var(--primary)/0.05))',
                                  color: whiteLabelMode ? brandColor : 'hsl(var(--primary))'
                                }}
                              >
                                {mockScoreData.overall}
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Overall Score</p>
                                <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                  <span className="text-green-500 text-sm">{mockScoreData.trend}</span>
                                  <span className="text-muted-foreground text-xs ml-1">vs last period</span>
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {section.key === 'mentions' && (
                            <div>
                              <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-3xl font-bold text-foreground">{mockMentionsData.total.toLocaleString()}</span>
                                <span className="text-sm text-green-500 font-medium">{mockMentionsData.change}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Total mentions across all platforms</p>
                            </div>
                          )}
                          
                          {section.key === 'platforms_coverage' && (
                            <div className="grid grid-cols-4 gap-3">
                              {mockScoreData.platforms.map((platform) => (
                                <div key={platform.name} className="text-center p-3 rounded-lg bg-muted/30">
                                  <p className="text-xs text-muted-foreground mb-1">{platform.name}</p>
                                  <p 
                                    className="text-lg font-semibold"
                                    style={{ color: whiteLabelMode ? brandColor : 'hsl(var(--primary))' }}
                                  >
                                    {platform.score}%
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {section.key === 'platform_distribution' && (
                            <div className="space-y-2">
                              {mockMentionsData.byPlatform.map((platform) => (
                                <div key={platform.name} className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground w-24">{platform.name}</span>
                                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${platform.percentage}%` }}
                                      transition={{ duration: 0.5, delay: 0.1 }}
                                      className="h-full rounded-full"
                                      style={{ backgroundColor: whiteLabelMode ? brandColor : 'hsl(var(--primary))' }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground w-16 text-right">
                                    {platform.count.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {(section.key === 'prompts' || section.key === 'onsite' || 
                            section.key === 'products' || section.key === 'sources' || 
                            section.key === 'actions_log') && (
                            <div className="bg-muted/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{section.description}</span>
                              </div>
                              {section.subsections && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {section.subsections.filter(s => s.enabled).map((sub) => (
                                    <Badge key={sub.id} variant="secondary" className="text-xs">
                                      {sub.label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Page Footer */}
                {showPageNumbers && enabledSections.length > 0 && (
                  <div className="px-6 py-3 border-t bg-muted/20 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {whiteLabelMode ? '' : 'Generated with Board Labs'}
                    </span>
                    <span className="text-xs text-muted-foreground">Page 1 of 1</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
