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
          <Text style={styles.sectionTitle}>AI Visibility Score</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Overall AI Visibility Score</Text>
            <Text style={styles.metricValue}>87/100</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Monthly Growth</Text>
            <Text style={styles.metricValue}>+12.5%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Platform Coverage</Text>
            <Text style={styles.metricValue}>15/18 platforms</Text>
          </View>
          <Text style={styles.content}>
            {reportData.brandName} demonstrates strong AI visibility with consistent mentions across major platforms.
          </Text>
        </View>
      )}

      {/* AI Mentions Analysis */}
      {reportData.sections.find(s => s.id === 'ai-mentions')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Mentions Analysis</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Mentions</Text>
            <Text style={styles.metricValue}>1,247</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Positive Sentiment</Text>
            <Text style={styles.metricValue}>73%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Top Platform</Text>
            <Text style={styles.metricValue}>ChatGPT (34%)</Text>
          </View>
        </View>
      )}

      {/* Strategic Recommendations */}
      {reportData.sections.find(s => s.id === 'recommendations')?.enabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategic Recommendations</Text>
          <Text style={styles.content}>
            • Optimize product descriptions for AI-friendly formatting
          </Text>
          <Text style={styles.content}>
            • Increase structured data implementation across web properties
          </Text>
          <Text style={styles.content}>
            • Develop AI-specific content marketing strategies
          </Text>
          <Text style={styles.content}>
            • Monitor competitor AI visibility trends
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