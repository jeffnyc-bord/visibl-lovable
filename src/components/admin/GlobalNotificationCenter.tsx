import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface GlobalNotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalNotificationCenter({ open, onOpenChange }: GlobalNotificationCenterProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'critical'>('info');
  const [audience, setAudience] = useState<'all' | 'enterprise' | 'pro'>('all');

  const handleSend = () => {
    toast({
      title: 'System Alert Sent',
      description: `Notification pushed to ${audience === 'all' ? 'all users' : `${audience} users`}`,
    });
    setTitle('');
    setMessage('');
    onOpenChange(false);
  };

  const severityColors = {
    info: { bg: 'hsl(220 90% 95%)', text: 'hsl(220 80% 45%)', border: 'hsl(220 80% 80%)' },
    warning: { bg: 'hsl(45 93% 95%)', text: 'hsl(45 93% 35%)', border: 'hsl(45 93% 75%)' },
    critical: { bg: 'hsl(0 72% 95%)', text: 'hsl(0 72% 45%)', border: 'hsl(0 72% 80%)' }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[480px]"
        style={{ fontFamily: '"Google Sans Flex", system-ui, sans-serif' }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-[17px] flex items-center gap-2"
            style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
          >
            <Bell className="w-5 h-5" />
            Global Notification Center
          </DialogTitle>
          <DialogDescription className="text-[13px]" style={{ color: 'hsl(0 0% 50%)' }}>
            Push system alerts to user dashboards as Apple-style toast notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label 
              className="text-[12px] uppercase tracking-wide"
              style={{ fontWeight: 600, color: 'hsl(0 0% 45%)' }}
            >
              Alert Title
            </label>
            <Input
              placeholder="e.g., Gemini API Experiencing Latency"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 text-[13px]"
              style={{
                background: 'hsl(0 0% 98%)',
                borderColor: 'hsl(0 0% 90%)'
              }}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label 
              className="text-[12px] uppercase tracking-wide"
              style={{ fontWeight: 600, color: 'hsl(0 0% 45%)' }}
            >
              Message
            </label>
            <Textarea
              placeholder="Detailed message for users..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] text-[13px]"
              style={{
                background: 'hsl(0 0% 98%)',
                borderColor: 'hsl(0 0% 90%)'
              }}
            />
          </div>

          {/* Severity & Audience */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label 
                className="text-[12px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 45%)' }}
              >
                Severity
              </label>
              <Select value={severity} onValueChange={(v: any) => setSeverity(v)}>
                <SelectTrigger 
                  className="h-10 text-[13px]"
                  style={{ background: 'hsl(0 0% 98%)', borderColor: 'hsl(0 0% 90%)' }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label 
                className="text-[12px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 45%)' }}
              >
                Audience
              </label>
              <Select value={audience} onValueChange={(v: any) => setAudience(v)}>
                <SelectTrigger 
                  className="h-10 text-[13px]"
                  style={{ background: 'hsl(0 0% 98%)', borderColor: 'hsl(0 0% 90%)' }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="pro">Pro Only</SelectItem>
                  <SelectItem value="enterprise">Enterprise Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          {title && (
            <div className="space-y-2">
              <label 
                className="text-[12px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 45%)' }}
              >
                Preview
              </label>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border"
                style={{
                  background: severityColors[severity].bg,
                  borderColor: severityColors[severity].border
                }}
              >
                <div className="flex items-start gap-3">
                  <Bell 
                    className="w-5 h-5 mt-0.5"
                    style={{ color: severityColors[severity].text }}
                  />
                  <div>
                    <p 
                      className="text-[14px]"
                      style={{ fontWeight: 600, color: severityColors[severity].text }}
                    >
                      {title}
                    </p>
                    {message && (
                      <p 
                        className="text-[12px] mt-1"
                        style={{ color: severityColors[severity].text, opacity: 0.8 }}
                      >
                        {message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="text-[13px]"
            style={{ borderColor: 'hsl(0 0% 88%)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!title}
            className="gap-2 text-[13px]"
            style={{ background: 'hsl(0 0% 10%)', color: 'white' }}
          >
            <Send className="w-4 h-4" />
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
