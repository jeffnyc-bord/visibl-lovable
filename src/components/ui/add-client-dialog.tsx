import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Globe, Building, Zap } from "lucide-react";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: (client: any) => void;
  currentClientCount: number;
  subscriptionTier: "Starter" | "Professional" | "Enterprise";
}

export const AddClientDialog = ({ 
  open, 
  onOpenChange, 
  onClientAdded, 
  currentClientCount, 
  subscriptionTier 
}: AddClientDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Get client limits based on subscription tier
  const getClientLimit = (tier: string) => {
    switch (tier) {
      case "Starter": return 5;
      case "Professional": return 15;
      case "Enterprise": return Infinity;
      default: return 5;
    }
  };
  
  const clientLimit = getClientLimit(subscriptionTier);
  const hasReachedLimit = currentClientCount >= clientLimit;

  const [formData, setFormData] = useState({
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
    { id: "Basic", name: "Basic", price: "$99/month", features: ["Up to 1 brand", "Basic analytics"] },
    { id: "Professional", name: "Professional", price: "$299/month", features: ["Up to 5 brands", "Advanced analytics"] },
    { id: "Enterprise", name: "Enterprise", price: "Custom", features: ["Unlimited brands", "Custom features"] }
  ];

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setScanError("Client name is required");
        return false;
      }
      if (!formData.website.trim()) {
        setScanError("Website URL is required");
        return false;
      }
      if (!formData.website.includes('.')) {
        setScanError("Please enter a valid website URL");
        return false;
      }
    }
    setScanError(null);
    return true;
  };

  const handleSubmit = async () => {
    // Check if user has reached their client limit
    if (hasReachedLimit) {
      return; // This shouldn't happen as the form should be disabled
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (!validateCurrentStep()) return;

    setIsScanning(true);
    setScanError(null);

    // Simulate scanning process
    const scanSteps = [
      { progress: 20, delay: 800 },
      { progress: 40, delay: 1000 },
      { progress: 60, delay: 800 },
      { progress: 80, delay: 1200 },
      { progress: 100, delay: 600 }
    ];

    for (const step of scanSteps) {
      setScanProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    // Simulate potential error (10% chance)
    if (Math.random() < 0.1) {
      setScanError("Failed to scan website. Please check if the URL is accessible and try again.");
      setIsScanning(false);
      setScanProgress(0);
      return;
    }

    // Success - create new client
    const newClient = {
      id: Date.now(),
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
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      website: "",
      industry: "",
      plan: "Professional",
      importData: false
    });
    setCurrentStep(1);
    setIsScanning(false);
    setScanError(null);
    setScanProgress(0);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            {hasReachedLimit 
              ? `You've reached your client limit (${clientLimit} clients on ${subscriptionTier} plan)`
              : "Add a new client to your agency dashboard"
            }
          </DialogDescription>
        </DialogHeader>

        {/* Upgrade prompt when limit is reached */}
        {hasReachedLimit && (
          <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-800">
                  Upgrade Required
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  You've reached your {subscriptionTier} plan limit of {clientLimit} client accounts. 
                  Upgrade to add more clients.
                </p>
                <div className="mt-3 space-y-2">
                  {subscriptionTier === "Starter" && (
                    <div className="text-sm text-orange-700">
                      <strong>Professional Plan:</strong> 15 clients for $2,500/month
                    </div>
                  )}
                  <div className="text-sm text-orange-700">
                    <strong>Enterprise Plan:</strong> Unlimited clients - Contact Sales
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Upgrade Plan
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Only show the form if not at limit */}
        {!hasReachedLimit && (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                    currentStep >= step 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-400 border-gray-300'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step ? 'bg-black' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Globe className="w-8 h-8 mx-auto text-blue-600" />
                  <h3 className="text-lg font-semibold">Client Information</h3>
                  <p className="text-sm text-gray-600">Enter the basic details for your new client</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Client Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Nike, Apple, Tesla"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL *</Label>
                    <Input
                      id="website"
                      placeholder="e.g., nike.com, apple.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>

                {scanError && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{scanError}</span>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => validateCurrentStep() && setCurrentStep(2)}>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Configuration */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Building className="w-8 h-8 mx-auto text-green-600" />
                  <h3 className="text-lg font-semibold">Configuration</h3>
                  <p className="text-sm text-gray-600">Configure tracking settings and service plan</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry (Optional)</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry for better benchmarking" />
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

                  <div className="space-y-3">
                    <Label>Service Plan</Label>
                    <div className="space-y-2">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.plan === plan.id 
                              ? 'border-black bg-gray-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData({ ...formData, plan: plan.id })}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="plan"
                                value={plan.id}
                                checked={formData.plan === plan.id}
                                onChange={() => setFormData({ ...formData, plan: plan.id })}
                                className="text-black"
                              />
                              <div>
                                <h4 className="font-medium text-sm">{plan.name}</h4>
                                <p className="text-xs text-gray-600">{plan.features.join(" • ")}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {plan.price}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Scan */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Zap className="w-8 h-8 mx-auto text-purple-600" />
                  <h3 className="text-lg font-semibold">Review & Initialize</h3>
                  <p className="text-sm text-gray-600">Review client details and start initial scan</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Client Name:</span>
                    <span className="text-sm text-gray-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Website:</span>
                    <span className="text-sm text-gray-900">{formData.website}</span>
                  </div>
                  {formData.industry && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Industry:</span>
                      <span className="text-sm text-gray-900">{formData.industry}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Service Plan:</span>
                    <span className="text-sm text-gray-900">{formData.plan}</span>
                  </div>
                </div>

                {!isScanning && !scanError && (
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleSubmit}>
                      Create Client & Start Scan
                    </Button>
                  </div>
                )}

                {isScanning && (
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">Scanning {formData.name}</p>
                      <p className="text-xs text-gray-600">Analyzing website structure and competitor landscape...</p>
                    </div>
                    <Progress value={scanProgress} className="w-full" />
                    <p className="text-xs text-center text-gray-500">
                      This may take a few moments. Please don't close this window.
                    </p>
                  </div>
                )}

                {scanError && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Scan Failed</span>
                    </div>
                    <p className="text-sm text-center text-gray-600">{scanError}</p>
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" onClick={() => setScanError(null)}>
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};