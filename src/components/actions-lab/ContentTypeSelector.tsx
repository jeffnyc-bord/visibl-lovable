import { useState } from 'react';
import { FileText, Star, HelpCircle, Briefcase, GitCompare, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContentType = 'blog' | 'review' | 'faq' | 'case-study' | 'comparison';

interface ContentTypeOption {
  id: ContentType;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const contentTypes: ContentTypeOption[] = [
  { 
    id: 'blog', 
    label: 'Blog Post', 
    description: 'Long-form article for thought leadership',
    icon: FileText 
  },
  { 
    id: 'review', 
    label: 'Review Page', 
    description: 'Product review with star ratings',
    icon: Star,
    badge: 'Schema' 
  },
  { 
    id: 'faq', 
    label: 'FAQ', 
    description: 'Question & answer format',
    icon: HelpCircle,
    badge: 'Schema' 
  },
  { 
    id: 'case-study', 
    label: 'Case Study', 
    description: 'Customer success story with metrics',
    icon: Briefcase 
  },
  { 
    id: 'comparison', 
    label: 'Comparison Guide', 
    description: 'Side-by-side product comparison',
    icon: GitCompare 
  },
];

interface ContentTypeSelectorProps {
  selectedType: ContentType | null;
  onSelectType: (type: ContentType) => void;
  disabled?: boolean;
}

export const ContentTypeSelector = ({
  selectedType,
  onSelectType,
  disabled = false,
}: ContentTypeSelectorProps) => {
  return (
    <section className={cn("relative", disabled && "opacity-50 pointer-events-none")}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5 mt-6">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
          2
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Generate
          </h3>
          <p className="text-sm text-foreground font-medium">Choose content format</p>
        </div>
      </div>

      {/* Segmented Control Grid */}
      <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-muted/30 border border-border/40">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-lg transition-all duration-300",
                isSelected 
                  ? "bg-background shadow-sm border border-border/60" 
                  : "hover:bg-background/50"
              )}
            >
              {/* Badge */}
              {type.badge && (
                <span className={cn(
                  "absolute top-2 right-2 text-[9px] font-medium px-1.5 py-0.5 rounded-full transition-colors",
                  isSelected 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground/60"
                )}>
                  {type.badge}
                </span>
              )}

              {/* Icon */}
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                isSelected 
                  ? "bg-primary/10" 
                  : "bg-transparent group-hover:bg-muted/50"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isSelected 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-foreground"
                )} />
              </div>

              {/* Label */}
              <span className={cn(
                "text-xs font-medium transition-colors duration-200 text-center",
                isSelected 
                  ? "text-foreground" 
                  : "text-muted-foreground group-hover:text-foreground"
              )}>
                {type.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Type Description */}
      {selectedType && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-300">
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{contentTypes.find(t => t.id === selectedType)?.description}</span>
        </div>
      )}

      {/* Divider */}
      <div className="mt-6 border-t border-border/40" />
    </section>
  );
};
