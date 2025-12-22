import { useState } from 'react';
import { PromptSourceSelector, PromptSource } from './PromptSourceSelector';
import { ContentTypeSelector, ContentType } from './ContentTypeSelector';
import { OptimizedStructurePanel } from './OptimizedStructurePanel';
import { SerpPreviewPanel } from './SerpPreviewPanel';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock prompt data from Prompt Blast Lab
const mockPrompts: PromptSource[] = [
  {
    id: '1',
    prompt: 'Nike Air Max vs Adidas Ultraboost',
    fullPrompt: "What's the difference between Nike Air Max and Adidas Ultraboost? Which one is better for daily wear and athletic performance?",
    mentions: 203,
    sentiment: 'positive',
    platforms: ['ChatGPT', 'Gemini', 'Perplexity', 'Grok'],
    lastTested: '2024-01-14',
  },
  {
    id: '2',
    prompt: 'Best running shoes for marathon training',
    fullPrompt: "What are the best running shoes for marathon training? I'm looking for shoes that provide excellent cushioning, durability, and support.",
    mentions: 145,
    sentiment: 'positive',
    platforms: ['ChatGPT', 'Gemini', 'Perplexity'],
    lastTested: '2024-01-20',
  },
  {
    id: '3',
    prompt: 'Most comfortable athletic shoes for daily wear',
    fullPrompt: "What are the most comfortable athletic shoes for daily wear? I need something that provides all-day comfort.",
    mentions: 67,
    sentiment: 'neutral',
    platforms: ['ChatGPT', 'Gemini', 'Grok', 'Perplexity'],
    lastTested: '2024-01-13',
  },
  {
    id: '4',
    prompt: 'Best basketball shoes for performance',
    fullPrompt: "What are the best basketball shoes for performance? I need shoes that provide excellent grip, ankle support, and cushioning.",
    mentions: 89,
    sentiment: 'positive',
    platforms: ['ChatGPT', 'Grok', 'Perplexity'],
    lastTested: '2024-01-12',
  },
];

interface ContentGenerationWorkflowProps {
  demoMode?: boolean;
}

export const ContentGenerationWorkflow = ({ demoMode = false }: ContentGenerationWorkflowProps) => {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptSource | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [schemaEnabled, setSchemaEnabled] = useState(false);
  const [ratingEnabled, setRatingEnabled] = useState(false);

  const handleSelectPrompt = (prompt: PromptSource) => {
    setSelectedPrompt(prompt);
    // Reset downstream selections
    setSelectedContentType(null);
  };

  const handleSelectContentType = (type: ContentType) => {
    setSelectedContentType(type);
    setSchemaEnabled(type === 'faq' || type === 'review');
    setRatingEnabled(type === 'review');
  };

  const handleStructureChange = (structure: any) => {
    setSeoTitle(structure.seoTitle);
    setUrlSlug(structure.urlSlug);
    setSchemaEnabled(structure.schemaEnabled);
    setRatingEnabled(structure.ratingEnabled);
  };

  const handleGenerate = () => {
    toast({
      title: "Generating Content",
      description: `Creating ${selectedContentType} content from "${selectedPrompt?.prompt.slice(0, 40)}..."`,
    });
  };

  const description = selectedPrompt 
    ? `Comprehensive guide covering ${selectedPrompt.prompt}. Expert analysis and recommendations based on extensive research and testing.`
    : '';

  return (
    <div className={cn("flex gap-8", demoMode && "demo-card-1")}>
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Step 1: Prompt Source */}
        <PromptSourceSelector
          prompts={mockPrompts}
          selectedPrompt={selectedPrompt}
          onSelectPrompt={handleSelectPrompt}
        />

        {/* Step 2: Content Type */}
        <ContentTypeSelector
          selectedType={selectedContentType}
          onSelectType={handleSelectContentType}
          disabled={!selectedPrompt}
        />

        {/* Step 3: Optimized Structure */}
        {selectedPrompt && selectedContentType && (
          <OptimizedStructurePanel
            contentType={selectedContentType}
            prompt={selectedPrompt}
            onStructureChange={handleStructureChange}
            onGenerate={handleGenerate}
          />
        )}

        {/* Empty State */}
        {!selectedPrompt && (
          <div className="mt-12 text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Select a prompt to begin
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Choose a prompt from your Prompt Blast Lab results to generate optimized content tailored for AI search engines.
            </p>
          </div>
        )}
      </div>

      {/* SERP Preview Sidebar */}
      {selectedPrompt && selectedContentType && (
        <SerpPreviewPanel
          title={seoTitle}
          urlSlug={urlSlug}
          description={description}
          contentType={selectedContentType}
          schemaEnabled={schemaEnabled}
          ratingEnabled={ratingEnabled}
        />
      )}
    </div>
  );
};
