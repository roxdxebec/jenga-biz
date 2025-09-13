
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, MessageCircle, Copy, Download, Check, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  strategy: any;
  language?: string;
  customTitle?: string;
  customIcon?: React.ReactNode;
  isFinancial?: boolean;
}

const ShareModal = ({ strategy, language = 'en', customTitle, customIcon, isFinancial = false }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Prevent conflicts with external share-modal scripts
  useEffect(() => {
    // Prevent conflicts with external scripts that might try to access DOM elements
    const preventExternalConflicts = () => {
      // Remove any external share-modal event listeners that might conflict
      const existingElements = document.querySelectorAll('[data-share-modal]');
      existingElements.forEach(element => {
        if (element && typeof element.removeEventListener === 'function') {
          try {
            // Create a safe clone to avoid addEventListener on null errors
            const cloned = element.cloneNode(true);
            element.parentNode?.replaceChild(cloned, element);
          } catch (error) {
            console.warn('Share modal cleanup error:', error);
          }
        }
      });
    };

    const timer = setTimeout(preventExternalConflicts, 100);
    
    return () => {
      clearTimeout(timer);
      preventExternalConflicts();
    };
  }, []);

  const translations = {
    en: {
      shareStrategy: 'Share Strategy',
      shareVia: 'Share via',
      whatsapp: 'WhatsApp',
      email: 'Email',
      copyText: 'Copy Text',
      downloadPdf: 'Download PDF',
      copied: 'Copied!',
      shareTitle: 'My Business Strategy',
      copiedToast: 'Strategy copied to clipboard!',
      pdfToast: 'PDF download feature coming soon!',
      emailToast: 'Email share feature coming soon!'
    },
    sw: {
      shareStrategy: 'Shiriki Mkakati',
      shareVia: 'Shiriki kupitia',
      whatsapp: 'WhatsApp',
      email: 'Barua pepe',
      copyText: 'Nakili Maandishi',
      downloadPdf: 'Pakua PDF',
      copied: 'Imenakiliwa!',
      shareTitle: 'Mkakati Wangu wa Biashara',
      copiedToast: 'Mkakati umenakiliwa kwenye ubao wa kunakili!',
      pdfToast: 'Kipengele cha kupakua PDF kinakuja hivi karibuni!',
      emailToast: 'Kipengele cha kushiriki barua pepe kinakuja hivi karibuni!'
    },
    ar: {
      shareStrategy: 'مشاركة الاستراتيجية',
      shareVia: 'مشاركة عبر',
      whatsapp: 'واتساب',
      email: 'البريد الإلكتروني',
      copyText: 'نسخ النص',
      downloadPdf: 'تحميل PDF',
      copied: 'تم النسخ!',
      shareTitle: 'استراتيجية عملي',
      copiedToast: 'تم نسخ الاستراتيجية إلى الحافظة!',
      pdfToast: 'ميزة تحميل PDF قادمة قريباً!',
      emailToast: 'ميزة مشاركة البريد الإلكتروني قادمة قريباً!'
    },
    fr: {
      shareStrategy: 'Partager la Stratégie',
      shareVia: 'Partager via',
      whatsapp: 'WhatsApp',
      email: 'E-mail',
      copyText: 'Copier le Texte',
      downloadPdf: 'Télécharger PDF',
      copied: 'Copié!',
      shareTitle: 'Ma Stratégie d\'Entreprise',
      copiedToast: 'Stratégie copiée dans le presse-papiers!',
      pdfToast: 'Fonctionnalité de téléchargement PDF à venir bientôt!',
      emailToast: 'Fonctionnalité de partage par e-mail à venir bientôt!'
    }
  };

  const t = translations[language] || translations.en;

  const generateShareText = () => {
    if (isFinancial) {
      return `${customTitle || t.shareTitle}

📊 Financial Summary (${strategy?.timePeriod || 'Current Period'})

💰 Total Revenue: ${strategy?.currency || strategy?.currencySymbol || 'KSh'} ${strategy?.totalRevenue?.toFixed(2) || strategy?.totalIncome?.toFixed(2) || '0.00'}

💸 Total Expenses: ${strategy?.currency || strategy?.currencySymbol || 'KSh'} ${strategy?.totalExpenses?.toFixed(2) || '0.00'}

📈 Net Profit: ${strategy?.currency || strategy?.currencySymbol || 'KSh'} ${strategy?.netProfit?.toFixed(2) || ((strategy?.totalRevenue || strategy?.totalIncome || 0) - (strategy?.totalExpenses || 0)).toFixed(2)}

📋 Revenue Entries: ${strategy?.revenueEntries?.length || strategy?.transactions?.filter(t => t.type === 'income')?.length || 0}
📋 Expense Entries: ${strategy?.expenseEntries?.length || strategy?.transactions?.filter(t => t.type === 'expense')?.length || 0}

Profit Margin: ${(strategy?.totalRevenue || strategy?.totalIncome) > 0 ? (((strategy?.netProfit || ((strategy?.totalRevenue || strategy?.totalIncome || 0) - (strategy?.totalExpenses || 0))) / (strategy?.totalRevenue || strategy?.totalIncome)) * 100).toFixed(1) : 0}%

Created with Jenga Biz Africa ✨`;
    }
    
    return `${customTitle || t.shareTitle}

📈 ${strategy?.businessName || strategy?.business_name || strategy?.name || 'My Business'}

🎯 Vision: ${strategy?.vision || 'Not specified'}

🚀 Mission: ${strategy?.mission || 'Not specified'}

👥 Target Market: ${strategy?.targetMarket || strategy?.target_market || 'Not specified'}

💰 Revenue Model: ${strategy?.revenueModel || strategy?.revenue_model || 'Not specified'}

⭐ Value Proposition: ${strategy?.valueProposition || strategy?.value_proposition || 'Not specified'}

🤝 Key Partners: ${strategy?.keyPartners || strategy?.key_partners || 'Not specified'}

📢 Marketing: ${strategy?.marketingApproach || strategy?.marketing_approach || 'Not specified'}

⚙️ Operations: ${strategy?.operationalNeeds || strategy?.operational_needs || 'Not specified'}

📊 Growth Goals: ${strategy?.growthGoals || strategy?.growth_goals || 'Not specified'}

Created with Jenga Biz Africa ✨`;
  };

  const handleWhatsAppShare = () => {
    try {
      const text = encodeURIComponent(generateShareText());
      const url = `https://wa.me/?text=${text}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('WhatsApp share failed:', error);
      toast({
        title: 'Share failed. Please try copying the text instead.',
        variant: 'destructive'
      });
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(t.shareTitle);
    const body = encodeURIComponent(generateShareText());
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.open(url, '_blank');
    toast({
      title: t.emailToast,
    });
  };

  const handleCopyText = async () => {
    try {
      if (!navigator.clipboard) {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = generateShareText();
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      } else {
        await navigator.clipboard.writeText(generateShareText());
      }
      
      setCopied(true);
      toast({
        title: t.copiedToast,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: 'Failed to copy text',
        description: 'Please try again or copy manually',
        variant: 'destructive'
      });
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
          {customIcon || <Share2 className="w-4 h-4 mr-2" />}
          {customTitle || t.shareStrategy}
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
              onClick={handleEmailShare}
              variant="outline"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              {t.email}
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
