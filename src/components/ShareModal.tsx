
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, MessageCircle, Copy, Download, Check, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateShareText, useShareActions } from '@/lib/shareUtils';

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
  const isMobile = useIsMobile();

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


  const shareActions = useShareActions();

  const handleWhatsAppShare = () => {
    const shareText = generateShareText({
      strategy,
      customTitle,
      isFinancial,
      language
    });
    shareActions.handleWhatsAppShare(shareText, language);
  };

  const handleEmailShare = () => {
    const shareText = generateShareText({
      strategy,
      customTitle,
      isFinancial,
      language
    });
    shareActions.handleEmailShare(shareText, customTitle || t.shareTitle);
  };

  const handleCopyText = async () => {
    const shareText = generateShareText({
      strategy,
      customTitle,
      isFinancial,
      language
    });
    await shareActions.handleCopyText(shareText, language);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
