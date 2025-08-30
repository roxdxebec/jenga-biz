import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Image, Palette, Type, Layout, Save } from 'lucide-react';

interface ReportBrandingConfigProps {
  onClose: () => void;
}

interface BrandingConfig {
  logo: {
    file?: File;
    url?: string;
    position: 'header-left' | 'header-center' | 'header-right';
    size: 'small' | 'medium' | 'large';
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  typography: {
    headerFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  layout: {
    headerHeight: number;
    footerHeight: number;
    margins: number;
    includePageNumbers: boolean;
    includeDate: boolean;
  };
  customText: {
    organizationName: string;
    tagline: string;
    footerText: string;
    watermark: string;
  };
}

export function ReportBrandingConfig({ onClose }: ReportBrandingConfigProps) {
  const [config, setConfig] = useState<BrandingConfig>({
    logo: {
      position: 'header-left',
      size: 'medium'
    },
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#10B981',
      text: '#1F2937'
    },
    typography: {
      headerFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    layout: {
      headerHeight: 80,
      footerHeight: 40,
      margins: 20,
      includePageNumbers: true,
      includeDate: true
    },
    customText: {
      organizationName: 'Jenga Biz Africa',
      tagline: 'Empowering African Entrepreneurs',
      footerText: 'Confidential - For Internal Use Only',
      watermark: ''
    }
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        setConfig(prev => ({
          ...prev,
          logo: { ...prev.logo, file, url: e.target?.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Source Sans Pro',
    'Arial',
    'Helvetica',
    'Times New Roman'
  ];

  const saveConfiguration = () => {
    console.log('Saving branding configuration:', config);
    // In a real app, this would save to backend or local storage
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Report Branding Configuration
                </CardTitle>
                <CardDescription>
                  Customize the appearance and branding of your exported reports
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-8">
            {/* Logo Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Logo & Brand Mark</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload">Upload Logo</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      {logoPreview ? (
                        <div className="space-y-3">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="max-w-32 max-h-16 mx-auto object-contain"
                          />
                          <Button variant="outline" size="sm" onClick={() => setLogoPreview(null)}>
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Upload your logo</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                          </div>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logo Position</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['header-left', 'header-center', 'header-right'].map((position) => (
                        <Button
                          key={position}
                          variant={config.logo.position === position ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setConfig(prev => ({ 
                            ...prev, 
                            logo: { ...prev.logo, position: position as any }
                          }))}
                        >
                          {position.split('-')[1]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Logo Size</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['small', 'medium', 'large'].map((size) => (
                        <Button
                          key={size}
                          variant={config.logo.size === size ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setConfig(prev => ({ 
                            ...prev, 
                            logo: { ...prev.logo, size: size as any }
                          }))}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Color Scheme</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(config.colors).map(([colorName, colorValue]) => (
                  <div key={colorName} className="space-y-2">
                    <Label className="capitalize">{colorName} Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: colorValue }}
                      ></div>
                      <Input
                        type="color"
                        value={colorValue}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          colors: { ...prev.colors, [colorName]: e.target.value }
                        }))}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={colorValue}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          colors: { ...prev.colors, [colorName]: e.target.value }
                        }))}
                        className="flex-1 font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Typography</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Header Font</Label>
                  <select
                    value={config.typography.headerFont}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      typography: { ...prev.typography, headerFont: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <select
                    value={config.typography.bodyFont}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      typography: { ...prev.typography, bodyFont: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {['small', 'medium', 'large'].map((size) => (
                      <Button
                        key={size}
                        variant={config.typography.fontSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setConfig(prev => ({ 
                          ...prev, 
                          typography: { ...prev.typography, fontSize: size as any }
                        }))}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Layout Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="header-height">Header Height (px)</Label>
                    <Input
                      id="header-height"
                      type="number"
                      value={config.layout.headerHeight}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        layout: { ...prev.layout, headerHeight: parseInt(e.target.value) || 80 }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer-height">Footer Height (px)</Label>
                    <Input
                      id="footer-height"
                      type="number"
                      value={config.layout.footerHeight}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        layout: { ...prev.layout, footerHeight: parseInt(e.target.value) || 40 }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="margins">Page Margins (px)</Label>
                    <Input
                      id="margins"
                      type="number"
                      value={config.layout.margins}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        layout: { ...prev.layout, margins: parseInt(e.target.value) || 20 }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="page-numbers">Include Page Numbers</Label>
                    <Switch
                      id="page-numbers"
                      checked={config.layout.includePageNumbers}
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        layout: { ...prev.layout, includePageNumbers: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-date">Include Generation Date</Label>
                    <Switch
                      id="include-date"
                      checked={config.layout.includeDate}
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        layout: { ...prev.layout, includeDate: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Text Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Custom Text & Branding</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={config.customText.organizationName}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      customText: { ...prev.customText, organizationName: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={config.customText.tagline}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      customText: { ...prev.customText, tagline: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footer-text">Footer Text</Label>
                  <Input
                    id="footer-text"
                    value={config.customText.footerText}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      customText: { ...prev.customText, footerText: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="watermark">Watermark Text (Optional)</Label>
                  <Input
                    id="watermark"
                    value={config.customText.watermark}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      customText: { ...prev.customText, watermark: e.target.value }
                    }))}
                    placeholder="e.g., DRAFT, CONFIDENTIAL"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={saveConfiguration}>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}