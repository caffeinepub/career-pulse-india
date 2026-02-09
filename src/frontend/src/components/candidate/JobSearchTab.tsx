import { useState } from 'react';
import { useGetAllJobs, useApplyForJob, useGetMyApplications, useGetCandidateProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, MapPin, DollarSign, Search, CheckCircle2 } from 'lucide-react';
import type { JobPosting } from '../../backend';

export default function JobSearchTab() {
  const { identity } = useInternetIdentity();
  const { data: jobs, isLoading } = useGetAllJobs();
  const { data: applications } = useGetMyApplications();
  const { data: candidateProfile } = useGetCandidateProfile(identity?.getPrincipal());
  const applyForJob = useApplyForJob();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  const filteredJobs = jobs?.filter((job) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.requiredDepartment.toLowerCase().includes(searchLower)
    );
  });

  const hasApplied = (jobId: bigint) => {
    return applications?.some((app) => app.jobId === jobId);
  };

  const handleApply = async (job: JobPosting) => {
    setSelectedJob(job);
    setShowApplicationDialog(true);
  };

  const confirmApplication = async () => {
    if (!selectedJob) return;

    try {
      await applyForJob.mutateAsync({
        jobId: selectedJob.id,
        cv: candidateProfile?.cv || null,
      });
      setShowApplicationDialog(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Application error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, location, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredJobs && filteredJobs.length > 0 ? (
        <div className="grid gap-4">
          {filteredJobs.map((job) => {
            const applied = hasApplied(job.id);
            return (
              <Card key={job.id.toString()} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ₹{job.salaryRange[0].toString()} - ₹{job.salaryRange[1].toString()}
                        </span>
                      </CardDescription>
                    </div>
                    {applied ? (
                      <Badge variant="secondary" className="gap-1 flex-shrink-0">
                        <CheckCircle2 className="h-3 w-3" />
                        Applied
                      </Badge>
                    ) : (
                      <Button 
                        onClick={() => handleApply(job)} 
                        size="sm" 
                        className="flex-shrink-0 bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]"
                      >
                        Apply Now
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-[#f58220]/30">
                      {job.requiredDepartment}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No jobs found</p>
            <p className="text-sm text-muted-foreground text-center">
              {searchTerm ? 'Try adjusting your search criteria' : 'Check back later for new opportunities'}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogDescription>
              You are about to apply for <strong>{selectedJob?.title}</strong> at {selectedJob?.location}.
              {candidateProfile?.cv ? ' Your uploaded CV will be sent with this application.' : ' No CV on file - you can add one in your profile.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmApplication} 
              disabled={applyForJob.isPending}
              className="bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]"
            >
              {applyForJob.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Applying...
                </>
              ) : (
                'Confirm Application'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
