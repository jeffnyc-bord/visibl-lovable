import { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, X, Save, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentType } from './ContentTypeSelector';

export interface HeaderItem {
  id: string;
  level: 'h1' | 'h2' | 'h3';
  text: string;
  isOptimized: boolean;
}

export interface HeaderTemplate {
  id: string;
  name: string;
  contentType: ContentType;
  headers: HeaderItem[];
}

interface EditableHeadersPanelProps {
  headers: HeaderItem[];
  onHeadersChange: (headers: HeaderItem[]) => void;
  templates: HeaderTemplate[];
  onSaveTemplate: (name: string) => void;
  onLoadTemplate: (template: HeaderTemplate) => void;
  contentType: ContentType;
}

export const EditableHeadersPanel = ({
  headers,
  onHeadersChange,
  templates,
  onSaveTemplate,
  onLoadTemplate,
  contentType,
}: EditableHeadersPanelProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [addingNew, setAddingNew] = useState<{ afterId: string; level: 'h1' | 'h2' | 'h3' } | null>(null);
  const [newHeaderText, setNewHeaderText] = useState('');

  const handleStartEdit = (header: HeaderItem) => {
    setEditingId(header.id);
    setEditingText(header.text);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    const updated = headers.map(h => 
      h.id === editingId ? { ...h, text: editingText } : h
    );
    onHeadersChange(updated);
    setEditingId(null);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleDelete = (id: string) => {
    // Don't allow deleting the only H1
    const h1Count = headers.filter(h => h.level === 'h1').length;
    const headerToDelete = headers.find(h => h.id === id);
    if (headerToDelete?.level === 'h1' && h1Count <= 1) return;
    
    onHeadersChange(headers.filter(h => h.id !== id));
  };

  const handleAddHeader = (afterId: string, level: 'h1' | 'h2' | 'h3') => {
    setAddingNew({ afterId, level });
    setNewHeaderText('');
  };

  const handleConfirmAdd = () => {
    if (!addingNew || !newHeaderText.trim()) return;
    
    const newHeader: HeaderItem = {
      id: `header-${Date.now()}`,
      level: addingNew.level,
      text: newHeaderText.trim(),
      isOptimized: false,
    };
    
    const afterIndex = headers.findIndex(h => h.id === addingNew.afterId);
    const newHeaders = [...headers];
    newHeaders.splice(afterIndex + 1, 0, newHeader);
    
    onHeadersChange(newHeaders);
    setAddingNew(null);
    setNewHeaderText('');
  };

  const handleCancelAdd = () => {
    setAddingNew(null);
    setNewHeaderText('');
  };

  const handleSaveAsTemplate = () => {
    if (!templateName.trim()) return;
    onSaveTemplate(templateName.trim());
    setTemplateName('');
    setShowSaveDialog(false);
  };

  const filteredTemplates = templates.filter(t => t.contentType === contentType);

  return (
    <div className="space-y-2 animate-fade-in">
      {/* Header Items */}
      {headers.map((header, index) => (
        <div key={header.id}>
          <div 
            className={cn(
              "group flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all duration-200",
              "hover:bg-muted/40",
              header.level === 'h2' && "ml-4",
              header.level === 'h3' && "ml-8"
            )}
          >
            {/* Drag Handle */}
            <GripVertical className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            
            {/* Level Badge */}
            <span className={cn(
              "text-[9px] font-mono uppercase w-6 flex-shrink-0 text-center py-0.5 rounded",
              header.level === 'h1' ? "bg-primary/10 text-primary" : "text-muted-foreground/60"
            )}>
              {header.level}
            </span>
            
            {/* Text Content */}
            {editingId === header.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="flex-1 bg-muted/50 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 text-success hover:bg-success/10 rounded transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-muted-foreground hover:bg-muted rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleStartEdit(header)}
                  className="flex-1 text-left text-sm truncate hover:text-primary transition-colors"
                >
                  {header.text}
                </button>
                
                {/* Optimized Indicator */}
                {header.isOptimized && (
                  <div className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Add buttons */}
                  {header.level === 'h1' && (
                    <button
                      onClick={() => handleAddHeader(header.id, 'h2')}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      title="Add H2"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                  {header.level === 'h2' && (
                    <>
                      <button
                        onClick={() => handleAddHeader(header.id, 'h2')}
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                        title="Add H2"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleAddHeader(header.id, 'h3')}
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors text-[9px] font-mono"
                        title="Add H3"
                      >
                        +H3
                      </button>
                    </>
                  )}
                  {header.level === 'h3' && (
                    <button
                      onClick={() => handleAddHeader(header.id, 'h3')}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      title="Add H3"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                  
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(header.id)}
                    className={cn(
                      "p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors",
                      header.level === 'h1' && headers.filter(h => h.level === 'h1').length <= 1 && "opacity-30 pointer-events-none"
                    )}
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Add New Row (appears after this header) */}
          {addingNew?.afterId === header.id && (
            <div className={cn(
              "flex items-center gap-2 py-1.5 px-2 ml-2 animate-fade-in",
              addingNew.level === 'h2' && "ml-6",
              addingNew.level === 'h3' && "ml-10"
            )}>
              <span className="text-[9px] font-mono uppercase w-6 flex-shrink-0 text-center py-0.5 rounded bg-primary/20 text-primary">
                {addingNew.level}
              </span>
              <input
                type="text"
                value={newHeaderText}
                onChange={(e) => setNewHeaderText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmAdd();
                  if (e.key === 'Escape') handleCancelAdd();
                }}
                placeholder={`New ${addingNew.level.toUpperCase()} heading...`}
                className="flex-1 bg-muted/50 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                autoFocus
              />
              <button
                onClick={handleConfirmAdd}
                disabled={!newHeaderText.trim()}
                className="p-1 text-success hover:bg-success/10 rounded transition-colors disabled:opacity-30"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCancelAdd}
                className="p-1 text-muted-foreground hover:bg-muted rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Template Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/30 mt-3">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Save className="w-3 h-3" />
          Save as template
        </button>
        
        {filteredTemplates.length > 0 && (
          <button
            onClick={() => setShowLoadDialog(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <FolderOpen className="w-3 h-3" />
            Load template
          </button>
        )}
      </div>

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl animate-scale-in">
            <h3 className="text-sm font-medium mb-4">Save as Template</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name..."
              className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsTemplate}
                disabled={!templateName.trim()}
                className="px-4 py-2 text-sm bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Template Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl animate-scale-in">
            <h3 className="text-sm font-medium mb-4">Load Template</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onLoadTemplate(template);
                    setShowLoadDialog(false);
                  }}
                  className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{template.name}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {template.headers.length} headers
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowLoadDialog(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
