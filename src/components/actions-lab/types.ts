export interface Recommendation {
  id: string;
  title: string;
  plainTitle: string;
  category: 'on-site' | 'off-site' | 'pr-social';
  subcategory: 'quick-wins' | 'foundations' | 'advanced';
  businessImpact: string;
  effort: 'Low' | 'Medium' | 'High';
  whatToChange: string;
  contextNote?: string;
  whyItMatters: string;
  technicalDetails?: {
    currentTitle?: string;
    currentH1?: string;
    currentUrl?: string;
    currentAltText?: string;
    internalLinks?: string[];
    schema?: string;
  };
  tags: string[];
  aiVisibilityIncrease: number;
  contentStudioTemplate?: string;
  priority?: 'do-first' | 'this-week' | 'later';
  hasDraft?: boolean;
}

export interface StrategyKPI {
  label: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change?: number;
}

export interface FilterState {
  goal: 'all' | 'demos' | 'calls' | 'visits';
  channel: 'all' | 'site' | 'pr' | 'social';
  effort: 'all' | 'low' | 'medium' | 'high';
}

export type TabType = 'on-site' | 'off-site' | 'pr-social';
export type SubcategoryType = 'quick-wins' | 'foundations' | 'advanced';
