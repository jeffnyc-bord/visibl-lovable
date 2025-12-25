import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Search,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Layers,
  Target,
  Zap,
  ArrowUpRight
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
import { useSubscription } from '@/contexts/SubscriptionContext';

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
  { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', initials: 'SC', action: 'Published Air Max guide', time: '2h ago', online: true },
  { name: 'Mike Torres', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', initials: 'MT', action: 'Updated FAQ section', time: '4h ago', online: true },
  { name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', initials: 'AK', action: 'Optimized descriptions', time: 'Yesterday', online: false },
];

const typeConfig: Record<ContentItem['type'], { label: string; icon: React.ReactNode; color: string }> = {
  'landing-page': { label: 'Landing Page', icon: <Target className="w-[18px] h-[18px]" />, color: 'text-blue-600' },
  'blog-post': { label: 'Article', icon: <FileText className="w-[18px] h-[18px]" />, color: 'text-violet-600' },
  'faq': { label: 'FAQ', icon: <HelpCircle className="w-[18px] h-[18px]" />, color: 'text-amber-600' },
  'product-description': { label: 'Product', icon: <Layers className="w-[18px] h-[18px]" />, color: 'text-emerald-600' }
};

// Glowing AEO Score Bar
const AEOScoreBar = ({ score }: { score: number }) => {
  const isExcellent = score >= 90;
  const isGood = score >= 70;
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-1.5 bg-black/[0.04] dark:bg-white/[0.08] rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className={`h-full rounded-full ${
            isExcellent 
              ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' 
              : isGood 
                ? 'bg-gradient-to-r from-blue-400 to-violet-400'
                : 'bg-gradient-to-r from-amber-400 to-orange-400'
          }`}
        />
        {isExcellent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/40 to-cyan-400/40 blur-sm"
          />
        )}
      </div>
      <span className={`text-sm font-semibold tabular-nums ${
        isExcellent ? 'text-emerald-600' : isGood ? 'text-foreground' : 'text-amber-600'
      }`}>
        {score}
      </span>
    </div>
  );
};

export const ContentStudioLibrary = () => {
  const [contentItems] = useState<ContentItem[]>(mockContentItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const { articlesUsed, limits, tier } = useSubscription();

  const articlesRemaining = limits.maxArticles - articlesUsed;

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
  const dataConfidence = Math.min(100, Math.round((articlesUsed / Math.max(limits.maxArticles, 1)) * 100));

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
    <div className="h-full flex gap-0">
      {/* Main Content - Center Stage */}
      <div className="flex-1 flex flex-col min-w-0 pr-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-10"
        >
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F] dark:text-foreground">
            Content Studio
          </h1>
          <p className="text-[15px] text-[#86868B] mt-1">
            Create and manage AI-optimized content
          </p>
        </motion.div>

        {/* Search Bar - Floating Style */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#86868B]" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-black/[0.03] dark:bg-white/[0.06] border-0 rounded-2xl text-[15px] placeholder:text-[#86868B] focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:bg-black/[0.05] dark:focus-visible:bg-white/[0.08] transition-all"
            />
          </div>
        </motion.div>

        {/* Content List - Frameless */}
        <div className="flex-1 overflow-auto">
          {filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-black/[0.03] dark:bg-white/[0.06] flex items-center justify-center mb-5">
                <FileText className="w-7 h-7 text-[#86868B]" />
              </div>
              <p className="text-[17px] font-medium text-[#1D1D1F] dark:text-foreground">No content found</p>
              <p className="text-[15px] text-[#86868B] mt-1">
                {searchQuery ? 'Try a different search term' : 'Create your first piece of content'}
              </p>
            </motion.div>
          ) : (
            <div>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="group"
                >
                  <div 
                    className="flex items-center gap-5 py-5 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.03] -mx-4 px-4 rounded-2xl transition-colors"
                    onClick={() => handleEditContent(item)}
                  >
                    {/* Type Icon */}
                    <div className={`w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center shrink-0 ${typeConfig[item.type].color}`}>
                      {typeConfig[item.type].icon}
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-[15px] font-medium text-[#1D1D1F] dark:text-foreground truncate leading-snug">
                          {item.title}
                        </h3>
                        {item.status === 'published' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        )}
                        {item.status === 'needs-attention' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className="text-[13px] text-[#86868B] mt-0.5">
                        {typeConfig[item.type].label} · {item.productName} · {formatTimeAgo(item.updatedAt)}
                      </p>
                    </div>

                    {/* Author Avatar */}
                    {item.author && (
                      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-white dark:ring-background shadow-sm">
                        <AvatarImage src={item.author.avatar} alt={item.author.name} />
                        <AvatarFallback className="text-[11px] font-medium bg-gradient-to-br from-gray-100 to-gray-200 dark:from-muted dark:to-muted-foreground/20 text-[#86868B]">
                          {item.author.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* AEO Score */}
                    {item.aeoScore && <AEOScoreBar score={item.aeoScore} />}

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg shrink-0"
                        >
                          <MoreHorizontal className="w-4 h-4 text-[#86868B]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-xl border-black/[0.08] dark:border-white/[0.1]">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditContent(item); }} className="rounded-lg">
                          <Pencil className="w-3.5 h-3.5 mr-2.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="rounded-lg">
                          <Eye className="w-3.5 h-3.5 mr-2.5" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600 focus:text-red-600 rounded-lg">
                          <Trash2 className="w-3.5 h-3.5 mr-2.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Separator */}
                  {index < filteredItems.length - 1 && (
                    <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mx-4" />
                  )}
                </motion.div>
              ))}

              {/* Ghost Slot */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: filteredItems.length * 0.03 + 0.1 }}
                className="mt-6"
              >
                <div 
                  className="flex items-center gap-5 py-5 px-5 rounded-2xl border-2 border-dashed border-black/[0.08] dark:border-white/[0.1] hover:border-black/[0.15] dark:hover:border-white/[0.2] hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-all cursor-pointer group"
                  onClick={handleCreateNew}
                >
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-black/[0.12] dark:border-white/[0.15] flex items-center justify-center group-hover:border-black/[0.2] dark:group-hover:border-white/[0.25] transition-colors">
                    <Plus className="w-5 h-5 text-[#86868B] group-hover:text-[#1D1D1F] dark:group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-[#86868B] group-hover:text-[#1D1D1F] dark:group-hover:text-foreground transition-colors">
                      Ready for your next high-impact page?
                    </p>
                    <p className="text-[13px] text-[#86868B]/70 mt-0.5">
                      Start a new AEO scan to expand coverage
                    </p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#86868B]/50 group-hover:text-[#86868B] transition-colors" />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Command Center - Right Panel with Frosted Glass */}
      <motion.div 
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="w-80 shrink-0 pl-8 border-l border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="sticky top-0 space-y-8">
          {/* Primary CTA - Gradient Pill */}
          <Button 
            onClick={handleCreateNew}
            className="w-full h-14 rounded-[20px] bg-gradient-to-b from-[#1D1D1F] to-[#0a0a0a] hover:from-[#2d2d2f] hover:to-[#1a1a1a] text-white font-medium text-[15px] shadow-[0_2px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all"
          >
            <Sparkles className="w-[18px] h-[18px] mr-2.5" />
            Create with AI
          </Button>

          {/* Stats - High Contrast */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-semibold text-[#1D1D1F] dark:text-foreground tabular-nums">{avgScore}</span>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">+2%</span>
                </div>
              </div>
              <p className="text-[13px] text-[#86868B] mt-1">Avg. Score</p>
            </div>
            <div className="p-5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-semibold text-[#1D1D1F] dark:text-foreground tabular-nums">{publishedCount}</span>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">+1</span>
                </div>
              </div>
              <p className="text-[13px] text-[#86868B] mt-1">Published</p>
            </div>
          </div>

          {/* Articles Remaining */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-amber-800 dark:text-amber-200">Articles Remaining</span>
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-2 bg-amber-200/50 dark:bg-amber-800/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, (articlesRemaining / limits.maxArticles) * 100)}%` }}
                  transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                />
              </div>
              <span className="text-[15px] font-semibold text-amber-800 dark:text-amber-200 tabular-nums">{articlesRemaining}/{limits.maxArticles}</span>
            </div>
            <p className="text-[12px] text-amber-700/80 dark:text-amber-300/70 leading-relaxed">
              {tier === 'enterprise' 
                ? 'Unlimited AEO-optimized articles available.'
                : `Upgrade to Pro for 15 AI Search Optimized articles from AEO Content Studio.`
              }
            </p>
          </div>

          {/* Recent Activity - iOS Notification Style */}
          <div>
            <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-4">
              Recent Activity
            </h3>
            <div className="space-y-2">
              {teamActivity.map((member, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] backdrop-blur-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-background shadow-sm">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-[11px] font-medium bg-gradient-to-br from-gray-100 to-gray-200 dark:from-muted dark:to-muted-foreground/20 text-[#86868B]">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    {member.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1D1D1F] dark:text-foreground truncate">
                      {member.action}
                    </p>
                    <p className="text-[12px] text-[#86868B]">
                      {member.name} · {member.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
