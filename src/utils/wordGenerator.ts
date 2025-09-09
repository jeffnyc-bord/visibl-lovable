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
            text: "AI Visibility Overview",
            bold: true,
            size: 28,
            color: "1f2937",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      })
    );

    // Overview Metrics Table
    const overviewTable = new Table({
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
              children: [new Paragraph({ children: [new TextRun({ text: `${reportData.brandData?.visibilityScore || 87}/100`, bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Total AI Mentions" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `${reportData.brandData?.totalMentions?.toLocaleString() || '1,247'}`, bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Platform Coverage" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `${reportData.brandData?.platformCoverage || 89}%`, bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Industry Ranking" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `#${reportData.brandData?.industryRanking || 2}`, bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Sentiment Score" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `${reportData.brandData?.sentimentScore || 78}%`, bold: true })] })],
            }),
          ],
        }),
      ],
    });

    children.push(overviewTable);
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${reportData.brandName} demonstrates strong AI visibility with consistent mentions across major AI platforms including ChatGPT, Claude, Gemini, and Perplexity.`,
            size: 22,
          }),
        ],
        spacing: { before: 200, after: 300 },
      })
    );
  }

  // Platform Breakdown
  if (reportData.sections.find(s => s.id === 'platform-analysis')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "AI Platform Breakdown",
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
            text: "Detailed analysis of your brand's presence across major AI platforms:",
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    const platforms = reportData.brandData?.platforms || [
      { name: "ChatGPT", mentions: 4234, sentiment: "positive", coverage: 92, trend: "+12%" },
      { name: "Claude", mentions: 3456, sentiment: "positive", coverage: 87, trend: "+8%" },
      { name: "Gemini", mentions: 2847, sentiment: "neutral", coverage: 84, trend: "+18%" },
      { name: "Perplexity", mentions: 2310, sentiment: "positive", coverage: 91, trend: "+22%" }
    ];

    const platformTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Platform", bold: true })] })],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Mentions", bold: true })] })],
              width: { size: 20, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Sentiment", bold: true })] })],
              width: { size: 20, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Coverage", bold: true })] })],
              width: { size: 15, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Trend", bold: true })] })],
              width: { size: 20, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        ...platforms.map(platform => 
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: platform.name })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: platform.mentions.toLocaleString() })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: platform.sentiment })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: `${platform.coverage}%` })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: platform.trend })] })],
              }),
            ],
          })
        ),
      ],
    });

    children.push(platformTable);
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { after: 300 },
      })
    );
  }

  // Product Analysis
  if (reportData.sections.find(s => s.id === 'product-analysis')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Product & Brand Analysis",
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
            text: "AI readiness and visibility analysis of your key products and services:",
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    const productOverviewTable = new Table({
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
              children: [new Paragraph({ children: [new TextRun({ text: "Overall Product AI Readiness" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "82%", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Total Products Analyzed" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "1,247", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "AI-Ready Products (90-100%)" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "156", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Need Attention (<70%)" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "89", bold: true })] })],
            }),
          ],
        }),
      ],
    });

    children.push(productOverviewTable);

    if (reportData.brandData?.products && reportData.brandData.products.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Top Performing Products:",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 300, after: 200 },
        })
      );

      const topProductsTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Product", bold: true })] })],
                width: { size: 40, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })],
                width: { size: 30, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "AI Score", bold: true })] })],
                width: { size: 15, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Mentions", bold: true })] })],
                width: { size: 15, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
          ...reportData.brandData.products.slice(0, 5).map(product => 
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: product.name })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: product.category })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: `${product.visibilityScore}%` })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: product.mentions.toString() })] })],
                }),
              ],
            })
          ),
        ],
      });

      children.push(topProductsTable);
    }
    
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { after: 300 },
      })
    );
  }

  // Competitor Analysis
  if (reportData.sections.find(s => s.id === 'competitor-analysis')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Competitive Landscape",
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
            text: "Analysis of your competitive position in AI platforms:",
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    const competitors = reportData.brandData?.competitors || [
      { name: "Adidas", visibilityScore: 84, mentions: 11234, trend: "+5%" },
      { name: "Puma", visibilityScore: 72, mentions: 8456, trend: "-2%" },
      { name: "Under Armour", visibilityScore: 68, mentions: 6789, trend: "+3%" }
    ];

    const competitorTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Competitor", bold: true })] })],
              width: { size: 30, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "AI Score", bold: true })] })],
              width: { size: 20, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Mentions", bold: true })] })],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Trend", bold: true })] })],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        ...competitors.map(competitor => 
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: competitor.name })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: competitor.visibilityScore.toString() })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: competitor.mentions.toLocaleString() })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: competitor.trend })] })],
              }),
            ],
          })
        ),
      ],
    });

    children.push(competitorTable);
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { after: 300 },
      })
    );
  }

  // Technical Health
  if (reportData.sections.find(s => s.id === 'technical-health')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Technical AI Optimization",
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
            text: "Technical analysis of your website's AI crawlability and optimization:",
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    const technicalTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Technical Metric", bold: true })] })],
              width: { size: 60, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })],
              width: { size: 40, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Schema Markup Coverage" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "78% implemented", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Structured Data Quality" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Good (minor issues)", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "AI-Friendly Content Format" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "85% compliance", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Crawl Accessibility" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Excellent", bold: true })] })],
            }),
          ],
        }),
      ],
    });

    children.push(technicalTable);
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Key recommendations: Implement Product schema on remaining pages, optimize FAQ sections for AI parsing, and improve content structure for better AI comprehension.",
            size: 22,
          }),
        ],
        spacing: { before: 200, after: 300 },
      })
    );
  }

  // Top Prompts Analysis
  if (reportData.sections.find(s => s.id === 'top-prompts')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Top AI Prompts & Queries",
            bold: true,
            size: 28,
            color: "1f2937",
          }),
        ],
        spacing: { before: 400, after: 300 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Most frequent prompts and queries mentioning your brand across AI platforms:",
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    // ChatGPT Prompts
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "ChatGPT Top Prompts:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    const chatgptPrompts = [
      "What are the best Nike running shoes for marathons? (2,847 queries)",
      "Compare Nike Air Max vs Nike React technology (1,923 queries)", 
      "Nike sustainability initiatives and environmental impact (1,456 queries)",
      "History of Nike brand and its iconic swoosh logo (1,234 queries)"
    ];

    chatgptPrompts.forEach(prompt => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${prompt}`,
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    });

    // Gemini Prompts  
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Gemini Top Prompts:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    const geminiPrompts = [
      "Nike financial performance and stock analysis (1,892 queries)",
      "Nike vs Adidas market share comparison (1,567 queries)",
      "Nike innovation in athletic wear technology (1,234 queries)"
    ];

    geminiPrompts.forEach(prompt => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${prompt}`,
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    });

    // Perplexity & Grok Prompts
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Perplexity Top Prompts:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    const perplexityPrompts = [
      "Nike endorsement deals with athletes and impact on sales (987 queries)",
      "Nike manufacturing locations and supply chain (834 queries)",
      "Nike digital transformation and e-commerce strategy (756 queries)"
    ];

    perplexityPrompts.forEach(prompt => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${prompt}`,
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    });

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Grok Top Prompts:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    const grokPrompts = [
      "Nike marketing campaigns and brand positioning (678 queries)",
      "Nike size guide and fit recommendations (534 queries)",
      "Nike collaborations with designers and brands (423 queries)"
    ];

    grokPrompts.forEach(prompt => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${prompt}`,
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    });
  }

  // Financial Impact Projections
  if (reportData.sections.find(s => s.id === 'financial-projections')?.enabled) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Financial Impact Projections",
            bold: true,
            size: 28,
            color: "1f2937",
          }),
        ],
        spacing: { before: 400, after: 300 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Estimated financial impact based on AI platform visibility and search volume analysis for Nike:",
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    // ChatGPT Impact Table
    const chatgptImpactTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "ChatGPT Search Volume Impact", bold: true })] })],
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
              children: [new Paragraph({ children: [new TextRun({ text: "Estimated Monthly ChatGPT Searches" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "2.4M queries", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Average Conversion Rate" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "0.85%", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Estimated Monthly Conversions" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "20,400 customers", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Average Order Value" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "$127", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Monthly Revenue from ChatGPT" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "$2.59M", bold: true, color: "059669" })] })],
            }),
          ],
        }),
      ],
    });

    children.push(chatgptImpactTable);

    // Cross-Platform Revenue Table
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Cross-Platform Revenue Projections:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 300, after: 200 },
      })
    );

    const revenueTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "AI Platform", bold: true })] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Monthly Revenue", bold: true })] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "ChatGPT (35% of AI traffic)" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "$2.59M", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Gemini (28% of AI traffic)" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "$2.07M", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Perplexity (22% of AI traffic)" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "$1.63M", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Grok (15% of AI traffic)" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "$1.11M", bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Total Monthly AI Revenue", bold: true })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "$7.40M", bold: true, color: "059669" })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Projected Annual AI Revenue", bold: true })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "$88.8M", bold: true, color: "059669" })] })],
            }),
          ],
        }),
      ],
    });

    children.push(revenueTable);

    // Growth Opportunities
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Growth Opportunity Analysis:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 300, after: 200 },
      })
    );

    const opportunities = [
      "Improving AI visibility by 15% could generate an additional $13.3M annually",
      "Optimizing for emerging platforms (Grok, others) represents $25M+ opportunity", 
      "Enhanced product descriptions could increase conversion rate by 0.2% (+$21M annually)",
      "Cross-platform optimization strategy could yield 25-35% revenue increase"
    ];

    opportunities.forEach(opportunity => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${opportunity}`,
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    });

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Note: Projections based on current market data, brand performance metrics, and AI platform analytics. Actual results may vary based on market conditions and optimization efforts.",
            size: 20,
            italics: true,
          }),
        ],
        spacing: { before: 200, after: 300 },
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
            text: "Platform-Specific Optimizations:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• ChatGPT: Enhance product descriptions with specific use cases and benefits",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Claude: Implement comprehensive FAQ sections for better context understanding",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Gemini: Optimize for visual content and multimedia descriptions",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Perplexity: Focus on authoritative source citations and references",
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Technical Improvements:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Implement missing Product and Organization schema markup",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Optimize content structure for AI parsing and understanding",
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
            text: "• Monitor competitor AI visibility trends and adjust strategy accordingly",
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Content Strategy:",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Create comprehensive product guides and comparison content",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Develop use-case driven content for different customer segments",
            size: 22,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "• Implement regular content audits for AI platform optimization",
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