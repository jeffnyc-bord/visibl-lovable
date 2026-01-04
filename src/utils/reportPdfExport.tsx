import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { ReportBlock, BlockStyles } from '@/components/reports/ReportEditor';

interface ReportPDFConfig {
  blocks: ReportBlock[];
  reportTitle: string;
  dateRange: { start: Date; end: Date };
  showPageNumbers?: boolean;
  customLogo?: string;
  brandName?: string;
}

// Default styles matching the editor
const defaultBlockStyles: Record<string, BlockStyles> = {
  section: { fontSize: 14, lineHeight: 1.4, marginBottom: 12 },
  text: { fontSize: 11, lineHeight: 1.5, marginBottom: 10 },
  stat: { fontSize: 24, lineHeight: 1.2, marginBottom: 12 },
  quote: { fontSize: 11, lineHeight: 1.4, marginBottom: 10 },
  image: { fontSize: 10, lineHeight: 1.4, marginBottom: 12 },
};

const getBlockStyles = (block: ReportBlock): BlockStyles => {
  return block.styles || defaultBlockStyles[block.type] || defaultBlockStyles.text;
};

// Base PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
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
  titleSection: {
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'light',
    color: '#1f2937',
    marginBottom: 2,
  },
  reportSubtitle: {
    fontSize: 8,
    color: '#6b7280',
  },
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
  // Base block styles (will be overridden by inline styles)
  sectionType: {
    fontSize: 7,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  quoteContainer: {
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#d1d5db',
  },
  image: {
    maxWidth: '100%',
    maxHeight: 120,
    objectFit: 'contain',
  },
});

// Block Renderers - using block's custom styles
const SectionBlockPDF = ({ block }: { block: ReportBlock }) => {
  const s = getBlockStyles(block);
  return (
    <View style={{ marginBottom: s.marginBottom }}>
      {block.content.sectionType && (
        <Text style={styles.sectionType}>{block.content.sectionType}</Text>
      )}
      {block.content.title && (
        <Text style={{ fontSize: s.fontSize, color: '#1f2937', marginBottom: 3 }}>
          {block.content.title}
        </Text>
      )}
      {block.content.body && (
        <Text style={{ fontSize: s.fontSize * 0.7, lineHeight: s.lineHeight, color: '#6b7280' }}>
          {block.content.body}
        </Text>
      )}
    </View>
  );
};

const TextBlockPDF = ({ block }: { block: ReportBlock }) => {
  const s = getBlockStyles(block);
  return (
    <View style={{ marginBottom: s.marginBottom }}>
      {block.content.title && (
        <Text style={{ fontSize: s.fontSize + 2, fontWeight: 'bold', color: '#1f2937', marginBottom: 2 }}>
          {block.content.title}
        </Text>
      )}
      {block.content.body && (
        <Text style={{ fontSize: s.fontSize, lineHeight: s.lineHeight, color: '#6b7280' }}>
          {block.content.body}
        </Text>
      )}
    </View>
  );
};

const StatBlockPDF = ({ block }: { block: ReportBlock }) => {
  const s = getBlockStyles(block);
  return (
    <View style={{ marginBottom: s.marginBottom, flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
      <Text style={{ fontSize: s.fontSize, color: '#1f2937' }}>
        {block.content.statValue}
      </Text>
      <Text style={{ fontSize: s.fontSize * 0.4, color: '#6b7280' }}>
        {block.content.statLabel}
      </Text>
    </View>
  );
};

const QuoteBlockPDF = ({ block }: { block: ReportBlock }) => {
  const s = getBlockStyles(block);
  return (
    <View style={[styles.quoteContainer, { marginBottom: s.marginBottom }]}>
      <Text style={{ fontSize: s.fontSize, fontStyle: 'italic', lineHeight: s.lineHeight, color: '#1f2937', marginBottom: 2 }}>
        "{block.content.quoteText}"
      </Text>
      {block.content.quoteAuthor && (
        <Text style={{ fontSize: s.fontSize * 0.8, color: '#6b7280' }}>
          — {block.content.quoteAuthor}
        </Text>
      )}
    </View>
  );
};

const ImageBlockPDF = ({ block }: { block: ReportBlock }) => {
  const s = getBlockStyles(block);
  return (
    <View style={{ marginBottom: s.marginBottom }}>
      {block.content.imageUrl && (
        <Image style={styles.image} src={block.content.imageUrl} />
      )}
      {block.content.imageCaption && (
        <Text style={{ fontSize: s.fontSize, color: '#6b7280', fontStyle: 'italic', marginTop: 3 }}>
          {block.content.imageCaption}
        </Text>
      )}
    </View>
  );
};

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

// Split blocks into pages using actual block styles
const splitBlocksIntoPages = (blocks: ReportBlock[]): ReportBlock[][] => {
  const pages: ReportBlock[][] = [];
  let currentPage: ReportBlock[] = [];
  let currentHeight = 0;
  const maxHeight = 680; // Approximate usable height on A4 page

  blocks.forEach(block => {
    const s = getBlockStyles(block);
    const lineHeight = s.fontSize * s.lineHeight;
    let blockHeight = s.marginBottom;

    switch (block.type) {
      case 'section': {
        const titleLines = Math.ceil((block.content.title?.length || 0) / 50);
        const bodyLines = Math.ceil((block.content.body?.length || 0) / 70);
        blockHeight += 15 + titleLines * s.fontSize + bodyLines * (s.fontSize * 0.7);
        break;
      }
      case 'text': {
        const titleLines = block.content.title ? 1 : 0;
        const bodyLines = Math.ceil((block.content.body?.length || 0) / 70);
        blockHeight += titleLines * (s.fontSize + 4) + bodyLines * lineHeight;
        break;
      }
      case 'stat':
        blockHeight += s.fontSize + 10;
        break;
      case 'quote': {
        const lines = Math.ceil((block.content.quoteText?.length || 0) / 60);
        blockHeight += lines * lineHeight + 15;
        break;
      }
      case 'image':
        blockHeight += block.content.imageUrl ? 130 : 40;
        break;
    }

    if (currentHeight + blockHeight > maxHeight && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [block];
      currentHeight = blockHeight;
    } else {
      currentPage.push(block);
      currentHeight += blockHeight;
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
