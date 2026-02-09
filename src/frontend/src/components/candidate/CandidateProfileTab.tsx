import { useState, useEffect } from 'react';
import { useGetCandidateProfile, useUpdateCandidateProfile, useGetMyApplications } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Briefcase } from 'lucide-react';
import { ExternalBlob, ApplicationStatus } from '../../backend';
import type { CandidateProfile } from '../../backend';

const DEPARTMENT_OPTIONS = [
  'HR',
  'Finance',
  'Engineering',
  'Production',
  'Sales',
  'Marketing',
  'Operations',
  'IT',
  'Customer Service',
  'Quality',
  'Research & Development',
  'Administration',
  'Other',
];

export default function CandidateProfileTab() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCandidateProfile(identity?.getPrincipal());
  const { data: applications } = useGetMyApplications();
  const updateProfile = useUpdateCandidateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('0');
  const [department, setDepartment] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [searchable, setSearchable] = useState(true);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setExperience(profile.experience.toString());
      setLocation(profile.location);
      setContactNumber(profile.contactNumber);
      setSearchable(profile.searchable);
      
      // Check if department is in predefined list
      if (DEPARTMENT_OPTIONS.includes(profile.department)) {
        setDepartment(profile.department);
        setCustomDepartment('');
      } else {
        setDepartment('Other');
        setCustomDepartment(profile.department);
      }
    }
  }, [profile]);

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    if (value !== 'Other') {
      setCustomDepartment('');
    }
  };

  const getFinalDepartment = () => {
    if (department === 'Other' && customDepartment.trim()) {
      return customDepartment.trim();
    }
    return department;
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      let cvBlob: ExternalBlob | undefined = profile.cv;

      if (cvFile) {
        setCvUploading(true);
        const arrayBuffer = await cvFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        cvBlob = ExternalBlob.fromBytes(uint8Array);
        setCvUploading(false);
      }

      const updatedProfile: CandidateProfile = {
        name,
        experience: BigInt(experience),
        department: getFinalDepartment(),
        location,
        contactNumber,
        searchable,
        cv: cvBlob,
      };

      await updateProfile.mutateAsync(updatedProfile);
      setIsEditing(false);
      setCvFile(null);
    } catch (error) {
      console.error('Update profile error:', error);
      setCvUploading(false);
    }
  };

  const getStatusVariant = (status: ApplicationStatus): "default" | "destructive" | "secondary" => {
    if (status === ApplicationStatus.hired) return 'default';
    if (status === ApplicationStatus.rejected) return 'destructive';
    return 'secondary';
  };

  const getStatusLabel = (status: ApplicationStatus): string => {
    switch (status) {
      case ApplicationStatus.applied:
        return 'Applied';
      case ApplicationStatus.shortlisted:
        return 'Shortlisted';
      case ApplicationStatus.interview:
        return 'Interview';
      case ApplicationStatus.hired:
        return 'Hired';
      case ApplicationStatus.rejected:
        return 'Rejected';
      default:
        return 'Unknown';
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Candidate Profile</CardTitle>
              <CardDescription>Manage your professional information</CardDescription>
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
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contactNumber">Contact Number</Label>
                <Input id="edit-contactNumber" type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select value={department} onValueChange={handleDepartmentChange}>
                  <SelectTrigger id="edit-department">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {department === 'Other' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-customDepartment">Custom Department</Label>
                  <Input
                    id="edit-customDepartment"
                    placeholder="Enter your department"
                    value={customDepartment}
                    onChange={(e) => setCustomDepartment(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-experience">Years of Experience</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cv">Update CV</Label>
                <Input id="edit-cv" type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} />
                {cvFile && (
                  <Badge variant="outline" className="gap-1">
                    <Upload className="h-3 w-3" />
                    {cvFile.name}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-searchable"
                  checked={searchable}
                  onCheckedChange={(checked) => setSearchable(checked as boolean)}
                />
                <Label htmlFor="edit-searchable" className="text-sm font-normal cursor-pointer">
                  Allow employers to find my profile in search
                </Label>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleSave} 
                  disabled={updateProfile.isPending || cvUploading || !getFinalDepartment()}
                  className="bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]"
                >
                  {updateProfile.isPending || cvUploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="text-lg font-medium">{profile.name}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Contact Number</Label>
                <p className="text-lg font-medium">{profile.contactNumber}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Department</Label>
                <p className="text-lg font-medium">{profile.department}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Experience</Label>
                <p className="text-lg font-medium">{profile.experience.toString()} years</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Location</Label>
                <p className="text-lg font-medium">{profile.location}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Profile Visibility</Label>
                <p className="text-lg font-medium">{profile.searchable ? 'Searchable by employers' : 'Private'}</p>
              </div>

              {profile.cv && (
                <div>
                  <Label className="text-muted-foreground">CV</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <a
                      href={profile.cv.getDirectURL()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View CV
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            My Applications
          </CardTitle>
          <CardDescription>Track your job applications</CardDescription>
        </CardHeader>
        <CardContent>
          {applications && applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Application #{app.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">Job ID: {app.jobId.toString()}</p>
                  </div>
                  <Badge variant={getStatusVariant(app.status)}>
                    {getStatusLabel(app.status)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No applications yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
