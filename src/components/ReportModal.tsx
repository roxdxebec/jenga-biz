"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (options: { type: string; period: string }) => void;
  mode: "download" | "share";
}

export default function ReportModal({ open, onClose, onConfirm, mode }: ReportModalProps) {
  const [type, setType] = useState("full");
  const [period, setPeriod] = useState("30days");
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm({ type, period });
    onClose();
  };

  const handleDesktopShare = (platform: "whatsapp" | "email" | "copy") => {
    const shareText = `Here is my ${type} report for the period: ${period}.`;
    const url = window.location.href;

    if (platform === "whatsapp") {
      window.open(
        `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + url)}`,
        "_blank"
      );
    } else if (platform === "email") {
      window.location.href = `mailto:?subject=Business Report&body=${encodeURIComponent(
        shareText + "\n\n" + url
      )}`;
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
          <DialogTitle>
            {mode === "download" ? "Download Report" : "Share Report"}
          </DialogTitle>
          <DialogDescription>
            Choose the type of report and time period.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Report</SelectItem>
                <SelectItem value="summary">Summary Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          {mode === "download" ? (
            <Button onClick={handleConfirm}>Download</Button>
          ) : (
            <>
              <Button onClick={() => handleDesktopShare("whatsapp")}>
                WhatsApp
              </Button>
              <Button onClick={() => handleDesktopShare("email")}>
                Email
              </Button>
              <Button onClick={() => handleDesktopShare("copy")}>
                Copy Link
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}