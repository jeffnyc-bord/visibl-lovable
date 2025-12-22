import { Package, MessageSquareText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WorkflowMode = 'product' | 'prompt';

interface WorkflowModeSelectorProps {
  selectedMode: WorkflowMode | null;
  onSelectMode: (mode: WorkflowMode) => void;
}

export const WorkflowModeSelector = ({
  selectedMode,
  onSelectMode,
}: WorkflowModeSelectorProps) => {
  const modes = [
    {
      id: 'product' as WorkflowMode,
      label: 'Start with Product',
      description: 'Choose a product first, then find relevant prompts',
      icon: Package,
    },
    {
      id: 'prompt' as WorkflowMode,
      label: 'Start with Prompt',
      description: 'Select from Prompt Blast Lab, then match products',
      icon: MessageSquareText,
    },
  ];

  return (
    <section className="animate-fade-in pb-6 border-b border-border/30">
      {/* Section Header */}
      <div className="flex items-center gap-3 py-3 mb-3">
        <div className={cn(
          "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold transition-colors",
          selectedMode 
            ? "bg-foreground text-background" 
            : "bg-muted text-muted-foreground"
        )}>
          {selectedMode ? <Check className="w-3 h-3" /> : '0'}
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Starting Point
        </span>
      </div>

      {/* Mode Options - Clean inline style */}
      <div className="flex gap-6 ml-8">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className="group flex items-center gap-3 text-left transition-colors"
            >
              {/* Radio indicator */}
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center",
                isSelected 
                  ? "border-foreground" 
                  : "border-muted-foreground/40 group-hover:border-muted-foreground"
              )}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-foreground" />
                )}
              </div>

              {/* Icon + Label */}
              <div className="flex items-center gap-2">
                <Icon className={cn(
                  "w-4 h-4 transition-colors",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )} />
                <div>
                  <span className={cn(
                    "text-sm transition-colors",
                    isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {mode.label}
                  </span>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5 hidden sm:block">
                    {mode.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
