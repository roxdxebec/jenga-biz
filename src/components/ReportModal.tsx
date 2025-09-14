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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "download" ? "Download Report" : "Share Report"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Report Type</Label>
            <RadioGroup value={type} onValueChange={setType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full">Full Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="summary" id="summary" />
                <Label htmlFor="summary">Summary Only</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Time Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          {mode === "download" ? (
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