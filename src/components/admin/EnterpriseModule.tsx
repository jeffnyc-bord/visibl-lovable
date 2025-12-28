import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Upload,
  Slack,
  TrendingDown,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrandVerification } from './types';
import { toast } from '@/hooks/use-toast';

interface EnterpriseModuleProps {
  brandVerifications: BrandVerification[];
}

export function EnterpriseModule({ brandVerifications }: EnterpriseModuleProps) {
  const pendingVerifications = brandVerifications.filter(b => b.status === 'pending');
  const priorityAlerts = brandVerifications.filter(b => b.scoreChange && b.scoreChange <= -10);

  const handleVerify = (id: string) => {
    toast({
      title: 'Brand Verified',
      description: 'Visibility signal has been approved and will appear in client dashboard.',
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: 'Verification Rejected',
      description: 'Signal has been marked as rejected.',
    });
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ fontFamily: '"Google Sans Flex", system-ui, sans-serif' }}
    >
      {/* Header */}
      <div 
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: '0.5px solid hsl(0 0% 92%)' }}
      >
        <div>
          <h1 
            className="text-[20px] tracking-[-0.02em]"
            style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
          >
            Enterprise Services
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'hsl(0 0% 50%)' }}>
            White-glove support for premium clients
          </p>
        </div>
        <Button 
          variant="outline"
          className="gap-2 h-9 text-[13px]"
          style={{ 
            borderColor: 'hsl(0 0% 88%)',
            color: 'hsl(0 0% 35%)',
            fontWeight: 500
          }}
        >
          <Upload className="w-4 h-4" />
          Upload Research Report
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Priority Queue - AI Readiness Drops */}
        {priorityAlerts.length > 0 && (
          <div 
            className="p-5 rounded-xl"
            style={{ 
              background: 'hsl(0 72% 97%)', 
              border: '1px solid hsl(0 72% 90%)' 
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4" style={{ color: 'hsl(0 72% 51%)' }} />
              <span 
                className="text-[14px]"
                style={{ fontWeight: 600, color: 'hsl(0 72% 40%)' }}
              >
                Priority Queue: AI Readiness Score Drops
              </span>
              <Badge 
                className="ml-1 text-[10px] px-1.5"
                style={{ background: 'hsl(0 72% 51%)', color: 'white' }}
              >
                {priorityAlerts.length}
              </Badge>
            </div>
            <p className="text-[12px] mb-4" style={{ color: 'hsl(0 72% 45%)' }}>
              Enterprise clients with &gt;10% score drop in the past week. Proactive outreach recommended.
            </p>
            <div className="space-y-3">
              {priorityAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ background: 'white' }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'hsl(270 80% 95%)' }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: 'hsl(270 70% 45%)' }} />
                    </div>
                    <div>
                      <p 
                        className="text-[14px]"
                        style={{ fontWeight: 500, color: 'hsl(0 0% 15%)' }}
                      >
                        {alert.brandName}
                      </p>
                      <p className="text-[12px]" style={{ color: 'hsl(0 0% 55%)' }}>
                        {alert.clientName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p 
                        className="text-[16px] tabular-nums"
                        style={{ fontWeight: 600, color: 'hsl(0 0% 15%)' }}
                      >
                        {alert.aiReadinessScore}%
                      </p>
                      <p 
                        className="text-[11px] flex items-center justify-end gap-0.5"
                        style={{ color: 'hsl(0 72% 51%)' }}
                      >
                        <TrendingDown className="w-3 h-3" />
                        {alert.scoreChange}%
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 h-8 text-[12px]"
                      style={{ background: 'hsl(0 0% 10%)', color: 'white' }}
                    >
                      <Slack className="w-3.5 h-3.5" />
                      Open Slack
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand Verification Queue */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 
                className="text-[15px]"
                style={{ fontWeight: 600, color: 'hsl(0 0% 15%)' }}
              >
                Manual Brand Verification Queue
              </h2>
              {pendingVerifications.length > 0 && (
                <Badge 
                  className="text-[10px] px-1.5"
                  style={{ background: 'hsl(45 93% 90%)', color: 'hsl(45 93% 30%)' }}
                >
                  {pendingVerifications.length} pending
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {brandVerifications.map((verification, index) => (
              <motion.div
                key={verification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-xl border"
                style={{
                  background: 'hsl(0 0% 100%)',
                  borderColor: verification.status === 'pending' 
                    ? 'hsl(45 93% 80%)' 
                    : 'hsl(0 0% 92%)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mt-0.5"
                      style={{ 
                        background: verification.clientTier === 'enterprise' 
                          ? 'hsl(270 80% 95%)' 
                          : 'hsl(220 90% 95%)' 
                      }}
                    >
                      <Building2 
                        className="w-5 h-5" 
                        style={{ 
                          color: verification.clientTier === 'enterprise' 
                            ? 'hsl(270 70% 45%)' 
                            : 'hsl(220 80% 45%)' 
                        }} 
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p 
                          className="text-[14px]"
                          style={{ fontWeight: 500, color: 'hsl(0 0% 15%)' }}
                        >
                          {verification.brandName}
                        </p>
                        <Badge
                          className="text-[9px] uppercase px-1.5 py-0.5"
                          style={{
                            background: verification.clientTier === 'enterprise' 
                              ? 'hsl(270 80% 95%)' 
                              : 'hsl(220 90% 95%)',
                            color: verification.clientTier === 'enterprise' 
                              ? 'hsl(270 70% 45%)' 
                              : 'hsl(220 80% 45%)'
                          }}
                        >
                          {verification.clientTier}
                        </Badge>
                      </div>
                      <p className="text-[12px] mt-0.5" style={{ color: 'hsl(0 0% 55%)' }}>
                        {verification.clientName} • {verification.signalType}
                      </p>
                      <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: 'hsl(0 0% 60%)' }}>
                        <Clock className="w-3 h-3" />
                        Submitted {new Date(verification.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {verification.status === 'pending' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-[12px]"
                          style={{ 
                            borderColor: 'hsl(0 72% 80%)', 
                            color: 'hsl(0 72% 45%)' 
                          }}
                          onClick={() => handleReject(verification.id)}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="gap-1.5 h-8 text-[12px]"
                          style={{ background: 'hsl(142 71% 45%)', color: 'white' }}
                          onClick={() => handleVerify(verification.id)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verify
                        </Button>
                      </>
                    ) : (
                      <Badge
                        className="text-[10px] px-2 py-1"
                        style={{
                          background: verification.status === 'verified' 
                            ? 'hsl(142 71% 95%)' 
                            : 'hsl(0 0% 95%)',
                          color: verification.status === 'verified' 
                            ? 'hsl(142 71% 35%)' 
                            : 'hsl(0 0% 50%)'
                        }}
                      >
                        {verification.status === 'verified' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {verification.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
