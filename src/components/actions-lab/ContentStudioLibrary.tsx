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
  FileCode,
  ShoppingBag,
  Sparkles,
  ChevronRight
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

const typeConfig: Record<ContentItem['type'], { label: string; icon: React.ReactNode }> = {
  'landing-page': { label: 'Landing Page', icon: <FileCode className="w-4 h-4" /> },
  'blog-post': { label: 'Article', icon: <FileText className="w-4 h-4" /> },
  'faq': { label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
  'product-description': { label: 'Product', icon: <ShoppingBag className="w-4 h-4" /> }
};

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
    <div className="h-full flex bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 max-w-4xl">
        {/* Header */}
        <div className="pb-8">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Content Studio
          </h1>
          <p className="text-muted-foreground mt-1">
            {contentItems.length} items · {publishedCount} published
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-muted/50 border-0 rounded-xl text-base placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-auto">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">No content found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? 'Try a different search' : 'Create your first piece'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="group py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 -mx-3 px-3 rounded-xl transition-colors"
                  onClick={() => handleEditContent(item)}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    {typeConfig[item.type].icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-medium text-foreground truncate">
                        {item.title}
                      </h3>
                      {item.status === 'needs-attention' && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {typeConfig[item.type].label} · {formatTimeAgo(item.updatedAt)}
                    </p>
                  </div>

                  {/* Author */}
                  {item.author && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={item.author.avatar} alt={item.author.name} />
                      <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                        {item.author.initials}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Score */}
                  {item.aeoScore && (
                    <div className="w-10 text-right shrink-0">
                      <span className={`text-sm font-medium ${
                        item.aeoScore >= 80 ? 'text-emerald-600' : 
                        item.aeoScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {item.aeoScore}
                      </span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="w-16 shrink-0">
                    <span className={`text-xs font-medium ${
                      item.status === 'published' ? 'text-emerald-600' :
                      item.status === 'draft' ? 'text-muted-foreground' : 'text-amber-600'
                    }`}>
                      {item.status === 'published' ? 'Live' : 
                       item.status === 'draft' ? 'Draft' : 'Review'}
                    </span>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditContent(item); }}>
                        <Pencil className="w-3.5 h-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Eye className="w-3.5 h-3.5 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                </motion.div>
              ))}

              {/* Add New */}
              <div 
                className="py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 -mx-3 px-3 rounded-xl transition-colors"
                onClick={handleCreateNew}
              >
                <div className="w-10 h-10 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground">Add content</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-72 ml-12 shrink-0">
        {/* Create Button */}
        <Button 
          onClick={handleCreateNew}
          className="w-full h-12 rounded-2xl bg-foreground hover:bg-foreground/90 text-background font-medium text-[15px] shadow-lg mb-8"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create with AI
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-muted/40">
            <p className="text-2xl font-semibold text-foreground">{avgScore}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg. Score</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/40">
            <p className="text-2xl font-semibold text-foreground">{publishedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Published</p>
          </div>
        </div>

        {/* Team Activity */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Recent Activity
          </h3>
          <div className="space-y-1">
            {teamActivity.map((member, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 py-3 px-3 -mx-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  {member.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{member.action}</p>
                  <p className="text-xs text-muted-foreground">{member.name} · {member.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
