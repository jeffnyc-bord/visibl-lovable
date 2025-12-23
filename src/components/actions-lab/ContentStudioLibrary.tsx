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
  CheckCircle2,
  Clock,
  Globe,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  status: 'draft' | 'published' | 'scheduled';
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
    status: 'scheduled',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
    productName: 'Air Force 1',
    aeoScore: 85
  }
];

const typeLabels: Record<ContentItem['type'], string> = {
  'landing-page': 'Landing Page',
  'blog-post': 'Blog Post',
  'faq': 'FAQ',
  'product-description': 'Product Description'
};

const statusConfig: Record<ContentItem['status'], { label: string; color: string; icon: React.ReactNode }> = {
  'draft': { label: 'Draft', color: 'bg-muted text-muted-foreground', icon: <Clock className="w-3 h-3" /> },
  'published': { label: 'Published', color: 'bg-emerald-500/10 text-emerald-600', icon: <CheckCircle2 className="w-3 h-3" /> },
  'scheduled': { label: 'Scheduled', color: 'bg-blue-500/10 text-blue-600', icon: <Calendar className="w-3 h-3" /> }
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-foreground tracking-tight">AEO Content Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage AI-optimized content for better visibility
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Content
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Sort
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Content', value: contentItems.length, color: 'text-foreground' },
          { label: 'Published', value: contentItems.filter(i => i.status === 'published').length, color: 'text-emerald-600' },
          { label: 'Drafts', value: contentItems.filter(i => i.status === 'draft').length, color: 'text-muted-foreground' },
          { label: 'Avg. AEO Score', value: Math.round(contentItems.reduce((acc, i) => acc + (i.aeoScore || 0), 0) / contentItems.length), color: 'text-primary' }
        ].map((stat, index) => (
          <div key={index} className="p-4 rounded-xl border border-border/50 bg-background">
            <div className={`text-2xl font-light ${stat.color}`}>{stat.value}{index === 3 ? '%' : ''}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No content found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Start creating AI-optimized content'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateNew} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Content
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group p-4 rounded-xl border border-border/50 bg-background hover:border-border hover:shadow-sm transition-all cursor-pointer"
                onClick={() => handleEditContent(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        {typeLabels[item.type]}
                      </Badge>
                      <Badge className={`${statusConfig[item.status].color} text-xs font-normal gap-1`}>
                        {statusConfig[item.status].icon}
                        {statusConfig[item.status].label}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-foreground truncate mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {item.productName && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {item.productName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-4">
                    {item.aeoScore && (
                      <div className="text-right">
                        <div className="text-lg font-light text-foreground">{item.aeoScore}%</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">AEO Score</div>
                      </div>
                    )}
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
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
