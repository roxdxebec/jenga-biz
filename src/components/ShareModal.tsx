
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, MessageCircle, Copy, Download, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  strategy: any;
  language?: string;
}

const ShareModal = ({ strategy, language = 'en' }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const translations = {
    en: {
      shareStrategy: 'Share Strategy',
      shareVia: 'Share via',
      whatsapp: 'WhatsApp',
      copyText: 'Copy Text',
      downloadPdf: 'Download PDF',
      copied: 'Copied!',
      shareTitle: 'My Business Strategy',
      copiedToast: 'Strategy copied to clipboard!',
      pdfToast: 'PDF download feature coming soon!'
    },
    sw: {
      shareStrategy: 'Shiriki Mkakati',
      shareVia: 'Shiriki kupitia',
      whatsapp: 'WhatsApp',
      copyText: 'Nakili Maandishi',
      downloadPdf: 'Pakua PDF',
      copied: 'Imenakiliwa!',
      shareTitle: 'Mkakati Wangu wa Biashara',
      copiedToast: 'Mkakati umenakiliwa kwenye ubao wa kunakili!',
      pdfToast: 'Kipengele cha kupakua PDF kinakuja hivi karibuni!'
    },
    ar: {
      shareStrategy: 'مشاركة الاستراتيجية',
      shareVia: 'مشاركة عبر',
      whatsapp: 'واتساب',
      copyText: 'نسخ النص',
      downloadPdf: 'تحميل PDF',
      copied: 'تم النسخ!',
      shareTitle: 'استراتيجية عملي',
      copiedToast: 'تم نسخ الاستراتيجية إلى الحافظة!',
      pdfToast: 'ميزة تحميل PDF قادمة قريباً!'
    },
    fr: {
      shareStrategy: 'Partager la Stratégie',
      shareVia: 'Partager via',
      whatsapp: 'WhatsApp',
      copyText: 'Copier le Texte',
      downloadPdf: 'Télécharger PDF',
      copied: 'Copié!',
      shareTitle: 'Ma Stratégie d\'Entreprise',
      copiedToast: 'Stratégie copiée dans le presse-papiers!',
      pdfToast: 'Fonctionnalité de téléchargement PDF à venir bientôt!'
    }
  };

  const t = translations[language] || translations.en;

  const generateShareText = () => {
    return `${t.shareTitle}

📈 ${strategy.businessName || 'My Business'}

🎯 Vision: ${strategy.vision}

🚀 Mission: ${strategy.mission}

👥 Target Market: ${strategy.targetMarket}

💰 Revenue Model: ${strategy.revenueModel}

⭐ Value Proposition: ${strategy.valueProposition}

🤝 Key Partners: ${strategy.keyPartners}

📢 Marketing: ${strategy.marketingApproach}

⚙️ Operations: ${strategy.operationalNeeds}

📊 Growth Goals: ${strategy.growthGoals}

Created with Strategy Grid ✨`;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      toast({
        title: t.copiedToast,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadPdf = () => {
    toast({
      title: t.pdfToast,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
          <Share2 className="w-4 h-4 mr-2" />
          {t.shareStrategy}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.shareStrategy}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{t.shareVia}</p>
          
          <div className="grid gap-3">
            <Button
              onClick={handleWhatsAppShare}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {t.whatsapp}
            </Button>
            
            <Button
              onClick={handleCopyText}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t.copyText}
                </>
              )}
            </Button>
            
            <Button
              onClick={handleDownloadPdf}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {t.downloadPdf}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
