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

// Clean, minimal PDF styles matching the editor preview exactly
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerLogo: {
    width: 80,
    height: 24,
    objectFit: 'contain',
  },
  headerBrand: {
    fontSize: 10,
    color: '#6b7280',
  },
  headerDate: {
    fontSize: 9,
    color: '#9ca3af',
  },
  // Title section
  titleSection: {
    marginBottom: 32,
  },
  reportTitle: {
    fontSize: 28,
    fontWeight: 'light',
    color: '#1f2937',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  reportSubtitle: {
    fontSize: 11,
    color: '#6b7280',
  },
  // Section block - matches editor SectionBlock
  sectionBlock: {
    marginBottom: 24,
    paddingTop: 8,
  },
  sectionType: {
    fontSize: 9,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'light',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#6b7280',
  },
  // Text block - matches editor TextBlock
  textBlock: {
    marginBottom: 20,
    paddingTop: 8,
  },
  textTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  textBody: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#6b7280',
  },
  // Stat block - matches editor StatBlock
  statBlock: {
    marginBottom: 24,
    paddingVertical: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'light',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  // Quote block - matches editor QuoteBlock
  quoteBlock: {
    marginBottom: 24,
    paddingLeft: 16,
    paddingVertical: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#d1d5db',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1f2937',
    lineHeight: 1.5,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 10,
    color: '#6b7280',
  },
  // Image block - matches editor ImageBlock
  imageBlock: {
    marginBottom: 24,
  },
  image: {
    maxWidth: '100%',
    maxHeight: 250,
    objectFit: 'contain',
  },
  imageCaption: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 8,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerBrand: {
    fontSize: 9,
    color: '#9ca3af',
  },
  pageNumber: {
    fontSize: 9,
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

// Split blocks into pages (rough estimation - about 5-6 blocks per page)
const splitBlocksIntoPages = (blocks: ReportBlock[]): ReportBlock[][] => {
  const pages: ReportBlock[][] = [];
  let currentPage: ReportBlock[] = [];
  let currentWeight = 0;

  blocks.forEach(block => {
    let weight = 1;
    switch (block.type) {
      case 'section':
        weight = 1.5;
        break;
      case 'stat':
        weight = 1.2;
        break;
      case 'quote':
        weight = 1.2;
        break;
      case 'image':
        weight = 2.5;
        break;
      case 'text':
        const textLength = (block.content.body?.length || 0) + (block.content.title?.length || 0);
        weight = Math.max(1, Math.min(2.5, textLength / 200));
        break;
    }

    if (currentWeight + weight > 6 && currentPage.length > 0) {
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
