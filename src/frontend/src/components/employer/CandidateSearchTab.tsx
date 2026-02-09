import { useState } from 'react';
import { useSearchCandidates, useGetCandidateProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, MapPin, Briefcase } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';

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

export default function CandidateSearchTab() {
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState<Principal[]>([]);
  const searchCandidates = useSearchCandidates();

  const handleSearch = async () => {
    if (!department || !location) return;

    try {
      const results = await searchCandidates.mutateAsync({ department, location });
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Candidates
          </CardTitle>
          <CardDescription>Find candidates by department and location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-department">Department *</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="search-department">
                <SelectValue placeholder="Select department" />
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

          <div className="space-y-2">
            <Label htmlFor="search-location">Location *</Label>
            <Input
              id="search-location"
              placeholder="e.g., Ludhiana, Punjab"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={!department || !location || searchCandidates.isPending}
            className="w-full bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]"
          >
            {searchCandidates.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Candidates
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {searchResults.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
          <div className="grid gap-4">
            {searchResults.map((candidateId) => (
              <CandidateCard key={candidateId.toString()} candidateId={candidateId} />
            ))}
          </div>
        </div>
      ) : searchCandidates.isSuccess ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No candidates found</p>
            <p className="text-sm text-muted-foreground text-center">
              Try adjusting your search criteria
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function CandidateCard({ candidateId }: { candidateId: Principal }) {
  const { data: profile, isLoading } = useGetCandidateProfile(candidateId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{profile.name}</CardTitle>
            <CardDescription className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {profile.experience.toString()} years
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-[#f58220]/30">
            {profile.department}
          </Badge>
        </div>
        {profile.cv && (
          <a
            href={profile.cv.getDirectURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-block"
          >
            View CV
          </a>
        )}
        <p className="text-sm text-muted-foreground">
          Contact: {profile.contactNumber}
        </p>
      </CardContent>
    </Card>
  );
}
