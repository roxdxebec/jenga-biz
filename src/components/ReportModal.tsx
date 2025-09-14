import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (options: { type: string; period: string }) => void;
  mode: 'download' | 'share';
}

export default function ReportModal({ open, onClose, onConfirm, mode }: ReportModalProps) {
  const [type, setType] = useState("full");
  const [period, setPeriod] = useState("30days");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm({ type, period });
    onClose();
  };

  const handleMobileShare = () => {
    const shareText = `Here is my ${type} report for the period: ${period}.`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: "Business Report",
        text: shareText,
        url: url,
      });
    }
    onClose();
  };

  const handleDesktopShare = (platform: "whatsapp" | "email" | "copy") => {
    const shareText = `Here is my ${type} report for the period: ${period}.`;
    const url = window.location.href;

    if (platform === "whatsapp") {
      window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + url)}`, "_blank");
    } else if (platform === "email") {
      window.location.href = `mailto:?subject=Business Report&body=${encodeURIComponent(shareText + "\n\n" + url)}`;
    } else if (platform === "copy") {
      navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      toast({
        title: "Link copied!",
        description: "Report link copied to clipboard.",
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'download' ? 'Download Report' : 'Share Report'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Report Type</Label>
            <RadioGroup value={type} onValueChange={setType} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full">Full</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="strategy" id="strategy" />
                <Label htmlFor="strategy">Strategy Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="milestones" id="milestones" />
                <Label htmlFor="milestones">Milestones Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="financials" id="financials" />
                <Label htmlFor="financials">Financials Only</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="mb-2 block">Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="ytd">Year-to-Date</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {mode === 'download' ? (
            <Button onClick={handleConfirm}>Download</Button>
          ) : isMobile ? (
            <Button onClick={handleMobileShare}>Share</Button>
          ) : (
            <>
              <Button onClick={() => handleDesktopShare("whatsapp")}>WhatsApp</Button>
              <Button onClick={() => handleDesktopShare("email")}>Email</Button>
              <Button onClick={() => handleDesktopShare("copy")}>Copy Link</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}