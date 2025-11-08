import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ScheduleScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (date: Date, time: string, frequency: string) => void;
  currentFrequency?: string;
  currentDate?: Date;
  currentTime?: string;
}

export function ScheduleScanDialog({ 
  open, 
  onOpenChange, 
  onSave,
  currentFrequency = "weekly",
  currentDate,
  currentTime = "14:00"
}: ScheduleScanDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate || new Date());
  const [selectedTime, setSelectedTime] = useState(currentTime);
  const [selectedFrequency, setSelectedFrequency] = useState(currentFrequency);

  const timeOptions = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const handleSave = () => {
    if (selectedDate) {
      onSave(selectedDate, selectedTime, selectedFrequency);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/40 shadow-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-semibold tracking-tight">Schedule Scan</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Frequency Selection */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-muted-foreground">Frequency</Label>
            <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
              <SelectTrigger className="h-11 border-border/60 bg-background/50 hover:bg-background transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/40">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-muted-foreground">Next Scan Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal border-border/60 bg-background/50 hover:bg-background transition-colors",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border/40" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-muted-foreground">Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="h-11 border-border/60 bg-background/50 hover:bg-background transition-colors">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/40 max-h-60">
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {selectedDate && (
            <div className="rounded-lg bg-muted/40 backdrop-blur-sm border border-border/40 p-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 animate-pulse" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Next scan scheduled</p>
                  <p className="text-sm font-semibold text-foreground">
                    {format(selectedDate, "EEEE, MMMM d")} at {format(new Date(`2000-01-01T${selectedTime}`), "h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Repeats {selectedFrequency === "daily" ? "every day" : selectedFrequency === "weekly" ? "every week" : selectedFrequency === "biweekly" ? "every 2 weeks" : "every month"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 hover:bg-muted/60"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="h-10 px-4 bg-primary hover:bg-primary/90 transition-colors"
            disabled={!selectedDate}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
