import { Package, MessageSquareText } from 'lucide-react';
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
      description: 'Select a prompt from Prompt Blast Lab, then match products',
      icon: MessageSquareText,
    },
  ];

  return (
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3 py-3 mb-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
          0
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Choose Your Starting Point
        </span>
      </div>

      {/* Mode Options */}
      <div className="grid grid-cols-2 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={cn(
                "group relative flex flex-col items-start gap-3 p-5 rounded-xl border transition-all duration-200 text-left",
                isSelected
                  ? "border-foreground bg-foreground/5"
                  : "border-border/50 hover:border-border hover:bg-muted/30"
              )}
            >
              {/* Icon */}
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                isSelected ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              )}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div>
                <h3 className={cn(
                  "text-sm font-medium mb-1",
                  isSelected ? "text-foreground" : "text-foreground/80"
                )}>
                  {mode.label}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
