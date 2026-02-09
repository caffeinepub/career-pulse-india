import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAllAnalytics, useGetAllCandidateProfiles, useGetAllEmployerProfiles, useGetAllJobs, useAdminDeleteCandidateProfile, useAdminDeleteEmployerProfile, useAdminDeleteJob } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Briefcase, Users, TrendingUp, Building2, Download, Trash2, Shield, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export default function AdminPortal() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: analytics, isLoading: analyticsLoading } = useGetAllAnalytics();
  const { data: candidates = [], isLoading: candidatesLoading } = useGetAllCandidateProfiles();
  const { data: employers = [], isLoading: employersLoading } = useGetAllEmployerProfiles();
  const { data: jobs = [], isLoading: jobsLoading } = useGetAllJobs();
  const deleteCandidateMutation = useAdminDeleteCandidateProfile();
  const deleteEmployerMutation = useAdminDeleteEmployerProfile();
  const deleteJobMutation = useAdminDeleteJob();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const isAuthenticated = !!identity;

  if (isInitializing || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-12 max-w-2xl mx-auto text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">Please log in to access the Admin Portal.</p>
        <Button onClick={() => navigate({ to: '/' })} className="bg-gradient-to-r from-[#f58220] to-[#f7931d]">
          Go to Home
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container px-4 py-12 max-w-2xl mx-auto text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-destructive" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You do not have permission to access the Admin Portal.</p>
        <Button onClick={() => navigate({ to: '/' })} className="bg-gradient-to-r from-[#f58220] to-[#f7931d]">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (!analytics) return;

    const csvContent = `Metric,Value
Job Postings,${analytics.jobPostings}
Applications,${analytics.applications}
Candidates,${analytics.candidates}
Employers,${analytics.employers}
Placement Rate,${(analytics.placementRate * 100).toFixed(2)}%`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-pulse-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported successfully');
  };

  const handleExportJSON = () => {
    if (!analytics) return;

    const jsonContent = JSON.stringify(analytics, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-pulse-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported successfully');
  };

  const handleDeleteCandidate = async (principal: string) => {
    try {
      await deleteCandidateMutation.mutateAsync(principal);
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const handleDeleteEmployer = async (principal: string) => {
    try {
      await deleteEmployerMutation.mutateAsync(principal);
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const handleDeleteJob = async (jobId: bigint) => {
    try {
      await deleteJobMutation.mutateAsync(jobId);
    } catch (error) {
      // Error already handled by mutation
    }
  };

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f58220] to-[#f7931d] flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f58220] to-[#f7931d] bg-clip-text text-transparent">
            Admin Portal
          </h1>
        </div>
        <p className="text-muted-foreground">Manage platform users, jobs, and view analytics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="candidates" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Candidates</span>
          </TabsTrigger>
          <TabsTrigger value="employers" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Employers</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Jobs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {analyticsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : analytics ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Job Postings</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.jobPostings.toString()}</div>
                    <p className="text-xs text-muted-foreground">Total active jobs</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Applications</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.applications.toString()}</div>
                    <p className="text-xs text-muted-foreground">Total applications</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Candidates</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.candidates.toString()}</div>
                    <p className="text-xs text-muted-foreground">Registered job seekers</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Employers</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.employers.toString()}</div>
                    <p className="text-xs text-muted-foreground">Registered companies</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Placement Success Rate</CardTitle>
                  <CardDescription>Percentage of applications that resulted in hires</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#f58220] to-[#f7931d] bg-clip-text text-transparent">
                    {(analytics.placementRate * 100).toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Analytics</CardTitle>
                  <CardDescription>Download platform metrics for reporting</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button onClick={handleExportCSV} className="gap-2 bg-gradient-to-r from-[#f58220] to-[#f7931d]">
                    <Download className="h-4 w-4" />
                    Export as CSV
                  </Button>
                  <Button onClick={handleExportJSON} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export as JSON
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : null}
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Registered Candidates</CardTitle>
              <CardDescription>View and manage all candidate profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {candidatesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : candidates.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No candidates registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Searchable</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map(([principal, profile]) => (
                        <TableRow key={principal.toString()}>
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{profile.department}</Badge>
                          </TableCell>
                          <TableCell>{profile.location}</TableCell>
                          <TableCell>{profile.experience.toString()} years</TableCell>
                          <TableCell>{profile.contactNumber}</TableCell>
                          <TableCell>
                            <Badge variant={profile.searchable ? 'default' : 'outline'}>
                              {profile.searchable ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Candidate Profile</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {profile.name}'s profile? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCandidate(principal.toString())}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employers">
          <Card>
            <CardHeader>
              <CardTitle>Registered Employers</CardTitle>
              <CardDescription>View and manage all employer profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {employersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : employers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No employers registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employers.map(([principal, profile]) => (
                        <TableRow key={principal.toString()}>
                          <TableCell className="font-medium">{profile.companyName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{profile.industry}</Badge>
                          </TableCell>
                          <TableCell>{profile.location}</TableCell>
                          <TableCell>{profile.contactEmail}</TableCell>
                          <TableCell>{profile.contactNumber}</TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Employer Profile</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {profile.companyName}'s profile? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEmployer(principal.toString())}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>All Job Postings</CardTitle>
              <CardDescription>View and manage all job postings on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : jobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No jobs posted yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Salary Range</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id.toString()}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{job.requiredDepartment}</Badge>
                          </TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>
                            ₹{Number(job.salaryRange[0]).toLocaleString()} - ₹{Number(job.salaryRange[1]).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{job.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
