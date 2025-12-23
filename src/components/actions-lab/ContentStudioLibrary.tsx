import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
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
  Activity,
  ArrowUpRight,
  Zap,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  author?: {
    name: string;
    avatar?: string;
    initials: string;
  };
}

interface TeamMember {
  name: string;
  avatar?: string;
  initials: string;
  action: string;
  time: string;
  online?: boolean;
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
    aeoScore: 92,
    author: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', initials: 'SC' }
  },
  {
    id: '2',
    title: 'Why Nike Air Jordan Remains the #1 Basketball Shoe',
    type: 'blog-post',
    status: 'published',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14',
    productName: 'Air Jordan',
    aeoScore: 88,
    author: { name: 'Mike Torres', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', initials: 'MT' }
  },
  {
    id: '3',
    title: 'Nike Pro Compression Gear FAQ',
    type: 'faq',
    status: 'draft',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    productName: 'Nike Pro',
    aeoScore: 75,
    author: { name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', initials: 'AK' }
  },
  {
    id: '4',
    title: 'Air Force 1 - Product Description Optimization',
    type: 'product-description',
    status: 'needs-attention',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
    productName: 'Air Force 1',
    aeoScore: 58,
    author: { name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', initials: 'JL' }
  },
  {
    id: '5',
    title: 'ZoomX Vaporfly - Elite Performance Landing Page',
    type: 'landing-page',
    status: 'published',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-16',
    productName: 'ZoomX Vaporfly',
    aeoScore: 95,
    author: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', initials: 'SC' }
  }
];

const teamActivity: TeamMember[] = [
  { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', initials: 'SC', action: 'published Air Max guide', time: '2h ago', online: true },
  { name: 'Mike Torres', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', initials: 'MT', action: 'updated FAQ section', time: '4h ago', online: true },
  { name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', initials: 'AK', action: 'optimized descriptions', time: 'Yesterday', online: false },
  { name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', initials: 'JL', action: 'created draft', time: 'Yesterday', online: false },
];

const typeConfig: Record<ContentItem['type'], { label: string; icon: React.ReactNode }> = {
  'landing-page': { label: 'Landing Page', icon: <FileCode className="w-4 h-4" /> },
  'blog-post': { label: 'Article', icon: <FileText className="w-4 h-4" /> },
  'faq': { label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
  'product-description': { label: 'Product', icon: <ShoppingBag className="w-4 h-4" /> }
};

// Activity Ring Component - Apple Health style
const ActivityRing = ({ 
  value, 
  max, 
  size = 72, 
  strokeWidth = 6,
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
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
        <span className="text-base font-semibold text-foreground tracking-tight">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
};

// Sparkline Component
const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 32;
  const width = 100;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#60a5fa" />
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

// AEO Score Gradient Bar - Refined
const AEOScoreBar = ({ score }: { score: number }) => {
  const getGradient = () => {
    if (score >= 80) return 'from-emerald-400 via-teal-400 to-cyan-400';
    if (score >= 60) return 'from-amber-400 via-yellow-400 to-emerald-400';
    return 'from-rose-400 via-orange-400 to-amber-400';
  };

  return (
    <div className="w-20">
      <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()}`}
        />
      </div>
      <div className="text-[10px] text-muted-foreground mt-1 text-right font-medium">{score}</div>
    </div>
  );
};

// Status Dot Component - Apple Home style
const StatusDot = ({ status }: { status: ContentItem['status'] }) => {
  const config = {
    'published': { color: 'bg-emerald-500', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.6)]', label: 'Live' },
    'draft': { color: 'bg-neutral-400', glow: '', label: 'Draft' },
    'needs-attention': { color: 'bg-amber-500', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse', label: 'Attention' }
  };

  const { color, glow, label } = config[status];

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${color} ${glow}`} />
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
    </div>
  );
};

// Team Activity Item with Avatar
const TeamActivityItem = ({ member }: { member: TeamMember }) => (
  <motion.div 
    className="flex items-center gap-2.5 py-2.5 group"
    whileHover={{ x: 2 }}
    transition={{ duration: 0.15 }}
  >
    <div className="relative">
      <Avatar className="h-7 w-7 ring-2 ring-background">
        <AvatarImage src={member.avatar} alt={member.name} />
        <AvatarFallback className="text-[10px] font-medium bg-gradient-to-br from-muted to-muted-foreground/20 text-muted-foreground">
          {member.initials}
        </AvatarFallback>
      </Avatar>
      {member.online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-background" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-foreground leading-tight">
        <span className="font-medium">{member.name.split(' ')[0]}</span>
        <span className="text-muted-foreground"> {member.action}</span>
      </p>
      <p className="text-[10px] text-muted-foreground/70">{member.time}</p>
    </div>
  </motion.div>
);

// Avatar Stack Component
const AvatarStack = ({ members }: { members: { avatar?: string; initials: string; name: string }[] }) => (
  <div className="flex -space-x-2">
    {members.slice(0, 4).map((member, i) => (
      <Avatar key={i} className="h-6 w-6 ring-2 ring-background">
        <AvatarImage src={member.avatar} alt={member.name} />
        <AvatarFallback className="text-[9px] font-medium bg-muted text-muted-foreground">
          {member.initials}
        </AvatarFallback>
      </Avatar>
    ))}
    {members.length > 4 && (
      <div className="h-6 w-6 rounded-full bg-muted ring-2 ring-background flex items-center justify-center">
        <span className="text-[9px] font-medium text-muted-foreground">+{members.length - 4}</span>
      </div>
    )}
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
  const fidelityScore = 50;

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

  const uniqueAuthors = mockContentItems
    .filter(item => item.author)
    .reduce((acc, item) => {
      if (item.author && !acc.find(a => a.name === item.author!.name)) {
        acc.push(item.author);
      }
      return acc;
    }, [] as { name: string; avatar?: string; initials: string }[]);

  return (
    <div className="h-full flex bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Stage - Clean Apple aesthetic */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Title Row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-semibold text-foreground tracking-tight">Content Studio</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Create AI-optimized content for visibility
              </p>
            </div>
            <AvatarStack members={uniqueAuthors} />
          </div>

          {/* Metrics Row - Refined Apple style */}
          <div className="flex items-center gap-10">
            {/* AEO Health Ring */}
            <div className="flex items-center gap-4">
              <ActivityRing 
                value={avgScore} 
                max={100} 
                gradientId="health-ring"
                gradientColors={{ start: '#34d399', end: '#10b981' }}
              />
              <div>
                <div className="text-sm font-medium text-foreground">AEO Health</div>
                <div className="text-xs text-muted-foreground">All content</div>
              </div>
            </div>

            <div className="h-10 w-px bg-border/60" />

            {/* Published Count */}
            <div className="flex items-center gap-4">
              <ActivityRing 
                value={publishedCount} 
                max={contentItems.length} 
                size={56}
                strokeWidth={5}
                gradientId="published-ring"
                gradientColors={{ start: '#60a5fa', end: '#a78bfa' }}
              />
              <div>
                <div className="text-sm font-medium text-foreground">{publishedCount} Live</div>
                <div className="text-xs text-muted-foreground">of {contentItems.length}</div>
              </div>
            </div>

            <div className="h-10 w-px bg-border/60" />

            {/* Live Impact */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-xl font-semibold text-foreground tracking-tight">+24%</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
            </div>

            <div className="flex-1" />

            {/* Fidelity Nudge */}
            <motion.button
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="relative w-9 h-9">
                <svg width="36" height="36" className="transform -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#fde68a" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="14" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="3"
                    strokeDasharray={87.96}
                    strokeDashoffset={87.96 * (1 - fidelityScore / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-amber-700">
                  {fidelityScore}%
                </span>
              </div>
              <div className="text-left max-w-[140px]">
                <div className="text-xs font-medium text-amber-800">Fidelity</div>
                <div className="text-[10px] text-amber-600 leading-tight">
                  Add 5 more tracks
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
            </motion.button>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-muted/30 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-ring/20 placeholder:text-muted-foreground/50"
            />
          </div>
          <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Content Library List */}
        <div className="flex-1 overflow-auto -mx-1 px-1">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-base font-medium text-foreground mb-1">No content found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search' : 'Start creating AI-optimized content'}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="group py-3.5 px-3 hover:bg-muted/40 rounded-xl transition-all cursor-pointer"
                  onClick={() => handleEditContent(item)}
                >
                  <div className="flex items-center gap-4">
                    {/* Type Icon */}
                    <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground/70 group-hover:bg-muted group-hover:text-muted-foreground transition-colors">
                      {typeConfig[item.type].icon}
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-medium text-foreground truncate group-hover:text-primary transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        <span className="font-medium">{typeConfig[item.type].label}</span>
                        {item.productName && (
                          <>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {item.productName}
                            </span>
                          </>
                        )}
                        <span className="text-muted-foreground/40">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(item.updatedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Author Avatar */}
                    {item.author && (
                      <Avatar className="h-7 w-7 ring-2 ring-background opacity-80 group-hover:opacity-100 transition-opacity">
                        <AvatarImage src={item.author.avatar} alt={item.author.name} />
                        <AvatarFallback className="text-[9px] font-medium bg-muted text-muted-foreground">
                          {item.author.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* Status Dot */}
                    <StatusDot status={item.status} />

                    {/* AEO Score Bar */}
                    {item.aeoScore && <AEOScoreBar score={item.aeoScore} />}

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditContent(item); }}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Eye className="w-3.5 h-3.5 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive focus:text-destructive">
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
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
                transition={{ delay: filteredItems.length * 0.03 + 0.1 }}
                className="py-3"
              >
                <div 
                  className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/20 transition-all cursor-pointer group"
                  onClick={handleCreateNew}
                >
                  <div className="w-9 h-9 rounded-xl border border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/40 group-hover:border-muted-foreground/50 group-hover:text-muted-foreground/60 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium">
                      Expand Coverage
                    </p>
                    <p className="text-[11px] text-muted-foreground/60">
                      Target competitor's top keywords
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
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
        transition={{ delay: 0.15 }}
        className="w-64 ml-8 flex flex-col"
      >
        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
          
          {/* Big Action Button - Apple style glossy black */}
          <Button 
            onClick={handleCreateNew}
            className="w-full h-11 rounded-2xl bg-foreground hover:bg-foreground/90 text-background shadow-lg shadow-foreground/10 mb-3 gap-2 font-medium"
          >
            <Sparkles className="w-4 h-4" />
            Optimize with AI
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-xl text-[11px] font-medium border-border/50">
              <Plus className="w-3 h-3 mr-1.5" />
              New
            </Button>
            <Button variant="outline" size="sm" className="h-9 rounded-xl text-[11px] font-medium border-border/50">
              <Zap className="w-3 h-3 mr-1.5" />
              Bulk
            </Button>
          </div>
        </div>

        {/* Analytics Snapshot */}
        <div className="mb-8 p-4 rounded-2xl bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Impact</h3>
            <Activity className="w-3.5 h-3.5 text-muted-foreground/60" />
          </div>
          <Sparkline data={[45, 52, 48, 61, 58, 72, 68, 85, 82, 91]} />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-muted-foreground">Visibility</span>
            <span className="text-[11px] font-semibold text-emerald-600">+24%</span>
          </div>
        </div>

        {/* Team Activity with Avatars */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Team Activity</h3>
            <div className="flex -space-x-1.5">
              {teamActivity.slice(0, 3).map((member, i) => (
                <Avatar key={i} className="h-5 w-5 ring-2 ring-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-[8px] font-medium bg-muted text-muted-foreground">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <div className="space-y-0.5">
            {teamActivity.map((member, i) => (
              <TeamActivityItem key={i} member={member} />
            ))}
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
  
  if (diffInHours < 1) return 'now';
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInHours < 48) return 'yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
