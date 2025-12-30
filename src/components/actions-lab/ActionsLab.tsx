import { useRef } from 'react';
import { ContentGenerationWorkflow } from './ContentGenerationWorkflow';
import { UnifiedAuthorityLab } from '@/components/authority-lab';
import { recommendations } from './data';
import { TabType } from './types';

interface ActionsLabProps {
  demoMode?: boolean;
  activeTab?: TabType;
  preselectedProductId?: string | null;
  onProductUsed?: () => void;
  onBackToProductLab?: () => void;
}

export const ActionsLab = ({ demoMode = false, activeTab = 'on-site', preselectedProductId, onProductUsed, onBackToProductLab }: ActionsLabProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const completedCount = 0;
  const totalCount = recommendations.length;

  return (
    <div className={`flex flex-col ${demoMode ? 'demo-card-1' : ''}`}>
      {/* Content Area */}
      <div className="flex gap-6">
        {/* Glassmorphism Sidebar - Only show for on-site */}
        {activeTab === 'on-site' && (
          <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-6 self-start">
            <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
              {/* Progress */}
              <div className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-medium text-foreground tracking-tight">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {completedCount} of {totalCount} complete
                  </div>
                  <div className="w-full h-1 rounded-full bg-muted mt-3 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div ref={contentRef} className="flex-1 min-w-0">
          {/* On-site: Content Generation */}
          {activeTab === 'on-site' && (
            <>
              <div className="hidden lg:block mb-6">
                <h2 className="text-xl font-medium text-foreground tracking-tight">
                  On-Site Optimization
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate AI-optimized content from your Prompt Blast Lab insights
                </p>
              </div>
              <ContentGenerationWorkflow demoMode={demoMode} preselectedProductId={preselectedProductId} onProductUsed={onProductUsed} onBack={onBackToProductLab} />
            </>
          )}

          {/* Authority Lab: Full height */}
          {activeTab === 'authority' && (
            <div className="h-[calc(100vh-7rem)] -mx-6 -mt-2 -mb-6">
              <UnifiedAuthorityLab />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};