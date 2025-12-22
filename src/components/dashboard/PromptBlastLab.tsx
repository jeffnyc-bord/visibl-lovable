import { useState } from "react";
import { Search, Sparkles, Eye, Zap, ChevronRight, Plus, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type SubmenuItem = 'generate' | 'monitor' | 'test';

interface PromptBlastLabProps {
  brandData: any;
  demoMode?: boolean;
  children?: React.ReactNode;
  monitorContent?: React.ReactNode;
  testContent?: React.ReactNode;
}

// Discovery question templates for different journey stages
const journeyStages = [
  {
    id: 'awareness',
    label: 'Awareness Stage',
    description: 'Early-stage discovery prompts',
    templates: [
      'What is [problem/topic]?',
      'Why is [problem] happening?',
      'Common causes of [problem]',
    ]
  },
  {
    id: 'consideration',
    label: 'Consideration Stage',
    description: 'Comparison and evaluation prompts',
    templates: [
      'Best solutions for [problem]',
      '[Brand] vs [Competitor] for [use case]',
      'How to choose [product category]',
    ]
  },
  {
    id: 'decision',
    label: 'Decision Stage',
    description: 'Purchase-ready prompts',
    templates: [
      'Is [Brand/Product] worth it?',
      '[Product] reviews and experiences',
      'Where to buy [product]',
    ]
  }
];

const knowledgeLevels = [
  { id: 'beginner', label: 'Beginner', description: 'No prior knowledge' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some familiarity' },
  { id: 'expert', label: 'Expert', description: 'Deep understanding' },
];

export const PromptBlastLab = ({ 
  brandData, 
  demoMode = false,
  monitorContent,
  testContent 
}: PromptBlastLabProps) => {
  const { toast } = useToast();
  const [activeSubmenu, setActiveSubmenu] = useState<SubmenuItem>('generate');
  
  // Generate tab state
  const [brandName, setBrandName] = useState(brandData?.name || '');
  const [productCategory, setProductCategory] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>(['awareness', 'consideration', 'decision']);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['beginner', 'intermediate']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<Array<{
    prompt: string;
    stage: string;
    level: string;
  }>>([]);

  const submenuItems: Array<{ id: SubmenuItem; label: string; icon: React.ReactNode; description: string }> = [
    { 
      id: 'generate', 
      label: 'Generate', 
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Discover content gaps'
    },
    { 
      id: 'monitor', 
      label: 'Monitor', 
      icon: <Eye className="w-4 h-4" />,
      description: 'Track prompts'
    },
    { 
      id: 'test', 
      label: 'Test', 
      icon: <Zap className="w-4 h-4" />,
      description: 'AI workspace'
    },
  ];

  const toggleStage = (stageId: string) => {
    setSelectedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(s => s !== stageId)
        : [...prev, stageId]
    );
  };

  const toggleLevel = (levelId: string) => {
    setSelectedLevels(prev => 
      prev.includes(levelId) 
        ? prev.filter(l => l !== levelId)
        : [...prev, levelId]
    );
  };

  const handleGenerate = () => {
    if (!brandName.trim() || !productCategory.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the brand name and product category.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockPrompts: Array<{ prompt: string; stage: string; level: string }> = [];
      
      selectedStages.forEach(stage => {
        selectedLevels.forEach(level => {
          const stageData = journeyStages.find(s => s.id === stage);
          if (stageData) {
            // Generate 2-3 prompts per combination
            const promptCount = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < promptCount; i++) {
              const templates = [
                `What are the best ${productCategory} for ${targetAudience || 'everyday use'}?`,
                `${brandName} ${productCategory} reviews and comparisons`,
                `How does ${brandName} compare to other ${productCategory} brands?`,
                `Is ${brandName} good for ${painPoints || 'my needs'}?`,
                `Best ${productCategory} under $200 - is ${brandName} worth it?`,
                `${brandName} vs competitors for ${productCategory}`,
                `Common problems with ${productCategory} and how ${brandName} solves them`,
                `Why choose ${brandName} for ${productCategory}?`,
                `${productCategory} buying guide - ${brandName} included`,
                `Expert review: ${brandName} ${productCategory} performance`,
              ];
              
              const randomPrompt = templates[Math.floor(Math.random() * templates.length)];
              mockPrompts.push({
                prompt: randomPrompt,
                stage: stageData.label,
                level: knowledgeLevels.find(l => l.id === level)?.label || level
              });
            }
          }
        });
      });

      setGeneratedPrompts(mockPrompts);
      setIsGenerating(false);
      
      toast({
        title: "Prompts Generated",
        description: `Discovered ${mockPrompts.length} potential content gap prompts.`,
      });
    }, 2000);
  };

  return (
    <div className="flex h-full min-h-[600px]">
      {/* Left Submenu */}
      <div className="w-52 border-r border-border/50 py-6 pr-4 flex-shrink-0">
        <div className="space-y-1">
          {submenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubmenu(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activeSubmenu === item.id
                  ? 'bg-foreground/5 text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className={activeSubmenu === item.id ? 'text-foreground' : 'text-muted-foreground'}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${activeSubmenu === item.id ? '' : ''}`}>
                  {item.label}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {item.description}
                </div>
              </div>
              {activeSubmenu === item.id && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pl-8 py-6 overflow-auto">
        {/* Generate View */}
        {activeSubmenu === 'generate' && (
          <div className="max-w-3xl space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight">
                Prompt Discovery
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Uncover content gaps across the customer journey. Generate prompts based on knowledge levels and buying stages.
              </p>
            </div>

            {/* Prerequisites Form */}
            <div className="space-y-6">
              {/* Brand & Product */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Brand Name</label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., Nike"
                    className="h-10 bg-background border-border/60 focus:border-foreground/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Product Category</label>
                  <Input
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    placeholder="e.g., Running Shoes"
                    className="h-10 bg-background border-border/60 focus:border-foreground/30"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Audience</label>
                <Input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Marathon runners, casual joggers, fitness enthusiasts"
                  className="h-10 bg-background border-border/60 focus:border-foreground/30"
                />
              </div>

              {/* Pain Points */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Customer Pain Points</label>
                <Textarea
                  value={painPoints}
                  onChange={(e) => setPainPoints(e.target.value)}
                  placeholder="e.g., Foot pain during long runs, durability concerns, finding the right fit..."
                  rows={3}
                  className="resize-none bg-background border-border/60 focus:border-foreground/30"
                />
              </div>

              <Separator className="my-6" />

              {/* Journey Stages */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Customer Journey Stages</label>
                <div className="flex flex-wrap gap-2">
                  {journeyStages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => toggleStage(stage.id)}
                      className={`px-3.5 py-2 rounded-full text-sm transition-all duration-200 ${
                        selectedStages.includes(stage.id)
                          ? 'bg-foreground text-background'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Knowledge Levels */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Knowledge Levels</label>
                <div className="flex flex-wrap gap-2">
                  {knowledgeLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => toggleLevel(level.id)}
                      className={`px-3.5 py-2 rounded-full text-sm transition-all duration-200 ${
                        selectedLevels.includes(level.id)
                          ? 'bg-foreground text-background'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="h-11 px-6 bg-foreground text-background hover:bg-foreground/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Content Gaps...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Discovery Prompts
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Prompts Results */}
            {generatedPrompts.length > 0 && (
              <div className="space-y-4 pt-4">
                <Separator />
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-foreground">
                    Discovered Prompts
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {generatedPrompts.length}
                    </Badge>
                  </h3>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add All to Queue
                  </Button>
                </div>

                <div className="space-y-2">
                  {generatedPrompts.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate pr-4">
                          {item.prompt}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-muted-foreground">{item.stage}</span>
                          <span className="text-[11px] text-muted-foreground/50">•</span>
                          <span className="text-[11px] text-muted-foreground">{item.level}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => setActiveSubmenu('test')}
                        >
                          Test
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Monitor View */}
        {activeSubmenu === 'monitor' && (
          <div className="space-y-6">
            {monitorContent}
          </div>
        )}

        {/* Test View */}
        {activeSubmenu === 'test' && (
          <div className="space-y-6">
            {testContent}
          </div>
        )}
      </div>
    </div>
  );
};
