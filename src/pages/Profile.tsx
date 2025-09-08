import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Upload, User, Building2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileData {
  full_name: string;
  email: string;
  contact_phone: string;
  website: string;
  industry: string;
  country: string;
  organization_name: string;
  business_type: string;
  account_type: string;
  profile_picture_url: string;
  logo_url: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    email: '',
    contact_phone: '',
    website: '',
    industry: '',
    country: '',
    organization_name: '',
    business_type: '',
    account_type: 'business',
    profile_picture_url: '',
    logo_url: ''
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        email: data.email || '',
        contact_phone: data.contact_phone || '',
        website: data.website || '',
        industry: data.industry || '',
        country: data.country || '',
        organization_name: data.organization_name || '',
        business_type: data.business_type || '',
        account_type: data.account_type || 'business',
        profile_picture_url: data.profile_picture_url || '',
        logo_url: data.logo_url || ''
      });
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Auto-save after 1 second of no typing
    setTimeout(() => saveProfile({ ...profile, [field]: value }), 1000);
  };

  const saveProfile = async (dataToSave = profile) => {
    if (!user || saving) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: dataToSave.full_name,
        contact_phone: dataToSave.contact_phone,
        website: dataToSave.website,
        industry: dataToSave.industry,
        country: dataToSave.country,
        organization_name: dataToSave.organization_name,
        business_type: dataToSave.business_type,
        profile_picture_url: dataToSave.profile_picture_url,
        logo_url: dataToSave.logo_url,
        is_profile_complete: true
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;
    const field = profile.account_type === 'organization' ? 'logo_url' : 'profile_picture_url';
    
    const updatedProfile = { ...profile, [field]: imageUrl };
    setProfile(updatedProfile);
    await saveProfile(updatedProfile);
    
    setUploading(false);
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  const isOrganization = profile.account_type === 'organization';
  const imageUrl = isOrganization ? profile.logo_url : profile.profile_picture_url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Picture/Logo Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isOrganization ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                {isOrganization ? 'Organization Logo' : 'Profile Photo'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={imageUrl} />
                  <AvatarFallback className="text-lg">
                    {isOrganization ? 
                      (profile.organization_name?.charAt(0) || 'O') : 
                      (profile.full_name?.charAt(0) || 'U')
                    }
                  </AvatarFallback>
                </Avatar>
                
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button disabled={uploading} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : `Upload ${isOrganization ? 'Logo' : 'Photo'}`}
                    </span>
                  </Button>
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account_type">Account Type</Label>
                  <Input
                    id="account_type"
                    value={profile.account_type === 'organization' ? 'Organization' : 'Business'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    {isOrganization ? 'Contact Person Name' : 'Full Name'}
                  </Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                  />
                </div>

                {isOrganization && (
                  <div className="space-y-2">
                    <Label htmlFor="organization_name">Organization Name</Label>
                    <Input
                      id="organization_name"
                      value={profile.organization_name}
                      onChange={(e) => handleInputChange('organization_name', e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone Number</Label>
                  <Input
                    id="contact_phone"
                    value={profile.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={profile.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  />
                </div>

                {!isOrganization && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="business_type">Business Type</Label>
                    <Textarea
                      id="business_type"
                      value={profile.business_type}
                      onChange={(e) => handleInputChange('business_type', e.target.value)}
                      placeholder="Describe your business..."
                    />
                  </div>
                )}
              </div>

              {saving && (
                <p className="text-sm text-muted-foreground">Auto-saving...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;