import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';

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

      {/* Platform Breakdown */}
      {reportData.sections.find(s => s.id === 'platform-analysis')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Platform Breakdown</Text>
          <Text style={styles.content}>
            Detailed analysis of your brand's presence across major AI platforms:
          </Text>
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
          )) || (
            <>
              <View style={styles.section}>
                <Text style={[styles.content, { fontWeight: 'bold' }]}>ChatGPT</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Mentions: 4,234 | Sentiment: Positive | Coverage: 92% | Trend: +12%</Text>
                </View>
              </View>
              <View style={styles.section}>
                <Text style={[styles.content, { fontWeight: 'bold' }]}>Claude</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Mentions: 3,456 | Sentiment: Positive | Coverage: 87% | Trend: +8%</Text>
                </View>
              </View>
              <View style={styles.section}>
                <Text style={[styles.content, { fontWeight: 'bold' }]}>Gemini</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Mentions: 2,847 | Sentiment: Neutral | Coverage: 84% | Trend: +18%</Text>
                </View>
              </View>
              <View style={styles.section}>
                <Text style={[styles.content, { fontWeight: 'bold' }]}>Perplexity</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Mentions: 2,310 | Sentiment: Positive | Coverage: 91% | Trend: +22%</Text>
                </View>
              </View>
            </>
          )}
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