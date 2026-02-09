import { useState } from 'react';
import { useGetAllJobs, usePostJob, useUpdateJob, useDeleteJob, useGetApplicationsForJob, useUpdateApplicationStatus } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, Plus, Edit, Trash2, Users } from 'lucide-react';
import type { JobPosting } from '../../backend';
import { ApplicationStatus } from '../../backend';

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

export default function JobManagementTab() {
  const { identity } = useInternetIdentity();
  const { data: allJobs, isLoading } = useGetAllJobs();
  const postJob = usePostJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showApplicationsDialog, setShowApplicationsDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');

  const myPrincipal = identity?.getPrincipal();
  const myJobs = allJobs?.filter((job) => job.employerId.toString() === myPrincipal?.toString());

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setSalaryMin('');
    setSalaryMax('');
    setDescription('');
    setDepartment('');
    setCustomDepartment('');
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

  const handleCreateJob = async () => {
    if (!myPrincipal) return;

    const newJob: JobPosting = {
      id: BigInt(0),
      title,
      location,
      salaryRange: [BigInt(salaryMin), BigInt(salaryMax)],
      description,
      requiredDepartment: getFinalDepartment(),
      employerId: myPrincipal,
    };

    try {
      await postJob.mutateAsync(newJob);
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Create job error:', error);
    }
  };

  const handleEditJob = (job: JobPosting) => {
    setSelectedJob(job);
    setTitle(job.title);
    setLocation(job.location);
    setSalaryMin(job.salaryRange[0].toString());
    setSalaryMax(job.salaryRange[1].toString());
    setDescription(job.description);
    
    // Check if department is in predefined list
    if (DEPARTMENT_OPTIONS.includes(job.requiredDepartment)) {
      setDepartment(job.requiredDepartment);
      setCustomDepartment('');
    } else {
      setDepartment('Other');
      setCustomDepartment(job.requiredDepartment);
    }
    
    setShowEditDialog(true);
  };

  const handleUpdateJob = async () => {
    if (!selectedJob || !myPrincipal) return;

    const updatedJob: JobPosting = {
      ...selectedJob,
      title,
      location,
      salaryRange: [BigInt(salaryMin), BigInt(salaryMax)],
      description,
      requiredDepartment: getFinalDepartment(),
    };

    try {
      await updateJob.mutateAsync({ jobId: selectedJob.id, job: updatedJob });
      setShowEditDialog(false);
      resetForm();
      setSelectedJob(null);
    } catch (error) {
      console.error('Update job error:', error);
    }
  };

  const handleDeleteJob = async (jobId: bigint) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      try {
        await deleteJob.mutateAsync(jobId);
      } catch (error) {
        console.error('Delete job error:', error);
      }
    }
  };

  const handleViewApplications = (job: JobPosting) => {
    setSelectedJob(job);
    setShowApplicationsDialog(true);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Job Postings</h2>
          <p className="text-muted-foreground">Manage your job openings</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2 bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]">
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {myJobs && myJobs.length > 0 ? (
        <div className="grid gap-4">
          {myJobs.map((job) => (
            <Card key={job.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <CardDescription>
                      {job.location} • ₹{job.salaryRange[0].toString()} - ₹{job.salaryRange[1].toString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => handleEditJob(job)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDeleteJob(job.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-[#f58220]/30">
                    {job.requiredDepartment}
                  </Badge>
                </div>
                <Button variant="secondary" onClick={() => handleViewApplications(job)} className="gap-2">
                  <Users className="h-4 w-4" />
                  View Applications
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No job postings yet</p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create your first job posting to start receiving applications
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2 bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]">
              <Plus className="h-4 w-4" />
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Job Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <DialogDescription>Fill in the details for your job posting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" placeholder="e.g., Senior Software Engineer" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="e.g., Ludhiana, Punjab" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Min Salary (₹) *</Label>
                <Input id="salaryMin" type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Max Salary (₹) *</Label>
                <Input id="salaryMax" type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Required Department *</Label>
              <Select value={department} onValueChange={handleDepartmentChange}>
                <SelectTrigger id="department">
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
            {department === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="customDepartment">Custom Department *</Label>
                <Input
                  id="customDepartment"
                  placeholder="Enter department name"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateJob}
                disabled={!title || !location || !salaryMin || !salaryMax || !description || !getFinalDepartment() || postJob.isPending}
                className="bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]"
              >
                {postJob.isPending ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>Update the details for your job posting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Job Title *</Label>
              <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-salaryMin">Min Salary (₹) *</Label>
                <Input id="edit-salaryMin" type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-salaryMax">Max Salary (₹) *</Label>
                <Input id="edit-salaryMax" type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Job Description *</Label>
              <Textarea id="edit-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Required Department *</Label>
              <Select value={department} onValueChange={handleDepartmentChange}>
                <SelectTrigger id="edit-department">
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
            {department === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="edit-customDepartment">Custom Department *</Label>
                <Input
                  id="edit-customDepartment"
                  placeholder="Enter department name"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); setSelectedJob(null); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateJob} 
                disabled={updateJob.isPending || !getFinalDepartment()}
                className="bg-gradient-to-r from-[#f58220] to-[#f7931d] hover:from-[#e57310] hover:to-[#e88310]"
              >
                {updateJob.isPending ? 'Updating...' : 'Update Job'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Applications Dialog */}
      {selectedJob && (
        <ApplicationsDialog
          job={selectedJob}
          open={showApplicationsDialog}
          onOpenChange={setShowApplicationsDialog}
        />
      )}
    </div>
  );
}

function ApplicationsDialog({ job, open, onOpenChange }: { job: JobPosting; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: applications, isLoading } = useGetApplicationsForJob(job.id);
  const updateStatus = useUpdateApplicationStatus();

  const handleUpdateStatus = async (applicationId: bigint, statusValue: string) => {
    try {
      const status = statusValue as ApplicationStatus;
      await updateStatus.mutateAsync({ applicationId, status });
    } catch (error) {
      console.error('Update status error:', error);
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applications for {job.title}</DialogTitle>
          <DialogDescription>{job.location}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id.toString()}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">Candidate: {app.candidateId.toString().slice(0, 20)}...</p>
                      <p className="text-sm text-muted-foreground">Application ID: {app.id.toString()}</p>
                      {app.cv && (
                        <a
                          href={app.cv.getDirectURL()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          View CV
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge>{getStatusLabel(app.status)}</Badge>
                      <select
                        className="text-sm border rounded px-2 py-1"
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      >
                        <option value={ApplicationStatus.applied}>Applied</option>
                        <option value={ApplicationStatus.shortlisted}>Shortlisted</option>
                        <option value={ApplicationStatus.interview}>Interview</option>
                        <option value={ApplicationStatus.hired}>Hired</option>
                        <option value={ApplicationStatus.rejected}>Rejected</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No applications yet</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
