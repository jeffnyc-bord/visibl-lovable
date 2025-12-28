import { motion } from 'framer-motion';
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LLMProvider } from './types';

interface LLMHealthModuleProps {
  providers: LLMProvider[];
}

export function LLMHealthModule({ providers }: LLMHealthModuleProps) {
  const healthyCount = providers.filter(p => p.status === 'healthy').length;
  const degradedCount = providers.filter(p => p.status === 'degraded').length;
  const downCount = providers.filter(p => p.status === 'down').length;

  const getStatusIcon = (status: LLMProvider['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(142 71% 45%)' }} />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(45 93% 47%)' }} />;
      case 'down':
        return <XCircle className="w-4 h-4" style={{ color: 'hsl(0 72% 51%)' }} />;
    }
  };

  const getStatusColor = (status: LLMProvider['status']) => {
    switch (status) {
      case 'healthy':
        return { bg: 'hsl(142 71% 95%)', text: 'hsl(142 71% 35%)', border: 'hsl(142 71% 85%)' };
      case 'degraded':
        return { bg: 'hsl(45 93% 95%)', text: 'hsl(45 93% 30%)', border: 'hsl(45 93% 80%)' };
      case 'down':
        return { bg: 'hsl(0 72% 95%)', text: 'hsl(0 72% 40%)', border: 'hsl(0 72% 85%)' };
    }
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
            System Intelligence
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'hsl(0 0% 50%)' }}>
            LLM Integration Health Monitor
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
          <RefreshCw className="w-4 h-4" />
          Refresh All
        </Button>
      </div>

      {/* Status Summary */}
      <div 
        className="px-6 py-4 flex gap-4"
        style={{ borderBottom: '0.5px solid hsl(0 0% 94%)' }}
      >
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'hsl(142 71% 95%)' }}
        >
          <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(142 71% 45%)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'hsl(142 71% 30%)' }}>
            {healthyCount} Healthy
          </span>
        </div>
        {degradedCount > 0 && (
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'hsl(45 93% 95%)' }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(45 93% 47%)' }} />
            <span className="text-[13px] font-medium" style={{ color: 'hsl(45 93% 30%)' }}>
              {degradedCount} Degraded
            </span>
          </div>
        )}
        {downCount > 0 && (
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'hsl(0 72% 95%)' }}
          >
            <XCircle className="w-4 h-4" style={{ color: 'hsl(0 72% 51%)' }} />
            <span className="text-[13px] font-medium" style={{ color: 'hsl(0 72% 40%)' }}>
              {downCount} Down
            </span>
          </div>
        )}
      </div>

      {/* Provider Cards */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {providers.map((provider, index) => {
            const statusColor = getStatusColor(provider.status);
            
            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-xl border"
                style={{
                  background: 'hsl(0 0% 100%)',
                  borderColor: 'hsl(0 0% 92%)'
                }}
              >
                <div className="flex items-start justify-between">
                  {/* Left: Logo and Name */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: 'hsl(0 0% 97%)' }}
                    >
                      <img 
                        src={provider.logo} 
                        alt={provider.name} 
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 
                          className="text-[15px]"
                          style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
                        >
                          {provider.name}
                        </h3>
                        {getStatusIcon(provider.status)}
                      </div>
                      <p className="text-[12px] mt-0.5" style={{ color: 'hsl(0 0% 55%)' }}>
                        Last check: {provider.lastCheck}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <Badge
                    className="text-[10px] uppercase tracking-wide px-2.5 py-1"
                    style={{
                      background: statusColor.bg,
                      color: statusColor.text,
                      border: `1px solid ${statusColor.border}`,
                      fontWeight: 600
                    }}
                  >
                    {provider.status}
                  </Badge>
                </div>

                {/* Stats Row */}
                <div 
                  className="mt-5 pt-4 grid grid-cols-4 gap-6"
                  style={{ borderTop: '0.5px solid hsl(0 0% 94%)' }}
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: 'hsl(0 0% 55%)' }}>
                      Avg Response
                    </p>
                    <p 
                      className="text-[18px] mt-1 tabular-nums"
                      style={{ 
                        fontWeight: 600, 
                        color: provider.status === 'down' ? 'hsl(0 0% 70%)' : 'hsl(0 0% 15%)' 
                      }}
                    >
                      {provider.status === 'down' ? '—' : `${provider.avgResponseTime}ms`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: 'hsl(0 0% 55%)' }}>
                      Success Rate
                    </p>
                    <p 
                      className="text-[18px] mt-1 tabular-nums"
                      style={{ 
                        fontWeight: 600, 
                        color: provider.successRate >= 99 ? 'hsl(142 71% 40%)' : 
                               provider.successRate >= 95 ? 'hsl(45 93% 40%)' : 
                               'hsl(0 72% 50%)'
                      }}
                    >
                      {provider.status === 'down' ? '0%' : `${provider.successRate}%`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: 'hsl(0 0% 55%)' }}>
                      Prompts Fired
                    </p>
                    <p 
                      className="text-[18px] mt-1 tabular-nums"
                      style={{ fontWeight: 600, color: 'hsl(0 0% 15%)' }}
                    >
                      {provider.promptsFired.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: 'hsl(0 0% 55%)' }}>
                      Errors
                    </p>
                    <p 
                      className="text-[18px] mt-1 tabular-nums"
                      style={{ 
                        fontWeight: 600, 
                        color: provider.errorCount > 20 ? 'hsl(0 72% 50%)' : 'hsl(0 0% 15%)' 
                      }}
                    >
                      {provider.errorCount}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
