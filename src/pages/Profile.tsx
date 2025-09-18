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
  contact_person_name: string;
  email: string;
  phone_number: string;
  website: string;
  industry: string;
  country: string;
  organization_name: string;
  business_type: string;
  account_type: string;
  organization_logo: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData>({
    contact_person_name: '',
    email: '',
    phone_number: '',
    website: '',
    industry: '',
    country: '',
    organization_name: '',
    business_type: '',
    account_type: 'Business',
    organization_logo: ''
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      
      // Auto-populate name and email from auth user
      if (user.email && !profile.email) {
        setProfile(prev => ({
          ...prev,
          email: user.email || '',
          contact_person_name: user.user_metadata?.full_name || '',
          account_type: user.user_metadata?.account_type || 'Business'
        }));
      }
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
        contact_person_name: data.full_name || user?.user_metadata?.full_name || '',
        email: data.email || user?.email || '',
        phone_number: data.contact_phone || '',
        website: data.website || '',
        industry: data.industry || '',
        country: data.country || '',
        organization_name: data.organization_name || '',
        business_type: data.business_type || '',
        account_type: data.account_type || user?.user_metadata?.account_type || 'Business',
        organization_logo: data.logo_url || data.profile_picture_url || ''
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
    
    // Use the helper function for proper upsert
    const { saveProfileForUser } = await import('@/lib/profile');
    const { error } = await saveProfileForUser(user.id, {
      email: dataToSave.email,
      full_name: dataToSave.contact_person_name,
      contact_phone: dataToSave.phone_number,
      website: dataToSave.website,
      industry: dataToSave.industry,
      country: dataToSave.country,
      organization_name: dataToSave.organization_name,
      business_type: dataToSave.business_type,
      account_type: dataToSave.account_type,
      profile_picture_url: dataToSave.organization_logo,
      logo_url: dataToSave.organization_logo,
      is_profile_complete: true
    });

    setSaving(false);

    if (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile saved successfully",
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
    
    const updatedProfile = { ...profile, organization_logo: imageUrl };
    setProfile(updatedProfile);
    await saveProfile(updatedProfile);
    
    setUploading(false);
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  const isOrganization = profile.account_type === 'Ecosystem Enabler';
  const imageUrl = profile.organization_logo;

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
                      (profile.organization_name?.charAt(0) || 'E') : 
                      (profile.contact_person_name?.charAt(0) || 'B')
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
                    value={profile.account_type}
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
                  <Label htmlFor="contact_person_name">
                    {isOrganization ? 'Contact Person Name' : 'Contact Person Name'}
                  </Label>
                  <Input
                    id="contact_person_name"
                    value={profile.contact_person_name}
                    onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
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
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={profile.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
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