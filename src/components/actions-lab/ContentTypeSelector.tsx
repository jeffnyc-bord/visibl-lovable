import { FileText, Star, HelpCircle, Briefcase, GitCompare, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContentType = 'blog' | 'review' | 'faq' | 'case-study' | 'comparison';

interface ContentTypeOption {
  id: ContentType;
  label: string;
  icon: React.ElementType;
}

const contentTypes: ContentTypeOption[] = [
  { id: 'blog', label: 'Blog Post', icon: FileText },
  { id: 'review', label: 'Review', icon: Star },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'case-study', label: 'Case Study', icon: Briefcase },
  { id: 'comparison', label: 'Comparison', icon: GitCompare },
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
    <section className={cn("relative py-4", disabled && "opacity-40 pointer-events-none")}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold">
          2
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Content Format
        </span>
      </div>

      {/* Inline Pill Selector */}
      <div className="flex flex-wrap gap-2">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-200 border",
                isSelected 
                  ? "bg-foreground text-background border-foreground font-medium" 
                  : "bg-transparent text-muted-foreground border-border/60 hover:border-foreground/30 hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{type.label}</span>
              {isSelected && <Check className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Thin Divider */}
      <div className="mt-5 border-t border-border/30" />
    </section>
  );
};
