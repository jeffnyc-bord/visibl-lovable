import { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  ExternalLink,
  TrendingUp,
  Users,
  Globe,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for sources with estimated traffic
const mockSources = [
  { id: 1, name: 'TechCrunch', favicon: '🔵', priority: 94, category: 'Tech News', llmCitations: 847, estimatedTraffic: '12.4M' },
  { id: 2, name: 'Forbes', favicon: '📰', priority: 91, category: 'Business', llmCitations: 723, estimatedTraffic: '89.2M' },
  { id: 3, name: 'Wired', favicon: '🔴', priority: 88, category: 'Tech Culture', llmCitations: 612, estimatedTraffic: '8.7M' },
  { id: 4, name: 'The Verge', favicon: '🟣', priority: 85, category: 'Tech News', llmCitations: 589, estimatedTraffic: '24.1M' },
  { id: 5, name: 'Reddit r/technology', favicon: '🟠', priority: 82, category: 'Community', llmCitations: 534, estimatedTraffic: '1.2B' },
  { id: 6, name: 'Hacker News', favicon: '🟧', priority: 79, category: 'Developer', llmCitations: 478, estimatedTraffic: '5.8M' },
  { id: 7, name: 'VentureBeat', favicon: '🔷', priority: 76, category: 'AI/ML', llmCitations: 423, estimatedTraffic: '4.2M' },
  { id: 8, name: 'Ars Technica', favicon: '⬛', priority: 74, category: 'Deep Tech', llmCitations: 398, estimatedTraffic: '6.1M' },
  { id: 9, name: 'Product Hunt', favicon: '🐱', priority: 71, category: 'Launches', llmCitations: 356, estimatedTraffic: '3.4M' },
  { id: 10, name: 'LinkedIn Pulse', favicon: '🔵', priority: 68, category: 'Professional', llmCitations: 312, estimatedTraffic: '310M' },
];

export function UnifiedAuthorityLab() {
  const [selectedSource, setSelectedSource] = useState<typeof mockSources[0] | null>(mockSources[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatus] = useState<'synced' | 'syncing'>('synced');

  const filteredSources = mockSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header Bar */}
      <header className="h-10 flex items-center justify-between px-4 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">Authority Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium",
            syncStatus === 'synced' 
              ? "bg-success/10 text-success" 
              : "bg-warning/10 text-warning"
          )}>
            <RefreshCw className={cn("w-2.5 h-2.5", syncStatus === 'syncing' && "animate-spin")} />
            {syncStatus === 'synced' ? 'Data Synced' : 'Syncing...'}
          </div>
          <span className="text-[10px] text-muted-foreground">Last: 2m ago</span>
        </div>
      </header>

      {/* Two Panel Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel: Sources List */}
        <div className="w-80 border-r border-border/50 flex flex-col bg-secondary/20">
          {/* Search Header */}
          <div className="p-3 border-b border-border/30">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-background/80 border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/60"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{filteredSources.length} sources tracked</p>
          </div>

          {/* Sources List */}
          <div className="flex-1 overflow-y-auto">
            {filteredSources.map((source) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/20",
                  selectedSource?.id === source.id 
                    ? "bg-foreground/5 border-l-2 border-l-primary" 
                    : "hover:bg-foreground/[0.02]"
                )}
              >
                {/* Favicon */}
                <span className="text-lg flex-shrink-0">{source.favicon}</span>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-xs truncate",
                    selectedSource?.id === source.id ? "font-medium text-foreground" : "text-foreground/80"
                  )}>
                    {source.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{source.category}</div>
                </div>
                
                {/* Priority Score */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-mono font-medium text-foreground">{source.priority}</div>
                  <div className="text-[9px] text-muted-foreground">priority</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Source Details */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedSource ? (
            <div className="w-full space-y-6 animate-fade-in">
              {/* Source Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSource.favicon}</span>
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">{selectedSource.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-secondary rounded-full text-muted-foreground">
                        {selectedSource.category}
                      </span>
                      <span className="text-xs text-muted-foreground">Priority: {selectedSource.priority}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-secondary/30 border border-border/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Est. Traffic
                    </span>
                  </div>
                  <div className="text-xl font-semibold text-foreground">{selectedSource.estimatedTraffic}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Monthly visitors</div>
                </div>

                <div className="p-4 bg-secondary/30 border border-border/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      LLM Citations
                    </span>
                  </div>
                  <div className="text-xl font-semibold text-foreground">{selectedSource.llmCitations.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Past 90 days</div>
                </div>

                <div className="p-4 bg-secondary/30 border border-border/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Reach Score
                    </span>
                  </div>
                  <div className="text-xl font-semibold text-foreground">8.7/10</div>
                  <div className="text-[10px] text-muted-foreground mt-1">High authority</div>
                </div>
              </div>

              {/* Why This Matters */}
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Why This Matters
                </h2>
                <div className="p-4 bg-secondary/30 border border-border/30 rounded-xl">
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {selectedSource.name} is a high-authority source with <strong>{selectedSource.llmCitations.toLocaleString()} LLM citations</strong> in the past 90 days and an estimated <strong>{selectedSource.estimatedTraffic} monthly visitors</strong>. Content published here has a <strong>3.2x higher chance</strong> of being referenced in AI-generated responses compared to average sources.
                  </p>
                </div>
              </section>

              {/* Contact / Action Area */}
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Take Action
                </h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
                    <Users className="w-4 h-4" />
                    Find Contacts
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border/50 text-foreground text-xs font-medium rounded-lg hover:bg-secondary/80 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Visit Source
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Select a source to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
