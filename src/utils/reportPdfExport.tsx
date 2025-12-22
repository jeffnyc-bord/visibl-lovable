import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { ReportBlock } from '@/components/reports/ReportEditor';

interface ReportPDFConfig {
  blocks: ReportBlock[];
  reportTitle: string;
  dateRange: { start: Date; end: Date };
  showPageNumbers: boolean;
  customLogo?: string;
  brandName?: string;
}

// Clean, Apple-inspired PDF styles
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
    padding: 60,
    fontFamily: 'Helvetica',
    justifyContent: 'space-between',
    height: '100%',
  },
  coverContent: {
    flex: 1,
    justifyContent: 'center',
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: 'light',
    color: '#1d1d1f',
    marginBottom: 20,
    letterSpacing: -1,
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#86868b',
    marginBottom: 8,
  },
  coverDate: {
    fontSize: 12,
    color: '#86868b',
    marginTop: 40,
  },
  coverLogo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
    marginBottom: 40,
  },
  pageNumber: {
    fontSize: 11,
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
    left: 60,
    right: 60,
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

// Cover Page Component
const CoverPage = ({ 
  reportTitle, 
  dateRange, 
  customLogo, 
  brandName,
  showPageNumbers 
}: { 
  reportTitle: string;
  dateRange: { start: Date; end: Date };
  customLogo?: string;
  brandName?: string;
  showPageNumbers: boolean;
}) => (
  <Page size="A4" style={styles.coverPage}>
    <View style={styles.coverContent}>
      {customLogo && (
        <Image style={styles.coverLogo} src={customLogo} />
      )}
      <Text style={styles.coverTitle}>{reportTitle}</Text>
      <Text style={styles.coverSubtitle}>
        {brandName || 'AI Visibility Report'}
      </Text>
      <Text style={styles.coverDate}>
        Report Period: {dateRange.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — {dateRange.end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </Text>
      <Text style={styles.coverDate}>
        Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </Text>
    </View>
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

export type { ReportPDFConfig };
