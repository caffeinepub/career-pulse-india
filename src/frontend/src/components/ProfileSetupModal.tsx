import { useState, useEffect } from 'react';
import { useRegisterCandidate, useRegisterEmployer } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload } from 'lucide-react';
import type { CandidateProfile, EmployerProfile } from '../backend';
import { ExternalBlob, UserType } from '../backend';
import { setIntendedUserType } from '../App';

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

interface ProfileSetupModalProps {
  initialUserType?: UserType | null;
}

export default function ProfileSetupModal({ initialUserType }: ProfileSetupModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [name, setName] = useState('');
  
  // Candidate fields
  const [experience, setExperience] = useState('0');
  const [department, setDepartment] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [searchable, setSearchable] = useState(true);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);

  // Employer fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [employerLocation, setEmployerLocation] = useState('');
  const [employerContactNumber, setEmployerContactNumber] = useState('');

  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const router = useRouter();
  const registerCandidate = useRegisterCandidate();
  const registerEmployer = useRegisterEmployer();

  // Set initial user type from login result
  useEffect(() => {
    if (initialUserType) {
      setUserType(initialUserType === UserType.candidate ? 'candidate' : 'employer');
    }
  }, [initialUserType]);

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

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

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      // User clicked X or pressed Escape - log them out and clear cache
      setIsOpen(false);
      try {
        await clear();
        queryClient.clear();
        setIntendedUserType(null);
        router.invalidate();
        navigate({ to: '/' });
      } catch (error) {
        console.error('Error closing modal:', error);
        window.location.href = '/';
      }
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() && !companyName.trim()) return;

    try {
      // Register specific profile first
      if (userType === 'candidate') {
        let cvBlob: ExternalBlob | undefined = undefined;
        
        if (cvFile) {
          setCvUploading(true);
          const arrayBuffer = await cvFile.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          cvBlob = ExternalBlob.fromBytes(uint8Array);
          setCvUploading(false);
        }

        const candidateProfile: CandidateProfile = {
          name,
          experience: BigInt(experience),
          department: getFinalDepartment(),
          location,
          contactNumber,
          searchable,
          cv: cvBlob,
        };

        await registerCandidate.mutateAsync(candidateProfile);
      } else {
        const employerProfile: EmployerProfile = {
          companyName,
          industry,
          location: employerLocation,
          contactEmail,
          contactNumber: employerContactNumber,
        };

        await registerEmployer.mutateAsync(employerProfile);
      }

      // Clear intended user type after successful registration
      setIntendedUserType(null);
      
      // Navigate to home and refresh
      router.invalidate();
      navigate({ to: '/' });
    } catch (error) {
      console.error('Profile setup error:', error);
    }
  };

  const isLoading = registerCandidate.isPending || registerEmployer.isPending || cvUploading;

  const isCandidateValid = name.trim() && location.trim() && contactNumber.trim() && getFinalDepartment();
  const isEmployerValid = companyName.trim() && industry.trim() && employerLocation.trim() && contactEmail.trim() && employerContactNumber.trim();
  const isValid = userType === 'candidate' ? isCandidateValid : isEmployerValid;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/assets/CPI FINAL LOGO.png" 
              alt="Career Pulse India" 
              className="h-14 w-14 object-contain" 
            />
            <div className="flex flex-col">
              <DialogTitle className="text-xl bg-gradient-to-r from-[#f58220] to-[#f7931d] bg-clip-text text-transparent">
                Career Pulse India
              </DialogTitle>
              <p className="text-xs text-[#1a1a1a]">Bridging Talent to Top Jobs</p>
            </div>
          </div>
          <DialogDescription>
            Complete your profile setup to get started. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={userType} onValueChange={(v) => setUserType(v as 'candidate' | 'employer')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="candidate">Job Seeker</TabsTrigger>
            <TabsTrigger value="employer">Employer</TabsTrigger>
          </TabsList>

          <TabsContent value="candidate" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="Enter your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={department} onValueChange={handleDepartmentChange}>
                <SelectTrigger id="department">
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
                <Label htmlFor="customDepartment">Custom Department *</Label>
                <Input
                  id="customDepartment"
                  placeholder="Enter your department"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience *</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                placeholder="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Ludhiana, Punjab"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cv">Upload CV (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                  className="cursor-pointer"
                />
                {cvFile && (
                  <Badge variant="outline" className="gap-1 border-[#f58220]">
                    <Upload className="h-3 w-3" />
                    {cvFile.name}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="searchable"
                checked={searchable}
                onCheckedChange={(checked) => setSearchable(checked as boolean)}
              />
              <Label htmlFor="searchable" className="text-sm font-normal cursor-pointer">
                Allow employers to find my profile in search
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="employer" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                placeholder="e.g., IT, Manufacturing, Healthcare"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerLocation">Location *</Label>
              <Input
                id="employerLocation"
                placeholder="e.g., Ludhiana, Punjab"
                value={employerLocation}
                onChange={(e) => setEmployerLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@company.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerContactNumber">Contact Number *</Label>
              <Input
                id="employerContactNumber"
                type="tel"
                placeholder="Enter contact number"
                value={employerContactNumber}
                onChange={(e) => setEmployerContactNumber(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button 
          onClick={handleSubmit} 
          disabled={!isValid || isLoading} 
          className="w-full bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310] border-0"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Setting up profile...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
