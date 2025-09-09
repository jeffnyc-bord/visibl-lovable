import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';

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

export const generateWordDocument = (reportData: ReportData): Document => {
  const children: any[] = [];

  // Title Page
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: reportData.reportTitle,
          bold: true,
          size: 48,
          color: "1f2937",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `AI Visibility Report for ${reportData.brandName}`,
          size: 24,
          color: "6b7280",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Report Period: ${reportData.dateRange.from.toLocaleDateString()} - ${reportData.dateRange.to.toLocaleDateString()}`,
          size: 20,
          color: "9ca3af",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  if (reportData.agencyName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Prepared by ${reportData.agencyName}`,
            size: 20,
            color: "9ca3af",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on: ${new Date().toLocaleDateString()}`,
          size: 18,
          color: "9ca3af",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Page Break
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "", break: 1 })],
      pageBreakBefore: true,
    })
  );

  // Executive Summary
  if (reportData.sections.find(s => s.id === 'executive-summary')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Executive Summary",
            bold: true,
            size: 32,
            color: "1f2937",
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: reportData.executiveSummary || 
              `This comprehensive AI visibility report for ${reportData.brandName} provides insights into brand performance across major AI platforms. The analysis covers key metrics, competitive positioning, and strategic recommendations for optimizing AI discoverability.`,
            size: 22,
          }),
        ],
        spacing: { after: 300 },
      })
    );
  }

  // AI Visibility Score
  if (reportData.sections.find(s => s.id === 'ai-visibility-score')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "AI Visibility Score",
            bold: true,
            size: 28,
            color: "1f2937",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      })
    );

    // Metrics Table
    const metricsTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true })] })],
              width: { size: 60, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true })] })],
              width: { size: 40, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Overall AI Visibility Score" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "87/100", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Monthly Growth" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "+12.5%", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Platform Coverage" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "15/18 platforms", bold: true })] })],
            }),
          ],
        }),
      ],
    });

    children.push(metricsTable);
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${reportData.brandName} demonstrates strong AI visibility with consistent mentions across major platforms.`,
            size: 22,
          }),
        ],
        spacing: { before: 200, after: 300 },
      })
    );
  }

  // AI Mentions Analysis
  if (reportData.sections.find(s => s.id === 'ai-mentions')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "AI Mentions Analysis",
            bold: true,
            size: 28,
            color: "1f2937",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      })
    );

    const mentionsTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true })] })],
              width: { size: 60, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true })] })],
              width: { size: 40, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Total Mentions" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "1,247", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Positive Sentiment" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "73%", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Top Platform" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "ChatGPT (34%)", bold: true })] })],
            }),
          ],
        }),
      ],
    });

    children.push(mentionsTable);
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { after: 300 },
      })
    );
  }

  // Strategic Recommendations
  if (reportData.sections.find(s => s.id === 'recommendations')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Strategic Recommendations",
            bold: true,
            size: 28,
            color: "1f2937",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Optimize product descriptions for AI-friendly formatting",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Increase structured data implementation across web properties",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Develop AI-specific content marketing strategies",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Monitor competitor AI visibility trends",
            size: 22,
          }),
        ],
        spacing: { after: 300 },
      })
    );
  }

  return new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });
};

export const downloadWordDocument = (reportData: ReportData, filename: string) => {
  const doc = generateWordDocument(reportData);
  
  // Use dynamic import to avoid SSR issues
  import('docx').then(({ Packer }) => {
    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  });
};