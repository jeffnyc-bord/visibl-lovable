import React, { useState, useMemo } from 'react';
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
  Loader2,
  Settings2,
  Minus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';

// Block styling options
export interface BlockStyles {
  fontSize: number; // in px
  lineHeight: number; // multiplier
  marginBottom: number; // in px
}

const defaultBlockStyles: Record<string, BlockStyles> = {
  section: { fontSize: 14, lineHeight: 1.4, marginBottom: 12 },
  text: { fontSize: 11, lineHeight: 1.5, marginBottom: 10 },
  stat: { fontSize: 24, lineHeight: 1.2, marginBottom: 12 },
  quote: { fontSize: 11, lineHeight: 1.4, marginBottom: 10 },
  image: { fontSize: 10, lineHeight: 1.4, marginBottom: 12 },
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
  styles?: BlockStyles;
}

interface ReportEditorProps {
  blocks: ReportBlock[];
  onBlocksChange: (blocks: ReportBlock[]) => void;
  onBack: () => void;
  onExport: () => void;
  reportTitle: string;
  onTitleChange: (title: string) => void;
  isExporting?: boolean;
  dateRange?: { start: Date | undefined; end: Date | undefined };
  brandName?: string;
}

// A4 dimensions at 96 DPI (standard screen): 794px x 1123px
// We'll use a scaled version for the canvas
const PAGE_WIDTH = 595; // ~A4 width in points
const PAGE_HEIGHT = 842; // ~A4 height in points
const PAGE_PADDING = 40;
const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 30;
const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT;

const ReportEditor = ({ 
  blocks, 
  onBlocksChange, 
  onBack, 
  onExport,
  reportTitle,
  onTitleChange,
  isExporting = false,
  dateRange,
  brandName = 'Brand'
}: ReportEditorProps) => {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());

  // Toggle block selection (shift-click for multi-select)
  const toggleBlockSelection = (blockId: string, shiftKey: boolean) => {
    setSelectedBlockIds(prev => {
      const newSet = new Set(shiftKey ? prev : []);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedBlockIds(new Set());
  };

  const selectAll = () => {
    setSelectedBlockIds(new Set(blocks.map(b => b.id)));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onBlocksChange(newBlocks);
  };

  const deleteBlock = (id: string) => {
    onBlocksChange(blocks.filter(b => b.id !== id));
    setSelectedBlockIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const deleteSelectedBlocks = () => {
    onBlocksChange(blocks.filter(b => !selectedBlockIds.has(b.id)));
    setSelectedBlockIds(new Set());
  };

  const updateBlock = (id: string, content: Partial<ReportBlock['content']>) => {
    onBlocksChange(blocks.map(b => 
      b.id === id ? { ...b, content: { ...b.content, ...content } } : b
    ));
  };

  const updateBlockStyles = (id: string, styles: Partial<BlockStyles>) => {
    onBlocksChange(blocks.map(b => 
      b.id === id ? { ...b, styles: { ...getBlockStyles(b), ...styles } } : b
    ));
  };

  // Update styles for all selected blocks
  const updateSelectedBlocksStyles = (styles: Partial<BlockStyles>) => {
    onBlocksChange(blocks.map(b => 
      selectedBlockIds.has(b.id) 
        ? { ...b, styles: { ...getBlockStyles(b), ...styles } } 
        : b
    ));
  };

  const getBlockStyles = (block: ReportBlock): BlockStyles => {
    return block.styles || defaultBlockStyles[block.type] || defaultBlockStyles.text;
  };

  const addBlock = (type: ReportBlock['type'], afterIndex?: number) => {
    const newBlock: ReportBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: { ...defaultBlockStyles[type] },
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

  // Calculate which blocks go on which page
  const pages = useMemo(() => {
    const result: { blocks: ReportBlock[]; pageNum: number }[] = [];
    let currentPage: ReportBlock[] = [];
    let currentHeight = 0;
    let pageNum = 1;

    // First page has title section
    const titleHeight = 50;
    currentHeight = titleHeight;

    blocks.forEach((block) => {
      const styles = getBlockStyles(block);
      const blockHeight = estimateBlockHeight(block, styles);

      if (currentHeight + blockHeight > CONTENT_HEIGHT && currentPage.length > 0) {
        result.push({ blocks: currentPage, pageNum });
        currentPage = [block];
        currentHeight = blockHeight;
        pageNum++;
      } else {
        currentPage.push(block);
        currentHeight += blockHeight;
      }
    });

    if (currentPage.length > 0 || result.length === 0) {
      result.push({ blocks: currentPage, pageNum });
    }

    return result;
  }, [blocks]);

  // Estimate block height based on content and styles
  function estimateBlockHeight(block: ReportBlock, styles: BlockStyles): number {
    const lineHeight = styles.lineHeight * styles.fontSize;
    const margin = styles.marginBottom;
    
    switch (block.type) {
      case 'section': {
        const titleLines = Math.ceil((block.content.title?.length || 0) / 50);
        const bodyLines = Math.ceil((block.content.body?.length || 0) / 70);
        return 20 + titleLines * 18 + bodyLines * lineHeight + margin;
      }
      case 'text': {
        const titleLines = block.content.title ? 1 : 0;
        const bodyLines = Math.ceil((block.content.body?.length || 0) / 70);
        return titleLines * 16 + bodyLines * lineHeight + margin;
      }
      case 'stat':
        return 40 + margin;
      case 'quote': {
        const lines = Math.ceil((block.content.quoteText?.length || 0) / 60);
        return lines * lineHeight + 20 + margin;
      }
      case 'image':
        return block.content.imageUrl ? 120 + margin : 60 + margin;
      default:
        return 40 + margin;
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Selection toolbar */}
            {selectedBlockIds.size > 0 ? (
              <div className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5">
                <span className="text-xs text-primary font-medium">
                  {selectedBlockIds.size} selected
                </span>
                <div className="flex items-center gap-1 border-l border-primary/20 pl-2 ml-1">
                  <BatchFormattingControls 
                    onUpdateStyles={updateSelectedBlocksStyles}
                    selectedCount={selectedBlockIds.size}
                  />
                  <button
                    onClick={deleteSelectedBlocks}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded"
                    title="Delete selected"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={clearSelection}
                    className="p-1 text-muted-foreground hover:text-foreground rounded"
                    title="Clear selection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={selectAll}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Select all
              </button>
            )}

            <span className="text-xs text-muted-foreground">
              {pages.length} page{pages.length !== 1 ? 's' : ''}
            </span>
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
        </div>
      </header>

      {/* Selection hint */}
      {selectedBlockIds.size === 0 && blocks.length > 0 && (
        <div className="bg-muted/50 border-b border-border py-1.5 text-center">
          <span className="text-xs text-muted-foreground">
            Click blocks to select. Hold <kbd className="bg-background px-1 py-0.5 rounded text-[10px] border border-border">Shift</kbd> to multi-select.
          </span>
        </div>
      )}

      {/* Page Canvas */}
      <div className="flex-1 overflow-auto py-8 px-4">
        <div className="flex flex-col items-center gap-6">
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className="relative">
              {/* Page number indicator */}
              <div className="absolute -left-16 top-4 text-xs text-muted-foreground">
                Page {page.pageNum}
              </div>
              
              {/* Page */}
              <div 
                className="bg-white shadow-lg rounded-sm relative"
                style={{ 
                  width: PAGE_WIDTH, 
                  minHeight: PAGE_HEIGHT,
                  padding: PAGE_PADDING,
                }}
              >
                {/* Header on first page */}
                {pageIndex === 0 && (
                  <div className="border-b border-gray-200 pb-3 mb-4" style={{ height: HEADER_HEIGHT }}>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] text-gray-500">{brandName}</span>
                      <span className="text-[8px] text-gray-400">
                        {formatDate(dateRange?.start)} — {formatDate(dateRange?.end)}
                      </span>
                    </div>
                    {/* Editable Title */}
                    <div className="mt-2 group">
                      {editingTitle ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={reportTitle}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="text-[18px] font-light text-gray-900 border-0 border-b border-gray-300 bg-transparent w-full focus:outline-none focus:border-primary"
                            autoFocus
                            onBlur={() => setEditingTitle(false)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingTitle(true)}
                          className="text-left w-full"
                        >
                          <h1 className="text-[18px] font-light text-gray-900 inline-flex items-center gap-2">
                            {reportTitle}
                            <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h1>
                        </button>
                      )}
                      <p className="text-[8px] text-gray-500 mt-0.5">AI Visibility Report • {brandName}</p>
                    </div>
                  </div>
                )}

                {/* Content blocks */}
                <div className="space-y-0">
                  {page.blocks.map((block, blockIndex) => {
                    const globalIndex = blocks.findIndex(b => b.id === block.id);
                    const styles = getBlockStyles(block);
                    
                    return (
                      <div
                        key={block.id}
                        draggable={!selectedBlockIds.has(block.id)}
                        onDragStart={() => handleDragStart(globalIndex)}
                        onDragOver={(e) => handleDragOver(e, globalIndex)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "group relative",
                          draggedIndex === globalIndex && "opacity-50"
                        )}
                        style={{ marginBottom: styles.marginBottom }}
                      >
                        <PageBlock
                          block={block}
                          styles={styles}
                          isEditing={editingBlockId === block.id}
                          isSelected={selectedBlockIds.has(block.id)}
                          onSelect={(shiftKey) => toggleBlockSelection(block.id, shiftKey)}
                          onEdit={() => setEditingBlockId(block.id)}
                          onSave={() => setEditingBlockId(null)}
                          onUpdate={(content) => updateBlock(block.id, content)}
                          onUpdateStyles={(newStyles) => updateBlockStyles(block.id, newStyles)}
                          onDelete={() => deleteBlock(block.id)}
                          onMoveUp={() => moveBlock(globalIndex, 'up')}
                          onMoveDown={() => moveBlock(globalIndex, 'down')}
                          canMoveUp={globalIndex > 0}
                          canMoveDown={globalIndex < blocks.length - 1}
                          onAddAfter={(type) => addBlock(type, globalIndex)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Add block button when page is empty or at end */}
                {page.blocks.length === 0 && pageIndex === 0 && (
                  <div className="border border-dashed border-gray-300 rounded p-6 text-center mt-4">
                    <p className="text-[10px] text-gray-400 mb-3">Add content blocks</p>
                    <AddBlockButton onAdd={addBlock} variant="large" />
                  </div>
                )}

                {/* Footer */}
                <div 
                  className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-[8px] text-gray-400 border-t border-gray-100"
                  style={{ 
                    padding: `8px ${PAGE_PADDING}px`,
                    height: FOOTER_HEIGHT 
                  }}
                >
                  <span>{brandName}</span>
                  <span>Page {page.pageNum} of {pages.length}</span>
                </div>

                {/* Page break indicator */}
                {pageIndex < pages.length - 1 && (
                  <div className="absolute -bottom-3 left-0 right-0 flex items-center justify-center">
                    <div className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full">
                      Page break
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add new block at end */}
          {blocks.length > 0 && (
            <div className="py-4">
              <AddBlockButton onAdd={addBlock} variant="large" />
            </div>
          )}
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
        <Button variant="outline" size="sm" className="rounded-full text-xs">
          <Plus className="w-3 h-3 mr-1" />
          Add Block
        </Button>
      ) : (
        <button className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform">
          <Plus className="w-3 h-3" />
        </button>
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center" className="w-40">
      <DropdownMenuItem onClick={() => onAdd('text')} className="text-xs">
        <Type className="w-3 h-3 mr-2" />
        Text Block
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdd('image')} className="text-xs">
        <Image className="w-3 h-3 mr-2" />
        Image
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdd('stat')} className="text-xs">
        <Hash className="w-3 h-3 mr-2" />
        Statistic
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAdd('quote')} className="text-xs">
        <Quote className="w-3 h-3 mr-2" />
        Quote
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Formatting Controls Popover
interface FormattingControlsProps {
  styles: BlockStyles;
  onUpdate: (styles: Partial<BlockStyles>) => void;
  blockType: string;
}

const FormattingControls = ({ styles, onUpdate, blockType }: FormattingControlsProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="p-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors">
        <Settings2 className="w-3 h-3" />
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-56 p-3" align="end">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Font Size</label>
            <span className="text-[10px] text-foreground font-medium">{styles.fontSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onUpdate({ fontSize: Math.max(8, styles.fontSize - 1) })}
              className="p-1 rounded border border-border hover:bg-muted"
            >
              <Minus className="w-3 h-3" />
            </button>
            <Slider
              value={[styles.fontSize]}
              onValueChange={([v]) => onUpdate({ fontSize: v })}
              min={8}
              max={blockType === 'stat' ? 48 : 24}
              step={1}
              className="flex-1"
            />
            <button 
              onClick={() => onUpdate({ fontSize: Math.min(blockType === 'stat' ? 48 : 24, styles.fontSize + 1) })}
              className="p-1 rounded border border-border hover:bg-muted"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Line Height</label>
            <span className="text-[10px] text-foreground font-medium">{styles.lineHeight.toFixed(1)}</span>
          </div>
          <Slider
            value={[styles.lineHeight * 10]}
            onValueChange={([v]) => onUpdate({ lineHeight: v / 10 })}
            min={10}
            max={24}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Spacing After</label>
            <span className="text-[10px] text-foreground font-medium">{styles.marginBottom}px</span>
          </div>
          <Slider
            value={[styles.marginBottom]}
            onValueChange={([v]) => onUpdate({ marginBottom: v })}
            min={0}
            max={40}
            step={2}
            className="w-full"
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

// Batch Formatting Controls for multi-select
interface BatchFormattingControlsProps {
  onUpdateStyles: (styles: Partial<BlockStyles>) => void;
  selectedCount: number;
}

const BatchFormattingControls = ({ onUpdateStyles, selectedCount }: BatchFormattingControlsProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="p-1 text-primary hover:bg-primary/10 rounded" title="Format selected">
        <Settings2 className="w-3.5 h-3.5" />
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-64 p-3" align="center">
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground text-center border-b border-border pb-2">
          Format {selectedCount} selected block{selectedCount !== 1 ? 's' : ''}
        </p>
        
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Font Size</label>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onUpdateStyles({ fontSize: 9 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Small
            </button>
            <button 
              onClick={() => onUpdateStyles({ fontSize: 11 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Medium
            </button>
            <button 
              onClick={() => onUpdateStyles({ fontSize: 14 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Large
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Line Height</label>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onUpdateStyles({ lineHeight: 1.2 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Tight
            </button>
            <button 
              onClick={() => onUpdateStyles({ lineHeight: 1.5 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Normal
            </button>
            <button 
              onClick={() => onUpdateStyles({ lineHeight: 1.8 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Relaxed
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Spacing After</label>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onUpdateStyles({ marginBottom: 6 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Compact
            </button>
            <button 
              onClick={() => onUpdateStyles({ marginBottom: 12 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Normal
            </button>
            <button 
              onClick={() => onUpdateStyles({ marginBottom: 20 })}
              className="flex-1 py-1.5 text-[10px] rounded border border-border hover:bg-muted"
            >
              Spacious
            </button>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

// Page Block Renderer
interface PageBlockProps {
  block: ReportBlock;
  styles: BlockStyles;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (shiftKey: boolean) => void;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<BlockStyles>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onAddAfter: (type: ReportBlock['type']) => void;
}

const PageBlock = ({
  block,
  styles,
  isEditing,
  isSelected,
  onSelect,
  onEdit,
  onSave,
  onUpdate,
  onUpdateStyles,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onAddAfter,
}: PageBlockProps) => {
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

  const handleClick = (e: React.MouseEvent) => {
    // Don't select if clicking on controls or editing
    if (isEditing) return;
    e.stopPropagation();
    onSelect(e.shiftKey);
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "relative rounded transition-all cursor-pointer",
        isEditing && "ring-1 ring-primary bg-blue-50/30 p-2 -mx-2",
        isSelected && !isEditing && "ring-2 ring-primary/50 bg-primary/5",
        !isEditing && !isSelected && "hover:bg-gray-50/50"
      )}
    >
      {/* Controls - left side */}
      {!isEditing && (
        <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-0.5">
          <button className="p-0.5 text-gray-400 hover:text-gray-600 cursor-grab">
            <GripVertical className="w-3 h-3" />
          </button>
          {canMoveUp && (
            <button onClick={onMoveUp} className="p-0.5 text-gray-400 hover:text-gray-600">
              <ChevronUp className="w-3 h-3" />
            </button>
          )}
          {canMoveDown && (
            <button onClick={onMoveDown} className="p-0.5 text-gray-400 hover:text-gray-600">
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Controls - right side */}
      {!isEditing && (
        <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
          <FormattingControls 
            styles={styles} 
            onUpdate={onUpdateStyles} 
            blockType={block.type}
          />
          {block.type !== 'section' && (
            <button
              onClick={onEdit}
              className="p-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Add block after - bottom center */}
      {!isEditing && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <AddBlockButton onAdd={onAddAfter} />
        </div>
      )}

      {/* Content */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {block.type === 'section' && (
        <SectionBlockContent block={block} styles={styles} isEditing={isEditing} onUpdate={onUpdate} />
      )}
      {block.type === 'text' && (
        <TextBlockContent block={block} styles={styles} isEditing={isEditing} onUpdate={onUpdate} />
      )}
      {block.type === 'image' && (
        <ImageBlockContent 
          block={block} 
          styles={styles}
          isEditing={isEditing} 
          onUpdate={onUpdate}
          onUpload={() => fileInputRef.current?.click()}
        />
      )}
      {block.type === 'stat' && (
        <StatBlockContent block={block} styles={styles} isEditing={isEditing} onUpdate={onUpdate} />
      )}
      {block.type === 'quote' && (
        <QuoteBlockContent block={block} styles={styles} isEditing={isEditing} onUpdate={onUpdate} />
      )}

      {/* Save button when editing */}
      {isEditing && (
        <div className="flex justify-end mt-2 pt-2 border-t border-gray-200">
          <button 
            onClick={onSave} 
            className="text-[10px] bg-primary text-primary-foreground px-3 py-1 rounded-full hover:bg-primary/90"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// Block Content Components
const SectionBlockContent = ({ block, styles, isEditing, onUpdate }: { 
  block: ReportBlock; 
  styles: BlockStyles;
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
}) => (
  <div style={{ lineHeight: styles.lineHeight }}>
    <div className="text-[7px] text-gray-500 uppercase tracking-wider mb-1">
      {block.content.sectionType}
    </div>
    {isEditing ? (
      <input
        value={block.content.title || ''}
        onChange={(e) => onUpdate({ title: e.target.value })}
        style={{ fontSize: styles.fontSize }}
        className="font-light text-gray-900 border-0 border-b border-gray-300 bg-transparent w-full focus:outline-none focus:border-primary"
      />
    ) : (
      <h2 style={{ fontSize: styles.fontSize }} className="font-light text-gray-900">
        {block.content.title}
      </h2>
    )}
    {block.content.body && (
      <p className="text-gray-600 mt-1" style={{ fontSize: styles.fontSize * 0.7, lineHeight: styles.lineHeight }}>
        {block.content.body}
      </p>
    )}
  </div>
);

const TextBlockContent = ({ block, styles, isEditing, onUpdate }: { 
  block: ReportBlock; 
  styles: BlockStyles;
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
}) => (
  <div style={{ lineHeight: styles.lineHeight }}>
    {isEditing ? (
      <div className="space-y-2">
        <input
          value={block.content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Title (optional)"
          style={{ fontSize: styles.fontSize + 2 }}
          className="font-medium text-gray-900 border-0 border-b border-gray-300 bg-transparent w-full focus:outline-none focus:border-primary"
        />
        <textarea
          value={block.content.body || ''}
          onChange={(e) => onUpdate({ body: e.target.value })}
          placeholder="Write content..."
          style={{ fontSize: styles.fontSize, lineHeight: styles.lineHeight }}
          className="text-gray-600 border-0 bg-transparent w-full focus:outline-none resize-none min-h-[60px]"
        />
      </div>
    ) : (
      <>
        {block.content.title && (
          <h3 style={{ fontSize: styles.fontSize + 2 }} className="font-medium text-gray-900 mb-1">
            {block.content.title}
          </h3>
        )}
        <p style={{ fontSize: styles.fontSize, lineHeight: styles.lineHeight }} className="text-gray-600 whitespace-pre-wrap">
          {block.content.body}
        </p>
      </>
    )}
  </div>
);

const ImageBlockContent = ({ block, styles, isEditing, onUpdate, onUpload }: { 
  block: ReportBlock; 
  styles: BlockStyles;
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
  onUpload: () => void;
}) => (
  <div>
    {block.content.imageUrl ? (
      <div>
        <img 
          src={block.content.imageUrl} 
          alt={block.content.imageCaption || 'Report image'} 
          className="max-h-[100px] object-contain rounded"
        />
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              value={block.content.imageCaption || ''}
              onChange={(e) => onUpdate({ imageCaption: e.target.value })}
              placeholder="Caption..."
              style={{ fontSize: styles.fontSize }}
              className="flex-1 text-gray-500 italic border-0 border-b border-gray-200 bg-transparent focus:outline-none"
            />
            <button onClick={onUpload} className="text-[9px] text-primary hover:underline">
              Replace
            </button>
          </div>
        ) : (
          block.content.imageCaption && (
            <p style={{ fontSize: styles.fontSize }} className="text-gray-500 italic mt-1">
              {block.content.imageCaption}
            </p>
          )
        )}
      </div>
    ) : (
      <button
        onClick={onUpload}
        className="w-full h-20 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
      >
        <Image className="w-4 h-4" />
        <span className="text-[9px]">Upload image</span>
      </button>
    )}
  </div>
);

const StatBlockContent = ({ block, styles, isEditing, onUpdate }: { 
  block: ReportBlock; 
  styles: BlockStyles;
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
}) => (
  <div className="flex items-baseline gap-2">
    {isEditing ? (
      <>
        <input
          value={block.content.statValue || ''}
          onChange={(e) => onUpdate({ statValue: e.target.value })}
          style={{ fontSize: styles.fontSize }}
          className="font-light text-gray-900 border-0 border-b border-gray-300 bg-transparent w-24 focus:outline-none"
        />
        <input
          value={block.content.statLabel || ''}
          onChange={(e) => onUpdate({ statLabel: e.target.value })}
          style={{ fontSize: styles.fontSize * 0.4 }}
          className="text-gray-500 border-0 border-b border-gray-200 bg-transparent flex-1 focus:outline-none"
        />
      </>
    ) : (
      <>
        <span style={{ fontSize: styles.fontSize }} className="font-light text-gray-900">
          {block.content.statValue}
        </span>
        <span style={{ fontSize: styles.fontSize * 0.4 }} className="text-gray-500">
          {block.content.statLabel}
        </span>
      </>
    )}
  </div>
);

const QuoteBlockContent = ({ block, styles, isEditing, onUpdate }: { 
  block: ReportBlock; 
  styles: BlockStyles;
  isEditing: boolean;
  onUpdate: (content: Partial<ReportBlock['content']>) => void;
}) => (
  <div className="pl-3 border-l-2 border-gray-300" style={{ lineHeight: styles.lineHeight }}>
    {isEditing ? (
      <div className="space-y-1">
        <textarea
          value={block.content.quoteText || ''}
          onChange={(e) => onUpdate({ quoteText: e.target.value })}
          placeholder="Enter quote..."
          style={{ fontSize: styles.fontSize, lineHeight: styles.lineHeight }}
          className="italic text-gray-900 border-0 bg-transparent w-full focus:outline-none resize-none min-h-[40px]"
        />
        <input
          value={block.content.quoteAuthor || ''}
          onChange={(e) => onUpdate({ quoteAuthor: e.target.value })}
          placeholder="Attribution"
          style={{ fontSize: styles.fontSize * 0.8 }}
          className="text-gray-500 border-0 border-b border-gray-200 bg-transparent w-full focus:outline-none"
        />
      </div>
    ) : (
      <>
        <p style={{ fontSize: styles.fontSize, lineHeight: styles.lineHeight }} className="italic text-gray-900">
          "{block.content.quoteText}"
        </p>
        {block.content.quoteAuthor && (
          <p style={{ fontSize: styles.fontSize * 0.8 }} className="text-gray-500 mt-1">
            — {block.content.quoteAuthor}
          </p>
        )}
      </>
    )}
  </div>
);

export default ReportEditor;
