import { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  Send, 
  Users, 
  FileText, 
  MessageCircle,
  ExternalLink,
  TrendingUp,
  Check,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// Mock data for sources
const mockSources = [
  { id: 1, name: 'TechCrunch', favicon: '🔵', priority: 94, category: 'Tech News', llmCitations: 847 },
  { id: 2, name: 'Forbes', favicon: '📰', priority: 91, category: 'Business', llmCitations: 723 },
  { id: 3, name: 'Wired', favicon: '🔴', priority: 88, category: 'Tech Culture', llmCitations: 612 },
  { id: 4, name: 'The Verge', favicon: '🟣', priority: 85, category: 'Tech News', llmCitations: 589 },
  { id: 5, name: 'Reddit r/technology', favicon: '🟠', priority: 82, category: 'Community', llmCitations: 534 },
  { id: 6, name: 'Hacker News', favicon: '🟧', priority: 79, category: 'Developer', llmCitations: 478 },
  { id: 7, name: 'VentureBeat', favicon: '🔷', priority: 76, category: 'AI/ML', llmCitations: 423 },
  { id: 8, name: 'Ars Technica', favicon: '⬛', priority: 74, category: 'Deep Tech', llmCitations: 398 },
  { id: 9, name: 'Product Hunt', favicon: '🐱', priority: 71, category: 'Launches', llmCitations: 356 },
  { id: 10, name: 'LinkedIn Pulse', favicon: '🔵', priority: 68, category: 'Professional', llmCitations: 312 },
];

// Mock timeline events
const mockTimelineEvents = [
  { id: 1, type: 'pitch', label: 'TechCrunch Pitch', date: 'Dec 15', completed: true },
  { id: 2, type: 'social', label: 'Reddit AMA', date: 'Dec 18', completed: true },
  { id: 3, type: 'mention', label: 'Forbes Feature', date: 'Dec 20', completed: false },
  { id: 4, type: 'pitch', label: 'Wired Outreach', date: 'Dec 22', completed: false },
  { id: 5, type: 'social', label: 'HN Launch', date: 'Dec 28', completed: false },
];

type PlaybookMode = 'pr' | 'social';

export function UnifiedAuthorityLab() {
  const [selectedSource, setSelectedSource] = useState<typeof mockSources[0] | null>(mockSources[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playbookMode, setPlaybookMode] = useState<PlaybookMode>('pr');
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [syncStatus] = useState<'synced' | 'syncing'>('synced');

  const filteredSources = mockSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Translucent Header Bar */}
      <header className="h-10 flex items-center justify-between px-4 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">Authority Lab</span>
          <span className="text-[10px] text-muted-foreground">Unified Strategy</span>
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

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Sources */}
        <aside className="w-64 border-r border-border/50 bg-secondary/30 backdrop-blur-sm flex flex-col">
          {/* Search */}
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
          </div>

          {/* Sources List */}
          <div className="flex-1 overflow-y-auto">
            {filteredSources.map((source, index) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                  selectedSource?.id === source.id 
                    ? "bg-foreground/5" 
                    : "hover:bg-foreground/[0.02]",
                  index !== 0 && "border-t border-border/20"
                )}
                style={{ borderWidth: '0.5px' }}
              >
                {/* Favicon */}
                <span className="text-sm flex-shrink-0">{source.favicon}</span>
                
                {/* Name & Score */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={cn(
                      "text-xs truncate",
                      selectedSource?.id === source.id ? "font-medium text-foreground" : "text-foreground/80"
                    )}>
                      {source.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">
                      {source.priority}
                    </span>
                  </div>
                  {/* Thin Progress Bar */}
                  <div className="h-[3px] w-full bg-border/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-foreground/60 rounded-full transition-all duration-500"
                      style={{ width: `${source.priority}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Source Stats Footer */}
          <div className="p-3 border-t border-border/30 bg-background/50">
            <div className="text-[10px] text-muted-foreground">
              <span className="font-medium text-foreground">{mockSources.length}</span> sources tracked
            </div>
          </div>
        </aside>

        {/* Center Stage - Intelligence */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {selectedSource ? (
            <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
              {/* Source Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedSource.favicon}</span>
                  <h1 className="text-xl font-semibold text-foreground">{selectedSource.name}</h1>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-secondary rounded-full text-muted-foreground">
                    {selectedSource.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Priority Score: {selectedSource.priority}/100</p>
              </div>

              {/* Why This Matters */}
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Why This Matters
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {selectedSource.name} is a high-authority source with <strong>{selectedSource.llmCitations.toLocaleString()} LLM citations</strong> in the past 90 days. 
                  Content published here has a <strong>3.2x higher chance</strong> of being referenced in AI-generated responses compared to average sources.
                </p>
              </section>

              {/* Citation Analysis */}
              <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Citation Analysis
                </h2>
                
                {/* LLM Training Data Snippets */}
                <div className="space-y-3">
                  <div className="p-4 bg-secondary/50 border border-border/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        GPT-4 Training Reference
                      </span>
                    </div>
                    <code className="block text-xs font-mono text-foreground/70 leading-relaxed">
                      "According to {selectedSource.name}, the latest developments in AI visibility show that brands appearing in training data see 47% higher recall rates..."
                    </code>
                  </div>
                  
                  <div className="p-4 bg-secondary/50 border border-border/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Claude Citation Pattern
                      </span>
                    </div>
                    <code className="block text-xs font-mono text-foreground/70 leading-relaxed">
                      "{selectedSource.name} reports that enterprise software adoption has increased by 23% in Q4, driven primarily by AI-integrated solutions..."
                    </code>
                  </div>
                </div>

                {/* Citation Stats */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {[
                    { label: 'Total Citations', value: selectedSource.llmCitations.toLocaleString(), icon: FileText },
                    { label: 'Avg. Position', value: '#2.4', icon: TrendingUp },
                    { label: 'Reach Score', value: '8.7/10', icon: Users },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <stat.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-semibold text-foreground">{stat.value}</div>
                      <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Select a source to view intelligence
            </div>
          )}
        </main>

        {/* Right Panel - Playbook */}
        <aside className="w-72 border-l border-border/50 bg-secondary/30 backdrop-blur-sm flex flex-col">
          {/* Playbook Header */}
          <div className="p-4 border-b border-border/30">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Playbook
            </h2>
            
            {/* Segmented Control */}
            <div className="flex p-0.5 bg-background/80 border border-border/50 rounded-lg">
              {(['pr', 'social'] as PlaybookMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPlaybookMode(mode)}
                  className={cn(
                    "flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200",
                    playbookMode === mode
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode === 'pr' ? 'PR Angle' : 'Social Strategy'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* Strategic Outreach - Primary Action */}
            <ActionButton
              icon={Send}
              label="Strategic Outreach"
              description={playbookMode === 'pr' 
                ? "Draft a pitch for editors" 
                : "Craft engagement post"
              }
              isPrimary
              expanded={expandedAction === 'outreach'}
              onClick={() => setExpandedAction(expandedAction === 'outreach' ? null : 'outreach')}
            />

            {playbookMode === 'pr' ? (
              <>
                <ActionButton
                  icon={FileText}
                  label="Press Release"
                  description="Generate newsworthy angle"
                  expanded={expandedAction === 'press'}
                  onClick={() => setExpandedAction(expandedAction === 'press' ? null : 'press')}
                />
                <ActionButton
                  icon={Users}
                  label="Expert Commentary"
                  description="Position as thought leader"
                  expanded={expandedAction === 'expert'}
                  onClick={() => setExpandedAction(expandedAction === 'expert' ? null : 'expert')}
                />
              </>
            ) : (
              <>
                <ActionButton
                  icon={MessageCircle}
                  label="Community Thread"
                  description="Start discussion on Reddit/HN"
                  expanded={expandedAction === 'thread'}
                  onClick={() => setExpandedAction(expandedAction === 'thread' ? null : 'thread')}
                />
                <ActionButton
                  icon={ExternalLink}
                  label="Cross-Post Strategy"
                  description="Syndicate across platforms"
                  expanded={expandedAction === 'crosspost'}
                  onClick={() => setExpandedAction(expandedAction === 'crosspost' ? null : 'crosspost')}
                />
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="p-3 border-t border-border/30 bg-background/50">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Actions completed</span>
              <span className="font-medium text-foreground">12/20</span>
            </div>
            <Progress value={60} className="h-1 mt-2" />
          </div>
        </aside>
      </div>

      {/* Bottom Timeline */}
      <div className="h-16 border-t border-border/50 bg-secondary/20 px-6 flex items-center">
        <div className="flex items-center gap-2 mr-6">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Influence Timeline
          </span>
        </div>
        
        {/* Timeline Track */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-1/2 left-0 right-0 h-[2px] bg-border/50 rounded-full" />
          <div className="relative flex justify-between items-center">
            {mockTimelineEvents.map((event, index) => (
              <div key={event.id} className="flex flex-col items-center gap-1 group">
                <div className={cn(
                  "w-3 h-3 rounded-full border-2 transition-all duration-300 cursor-pointer",
                  event.completed 
                    ? "bg-success border-success" 
                    : "bg-background border-border hover:border-foreground/50"
                )}>
                  {event.completed && <Check className="w-2 h-2 text-success-foreground" />}
                </div>
                <div className="absolute top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[9px] px-2 py-1 rounded whitespace-nowrap">
                  {event.label} · {event.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Event Button */}
        <button className="ml-6 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium bg-gradient-to-r from-foreground to-foreground/90 text-background rounded-full hover:opacity-90 transition-opacity">
          <Zap className="w-3 h-3" />
          Add Event
        </button>
      </div>
    </div>
  );
}

// Action Button Component with smooth expand
function ActionButton({ 
  icon: Icon, 
  label, 
  description, 
  isPrimary = false,
  expanded,
  onClick 
}: { 
  icon: React.ElementType;
  label: string;
  description: string;
  isPrimary?: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <div className="overflow-hidden">
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
          isPrimary 
            ? "bg-gradient-to-r from-foreground to-foreground/90 text-background hover:opacity-95" 
            : "bg-background/80 border border-border/50 hover:border-border text-foreground"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isPrimary ? "bg-background/20" : "bg-secondary"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium">{label}</div>
          <div className={cn(
            "text-[10px]",
            isPrimary ? "text-background/70" : "text-muted-foreground"
          )}>
            {description}
          </div>
        </div>
      </button>
      
      {/* Expanded Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        expanded ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
      )}>
        <div className="p-3 bg-background/60 border border-border/30 rounded-lg space-y-2">
          <textarea 
            placeholder="Add your notes or customize the action..."
            className="w-full h-16 text-xs bg-transparent border-none resize-none focus:outline-none placeholder:text-muted-foreground/50"
          />
          <button className="w-full py-1.5 text-[10px] font-medium bg-foreground/10 hover:bg-foreground/20 rounded-md transition-colors">
            Execute Action
          </button>
        </div>
      </div>
    </div>
  );
}
