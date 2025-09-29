// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import CountrySelector from './CountrySelector';

interface ProfileSetupProps {
  onComplete: () => void;
}

const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<'business' | 'organization'>('business');
  
  const [profileData, setProfileData] = useState({
    // B2C fields
    firstName: '',
    lastName: '',
    businessName: '',
    profilePictureUrl: '',
    
    // B2B fields
    organizationName: '',
    contactPersonName: '',
    contactPersonTitle: '',
    logoUrl: '',
    website: '',
    contactPhone: '',
    
    // Common fields
    country: 'KE',
    currency: 'KES',
    industry: '',
    contactEmail: user?.email || ''
  });

  const industries = [
    'Agriculture & Food Processing',
    'Technology & Software',
    'Retail & E-commerce',
    'Healthcare & Wellness',
    'Education & Training',
    'Manufacturing',
    'Construction & Real Estate',
    'Transportation & Logistics',
    'Financial Services',
    'Tourism & Hospitality',
    'Arts & Entertainment',
    'Consulting & Professional Services',
    'Energy & Environment',
    'Other'
  ];

  useEffect(() => {
    // Check if user already has a profile
    loadExistingProfile();
  }, [user]);

  const loadExistingProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        const msg = (error as any)?.message || (error as any)?.details || String(error);
        // Ignore missing-row errors (first-time users)
        if ((error as any)?.code === 'PGRST116' || msg.toLowerCase().includes('no rows') || msg.toLowerCase().includes('0 rows')) {
          return;
        }
        console.error('Error loading profile:', msg);
        return;
      }

      if (data) {
        setProfileData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          businessName: data.business_type || '',
          profilePictureUrl: data.profile_picture_url || '',
          organizationName: data.organization_name || '',
          contactPersonName: data.contact_person_name || '',
          contactPersonTitle: data.contact_person_title || '',
          logoUrl: data.logo_url || '',
          website: data.website || '',
          contactPhone: data.contact_phone || '',
          country: data.country || 'KE',
          currency: 'KES', // Default currency based on country
          industry: data.industry || '',
          contactEmail: data.email || user.email || ''
        });
        
        setAccountType(data.account_type === 'organization' ? 'organization' : 'business');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (accountType === 'business') {
      if (!profileData.firstName || !profileData.lastName || !profileData.businessName) {
        toast({
          title: 'Required Fields Missing',
          description: 'Please fill in your first name, last name, and business name.',
          variant: 'destructive'
        });
        return false;
      }
    } else {
      if (!profileData.organizationName || !profileData.contactPersonName) {
        toast({
          title: 'Required Fields Missing',
          description: 'Please fill in your organization name and contact person name.',
          variant: 'destructive'
        });
        return false;
      }
    }

    if (!profileData.country || !profileData.industry) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please select your country and industry.',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const updateData = {
        full_name: accountType === 'business' 
          ? `${profileData.firstName} ${profileData.lastName}`.trim()
          : profileData.contactPersonName,
        first_name: accountType === 'business' ? profileData.firstName : null,
        last_name: accountType === 'business' ? profileData.lastName : null,
        business_type: accountType === 'business' ? profileData.businessName : null,
        organization_name: accountType === 'organization' ? profileData.organizationName : null,
        contact_person_name: accountType === 'organization' ? profileData.contactPersonName : null,
        contact_person_title: accountType === 'organization' ? profileData.contactPersonTitle : null,
        profile_picture_url: profileData.profilePictureUrl || null,
        logo_url: profileData.logoUrl || null,
        country: profileData.country,
        currency: profileData.currency,
        industry: profileData.industry,
        website: profileData.website || null,
        contact_phone: profileData.contactPhone || null,
        account_type: accountType,
        is_profile_complete: true,
        email: profileData.contactEmail
      };

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...updateData
        });

      if (error) throw error;

      toast({
        title: 'Profile Setup Complete',
        description: 'Your profile has been saved successfully!',
      });

      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Let's set up your profile to personalize your experience
          </p>
        </div>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div 
                className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  accountType === 'business' 
                    ? 'border-orange-300 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setAccountType('business')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Entrepreneur (B2C)</span>
                </div>
                <p className="text-sm text-gray-600">
                  Individual business owner or entrepreneur
                </p>
              </div>
              
              <div 
                className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  accountType === 'organization' 
                    ? 'border-orange-300 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setAccountType('organization')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Organization (B2B)</span>
                </div>
                <p className="text-sm text-gray-600">
                  Business hub, incubator, or organization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {accountType === 'business' ? (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={profileData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="profilePicture">Profile Picture URL (Optional)</Label>
                  <Input
                    id="profilePicture"
                    value={profileData.profilePictureUrl}
                    onChange={(e) => handleInputChange('profilePictureUrl', e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    value={profileData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                    <Input
                      id="contactPersonName"
                      value={profileData.contactPersonName}
                      onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                      placeholder="Enter contact name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPersonTitle">Title (Optional)</Label>
                    <Input
                      id="contactPersonTitle"
                      value={profileData.contactPersonTitle}
                      onChange={(e) => handleInputChange('contactPersonTitle', e.target.value)}
                      placeholder="e.g., CEO, Director"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                  <Input
                    id="logoUrl"
                    value={profileData.logoUrl}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
                    <Input
                      id="contactPhone"
                      value={profileData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle>Location & Industry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={profileData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Country *</Label>
                  <CountrySelector
                    currentCountry={profileData.country}
                    onCountryChange={(country) => handleInputChange('country', country)}
                    showAllCountries={true}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select
                    value={profileData.currency}
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                      <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
                      <SelectItem value="TZS">TZS - Tanzanian Shilling</SelectItem>
                      <SelectItem value="RWF">RWF - Rwandan Franc</SelectItem>
                      <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry/Sector *</Label>
                <Select
                  value={profileData.industry}
                  onValueChange={(value) => handleInputChange('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-8">
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
