import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Clock,
  Globe,
  Search,
  HelpCircle,
  FileCode,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Activity,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AEOContentStudio } from './AEOContentStudio';

interface ContentItem {
  id: string;
  title: string;
  type: 'landing-page' | 'blog-post' | 'faq' | 'product-description';
  status: 'draft' | 'published' | 'needs-attention';
  createdAt: string;
  updatedAt: string;
  productName?: string;
  aeoScore?: number;
}

// Mock data for existing content
const mockContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Air Max 2024 - Ultimate Running Shoe Guide',
    type: 'landing-page',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-18',
    productName: 'Air Max',
    aeoScore: 92
  },
  {
    id: '2',
    title: 'Why Nike Air Jordan Remains the #1 Basketball Shoe',
    type: 'blog-post',
    status: 'published',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14',
    productName: 'Air Jordan',
    aeoScore: 88
  },
  {
    id: '3',
    title: 'Nike Pro Compression Gear FAQ',
    type: 'faq',
    status: 'draft',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    productName: 'Nike Pro',
    aeoScore: 75
  },
  {
    id: '4',
    title: 'Air Force 1 - Product Description Optimization',
    type: 'product-description',
    status: 'needs-attention',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
    productName: 'Air Force 1',
    aeoScore: 58
  },
  {
    id: '5',
    title: 'ZoomX Vaporfly - Elite Performance Landing Page',
    type: 'landing-page',
    status: 'published',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-16',
    productName: 'ZoomX Vaporfly',
    aeoScore: 95
  }
];

const typeConfig: Record<ContentItem['type'], { label: string; icon: React.ReactNode }> = {
  'landing-page': { label: 'Landing Page', icon: <FileCode className="w-4 h-4" /> },
  'blog-post': { label: 'Article', icon: <FileText className="w-4 h-4" /> },
  'faq': { label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
  'product-description': { label: 'Product', icon: <ShoppingBag className="w-4 h-4" /> }
};

// Activity Ring Component
const ActivityRing = ({ 
  value, 
  max, 
  size = 80, 
  strokeWidth = 8,
  gradientId,
  gradientColors
}: { 
  value: number; 
  max: number; 
  size?: number; 
  strokeWidth?: number;
  gradientId: string;
  gradientColors: { start: string; end: string };
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors.start} />
            <stop offset="100%" stopColor={gradientColors.end} />
          </linearGradient>
        </defs>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          className="opacity-30"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-foreground">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
};

// Sparkline Component
const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 40;
  const width = 120;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="url(#sparkline-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// AEO Score Gradient Bar
const AEOScoreBar = ({ score }: { score: number }) => {
  const getGradient = () => {
    if (score >= 80) return 'from-emerald-400 to-blue-500';
    if (score >= 60) return 'from-amber-400 to-emerald-500';
    return 'from-rose-400 to-amber-500';
  };

  return (
    <div className="w-24">
      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()}`}
        />
      </div>
      <div className="text-[11px] text-muted-foreground mt-1 text-right">{score}%</div>
    </div>
  );
};

// Status Dot Component
const StatusDot = ({ status }: { status: ContentItem['status'] }) => {
  const config = {
    'published': { color: 'bg-emerald-500', glow: 'shadow-emerald-500/50', label: 'Live' },
    'draft': { color: 'bg-muted-foreground', glow: '', label: 'Draft' },
    'needs-attention': { color: 'bg-amber-500', glow: 'shadow-amber-500/50 animate-pulse', label: 'Needs Attention' }
  };

  const { color, glow, label } = config[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color} ${glow} shadow-lg`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

// Team Activity Item
const TeamActivityItem = ({ name, action, time }: { name: string; action: string; time: string }) => (
  <div className="flex items-start gap-3 py-2">
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
      {name.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-foreground truncate">
        <span className="font-medium">{name}</span> {action}
      </p>
      <p className="text-[10px] text-muted-foreground">{time}</p>
    </div>
  </div>
);

export const ContentStudioLibrary = () => {
  const [contentItems] = useState<ContentItem[]>(mockContentItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const filteredItems = contentItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setSelectedContent(null);
    setIsStudioOpen(true);
  };

  const handleEditContent = (item: ContentItem) => {
    setSelectedContent(item);
    setIsStudioOpen(true);
  };

  const publishedCount = contentItems.filter(i => i.status === 'published').length;
  const avgScore = Math.round(contentItems.reduce((acc, i) => acc + (i.aeoScore || 0), 0) / contentItems.length);
  const fidelityScore = 50; // Mock tier-based score

  if (isStudioOpen) {
    return (
      <AEOContentStudio
        isOpen={true}
        onClose={() => setIsStudioOpen(false)}
        prompt={null}
        contentType={null}
        productName={selectedContent?.productName}
      />
    );
  }

  return (
    <div className="h-full flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Glassmorphic Dashboard Stage */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
          
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">AEO Content Studio</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage AI-optimized content for better visibility
                </p>
              </div>
            </div>

            {/* Activity Rings Row */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <ActivityRing 
                  value={avgScore} 
                  max={100} 
                  gradientId="health-ring"
                  gradientColors={{ start: '#22c55e', end: '#10b981' }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">Overall AEO Health</div>
                  <div className="text-xs text-muted-foreground">Across all content</div>
                </div>
              </div>

              <div className="h-12 w-px bg-border/50" />

              <div className="flex items-center gap-4">
                <ActivityRing 
                  value={publishedCount} 
                  max={contentItems.length} 
                  size={64}
                  strokeWidth={6}
                  gradientId="published-ring"
                  gradientColors={{ start: '#3b82f6', end: '#8b5cf6' }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{publishedCount} Published</div>
                  <div className="text-xs text-muted-foreground">of {contentItems.length} total</div>
                </div>
              </div>

              <div className="h-12 w-px bg-border/50" />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span className="text-2xl font-light text-foreground">+24%</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Live Impact</div>
                  <div className="text-xs text-muted-foreground">This month</div>
                </div>
              </div>

              <div className="flex-1" />

              {/* Fidelity Gauge */}
              <motion.div 
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200/50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-10 h-10">
                  <svg width="40" height="40" className="transform -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#fde68a" strokeWidth="4" />
                    <circle 
                      cx="20" cy="20" r="16" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="4"
                      strokeDasharray={100.53}
                      strokeDashoffset={100.53 * (1 - fidelityScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-amber-700">
                    {fidelityScore}%
                  </span>
                </div>
                <div className="max-w-[180px]">
                  <div className="text-xs font-medium text-amber-800">Data Fidelity</div>
                  <div className="text-[10px] text-amber-600 leading-tight">
                    Add 5 more product tracks for 100% fidelity
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-600" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-foreground/20"
          />
        </div>

        {/* Content Library List */}
        <div className="flex-1 overflow-auto">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No content found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search' : 'Start creating AI-optimized content'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group py-4 px-2 hover:bg-muted/30 rounded-lg transition-all cursor-pointer -mx-2"
                  onClick={() => handleEditContent(item)}
                >
                  <div className="flex items-center gap-4">
                    {/* Type Icon */}
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
                      {typeConfig[item.type].icon}
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-medium text-[#1D1D1F] truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{typeConfig[item.type].label}</span>
                        <span>•</span>
                        {item.productName && (
                          <>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {item.productName}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Updated {formatTimeAgo(item.updatedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Status Dot */}
                    <StatusDot status={item.status} />

                    {/* AEO Score Bar */}
                    {item.aeoScore && <AEOScoreBar score={item.aeoScore} />}

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditContent(item); }}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}

              {/* Ghost Slot */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: filteredItems.length * 0.05 + 0.1 }}
                className="py-4 px-2 -mx-2"
              >
                <div 
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors cursor-pointer group"
                  onClick={handleCreateNew}
                >
                  <div className="w-8 h-8 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/50 group-hover:border-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Next Category Awaiting Optimization
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      Expand coverage to competitor's top-performing keywords
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Action Drawer - Right Sidebar */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-72 ml-6 flex flex-col"
      >
        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
          
          {/* Big Action Button */}
          <Button 
            onClick={handleCreateNew}
            className="w-full h-12 rounded-xl bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white shadow-lg shadow-black/20 mb-3 gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Optimize with AI
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-lg text-xs">
              <Plus className="w-3 h-3 mr-1" />
              New Content
            </Button>
            <Button variant="outline" size="sm" className="h-9 rounded-lg text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Bulk Optimize
            </Button>
          </div>
        </div>

        {/* Analytics Snapshot */}
        <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Impact Analysis</h3>
            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <Sparkline data={[45, 52, 48, 61, 58, 72, 68, 85, 82, 91]} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">Visibility Trend</span>
            <span className="text-xs font-medium text-emerald-600">+24% ↑</span>
          </div>
        </div>

        {/* Team Activity */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Activity</h3>
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <TeamActivityItem 
              name="Sarah" 
              action="published Air Max guide" 
              time="2 hours ago" 
            />
            <TeamActivityItem 
              name="Mike" 
              action="updated FAQ section" 
              time="4 hours ago" 
            />
            <TeamActivityItem 
              name="Alex" 
              action="optimized product descriptions" 
              time="Yesterday" 
            />
            <TeamActivityItem 
              name="Jordan" 
              action="created landing page draft" 
              time="Yesterday" 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}