import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Globe, Building, ScanLine } from "lucide-react";

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

        {/* Enhanced upgrade modal when limit is reached */}
        {hasReachedLimit && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-success rounded-full mx-auto animate-ping opacity-20"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Your Agency is Growing! 🚀
                </h3>
                <div className="max-w-md mx-auto">
                  <p className="text-muted-foreground leading-relaxed">
                    You've successfully managed <span className="font-semibold text-foreground">{currentClientCount} clients</span> on the {subscriptionTier} plan! 
                    <br />
                    Unlock powerful features to scale your agency even further.
                  </p>
                </div>
              </div>
            </div>

            {/* Plan comparison cards - side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
              {subscriptionTier === "Starter" && (
                <div className="relative group hover-scale">
                  <div className="absolute inset-0 bg-gradient-premium rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative border-2 border-premium/30 rounded-xl p-6 bg-card backdrop-blur-sm shadow-lg">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-premium text-premium-foreground px-3 py-1 text-sm font-semibold shadow-md">
                        ⭐ Recommended
                      </Badge>
                    </div>
                    <div className="text-center space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-foreground">Professional</h4>
                        <div className="flex items-baseline justify-center space-x-1">
                          <span className="text-3xl font-bold bg-gradient-premium bg-clip-text text-transparent">$2,500</span>
                          <span className="text-sm text-muted-foreground">/month</span>
                        </div>
                        <p className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-full inline-block">
                          Save 20% yearly
                        </p>
                      </div>
                      
                      <div className="space-y-3 text-left">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gradient-success rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">15 Client Accounts</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gradient-success rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-muted-foreground">Advanced Analytics Dashboard</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gradient-success rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-muted-foreground">Expanded Competitor Tracking</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gradient-success rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-muted-foreground">Priority Support & Training</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gradient-success rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-muted-foreground">White-label Reports</span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-premium hover:shadow-lg text-premium-foreground font-semibold py-3 text-sm transition-all duration-200 hover-scale">
                        Upgrade to Professional ✨
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Enterprise Plan */}
              <div className="relative group hover-scale">
                <div className="absolute inset-0 bg-gradient-enterprise rounded-xl blur-sm opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative border border-border rounded-xl p-6 bg-card shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-foreground">Enterprise</h4>
                      <div className="flex items-baseline justify-center">
                        <span className="text-lg font-semibold text-muted-foreground">Custom pricing</span>
                      </div>
                      <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full inline-block">
                        Volume discounts available
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gradient-enterprise rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">Unlimited Clients</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gradient-enterprise rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-muted-foreground">Dedicated Account Manager</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gradient-enterprise rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-muted-foreground">Custom Integrations & APIs</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gradient-enterprise rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-muted-foreground">Enterprise Security</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gradient-enterprise rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-muted-foreground">24/7 Premium Support</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-enterprise/30 hover:bg-enterprise/5 font-semibold py-3 text-sm transition-all duration-200 hover-scale">
                      Contact Sales Team 💼
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4 pt-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Need help choosing? Our team can help you find the perfect plan for your agency.
                </p>
              </div>
              <div className="flex justify-center">
                <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground px-8">
                  Maybe Later
                </Button>
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
                  <ScanLine className="w-8 h-8 mx-auto text-purple-600" />
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