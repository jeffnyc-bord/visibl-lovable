import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf, Image } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #3b82f6',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 4,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 10,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  platformTable: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottom: '1px solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  platformLogo: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
});

interface ReportData {
  brandName: string;
  reportTitle: string;
  dateRange: { from: Date; to: Date };
  sections: Array<{
    id: string;
    label: string;
    enabled: boolean;
  }>;
  executiveSummary?: string;
  agencyName?: string;
  // Enhanced data from dashboard
  brandData?: {
    visibilityScore: number;
    totalMentions: number;
    platformCoverage: number;
    industryRanking: number;
    mentionTrend: string;
    sentimentScore: number;
    platforms: Array<{
      name: string;
      mentions: number;
      sentiment: string;
      coverage: number;
      trend: string;
    }>;
    products: Array<{
      name: string;
      category: string;
      visibilityScore: number;
      mentions: number;
      sentiment: string;
    }>;
    competitors: Array<{
      name: string;
      visibilityScore: number;
      mentions: number;
      trend: string;
    }>;
  };
}

// PDF Document Component
const ReportPDFDocument = ({ reportData }: { reportData: ReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>{reportData.reportTitle}</Text>
          {reportData.agencyName && (
            <Text style={styles.subtitle}>Prepared by {reportData.agencyName}</Text>
          )}
        </View>
        <Text style={styles.subtitle}>
          Report Period: {reportData.dateRange.from.toLocaleDateString()} - {reportData.dateRange.to.toLocaleDateString()}
        </Text>
        <Text style={styles.subtitle}>Generated on: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Executive Summary */}
      {reportData.sections.find(s => s.id === 'executive-summary')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.content}>
            {reportData.executiveSummary || 
            `This comprehensive AI visibility report for ${reportData.brandName} provides insights into brand performance across major AI platforms. The analysis covers key metrics, competitive positioning, and strategic recommendations for optimizing AI discoverability.`}
          </Text>
        </View>
      )}

      {/* AI Visibility Score */}
      {reportData.sections.find(s => s.id === 'ai-visibility-score')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Visibility Overview</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Overall AI Visibility Score</Text>
            <Text style={styles.metricValue}>{reportData.brandData?.visibilityScore || 87}/100</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total AI Mentions</Text>
            <Text style={styles.metricValue}>{reportData.brandData?.totalMentions?.toLocaleString() || '1,247'}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Platform Coverage</Text>
            <Text style={styles.metricValue}>{reportData.brandData?.platformCoverage || 89}% coverage</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Industry Ranking</Text>
            <Text style={styles.metricValue}>#{reportData.brandData?.industryRanking || 2}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Sentiment Score</Text>
            <Text style={styles.metricValue}>{reportData.brandData?.sentimentScore || 78}%</Text>
          </View>
          <Text style={styles.content}>
            {reportData.brandName} demonstrates strong AI visibility with consistent mentions across major AI platforms including ChatGPT, Claude, Gemini, and Perplexity.
          </Text>
        </View>
      )}

      {/* Platform Breakdown with Enhanced Visuals */}
      {reportData.sections.find(s => s.id === 'platform-analysis')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Platform Mention Distribution</Text>
          <Text style={styles.content}>
            Comprehensive analysis of brand mentions across leading AI platforms with visual breakdown and detailed metrics.
          </Text>

          {/* Platform Metrics Table */}
          <View style={styles.platformTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Platform</Text>
              <Text style={styles.tableCellHeader}>Mentions</Text>
              <Text style={styles.tableCellHeader}>Sentiment</Text>
              <Text style={styles.tableCellHeader}>Coverage</Text>
              <Text style={styles.tableCellHeader}>Trend</Text>
            </View>
            
            {/* Platform Data Rows */}
            <View style={styles.tableRow}>
              <View style={styles.platformRow}>
                <Image style={styles.platformLogo} src="/lovable-uploads/84b583a1-fe3d-4393-ae0a-df3ec0dbd01d.png" />
                <Text style={styles.tableCell}>ChatGPT</Text>
              </View>
              <Text style={styles.tableCell}>4,234</Text>
              <Text style={styles.tableCell}>Positive</Text>
              <Text style={styles.tableCell}>92%</Text>
              <Text style={styles.tableCell}>+12%</Text>
            </View>
            
            
            <View style={styles.tableRow}>
              <View style={styles.platformRow}>
                <Image style={styles.platformLogo} src="/lovable-uploads/20ab85cf-422a-46f0-a62a-26fe3db14680.png" />
                <Text style={styles.tableCell}>Gemini</Text>
              </View>
              <Text style={styles.tableCell}>2,847</Text>
              <Text style={styles.tableCell}>Neutral</Text>
              <Text style={styles.tableCell}>84%</Text>
              <Text style={styles.tableCell}>+18%</Text>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.platformRow}>
                <Image style={styles.platformLogo} src="/lovable-uploads/921c76c7-1c98-41d6-a192-8308c4b7fd49.png" />
                <Text style={styles.tableCell}>Perplexity</Text>
              </View>
              <Text style={styles.tableCell}>2,310</Text>
              <Text style={styles.tableCell}>Positive</Text>
              <Text style={styles.tableCell}>91%</Text>
              <Text style={styles.tableCell}>+22%</Text>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.platformRow}>
                <Image style={styles.platformLogo} src="/lovable-uploads/771fa115-94bb-4581-ae07-0733d1e93498.png" />
                <Text style={styles.tableCell}>Grok</Text>
              </View>
              <Text style={styles.tableCell}>1,892</Text>
              <Text style={styles.tableCell}>Positive</Text>
              <Text style={styles.tableCell}>78%</Text>
              <Text style={styles.tableCell}>+15%</Text>
            </View>
          </View>


          {/* Fallback to dynamic data if available */}
          {reportData.brandData?.platforms?.map((platform, index) => (
            <View key={index} style={styles.section}>
              <Text style={[styles.content, { fontWeight: 'bold', marginBottom: 4 }]}>
                {platform.name}
              </Text>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Mentions</Text>
                <Text style={styles.metricValue}>{platform.mentions.toLocaleString()}</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Sentiment</Text>
                <Text style={styles.metricValue}>{platform.sentiment}</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Coverage</Text>
                <Text style={styles.metricValue}>{platform.coverage}%</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Trend</Text>
                <Text style={styles.metricValue}>{platform.trend}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Product Analysis */}
      {reportData.sections.find(s => s.id === 'product-analysis')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product & Brand Analysis</Text>
          <Text style={styles.content}>
            AI readiness and visibility analysis of your key products and services:
          </Text>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Overall Product AI Readiness</Text>
            <Text style={styles.metricValue}>82%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Products Analyzed</Text>
            <Text style={styles.metricValue}>1,247</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>AI-Ready Products</Text>
            <Text style={styles.metricValue}>156 (90-100% score)</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Need Attention</Text>
            <Text style={styles.metricValue}>89 products (&lt;70% score)</Text>
          </View>

          {reportData.brandData?.products && reportData.brandData.products.length > 0 && (
            <>
              <Text style={[styles.content, { fontWeight: 'bold', marginTop: 12, marginBottom: 8 }]}>
                Top Performing Products:
              </Text>
              {reportData.brandData.products.slice(0, 5).map((product, index) => (
                <View key={index} style={styles.metricRow}>
                  <Text style={styles.metricLabel}>{product.name}</Text>
                  <Text style={styles.metricValue}>{product.visibilityScore}% | {product.mentions} mentions</Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}

      {/* Competitor Analysis */}
      {reportData.sections.find(s => s.id === 'competitor-analysis')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competitive Landscape</Text>
          <Text style={styles.content}>
            Analysis of your competitive position in AI platforms:
          </Text>
          
          {reportData.brandData?.competitors && reportData.brandData.competitors.length > 0 ? (
            reportData.brandData.competitors.map((competitor, index) => (
              <View key={index} style={styles.metricRow}>
                <Text style={styles.metricLabel}>{competitor.name}</Text>
                <Text style={styles.metricValue}>Score: {competitor.visibilityScore} | Mentions: {competitor.mentions.toLocaleString()} | Trend: {competitor.trend}</Text>
              </View>
            ))
          ) : (
            <>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Adidas</Text>
                <Text style={styles.metricValue}>Score: 84 | Mentions: 11,234 | Trend: +5%</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Puma</Text>
                <Text style={styles.metricValue}>Score: 72 | Mentions: 8,456 | Trend: -2%</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Under Armour</Text>
                <Text style={styles.metricValue}>Score: 68 | Mentions: 6,789 | Trend: +3%</Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* Technical Health */}
      {reportData.sections.find(s => s.id === 'technical-health')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical AI Optimization</Text>
          <Text style={styles.content}>
            Technical analysis of your website's AI crawlability and optimization:
          </Text>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Schema Markup Coverage</Text>
            <Text style={styles.metricValue}>78% implemented</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Structured Data Quality</Text>
            <Text style={styles.metricValue}>Good (minor issues found)</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>AI-Friendly Content Format</Text>
            <Text style={styles.metricValue}>85% compliance</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Crawl Accessibility</Text>
            <Text style={styles.metricValue}>Excellent</Text>
          </View>
          
          <Text style={styles.content}>
            Key recommendations: Implement Product schema on remaining pages, optimize FAQ sections for AI parsing, and improve content structure for better AI comprehension.
          </Text>
        </View>
      )}

      {/* Top Prompts Analysis */}
      {reportData.sections.find(s => s.id === 'top-prompts')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top AI Prompts & Queries</Text>
          <Text style={styles.content}>
            Most frequent prompts and queries mentioning your brand across AI platforms:
          </Text>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginBottom: 8 }]}>
            ChatGPT Top Prompts:
          </Text>
          <Text style={styles.content}>
            • "What are the best Nike running shoes for marathons?" (2,847 queries)
          </Text>
          <Text style={styles.content}>
            • "Compare Nike Air Max vs Nike React technology" (1,923 queries)
          </Text>
          <Text style={styles.content}>
            • "Nike sustainability initiatives and environmental impact" (1,456 queries)
          </Text>
          <Text style={styles.content}>
            • "History of Nike brand and its iconic swoosh logo" (1,234 queries)
          </Text>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginTop: 12, marginBottom: 8 }]}>
            Gemini Top Prompts:
          </Text>
          <Text style={styles.content}>
            • "Nike financial performance and stock analysis" (1,892 queries)
          </Text>
          <Text style={styles.content}>
            • "Nike vs Adidas market share comparison" (1,567 queries)
          </Text>
          <Text style={styles.content}>
            • "Nike innovation in athletic wear technology" (1,234 queries)
          </Text>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginTop: 12, marginBottom: 8 }]}>
            Perplexity Top Prompts:
          </Text>
          <Text style={styles.content}>
            • "Nike endorsement deals with athletes and impact on sales" (987 queries)
          </Text>
          <Text style={styles.content}>
            • "Nike manufacturing locations and supply chain" (834 queries)
          </Text>
          <Text style={styles.content}>
            • "Nike digital transformation and e-commerce strategy" (756 queries)
          </Text>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginTop: 12, marginBottom: 8 }]}>
            Grok Top Prompts:
          </Text>
          <Text style={styles.content}>
            • "Nike marketing campaigns and brand positioning" (678 queries)
          </Text>
          <Text style={styles.content}>
            • "Nike size guide and fit recommendations" (534 queries)
          </Text>
          <Text style={styles.content}>
            • "Nike collaborations with designers and brands" (423 queries)
          </Text>
        </View>
      )}

      {/* Financial Impact Projections */}
      {reportData.sections.find(s => s.id === 'financial-projections')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Impact Projections</Text>
          <Text style={styles.content}>
            Estimated financial impact based on AI platform visibility and search volume analysis for Nike:
          </Text>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginBottom: 8 }]}>
            ChatGPT Search Volume Impact:
          </Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Estimated Monthly ChatGPT Searches</Text>
            <Text style={styles.metricValue}>2.4M queries</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Conversion Rate</Text>
            <Text style={styles.metricValue}>0.85%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Estimated Monthly Conversions</Text>
            <Text style={styles.metricValue}>20,400 customers</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Order Value</Text>
            <Text style={styles.metricValue}>$127</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Monthly Revenue from ChatGPT</Text>
            <Text style={styles.metricValue}>$2.59M</Text>
          </View>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginTop: 16, marginBottom: 8 }]}>
            Cross-Platform Revenue Projections:
          </Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>ChatGPT (35% of AI traffic)</Text>
            <Text style={styles.metricValue}>$2.59M/month</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Gemini (28% of AI traffic)</Text>
            <Text style={styles.metricValue}>$2.07M/month</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Perplexity (22% of AI traffic)</Text>
            <Text style={styles.metricValue}>$1.63M/month</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Grok (15% of AI traffic)</Text>
            <Text style={styles.metricValue}>$1.11M/month</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { fontWeight: 'bold', fontSize: 14 }]}>Total Monthly AI Revenue</Text>
            <Text style={[styles.metricValue, { fontWeight: 'bold', fontSize: 14 }]}>$7.40M</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { fontWeight: 'bold', fontSize: 14 }]}>Projected Annual AI Revenue</Text>
            <Text style={[styles.metricValue, { fontWeight: 'bold', fontSize: 14 }]}>$88.8M</Text>
          </View>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginTop: 16, marginBottom: 8 }]}>
            Growth Opportunity Analysis:
          </Text>
          <Text style={styles.content}>
            • Improving AI visibility by 15% could generate an additional $13.3M annually
          </Text>
          <Text style={styles.content}>
            • Optimizing for emerging platforms (Grok, others) represents $25M+ opportunity
          </Text>
          <Text style={styles.content}>
            • Enhanced product descriptions could increase conversion rate by 0.2% (+$21M annually)
          </Text>
          <Text style={styles.content}>
            • Cross-platform optimization strategy could yield 25-35% revenue increase
          </Text>
          
          <Text style={styles.content}>
            Note: Projections based on current market data, brand performance metrics, and AI platform analytics. Actual results may vary based on market conditions and optimization efforts.
          </Text>
        </View>
      )}

      {/* Strategic Recommendations */}
      {reportData.sections.find(s => s.id === 'recommendations')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategic Recommendations</Text>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginBottom: 4 }]}>
            Platform-Specific Optimizations:
          </Text>
          <Text style={styles.content}>
            • ChatGPT: Enhance product descriptions with specific use cases and benefits
          </Text>
          <Text style={styles.content}>
            • Claude: Implement comprehensive FAQ sections for better context understanding  
          </Text>
          <Text style={styles.content}>
            • Gemini: Optimize for visual content and multimedia descriptions
          </Text>
          <Text style={styles.content}>
            • Perplexity: Focus on authoritative source citations and references
          </Text>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginTop: 8, marginBottom: 4 }]}>
            Technical Improvements:
          </Text>
          <Text style={styles.content}>
            • Implement missing Product and Organization schema markup
          </Text>
          <Text style={styles.content}>
            • Optimize content structure for AI parsing and understanding
          </Text>
          <Text style={styles.content}>
            • Develop AI-specific content marketing strategies
          </Text>
          <Text style={styles.content}>
            • Monitor competitor AI visibility trends and adjust strategy accordingly
          </Text>
          
          <Text style={[styles.content, { fontWeight: 'bold', marginTop: 8, marginBottom: 4 }]}>
            Content Strategy:
          </Text>
          <Text style={styles.content}>
            • Create comprehensive product guides and comparison content
          </Text>
          <Text style={styles.content}>
            • Develop use-case driven content for different customer segments
          </Text>
          <Text style={styles.content}>
            • Implement regular content audits for AI platform optimization
          </Text>
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>
        {reportData.agencyName ? `${reportData.agencyName} • ` : ''}AI Visibility Report • Confidential
      </Text>
    </Page>
  </Document>
);

export const generatePDF = async (reportData: ReportData): Promise<Blob> => {
  const pdfDoc = <ReportPDFDocument reportData={reportData} />;
  const blob = await pdf(pdfDoc).toBlob();
  return blob;
};

export const downloadPDF = (reportData: ReportData, filename: string) => {
  generatePDF(reportData).then(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};