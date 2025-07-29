import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PlatformDetail {
  platform: string;
  mentions: number;
  trend: string;
}

interface AIInsightsModalProps {
  trigger: React.ReactNode;
  platforms: PlatformDetail[];
}

const getTrendIcon = (trend: string) => {
  if (trend.startsWith('+')) return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend.startsWith('-')) return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
};

const getTrendColor = (trend: string) => {
  if (trend.startsWith('+')) return "bg-green-100 text-green-800";
  if (trend.startsWith('-')) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export function AIInsightsModal({ trigger, platforms }: AIInsightsModalProps) {
  // Show platforms beyond the main 4 (ChatGPT, Claude, Gemini, Perplexity)
  const additionalPlatforms = platforms.slice(4, 12); // Show top 8 additional platforms

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Extended AI Platform Coverage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Additional AI platforms where your brand is mentioned beyond the primary four platforms.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Mentions</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {additionalPlatforms.map((platform, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{platform.platform}</TableCell>
                  <TableCell>{platform.mentions}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(platform.trend)}
                      <Badge variant="secondary" className={getTrendColor(platform.trend)}>
                        {platform.trend}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}