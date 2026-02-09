import { useState, useEffect } from 'react';
import { useGetEmployerProfile, useUpdateEmployerProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EmployerProfile } from '../../backend';

export default function EmployerProfileTab() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetEmployerProfile(identity?.getPrincipal());
  const updateProfile = useUpdateEmployerProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName);
      setIndustry(profile.industry);
      setLocation(profile.location);
      setContactEmail(profile.contactEmail);
      setContactNumber(profile.contactNumber);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    const updatedProfile: EmployerProfile = {
      companyName,
      industry,
      location,
      contactEmail,
      contactNumber,
    };

    try {
      await updateProfile.mutateAsync(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium mb-2">Profile not found</p>
          <p className="text-sm text-muted-foreground">Please complete your profile setup</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Employer Profile</CardTitle>
            <CardDescription>Manage your company information</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="edit-companyName">Company Name</Label>
              <Input id="edit-companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-industry">Industry</Label>
              <Input id="edit-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contactEmail">Contact Email</Label>
              <Input id="edit-contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contactNumber">Contact Number</Label>
              <Input id="edit-contactNumber" type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSave} 
                disabled={updateProfile.isPending}
                className="bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label className="text-muted-foreground">Company Name</Label>
              <p className="text-lg font-medium">{profile.companyName}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Industry</Label>
              <p className="text-lg font-medium">{profile.industry}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Location</Label>
              <p className="text-lg font-medium">{profile.location}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Contact Email</Label>
              <p className="text-lg font-medium">{profile.contactEmail}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Contact Number</Label>
              <p className="text-lg font-medium">{profile.contactNumber}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
