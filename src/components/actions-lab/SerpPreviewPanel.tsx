import { Globe, Star, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentType } from './ContentTypeSelector';

interface SerpPreviewPanelProps {
  title: string;
  urlSlug: string;
  description: string;
  contentType: ContentType | null;
  schemaEnabled: boolean;
  ratingEnabled: boolean;
}

export const SerpPreviewPanel = ({
  title,
  urlSlug,
  description,
  contentType,
  schemaEnabled,
  ratingEnabled,
}: SerpPreviewPanelProps) => {
  const truncatedTitle = title.slice(0, 60);
  const truncatedDescription = description.slice(0, 155);
  const domain = 'yourbrand.com';

  return (
    <aside className="w-80 flex-shrink-0 sticky top-6 self-start">
      <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              SERP Preview
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            How your page may appear in Google
          </p>
        </div>

        {/* SERP Result Preview */}
        <div className="p-4">
          <div className="p-4 rounded-lg bg-background border border-border/40">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <span className="text-[#202124]">{domain}</span>
              <ChevronRight className="w-3 h-3" />
              <span>blog</span>
              {urlSlug && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{urlSlug}</span>
                </>
              )}
            </div>

            {/* Title */}
            <a 
              href="#" 
              className="text-[#1a0dab] text-lg font-medium hover:underline line-clamp-2 leading-tight"
              onClick={(e) => e.preventDefault()}
            >
              {truncatedTitle || 'Your SEO Title Will Appear Here'}
            </a>

            {/* Rich Snippets */}
            {schemaEnabled && contentType === 'review' && ratingEnabled && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3 h-3",
                        star <= 4 ? "text-[#fbbc04] fill-[#fbbc04]" : "text-[#dadce0] fill-[#dadce0]"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">4.2 · 127 reviews</span>
              </div>
            )}

            {schemaEnabled && contentType === 'faq' && (
              <div className="mt-2 space-y-1">
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-muted-foreground font-medium">Q:</span>
                  <span className="text-muted-foreground">What are the key differences?</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-muted-foreground font-medium">Q:</span>
                  <span className="text-muted-foreground">Which option is best?</span>
                </div>
              </div>
            )}

            {/* Meta Description */}
            <p className="text-[#4d5156] text-sm mt-2 line-clamp-2">
              {truncatedDescription || 'Your meta description will appear here. Make it compelling and include your primary keyword.'}
            </p>

            {/* Date */}
            <span className="text-xs text-muted-foreground mt-2 block">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* SEO Score */}
        <div className="p-4 border-t border-border/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">SEO Score</span>
            <span className={cn(
              "text-sm font-semibold",
              title.length >= 50 && title.length <= 60 ? "text-success" : "text-warning"
            )}>
              {title.length >= 50 && title.length <= 60 ? 'Excellent' : 'Good'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                title.length > 0 ? "bg-success" : "bg-muted"
              )} />
              <span className="text-xs text-muted-foreground">Title tag present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                urlSlug.length > 0 ? "bg-success" : "bg-muted"
              )} />
              <span className="text-xs text-muted-foreground">SEO-friendly URL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                schemaEnabled ? "bg-success" : "bg-muted"
              )} />
              <span className="text-xs text-muted-foreground">Schema markup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                title.length >= 50 && title.length <= 60 ? "bg-success" : "bg-warning"
              )} />
              <span className="text-xs text-muted-foreground">Optimal title length</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 border-t border-border/40 bg-muted/20">
          <p className="text-[11px] text-muted-foreground">
            <span className="font-medium">Pro tip:</span> Include your primary keyword in the first 60 characters of your title for better AI visibility.
          </p>
        </div>
      </div>
    </aside>
  );
};
