import { ActionsLab } from "@/components/actions-lab";

interface BrandData {
  id: string;
  name: string;
  logo: string;
  url: string;
  visibilityScore: number;
  totalMentions: number;
  platformCoverage: number;
  industryRanking: number;
  mentionTrend: string;
  sentimentScore: number;
  lastUpdated: string;
  platforms: Array<{
    name: string;
    mentions: number;
    sentiment: string;
    coverage: number;
    trend: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    category: string;
    visibilityScore: number;
    mentions: number;
    sentiment: string;
    lastOptimized: string;
  }>;
  competitors: Array<{
    name: string;
    visibilityScore: number;
    mentions: number;
    trend: string;
  }>;
}

interface RecommendationsSectionProps {
  brandData?: BrandData;
  demoMode?: boolean;
  activeSubTab?: 'on-site' | 'authority' | 'contentstudio';
  preselectedProductId?: string | null;
  returnToProductName?: string | null;
  onProductUsed?: () => void;
  onBackToProductLab?: () => void;
}

export const RecommendationsSection = ({ brandData, demoMode = false, activeSubTab = 'on-site', preselectedProductId, returnToProductName, onProductUsed, onBackToProductLab }: RecommendationsSectionProps = {}) => {
  return <ActionsLab demoMode={demoMode} activeTab={activeSubTab === 'contentstudio' ? 'on-site' : activeSubTab} preselectedProductId={preselectedProductId} returnToProductName={returnToProductName} onProductUsed={onProductUsed} onBackToProductLab={onBackToProductLab} />;
};
