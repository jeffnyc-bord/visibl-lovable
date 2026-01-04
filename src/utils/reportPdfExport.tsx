import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { ReportBlock } from '@/components/reports/ReportEditor';

interface ReportPDFConfig {
  blocks: ReportBlock[];
  reportTitle: string;
  dateRange: { start: Date; end: Date };
  showPageNumbers?: boolean;
  customLogo?: string;
  brandName?: string;
}

// Clean, compact PDF styles matching the editor preview
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerLogo: {
    width: 60,
    height: 20,
    objectFit: 'contain',
  },
  headerBrand: {
    fontSize: 9,
    color: '#6b7280',
  },
  headerDate: {
    fontSize: 8,
    color: '#9ca3af',
  },
  // Title section
  titleSection: {
    marginBottom: 16,
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: 'light',
    color: '#1f2937',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  reportSubtitle: {
    fontSize: 9,
    color: '#6b7280',
  },
  // Section block - compact
  sectionBlock: {
    marginBottom: 12,
    paddingTop: 4,
  },
  sectionType: {
    fontSize: 7,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'light',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#6b7280',
  },
  // Text block - compact
  textBlock: {
    marginBottom: 10,
    paddingTop: 4,
  },
  textTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  textBody: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#6b7280',
  },
  // Stat block - compact
  statBlock: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'light',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  // Quote block - compact
  quoteBlock: {
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#d1d5db',
  },
  quoteText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#1f2937',
    lineHeight: 1.4,
    marginBottom: 3,
  },
  quoteAuthor: {
    fontSize: 8,
    color: '#6b7280',
  },
  // Image block - compact
  imageBlock: {
    marginBottom: 12,
  },
  image: {
    maxWidth: '100%',
    maxHeight: 180,
    objectFit: 'contain',
  },
  imageCaption: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerBrand: {
    fontSize: 8,
    color: '#9ca3af',
  },
  pageNumber: {
    fontSize: 8,
    color: '#9ca3af',
  },
});

// Block Renderers - matching editor exactly
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
    <View style={styles.statRow}>
      <Text style={styles.statValue}>{block.content.statValue}</Text>
      <Text style={styles.statLabel}>{block.content.statLabel}</Text>
    </View>
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

// Split blocks into pages - more blocks per page with compact styling
const splitBlocksIntoPages = (blocks: ReportBlock[]): ReportBlock[][] => {
  const pages: ReportBlock[][] = [];
  let currentPage: ReportBlock[] = [];
  let currentWeight = 0;

  blocks.forEach(block => {
    let weight = 0.8;
    switch (block.type) {
      case 'section':
        weight = 1;
        break;
      case 'stat':
        weight = 0.8;
        break;
      case 'quote':
        weight = 0.7;
        break;
      case 'image':
        weight = 2;
        break;
      case 'text':
        const textLength = (block.content.body?.length || 0) + (block.content.title?.length || 0);
        weight = Math.max(0.6, Math.min(2, textLength / 300));
        break;
    }

    if (currentWeight + weight > 8 && currentPage.length > 0) {
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

// Main PDF Document - standardized format matching editor
const ReportPDFDocument = ({ config }: { config: ReportPDFConfig }) => {
  const formatDate = (date: Date) => 
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const blockPages = splitBlocksIntoPages(config.blocks);
  const showPageNumbers = config.showPageNumbers !== false;

  return (
    <Document>
      {blockPages.map((pageBlocks, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header - only on first page */}
          {pageIndex === 0 && (
            <>
              <View style={styles.header}>
                {config.customLogo ? (
                  <Image style={styles.headerLogo} src={config.customLogo} />
                ) : (
                  <Text style={styles.headerBrand}>{config.brandName || 'Report'}</Text>
                )}
                <Text style={styles.headerDate}>
                  {formatDate(config.dateRange.start)} — {formatDate(config.dateRange.end)}
                </Text>
              </View>

              {/* Title */}
              <View style={styles.titleSection}>
                <Text style={styles.reportTitle}>{config.reportTitle}</Text>
                <Text style={styles.reportSubtitle}>
                  AI Visibility Report • {config.brandName || 'Brand'}
                </Text>
              </View>
            </>
          )}

          {/* Content blocks */}
          <View>
            {pageBlocks.map(block => renderBlock(block))}
          </View>

          {/* Footer with page number */}
          {showPageNumbers && (
            <View style={styles.footer} fixed>
              <Text style={styles.footerBrand}>{config.brandName || ''}</Text>
              <Text style={styles.pageNumber}>
                Page {pageIndex + 1} of {blockPages.length}
              </Text>
            </View>
          )}
        </Page>
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

export type { ReportPDFConfig };
