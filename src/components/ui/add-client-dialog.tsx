import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: (client: any) => void;
}

interface ClientFormData {
  name: string;
  website: string;
  industry: string;
  plan: string;
  importData: boolean;
}

export const AddClientDialog = ({ open, onOpenChange, onClientAdded }: AddClientDialogProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    website: "",
    industry: "",
    plan: "Professional",
    importData: false
  });

  const industries = [
    "Technology", "E-commerce", "Healthcare", "Finance", "Education",
    "Manufacturing", "Retail", "Hospitality", "Real Estate", "Other"
  ];

  const plans = [
    { value: "Basic", label: "Basic - $99/month", description: "Up to 1 brand, basic analytics" },
    { value: "Professional", label: "Professional - $299/month", description: "Up to 5 brands, advanced analytics" },
    { value: "Enterprise", label: "Enterprise - Custom", description: "Unlimited brands, custom features" }
  ];

  const handleInputChange = (field: keyof ClientFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError("Client name is required");
      return false;
    }
    if (!formData.website.trim()) {
      setError("Website URL is required");
      return false;
    }
    if (!formData.website.includes('.')) {
      setError("Please enter a valid website URL");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const simulateSiteScanning = async () => {
    setScanStatus('scanning');
    setScanProgress(0);
    
    // Simulate scanning progress
    const progressSteps = [
      { progress: 20, message: "Analyzing website structure..." },
      { progress: 40, message: "Checking SEO foundations..." },
      { progress: 60, message: "Scanning competitor landscape..." },
      { progress: 80, message: "Analyzing brand visibility..." },
      { progress: 100, message: "Finalizing setup..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanProgress(step.progress);
    }

    // Simulate potential error (10% chance)
    if (Math.random() < 0.1) {
      setScanStatus('error');
      setError("Failed to scan website. Please check if the URL is accessible and try again.");
    } else {
      setScanStatus('success');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      await simulateSiteScanning();
      
      if (scanStatus !== 'error') {
        // Create new client object
        const newClient = {
          id: Date.now(), // In real app, this would come from backend
          name: formData.name,
          email: `contact@${formData.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}`,
          status: "Scanning" as const,
          tier: formData.plan,
          deepTrackedBrands: 0,
          competitorBrands: 0,
          lastScan: "Just now",
          avgVisibilityScore: 0,
          visibilityTrend: { value: 0, direction: "up" as const },
          url: formData.website.replace(/^https?:\/\//, '').replace(/^www\./, ''),
          brand: formData.name.toLowerCase().replace(/\s+/g, ''),
          industry: formData.industry,
          isScanning: true
        };

        onClientAdded(newClient);
        
        toast({
          title: "Client Added Successfully",
          description: `${formData.name} has been added and initial scan is in progress.`,
        });

        // Reset form and close dialog
        setFormData({
          name: "",
          website: "",
          industry: "",
          plan: "Professional",
          importData: false
        });
        setStep(1);
        setScanStatus('idle');
        setScanProgress(0);
        onOpenChange(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setScanStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setStep(1);
    setScanStatus('idle');
    setScanProgress(0);
    setError("");
    setFormData({
      name: "",
      website: "",
      industry: "",
      plan: "Professional",
      importData: false
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Set up a new client account for AI visibility tracking
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name *</Label>
              <Input
                id="client-name"
                placeholder="e.g., Nike, Apple, Tesla"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website URL *</Label>
              <Input
                id="website"
                placeholder="e.g., nike.com, apple.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service Plan</Label>
              <div className="space-y-2">
                {plans.map((plan) => (
                  <div key={plan.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <input
                      type="radio"
                      id={plan.value}
                      name="plan"
                      value={plan.value}
                      checked={formData.plan === plan.value}
                      onChange={(e) => handleInputChange('plan', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <Label htmlFor={plan.value} className="font-medium">{plan.label}</Label>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="import-data"
                checked={formData.importData}
                onCheckedChange={(checked) => handleInputChange('importData', checked as boolean)}
              />
              <Label htmlFor="import-data" className="text-sm">
                Import existing SEO/marketing data (if available)
              </Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Review & Confirm</h3>
              <p className="text-sm text-muted-foreground">
                Please review the client information before proceeding
              </p>
            </div>

            <div className="bg-accent/20 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Client Name:</span>
                <span>{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Website:</span>
                <span>{formData.website}</span>
              </div>
              {formData.industry && (
                <div className="flex justify-between">
                  <span className="font-medium">Industry:</span>
                  <span>{formData.industry}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Plan:</span>
                <span>{formData.plan}</span>
              </div>
            </div>

            {scanStatus === 'idle' && (
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Create Client Account"
                  )}
                </Button>
              </div>
            )}

            {scanStatus === 'scanning' && (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Scanning website and setting up client account...</span>
                </div>
                <Progress value={scanProgress} className="w-full" />
                <p className="text-xs text-center text-muted-foreground">
                  This may take a few moments. Please don't close this window.
                </p>
              </div>
            )}

            {scanStatus === 'success' && (
              <div className="text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h4 className="font-semibold text-green-700">Client Added Successfully!</h4>
                <p className="text-sm text-muted-foreground">
                  {formData.name} has been added to your client accounts and initial scanning is complete.
                </p>
              </div>
            )}

            {scanStatus === 'error' && (
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <h4 className="font-semibold text-red-700">Setup Failed</h4>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" onClick={() => setScanStatus('idle')}>
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};