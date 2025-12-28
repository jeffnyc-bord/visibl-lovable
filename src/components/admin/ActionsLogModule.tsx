import { motion } from 'framer-motion';
import { 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionLogEntry } from './types';

interface ActionsLogModuleProps {
  entries: ActionLogEntry[];
}

export function ActionsLogModule({ entries }: ActionsLogModuleProps) {
  const getTypeIcon = (type: ActionLogEntry['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4" style={{ color: 'hsl(220 80% 55%)' }} />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(45 93% 47%)' }} />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(142 71% 45%)' }} />;
      case 'error':
        return <XCircle className="w-4 h-4" style={{ color: 'hsl(0 72% 51%)' }} />;
    }
  };

  const getTypeBg = (type: ActionLogEntry['type']) => {
    switch (type) {
      case 'info':
        return 'hsl(220 80% 97%)';
      case 'warning':
        return 'hsl(45 93% 97%)';
      case 'success':
        return 'hsl(142 71% 97%)';
      case 'error':
        return 'hsl(0 72% 97%)';
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
            Global Actions Log
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'hsl(0 0% 50%)' }}>
            All admin and system actions
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
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-start gap-4 p-4 rounded-lg"
              style={{ background: getTypeBg(entry.type) }}
            >
              <div className="mt-0.5">
                {getTypeIcon(entry.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-[13px]"
                  style={{ fontWeight: 500, color: 'hsl(0 0% 15%)' }}
                >
                  {entry.action}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px]" style={{ color: 'hsl(0 0% 50%)' }}>
                    {entry.user}
                  </span>
                  {entry.target && (
                    <>
                      <span className="text-[12px]" style={{ color: 'hsl(0 0% 70%)' }}>→</span>
                      <span 
                        className="text-[12px]"
                        style={{ color: 'hsl(0 0% 40%)', fontWeight: 500 }}
                      >
                        {entry.target}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span 
                className="text-[11px] tabular-nums whitespace-nowrap"
                style={{ color: 'hsl(0 0% 55%)' }}
              >
                {entry.timestamp}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
