import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Table, Image, CheckCircle } from "lucide-react";

interface ExportDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  exportType: "report" | "data" | "analysis";
}

export const ExportDialog = ({ trigger, title, description, exportType }: ExportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  const formatOptions = {
    report: [
      { value: "pdf", label: "PDF Report", icon: FileText },
      { value: "excel", label: "Excel Spreadsheet", icon: Table },
      { value: "powerpoint", label: "PowerPoint Presentation", icon: FileText },
    ],
    data: [
      { value: "csv", label: "CSV File", icon: Table },
      { value: "excel", label: "Excel Spreadsheet", icon: Table },
      { value: "json", label: "JSON Data", icon: FileText },
    ],
    analysis: [
      { value: "pdf", label: "PDF Analysis", icon: FileText },
      { value: "excel", label: "Excel Data", icon: Table },
      { value: "png", label: "Chart Images", icon: Image },
    ]
  };

  const handleExport = () => {
    if (!format) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 300);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setIsOpen(false);
        setFormat("");
        toast({
          title: "Export Complete",
          description: `Your ${formatOptions[exportType].find(f => f.value === format)?.label} has been downloaded successfully.`,
        });
      }, 1000);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!isExporting ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-blue-600" />
                <span>{title}</span>
              </DialogTitle>
              <DialogDescription>
                {description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="format">Export Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions[exportType].map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={!format}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                {exportProgress === 100 ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <Download className="w-8 h-8 text-blue-600 animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {exportProgress === 100 ? "Export Complete!" : "Preparing Export..."}
                </h3>
                <p className="text-gray-600 text-sm">
                  {exportProgress === 100 ? 
                    "Your file has been prepared and will download shortly." :
                    exportProgress < 30 ? "Gathering data..." :
                    exportProgress < 70 ? "Formatting content..." :
                    "Finalizing export..."
                  }
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(exportProgress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {Math.round(exportProgress)}% complete
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};