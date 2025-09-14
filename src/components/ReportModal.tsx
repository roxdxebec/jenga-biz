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
import { generateShareText, useShareActions } from "@/lib/shareUtils";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (options: { type: string; period: string }) => void;
  mode: "download" | "share";
  strategy?: any;
  language?: string;
}

export default function ReportModal({ open, onClose, onConfirm, mode, strategy, language = 'en' }: ReportModalProps) {
  const [type, setType] = useState("full");
  const [period, setPeriod] = useState("30days");
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm({ type, period });
    onClose();
  };

  const shareActions = useShareActions();

  const handleShare = (platform: "whatsapp" | "email" | "copy") => {
    const shareText = generateShareText({
      strategy,
      type: type === "summary" ? "summary" : "full",
      customTitle: `My ${type} Business Report`,
      isFinancial: false,
      language
    });

    if (platform === "whatsapp") {
      shareActions.handleWhatsAppShare(shareText, language);
    } else if (platform === "email") {
      shareActions.handleEmailShare(shareText, `My ${type} Business Report`);
    } else if (platform === "copy") {
      shareActions.handleCopyText(shareText, language);
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
              <Button onClick={() => handleShare("whatsapp")}>
                WhatsApp
              </Button>
              <Button onClick={() => handleShare("email")}>
                Email
              </Button>
              <Button onClick={() => handleShare("copy")}>
                Copy Text
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}