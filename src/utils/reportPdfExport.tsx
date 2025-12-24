import { Document, Page, Text, View, StyleSheet, pdf, Image, Svg, Rect, G } from '@react-pdf/renderer';
import { ReportBlock } from '@/components/reports/ReportEditor';

// AI Platform logos as base64 or URLs - using public paths since @react-pdf works better with URLs
const platformLogoUrls: Record<string, string> = {
  chatgpt: '/lovable-uploads/chatGPT_logo.png',
  gemini: '/lovable-uploads/gemini_logo.png',
  claude: '/lovable-uploads/claude_logo.png',
  perplexity: '/lovable-uploads/perplexity_logo.png',
  grok: '/lovable-uploads/grok_logo_new.png',
};

interface PlatformData {
  id: string;
  name: string;
  mentions: number;
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

interface ReportPDFConfig {
  blocks: ReportBlock[];
  reportTitle: string;
  dateRange: { start: Date; end: Date };
  showPageNumbers: boolean;
  customLogo?: string;
  brandName?: string;
  sections?: SectionData;
  platforms?: PlatformData[];
}

// Mock trend data matching preview
const trendData = [35, 42, 38, 51, 49, 62, 58, 71, 68, 79, 85, 87];

// Clean, Apple-inspired PDF styles with Google Sans feel
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 60,
    fontFamily: 'Helvetica',
  },
  // Cover page styles
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 48,
    fontFamily: 'Helvetica',
    height: '100%',
  },
  coverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  coverContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'light',
    color: '#1d1d1f',
    marginBottom: 12,
    letterSpacing: -1,
  },
  coverSubtitle: {
    fontSize: 12,
    color: '#86868b',
    marginBottom: 8,
  },
  coverDate: {
    fontSize: 10,
    color: '#86868b',
  },
  coverLogo: {
    width: 100,
    height: 32,
    objectFit: 'contain',
  },
  pageNumber: {
    fontSize: 10,
    color: '#86868b',
  },
  // Score Section
  scoreSection: {
    marginBottom: 32,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'light',
    color: '#1d1d1f',
    letterSpacing: -2,
  },
  scoreTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 10,
  },
  scoreTrendText: {
    fontSize: 12,
    color: '#22c55e',
  },
  // Trend Chart
  trendChartContainer: {
    height: 60,
    marginTop: 16,
    marginBottom: 8,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  chartLabel: {
    fontSize: 8,
    color: '#86868b',
  },
  // Mentions Section
  mentionsSection: {
    marginBottom: 32,
  },
  mentionsValue: {
    fontSize: 42,
    fontWeight: 'light',
    color: '#1d1d1f',
    letterSpacing: -1,
  },
  mentionsLabel: {
    fontSize: 11,
    color: '#86868b',
    marginTop: 4,
  },
  // Platform Coverage
  platformSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 9,
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  platformRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  platformLogo: {
    width: 16,
    height: 16,
    marginRight: 6,
    borderRadius: 2,
  },
  platformName: {
    fontSize: 10,
    color: '#1d1d1f',
    marginRight: 4,
  },
  platformMentions: {
    fontSize: 9,
    color: '#86868b',
  },
  // Summary footer
  summarySection: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f7',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    fontSize: 9,
    color: '#86868b',
  },
  // Content styles
  sectionBlock: {
    marginBottom: 32,
  },
  sectionType: {
    fontSize: 10,
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'light',
    color: '#1d1d1f',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  sectionBody: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#515154',
  },
  // Text block
  textBlock: {
    marginBottom: 24,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  textBody: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#515154',
  },
  // Stat block
  statBlock: {
    marginBottom: 32,
    paddingVertical: 20,
  },
  statValue: {
    fontSize: 48,
    fontWeight: 'light',
    color: '#1d1d1f',
    letterSpacing: -2,
  },
  statLabel: {
    fontSize: 14,
    color: '#86868b',
    marginTop: 8,
  },
  // Quote block
  quoteBlock: {
    marginBottom: 32,
    paddingLeft: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#d2d2d7',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#1d1d1f',
    lineHeight: 1.5,
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#86868b',
  },
  // Image block
  imageBlock: {
    marginBottom: 32,
  },
  image: {
    maxWidth: '100%',
    maxHeight: 300,
    objectFit: 'contain',
  },
  imageCaption: {
    fontSize: 11,
    color: '#86868b',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLogo: {
    width: 80,
    height: 24,
    objectFit: 'contain',
  },
  footerBrand: {
    fontSize: 10,
    color: '#86868b',
  },
});

// Trend Chart Component using SVG
const TrendChart = () => (
  <View style={styles.trendChartContainer}>
    <Svg width="100%" height="60" viewBox="0 0 400 60">
      <G>
        {trendData.map((value, i) => {
          const barWidth = 400 / trendData.length - 4;
          const barHeight = (value / 100) * 55;
          const x = i * (400 / trendData.length) + 2;
          const y = 55 - barHeight;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#6366f1"
              opacity={0.7 + (value / 100) * 0.3}
              rx={2}
            />
          );
        })}
      </G>
    </Svg>
    <View style={styles.chartLabels}>
      <Text style={styles.chartLabel}>Jan</Text>
      <Text style={styles.chartLabel}>Dec</Text>
    </View>
  </View>
);

// Cover Page Component with visual data matching preview
const CoverPage = ({ 
  reportTitle, 
  dateRange, 
  customLogo, 
  brandName,
  showPageNumbers,
  sections,
  platforms
}: { 
  reportTitle: string;
  dateRange: { start: Date; end: Date };
  customLogo?: string;
  brandName?: string;
  showPageNumbers: boolean;
  sections?: SectionData;
  platforms?: PlatformData[];
}) => {
  const formatDate = (date: Date) => 
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Page size="A4" style={styles.coverPage}>
      {/* Header */}
      <View style={styles.coverHeader}>
        {customLogo ? (
          <Image style={styles.coverLogo} src={customLogo} />
        ) : (
          <Text style={styles.coverDate}>{brandName}</Text>
        )}
        <Text style={styles.coverDate}>
          {formatDate(dateRange.start)} — {formatDate(dateRange.end)}
        </Text>
      </View>

      {/* Title */}
      <View style={styles.coverContent}>
        <Text style={styles.coverTitle}>{reportTitle}</Text>
        <Text style={styles.coverSubtitle}>
          AI Visibility Report • {brandName || 'Brand Report'}
        </Text>

        {/* Score Section with Trend Chart */}
        {sections?.score.enabled && (
          <View style={styles.scoreSection}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>87</Text>
              <View style={styles.scoreTrend}>
                <Text style={styles.scoreTrendText}>▲ +5 pts</Text>
              </View>
            </View>
            <TrendChart />
          </View>
        )}

        {/* Mentions */}
        {sections?.mentions.enabled && (
          <View style={styles.mentionsSection}>
            <Text style={styles.mentionsValue}>12,847</Text>
            <Text style={styles.mentionsLabel}>total brand mentions across AI platforms</Text>
          </View>
        )}

        {/* Platform Coverage with Logos */}
        {(sections?.platformCoverage.items?.length || 0) > 0 && platforms && (
          <View style={styles.platformSection}>
            <Text style={styles.sectionLabel}>Platform Coverage</Text>
            <View style={styles.platformRow}>
              {sections?.platformCoverage.items?.slice(0, 5).map((platformId) => {
                const platform = platforms.find(p => p.id === platformId);
                if (!platform) return null;
                const logoUrl = platformLogoUrls[platformId];
                return (
                  <View key={platformId} style={styles.platformPill}>
                    {logoUrl && (
                      <Image style={styles.platformLogo} src={logoUrl} />
                    )}
                    <Text style={styles.platformName}>{platform.name}</Text>
                    <Text style={styles.platformMentions}>{(platform.mentions / 1000).toFixed(1)}k</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Summary Footer */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          {(sections?.prompts.items?.length || 0) > 0 && (
            <Text style={styles.summaryItem}>{sections?.prompts.items?.length} prompts</Text>
          )}
          {(sections?.products.items?.length || 0) > 0 && (
            <Text style={styles.summaryItem}>{sections?.products.items?.length} products</Text>
          )}
          {(sections?.optimizations.items?.length || 0) > 0 && (
            <Text style={styles.summaryItem}>{sections?.optimizations.items?.length} optimizations</Text>
          )}
          {(sections?.actions.items?.length || 0) > 0 && (
            <Text style={styles.summaryItem}>{sections?.actions.items?.length} actions</Text>
          )}
        </View>
      </View>

      {/* Page Number */}
      {showPageNumbers && (
        <View style={styles.footer}>
          {customLogo ? (
            <Image style={styles.footerLogo} src={customLogo} />
          ) : (
            <Text style={styles.footerBrand}>{brandName || ''}</Text>
          )}
          <Text style={styles.pageNumber}>01</Text>
        </View>
      )}
    </Page>
  );
};

// Block Renderers
const SectionBlockPDF = ({ block }: { block: ReportBlock }) => (
  <View style={styles.sectionBlock}>
    {block.content.sectionType && (
      <Text style={styles.sectionType}>{block.content.sectionType}</Text>
    )}
    {block.content.title && (
      <Text style={styles.sectionTitle}>{block.content.title}</Text>
    )}
    {block.content.body && (
      <Text style={styles.sectionBody}>{block.content.body}</Text>
    )}
  </View>
);

const TextBlockPDF = ({ block }: { block: ReportBlock }) => (
  <View style={styles.textBlock}>
    {block.content.title && (
      <Text style={styles.textTitle}>{block.content.title}</Text>
    )}
    {block.content.body && (
      <Text style={styles.textBody}>{block.content.body}</Text>
    )}
  </View>
);

const StatBlockPDF = ({ block }: { block: ReportBlock }) => (
  <View style={styles.statBlock}>
    <Text style={styles.statValue}>{block.content.statValue}</Text>
    <Text style={styles.statLabel}>{block.content.statLabel}</Text>
  </View>
);

const QuoteBlockPDF = ({ block }: { block: ReportBlock }) => (
  <View style={styles.quoteBlock}>
    <Text style={styles.quoteText}>"{block.content.quoteText}"</Text>
    {block.content.quoteAuthor && (
      <Text style={styles.quoteAuthor}>— {block.content.quoteAuthor}</Text>
    )}
  </View>
);

const ImageBlockPDF = ({ block }: { block: ReportBlock }) => (
  <View style={styles.imageBlock}>
    {block.content.imageUrl && (
      <Image style={styles.image} src={block.content.imageUrl} />
    )}
    {block.content.imageCaption && (
      <Text style={styles.imageCaption}>{block.content.imageCaption}</Text>
    )}
  </View>
);

// Render a block based on its type
const renderBlock = (block: ReportBlock) => {
  switch (block.type) {
    case 'section':
      return <SectionBlockPDF key={block.id} block={block} />;
    case 'text':
      return <TextBlockPDF key={block.id} block={block} />;
    case 'stat':
      return <StatBlockPDF key={block.id} block={block} />;
    case 'quote':
      return <QuoteBlockPDF key={block.id} block={block} />;
    case 'image':
      return <ImageBlockPDF key={block.id} block={block} />;
    default:
      return null;
  }
};

// Content Page Component
const ContentPage = ({ 
  blocks, 
  pageNumber, 
  showPageNumbers,
  customLogo,
  brandName
}: { 
  blocks: ReportBlock[];
  pageNumber: number;
  showPageNumbers: boolean;
  customLogo?: string;
  brandName?: string;
}) => (
  <Page size="A4" style={styles.page}>
    <View>
      {blocks.map(block => renderBlock(block))}
    </View>
    {showPageNumbers && (
      <View style={styles.footer} fixed>
        {customLogo ? (
          <Image style={styles.footerLogo} src={customLogo} />
        ) : (
          <Text style={styles.footerBrand}>{brandName || ''}</Text>
        )}
        <Text style={styles.pageNumber}>
          {String(pageNumber).padStart(2, '0')}
        </Text>
      </View>
    )}
  </Page>
);

// Split blocks into pages (rough estimation - about 4-5 blocks per page)
const splitBlocksIntoPages = (blocks: ReportBlock[]): ReportBlock[][] => {
  const pages: ReportBlock[][] = [];
  let currentPage: ReportBlock[] = [];
  let currentWeight = 0;

  blocks.forEach(block => {
    // Estimate weight based on block type
    let weight = 1;
    switch (block.type) {
      case 'section':
        weight = 2;
        break;
      case 'stat':
        weight = 1.5;
        break;
      case 'quote':
        weight = 1.5;
        break;
      case 'image':
        weight = 3;
        break;
      case 'text':
        // Estimate based on content length
        const textLength = (block.content.body?.length || 0) + (block.content.title?.length || 0);
        weight = Math.max(1, Math.min(3, textLength / 200));
        break;
    }

    if (currentWeight + weight > 5 && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [block];
      currentWeight = weight;
    } else {
      currentPage.push(block);
      currentWeight += weight;
    }
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

// Main PDF Document
const ReportPDFDocument = ({ config }: { config: ReportPDFConfig }) => {
  const blockPages = splitBlocksIntoPages(config.blocks);

  return (
    <Document>
      <CoverPage
        reportTitle={config.reportTitle}
        dateRange={config.dateRange}
        customLogo={config.customLogo}
        brandName={config.brandName}
        showPageNumbers={config.showPageNumbers}
        sections={config.sections}
        platforms={config.platforms}
      />
      {blockPages.map((pageBlocks, index) => (
        <ContentPage
          key={index}
          blocks={pageBlocks}
          pageNumber={index + 2}
          showPageNumbers={config.showPageNumbers}
          customLogo={config.customLogo}
          brandName={config.brandName}
        />
      ))}
    </Document>
  );
};

// Export function
export const generateReportPDF = async (config: ReportPDFConfig): Promise<Blob> => {
  const doc = <ReportPDFDocument config={config} />;
  const blob = await pdf(doc).toBlob();
  return blob;
};

// Download helper
export const downloadReportPDF = async (config: ReportPDFConfig, filename?: string) => {
  const blob = await generateReportPDF(config);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${config.reportTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export type { ReportPDFConfig, SectionData, PlatformData };