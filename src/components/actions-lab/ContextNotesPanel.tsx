import { useState } from 'react';
import { FileText, ChevronDown, Plus, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductSource } from './ProductSourceSelector';

interface ContextNote {
  id: string;
  type: 'feature' | 'differentiator' | 'tone' | 'avoid' | 'custom';
  content: string;
}

interface ContextNotesPanelProps {
  product: ProductSource | null;
  productNotes: string;
  onProductNotesChange: (notes: string) => void;
  sessionContext: ContextNote[];
  onSessionContextChange: (context: ContextNote[]) => void;
  disabled?: boolean;
  stepNumber?: number;
}

const contextTypes: { id: ContextNote['type']; label: string; placeholder: string }[] = [
  { id: 'feature', label: 'Key Features', placeholder: 'e.g., Carbon fiber plate technology, 4% energy return...' },
  { id: 'differentiator', label: 'Unique Selling Points', placeholder: 'e.g., Only shoe endorsed by Olympic champions...' },
  { id: 'tone', label: 'Tone & Style', placeholder: 'e.g., Professional but approachable, avoid jargon...' },
  { id: 'avoid', label: 'Things to Avoid', placeholder: 'e.g., Don\'t mention competitor X, avoid price comparisons...' },
  { id: 'custom', label: 'Additional Notes', placeholder: 'Any other context or information...' },
];

export const ContextNotesPanel = ({
  product,
  productNotes,
  onProductNotesChange,
  sessionContext,
  onSessionContextChange,
  disabled = false,
  stepNumber = 4,
}: ContextNotesPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeType, setActiveType] = useState<ContextNote['type'] | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (!activeType || !newNoteContent.trim()) return;
    
    const newNote: ContextNote = {
      id: `note-${Date.now()}`,
      type: activeType,
      content: newNoteContent.trim(),
    };
    
    onSessionContextChange([...sessionContext, newNote]);
    setNewNoteContent('');
    setActiveType(null);
  };

  const handleRemoveNote = (id: string) => {
    onSessionContextChange(sessionContext.filter(n => n.id !== id));
  };

  const getTypeLabel = (type: ContextNote['type']) => {
    return contextTypes.find(t => t.id === type)?.label || type;
  };

  const hasContent = productNotes || sessionContext.length > 0;

  return (
    <section className={cn(
      "relative py-4 border-t border-border/30 transition-all duration-300 ease-out animate-fade-in",
      disabled && "opacity-40 pointer-events-none"
    )}>
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold transition-colors",
            hasContent 
              ? "bg-foreground text-background" 
              : "bg-muted text-muted-foreground"
          )}>
            {stepNumber}
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Context & Notes
          </span>
          <span className="text-xs text-muted-foreground/60 normal-case tracking-normal">
            — Optional
          </span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-200",
          !isExpanded && "-rotate-90"
        )} />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {/* Product Notes */}
          {product && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Notes for <span className="text-foreground font-medium">{product.name}</span>
                </span>
              </div>
              <textarea
                value={productNotes}
                onChange={(e) => onProductNotesChange(e.target.value)}
                placeholder="Add internal notes about this product that should inform content generation... (e.g., recent updates, specific features to highlight, target audience)"
                className="w-full bg-muted/30 rounded-lg px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none transition-all duration-200"
                rows={3}
              />
            </div>
          )}

          {/* Session Context Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Session-specific context
              </span>
            </div>

            {/* Existing Notes */}
            {sessionContext.length > 0 && (
              <div className="space-y-2">
                {sessionContext.map((note) => (
                  <div 
                    key={note.id}
                    className="group flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/30"
                  >
                    <span className="text-[10px] font-medium uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
                      {getTypeLabel(note.type)}
                    </span>
                    <p className="flex-1 text-sm text-foreground/80 leading-relaxed">
                      {note.content}
                    </p>
                    <button
                      onClick={() => handleRemoveNote(note.id)}
                      className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-destructive/10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Note UI */}
            {activeType ? (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-primary">
                    {getTypeLabel(activeType)}
                  </span>
                  <button
                    onClick={() => setActiveType(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    (change)
                  </button>
                </div>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={contextTypes.find(t => t.id === activeType)?.placeholder}
                  className="w-full bg-muted/30 rounded-lg px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setActiveType(null);
                      setNewNoteContent('');
                    }}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={!newNoteContent.trim()}
                    className="px-3 py-1.5 text-xs bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {contextTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-dashed border-border/50 hover:border-border rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
