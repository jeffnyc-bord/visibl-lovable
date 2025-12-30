import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProductSourceSelector, ProductSource } from './ProductSourceSelector';
import { PromptSourceSelector, PromptSource } from './PromptSourceSelector';
import { ContentTypeSelector, ContentType } from './ContentTypeSelector';
import { OptimizedStructurePanel, OptimizedStructure } from './OptimizedStructurePanel';
import { SerpPreviewPanel } from './SerpPreviewPanel';
import { ContextNotesPanel } from './ContextNotesPanel';
import { WorkflowModeSelector, WorkflowMode } from './WorkflowModeSelector';
import { ContextualTransitionModal } from './ContextualTransitionModal';
import { AEOContentStudio } from './AEOContentStudio';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import nikeLogo from '@/assets/nike-logo.png';

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
    brandLogo: nikeLogo,
  },
  {
    id: '2',
    name: 'Nike Pegasus 41',
    category: 'Performance Running',
    visibilityScore: 65,
    mentions: 145,
    brandLogo: nikeLogo,
  },
  {
    id: '3',
    name: 'Nike Dunk Low',
    category: 'Lifestyle',
    visibilityScore: 82,
    mentions: 312,
    brandLogo: nikeLogo,
  },
  {
    id: '4',
    name: 'Nike Air Force 1',
    category: 'Lifestyle',
    visibilityScore: 91,
    mentions: 456,
    brandLogo: nikeLogo,
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
  preselectedProductId?: string | null;
  onProductUsed?: () => void;
  onBack?: () => void;
}

export const ContentGenerationWorkflow = ({ demoMode = false, preselectedProductId, onProductUsed, onBack }: ContentGenerationWorkflowProps) => {
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
  const [cameFromProductLab, setCameFromProductLab] = useState(false);

  // Handle preselected product from external navigation
  useEffect(() => {
    if (preselectedProductId) {
      const product = mockProducts.find(p => p.id === preselectedProductId);
      if (product) {
        setWorkflowMode('product');
        setSelectedProduct(product);
        setCameFromProductLab(true);
        onProductUsed?.();
      }
    }
  }, [preselectedProductId, onProductUsed]);

  const handleBackToProductLab = () => {
    if (onBack) {
      onBack();
    }
  };

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

  // Studio state
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  const handleGenerate = () => {
    setShowTransitionModal(true);
  };

  const handleTransitionComplete = useCallback(() => {
    setShowTransitionModal(false);
    setShowStudio(true);
  }, []);

  const handleTransitionCancel = useCallback(() => {
    setShowTransitionModal(false);
  }, []);

  const handleCloseStudio = () => {
    setShowStudio(false);
  };

  const handlePublish = () => {
    toast({
      title: "Content Published",
      description: "Your content has been synced to the site successfully.",
    });
  };


  // Check if we've completed all required steps
  // For prompt-first flow, we don't need a product
  const isReadyForStructure = workflowMode === 'prompt' 
    ? selectedPrompt && selectedContentType
    : selectedProduct && selectedPrompt && selectedContentType;

  return (
    <div className={cn("flex gap-8 relative", demoMode && "demo-card-1")}>
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pb-8">
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

            {/* Step 2: Content Type (directly after prompt selection) */}
            <ContentTypeSelector
              selectedType={selectedContentType}
              onSelectType={handleSelectContentType}
              disabled={!selectedPrompt}
              stepNumber={2}
            />
          </>
        )}

        {/* Step 3: Content Type (only for product-first flow) */}
        {workflowMode === 'product' && (
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

      {/* SERP Preview Sidebar - Sticky wrapper */}
      {isReadyForStructure && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-0 pt-0">
            <SerpPreviewPanel
              title={seoTitle}
              urlSlug={urlSlug}
              description={metaDescription}
              contentType={selectedContentType}
              schemaEnabled={schemaEnabled}
              ratingEnabled={false}
            />
          </div>
        </div>
      )}

      {/* Contextual Transition Modal */}
      <ContextualTransitionModal
        isOpen={showTransitionModal}
        onComplete={handleTransitionComplete}
        onCancel={handleTransitionCancel}
        prompt={selectedPrompt}
        contentType={selectedContentType}
        productName={
          selectedProduct?.name ??
          (((selectedPrompt?.prompt ?? '').toLowerCase().includes('nike')) ? 'Nike' : undefined)
        }
        brandLogo={
          selectedProduct?.brandLogo ??
          (((selectedPrompt?.prompt ?? '').toLowerCase().includes('nike')) ? nikeLogo : undefined)
        }
      />

      {/* AEO Content Studio */}
      <AEOContentStudio
        isOpen={showStudio}
        onClose={handleCloseStudio}
        prompt={selectedPrompt}
        contentType={selectedContentType}
        productName={selectedProduct?.name}
        onPublish={handlePublish}
      />
    </div>
  );
};
