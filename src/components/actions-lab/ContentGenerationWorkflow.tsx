import { useState } from 'react';
import { ProductSourceSelector, ProductSource } from './ProductSourceSelector';
import { PromptSourceSelector, PromptSource } from './PromptSourceSelector';
import { ContentTypeSelector, ContentType } from './ContentTypeSelector';
import { OptimizedStructurePanel, OptimizedStructure } from './OptimizedStructurePanel';
import { SerpPreviewPanel } from './SerpPreviewPanel';
import { ContextNotesPanel } from './ContextNotesPanel';
import { WorkflowModeSelector, WorkflowMode } from './WorkflowModeSelector';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ContextNote {
  id: string;
  type: 'feature' | 'differentiator' | 'tone' | 'avoid' | 'custom';
  content: string;
}
const mockProducts: ProductSource[] = [
  {
    id: '1',
    name: 'Nike Air Max 90',
    category: 'Running Shoes',
    visibilityScore: 78,
    mentions: 203,
  },
  {
    id: '2',
    name: 'Nike Pegasus 41',
    category: 'Performance Running',
    visibilityScore: 65,
    mentions: 145,
  },
  {
    id: '3',
    name: 'Nike Dunk Low',
    category: 'Lifestyle',
    visibilityScore: 82,
    mentions: 312,
  },
  {
    id: '4',
    name: 'Nike Air Force 1',
    category: 'Lifestyle',
    visibilityScore: 91,
    mentions: 456,
  },
];

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
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductSource | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptSource | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [schemaEnabled, setSchemaEnabled] = useState(false);
  const [productNotes, setProductNotes] = useState('');
  const [sessionContext, setSessionContext] = useState<ContextNote[]>([]);

  const handleSelectMode = (mode: WorkflowMode) => {
    setWorkflowMode(mode);
    // Reset all downstream selections when mode changes
    setSelectedProduct(null);
    setSelectedPrompt(null);
    setSelectedContentType(null);
  };

  const handleSelectProduct = (product: ProductSource) => {
    setSelectedProduct(product);
    // Only reset downstream if in product-first mode
    if (workflowMode === 'product') {
      setSelectedPrompt(null);
      setSelectedContentType(null);
    }
  };

  const handleSelectPrompt = (prompt: PromptSource) => {
    setSelectedPrompt(prompt);
    // Only reset downstream if in prompt-first mode
    if (workflowMode === 'prompt') {
      setSelectedProduct(null);
      setSelectedContentType(null);
    }
  };

  const handleSelectContentType = (type: ContentType) => {
    setSelectedContentType(type);
    setSchemaEnabled(type === 'faq');
  };

  const handleStructureChange = (structure: OptimizedStructure) => {
    setSeoTitle(structure.seoTitle);
    setUrlSlug(structure.urlSlug);
    setMetaDescription(structure.metaDescription);
    setSchemaEnabled(structure.schemaEnabled);
  };

  const handleGenerate = () => {
    toast({
      title: "Generating Content",
      description: `Creating ${selectedContentType} content for "${selectedProduct?.name}" from "${selectedPrompt?.prompt.slice(0, 30)}..."`,
    });
  };


  // Check if we've completed all required steps
  const isReadyForStructure = selectedProduct && selectedPrompt && selectedContentType;

  return (
    <div className={cn("flex gap-8", demoMode && "demo-card-1")}>
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Step 0: Workflow Mode */}
        <WorkflowModeSelector
          selectedMode={workflowMode}
          onSelectMode={handleSelectMode}
        />

        {/* Product-first flow */}
        {workflowMode === 'product' && (
          <>
            {/* Step 1: Product Source */}
            <ProductSourceSelector
              products={mockProducts}
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
              stepNumber={1}
            />

            {/* Step 2: Prompt Source */}
            <PromptSourceSelector
              prompts={mockPrompts}
              selectedPrompt={selectedPrompt}
              onSelectPrompt={handleSelectPrompt}
              disabled={!selectedProduct}
              stepNumber={2}
            />
          </>
        )}

        {/* Prompt-first flow */}
        {workflowMode === 'prompt' && (
          <>
            {/* Step 1: Prompt Source */}
            <PromptSourceSelector
              prompts={mockPrompts}
              selectedPrompt={selectedPrompt}
              onSelectPrompt={handleSelectPrompt}
              disabled={false}
              stepNumber={1}
            />

            {/* Step 2: Product Source */}
            <ProductSourceSelector
              products={mockProducts}
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
              stepNumber={2}
              disabled={!selectedPrompt}
            />
          </>
        )}

        {/* Step 3: Content Type (shown after both product and prompt are selected) */}
        {workflowMode && (
          <ContentTypeSelector
            selectedType={selectedContentType}
            onSelectType={handleSelectContentType}
            disabled={!selectedPrompt || !selectedProduct}
            stepNumber={3}
          />
        )}

        {/* Step 4: Context & Notes (Optional) */}
        {selectedContentType && (
          <ContextNotesPanel
            product={selectedProduct}
            productNotes={productNotes}
            onProductNotesChange={setProductNotes}
            sessionContext={sessionContext}
            onSessionContextChange={setSessionContext}
            disabled={!selectedContentType}
            stepNumber={4}
          />
        )}

        {/* Step 5: Optimized Structure */}
        {isReadyForStructure && (
          <OptimizedStructurePanel
            contentType={selectedContentType}
            prompt={selectedPrompt}
            onStructureChange={handleStructureChange}
            onGenerate={handleGenerate}
          />
        )}

        {/* Empty State */}
        {!workflowMode && (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Choose how to start
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Select whether you want to start with a product from your catalog or a prompt from Prompt Blast Lab.
            </p>
          </div>
        )}
      </div>

      {/* SERP Preview Sidebar */}
      {isReadyForStructure && (
        <SerpPreviewPanel
          title={seoTitle}
          urlSlug={urlSlug}
          description={metaDescription}
          contentType={selectedContentType}
          schemaEnabled={schemaEnabled}
          ratingEnabled={false}
        />
      )}
    </div>
  );
};
