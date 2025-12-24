import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Plus,
  GripVertical,
  Type,
  Image,
  Hash,
  Quote,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit3,
  Check,
  X,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

// Import AI logos
import chatGPTLogo from '@/assets/chatGPT_logo.png';
import geminiLogo from '@/assets/gemini_logo.png';
import claudeLogo from '@/assets/claude_logo.png';
import perplexityLogo from '@/assets/perplexity_logo.png';
import grokLogo from '@/assets/grok_logo_new.png';

const platformLogos: Record<string, string> = {
  chatgpt: chatGPTLogo,
  gemini: geminiLogo,
  claude: claudeLogo,
  perplexity: perplexityLogo,
  grok: grokLogo,
};

export interface ReportBlock {
  id: string;
  type: 'section' | 'text' | 'image' | 'stat' | 'quote';
  content: {
    title?: string;
    body?: string;
    imageUrl?: string;
    imageCaption?: string;
    statValue?: string;
    statLabel?: string;
    quoteText?: string;
    quoteAuthor?: string;
    sectionType?: string;
  };
}

interface SectionData {
  score: { enabled: boolean };
  mentions: { enabled: boolean };
  platformCoverage: { enabled: boolean; items?: string[] };
  prompts: { enabled: boolean; items?: string[] };
  products: { enabled: boolean; items?: string[] };
  optimizations: { enabled: boolean; items?: string[] };
  actions: { enabled: boolean; items?: string[] };
}

interface PlatformData {
  id: string;
  name: string;
  mentions: number;
}

interface ReportEditorProps {
  blocks: ReportBlock[];
  onBlocksChange: (blocks: ReportBlock[]) => void;
  onBack: () => void;
  onExport: () => void;
  reportTitle: string;
  onTitleChange: (title: string) => void;
  isExporting?: boolean;
  sections?: SectionData;
  platforms?: PlatformData[];
  dateRange?: { start: Date | undefined; end: Date | undefined };
  brandName?: string;
  customLogo?: string | null;
}

// Mock trend data for visualization
const trendData = [35, 42, 38, 51, 49, 62, 58, 71, 68, 79, 85, 87];

const ReportEditor = ({ 
  blocks, 
  onBlocksChange, 
  onBack, 
  onExport,
  reportTitle,
  onTitleChange,
  isExporting = false,
  sections,
  platforms,
  dateRange,
  brandName = 'Brand',
  customLogo
}: ReportEditorProps) => {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onBlocksChange(newBlocks);
  };

  const deleteBlock = (id: string) => {
    onBlocksChange(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, content: Partial<ReportBlock['content']>) => {
    onBlocksChange(blocks.map(b => 
      b.id === id ? { ...b, content: { ...b.content, ...content } } : b
    ));
  };

  const addBlock = (type: ReportBlock['type'], afterIndex?: number) => {
    const newBlock: ReportBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };
    
    if (afterIndex !== undefined) {
      const newBlocks = [...blocks];
      newBlocks.splice(afterIndex + 1, 0, newBlock);
      onBlocksChange(newBlocks);
    } else {
      onBlocksChange([...blocks, newBlock]);
    }
    setEditingBlockId(newBlock.id);
  };

  const getDefaultContent = (type: ReportBlock['type']): ReportBlock['content'] => {
    switch (type) {
      case 'text':
        return { title: 'New Section', body: 'Add your commentary here...' };
      case 'image':
        return { imageUrl: '', imageCaption: 'Image caption' };
      case 'stat':
        return { statValue: '0', statLabel: 'Metric name' };
      case 'quote':
        return { quoteText: 'Add a notable quote or insight...', quoteAuthor: '' };
      default:
        return {};
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedIndex];
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(index, 0, draggedBlock);
    onBlocksChange(newBlocks);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const formatDate = (date: Date | undefined) => 
    date ? format(date, "MMM d, yyyy") : "—";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <Button 
            onClick={onExport}
            className="h-9 px-5 rounded-full"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex">
        {/* Left Panel - Editor */}
        <div className="flex-1 overflow-auto border-r border-border/50">
          <div className="max-w-2xl mx-auto px-8 py-10">
            {/* Editable Title */}
            <div className="mb-8 group">
              {editingTitle ? (
                <div className="flex items-center gap-3">
                  <Input
                    value={reportTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="text-2xl font-light border-0 border-b border-border rounded-none px-0 h-auto py-2 focus-visible:ring-0 bg-transparent"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingTitle(false)}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="text-left w-full"
                >
                  <h1 className="text-2xl font-light tracking-tight text-foreground inline-flex items-center gap-3">
                    {reportTitle}
                    <Edit3 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h1>
                </button>
              )}
              {dateRange && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(dateRange.start)} — {formatDate(dateRange.end)}
                </p>
              )}
            </div>

            <p className="text-muted-foreground mb-6 text-sm">
              Add commentary, insights, or additional content. Changes update live in the preview.
            </p>

            {/* Blocks */}
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group relative",
                    draggedIndex === index && "opacity-50"
                  )}
                >
                  <BlockRenderer
                    block={block}
                    isEditing={editingBlockId === block.id}
                    onEdit={() => setEditingBlockId(block.id)}
                    onSave={() => setEditingBlockId(null)}
                    onUpdate={(content) => updateBlock(block.id, content)}
                    onDelete={() => deleteBlock(block.id)}
                    onMoveUp={() => moveBlock(index, 'up')}
                    onMoveDown={() => moveBlock(index, 'down')}
                    canMoveUp={index > 0}
                    canMoveDown={index < blocks.length - 1}
                  />
                  
                  {/* Add block button between items */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <AddBlockButton onAdd={(type) => addBlock(type, index)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Add block at end */}
            {blocks.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg p-10 text-center">
                <p className="text-muted-foreground mb-4 text-sm">No content blocks yet</p>
                <AddBlockButton onAdd={addBlock} variant="large" />
              </div>
            ) : (
              <div className="mt-8 flex justify-center">
                <AddBlockButton onAdd={addBlock} variant="large" />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-[420px] bg-muted/30 overflow-auto hidden lg:block">
          <div className="sticky top-0 bg-muted/50 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Live Preview</span>
            <span className="text-xs text-muted-foreground">{blocks.length} blocks</span>
          </div>
          
          <div className="p-4">
            {/* PDF Preview - Cover Page */}
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden mb-4"
              style={{ fontFamily: "'Google Sans', system-ui, sans-serif", aspectRatio: '8.5/11' }}
            >
              <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  {customLogo ? (
                    <img src={customLogo} alt="Logo" className="h-5 object-contain" />
                  ) : (
                    <span className="text-[8px] text-[#86868b] tracking-wide">{brandName}</span>
                  )}
                  <span className="text-[7px] text-[#86868b]">
                    {formatDate(dateRange?.start)} — {formatDate(dateRange?.end)}
                  </span>
                </div>

                {/* Title */}
                <div className="flex-1 flex flex-col justify-start pt-2">
                  <h1 className="text-lg font-light text-[#1d1d1f] tracking-tight leading-tight mb-1">
                    {reportTitle}
                  </h1>
                  <p className="text-[8px] text-[#86868b]">
                    AI Visibility Report • {brandName}
                  </p>

                  {/* Score Section with Trend Chart */}
                  {sections?.score.enabled && (
                    <div className="mt-4">
                      <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-light text-[#1d1d1f]">87</span>
                        <div className="flex items-center gap-0.5 text-emerald-600 text-[8px] pb-0.5">
                          <TrendingUp className="w-2.5 h-2.5" />
                          <span>+5 pts</span>
                        </div>
                      </div>
                      
                      {/* Mini Trend Chart */}
                      <div className="h-6 flex items-end gap-0.5">
                        {trendData.map((value, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-primary/40 to-primary/80 rounded-t-sm"
                            style={{ height: `${value}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[6px] text-[#86868b]">Jan</span>
                        <span className="text-[6px] text-[#86868b]">Dec</span>
                      </div>
                    </div>
                  )}

                  {/* Mentions */}
                  {sections?.mentions.enabled && (
                    <div className="mt-3">
                      <span className="text-xl font-light text-[#1d1d1f]">12,847</span>
                      <p className="text-[7px] text-[#86868b] mt-0.5">total brand mentions</p>
                    </div>
                  )}

                  {/* Platform Coverage with Logos */}
                  {(sections?.platformCoverage.items?.length || 0) > 0 && platforms && (
                    <div className="mt-3">
                      <p className="text-[6px] text-[#86868b] uppercase tracking-wider mb-1.5">Platform Coverage</p>
                      <div className="flex flex-wrap gap-1">
                        {sections?.platformCoverage.items?.slice(0, 5).map((platformId) => {
                          const platform = platforms.find(p => p.id === platformId);
                          const logo = platformLogos[platformId];
                          if (!platform) return null;
                          return (
                            <div key={platformId} className="flex items-center gap-1 bg-[#f5f5f7] rounded-full px-1.5 py-0.5">
                              {logo && (
                                <img src={logo} alt={platform.name} className="w-2.5 h-2.5 object-contain rounded-sm" />
                              )}
                              <span className="text-[6px] text-[#1d1d1f]">{platform.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Page Number */}
                <div className="text-[6px] text-[#86868b] text-right">01</div>
              </div>
            </div>

            {/* Content Pages Preview */}
            {blocks.length > 0 && (
              <div 
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                style={{ fontFamily: "'Google Sans', system-ui, sans-serif", aspectRatio: '8.5/11' }}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    {blocks.slice(0, 4).map((block) => (
                      <div key={block.id} className="mb-3">
                        {block.type === 'text' && (
                          <div>
                            {block.content.title && (
                              <h3 className="text-[9px] font-medium text-[#1d1d1f] mb-0.5">{block.content.title}</h3>
                            )}
                            {block.content.body && (
                              <p className="text-[7px] text-[#515154] line-clamp-3">{block.content.body}</p>
                            )}
                          </div>
                        )}
                        {block.type === 'stat' && (
                          <div className="py-1">
                            <span className="text-lg font-light text-[#1d1d1f]">{block.content.statValue}</span>
                            <p className="text-[7px] text-[#86868b]">{block.content.statLabel}</p>
                          </div>
                        )}
                        {block.type === 'quote' && (
                          <div className="pl-2 border-l border-[#d2d2d7] py-1">
                            <p className="text-[8px] italic text-[#1d1d1f] line-clamp-2">"{block.content.quoteText}"</p>
                            {block.content.quoteAuthor && (
                              <p className="text-[6px] text-[#86868b] mt-0.5">— {block.content.quoteAuthor}</p>
                            )}
                          </div>
                        )}
                        {block.type === 'image' && block.content.imageUrl && (
                          <div>
                            <img 
                              src={block.content.imageUrl} 
                              alt={block.content.imageCaption || ''} 
                              className="w-full h-16 object-cover rounded"
                            />
                            {block.content.imageCaption && (
                              <p className="text-[6px] text-[#86868b] italic mt-0.5 text-center">{block.content.imageCaption}</p>
                            )}
                          </div>
                        )}
                        {block.type === 'section' && (
                          <div>
                            <span className="text-[6px] text-[#86868b] uppercase tracking-wider">{block.content.sectionType}</span>
                            <h2 className="text-[10px] font-light text-[#1d1d1f]">{block.content.title}</h2>
                          </div>
                        )}
                      </div>
                    ))}
                    {blocks.length > 4 && (
                      <p className="text-[7px] text-[#86868b] text-center mt-2">
                        +{blocks.length - 4} more blocks...
                      </p>
                    )}
                  </div>
                  <div className="text-[6px] text-[#86868b] text-right">02</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Block Button
interface AddBlockButtonProps {
  onAdd: (type: ReportBlock['type']) => void;
  variant?: 'small' | 'large';
}

const AddBlockButton = ({ onAdd, variant = 'small' }: AddBlockButtonProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {variant === 'large' ? (
        <Button variant="outline" className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Block
        </Button>
      ) : (
        <button className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform">
          <Plus className="w-3 h-3" />
        </button>
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center" className="w-48">
      <DropdownMenuItem onClick={() => onAdd('text')}>
        <Type className="w-4 h-4 mr-2" />
        Text Block
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdd('image')}>
        <Image className="w-4 h-4 mr-2" />
        Image
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdd('stat')}>
        <Hash className="w-4 h-4 mr-2" />
        Statistic
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdd('quote')}>
        <Quote className="w-4 h-4 mr-2" />
        Quote
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Block Renderer
interface BlockRendererProps {
  block: ReportBlock;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const BlockRenderer = ({
  block,
  isEditing,
  onEdit,
  onSave,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: BlockRendererProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({ imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn(
      "relative border border-transparent rounded-lg transition-all",
      isEditing ? "border-border bg-muted/30 p-4" : "hover:border-border/50 group"
    )}>
      {/* Controls */}
      {!isEditing && (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
          <button className="p-1 text-muted-foreground hover:text-foreground cursor-grab">
            <GripVertical className="w-4 h-4" />
          </button>
          {canMoveUp && (
            <button onClick={onMoveUp} className="p-1 text-muted-foreground hover:text-foreground">
              <ChevronUp className="w-3 h-3" />
            </button>
          )}
          {canMoveDown && (
            <button onClick={onMoveDown} className="p-1 text-muted-foreground hover:text-foreground">
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Edit/Delete buttons */}
      {!isEditing && block.type !== 'section' && (
        <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md bg-background border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md bg-background border border-border text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Content based on type */}
      {block.type === 'section' && (
        <SectionBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />
      )}

      {block.type === 'text' && (
        <TextBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />
      )}

      {block.type === 'image' && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <ImageBlock 
            block={block} 
            isEditing={isEditing} 
            onUpdate={onUpdate}
            onUpload={() => fileInputRef.current?.click()}
          />
        </>
      )}

      {block.type === 'stat' && (
        <StatBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />
      )}

      {block.type === 'quote' && (
        <QuoteBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />
      )}

      {/* Save button when editing */}
      {isEditing && (
        <div className="flex justify-end mt-4 pt-4 border-t border-border/50">
          <Button size="sm" onClick={onSave} className="rounded-full">
            <Check className="w-3 h-3 mr-1" />
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

// Section Block (auto-generated from config)
const SectionBlock = ({ block, isEditing, onUpdate }: { 
  block: ReportBlock; 
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
}) => (
  <div className="py-4">
    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
      {block.content.sectionType}
    </div>
    {isEditing ? (
      <Input
        value={block.content.title || ''}
        onChange={(e) => onUpdate({ title: e.target.value })}
        className="text-xl font-light border-0 border-b border-border rounded-none px-0 h-auto py-1 focus-visible:ring-0 bg-transparent"
      />
    ) : (
      <h2 className="text-xl font-light text-foreground">{block.content.title}</h2>
    )}
    {block.content.body && (
      <p className="text-muted-foreground mt-2 text-sm">{block.content.body}</p>
    )}
  </div>
);

// Text Block
const TextBlock = ({ block, isEditing, onUpdate }: { 
  block: ReportBlock; 
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
}) => (
  <div className="py-4">
    {isEditing ? (
      <div className="space-y-3">
        <Input
          value={block.content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Section title (optional)"
          className="font-medium border-0 border-b border-border rounded-none px-0 h-auto py-1 focus-visible:ring-0 bg-transparent"
        />
        <Textarea
          value={block.content.body || ''}
          onChange={(e) => onUpdate({ body: e.target.value })}
          placeholder="Write your commentary..."
          className="min-h-[100px] border-0 px-0 focus-visible:ring-0 bg-transparent resize-none"
        />
      </div>
    ) : (
      <>
        {block.content.title && (
          <h3 className="font-medium text-foreground mb-2">{block.content.title}</h3>
        )}
        <p className="text-muted-foreground whitespace-pre-wrap">{block.content.body}</p>
      </>
    )}
  </div>
);

// Image Block
const ImageBlock = ({ block, isEditing, onUpdate, onUpload }: { 
  block: ReportBlock; 
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
  onUpload: () => void;
}) => (
  <div className="py-4">
    {block.content.imageUrl ? (
      <div className="space-y-3">
        <img 
          src={block.content.imageUrl} 
          alt={block.content.imageCaption || 'Report image'} 
          className="rounded-lg max-h-80 object-contain"
        />
        {isEditing ? (
          <div className="flex items-center gap-3">
            <Input
              value={block.content.imageCaption || ''}
              onChange={(e) => onUpdate({ imageCaption: e.target.value })}
              placeholder="Add caption..."
              className="flex-1 text-sm border-0 border-b border-border rounded-none px-0 h-auto py-1 focus-visible:ring-0 bg-transparent"
            />
            <button
              onClick={onUpload}
              className="text-xs text-primary hover:underline"
            >
              Replace
            </button>
          </div>
        ) : (
          block.content.imageCaption && (
            <p className="text-sm text-muted-foreground italic">{block.content.imageCaption}</p>
          )
        )}
      </div>
    ) : (
      <button
        onClick={onUpload}
        className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
      >
        <Image className="w-6 h-6" />
        <span className="text-sm">Click to upload image</span>
      </button>
    )}
  </div>
);

// Stat Block
const StatBlock = ({ block, isEditing, onUpdate }: { 
  block: ReportBlock; 
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
}) => (
  <div className="py-6">
    {isEditing ? (
      <div className="flex items-end gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Value</label>
          <Input
            value={block.content.statValue || ''}
            onChange={(e) => onUpdate({ statValue: e.target.value })}
            className="text-4xl font-light w-32 border-0 border-b border-border rounded-none px-0 h-auto py-1 focus-visible:ring-0 bg-transparent"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Label</label>
          <Input
            value={block.content.statLabel || ''}
            onChange={(e) => onUpdate({ statLabel: e.target.value })}
            className="border-0 border-b border-border rounded-none px-0 h-auto py-1 focus-visible:ring-0 bg-transparent"
          />
        </div>
      </div>
    ) : (
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-light text-foreground">{block.content.statValue}</span>
        <span className="text-muted-foreground">{block.content.statLabel}</span>
      </div>
    )}
  </div>
);

// Quote Block
const QuoteBlock = ({ block, isEditing, onUpdate }: { 
  block: ReportBlock; 
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
}) => (
  <div className="py-6 pl-6 border-l-2 border-foreground/20">
    {isEditing ? (
      <div className="space-y-3">
        <Textarea
          value={block.content.quoteText || ''}
          onChange={(e) => onUpdate({ quoteText: e.target.value })}
          placeholder="Enter quote..."
          className="text-lg italic border-0 px-0 focus-visible:ring-0 bg-transparent resize-none min-h-[60px]"
        />
        <Input
          value={block.content.quoteAuthor || ''}
          onChange={(e) => onUpdate({ quoteAuthor: e.target.value })}
          placeholder="Attribution (optional)"
          className="text-sm border-0 border-b border-border rounded-none px-0 h-auto py-1 focus-visible:ring-0 bg-transparent"
        />
      </div>
    ) : (
      <>
        <p className="text-lg italic text-foreground">"{block.content.quoteText}"</p>
        {block.content.quoteAuthor && (
          <p className="text-sm text-muted-foreground mt-2">— {block.content.quoteAuthor}</p>
        )}
      </>
    )}
  </div>
);

export default ReportEditor;
