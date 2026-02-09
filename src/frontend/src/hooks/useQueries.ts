import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  CandidateProfile,
  EmployerProfile,
  JobPosting,
  JobApplication,
  ChatMessage,
  Rating,
  Notification,
  ApplicationStatus,
  Department,
  Location,
  ExternalBlob,
  LoginResult,
} from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { toast } from 'sonner';

// Login Query
export function useLogin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoginResult>({
    queryKey: ['login'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.login();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['login'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Candidate Profile Queries
export function useRegisterCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CandidateProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerCandidate(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['candidateProfile'] });
      queryClient.invalidateQueries({ queryKey: ['login'] });
      toast.success('Welcome to Career Pulse India! Your profile is ready.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to register: ${error.message}`);
    },
  });
}

export function useUpdateCandidateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CandidateProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCandidateProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidateProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
}

export function useGetCandidateProfile(user?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CandidateProfile | null>({
    queryKey: ['candidateProfile', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      return actor.getCandidateProfile(user);
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}

// Employer Profile Queries
export function useRegisterEmployer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: EmployerProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerEmployer(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['login'] });
      toast.success('Welcome to Career Pulse India! Your company profile is ready.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to register: ${error.message}`);
    },
  });
}

export function useUpdateEmployerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: EmployerProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEmployerProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
}

export function useGetEmployerProfile(user?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EmployerProfile | null>({
    queryKey: ['employerProfile', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      return actor.getEmployerProfile(user);
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}

// Job Posting Queries
export function useGetAllJobs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['allJobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePostJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: JobPosting) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postJob(job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allJobs'] });
      toast.success('Job posted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to post job: ${error.message}`);
    },
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, job }: { jobId: bigint; job: JobPosting }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJob(jobId, job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allJobs'] });
      toast.success('Job updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update job: ${error.message}`);
    },
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allJobs'] });
      toast.success('Job deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete job: ${error.message}`);
    },
  });
}

export function useSearchJobsByDepartment() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ department, location }: { department: Department; location: Location }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchJobsByDepartment(department, location);
    },
  });
}

export function useGetTopJobRecommendations() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ location, department }: { location: Location; department: Department }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTopJobRecommendations(location, department);
    },
  });
}

// Job Application Queries
export function useApplyForJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, cv }: { jobId: bigint; cv: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyForJob(jobId, cv);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      toast.success('Application submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to apply: ${error.message}`);
    },
  });
}

export function useGetMyApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['myApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyApplications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetApplicationsForJob(jobId?: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['jobApplications', jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId === undefined) return [];
      return actor.getApplicationsForJob(jobId);
    },
    enabled: !!actor && !actorFetching && jobId !== undefined,
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: bigint; status: ApplicationStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] });
      toast.success('Application status updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}

// Chat/Messaging Queries
export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiver, content }: { receiver: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(receiver, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['allMessages'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}

export function useGetMessagesWithUser(user?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['messages', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getMessagesWithUser(user);
    },
    enabled: !!actor && !actorFetching && !!user,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
}

export function useGetAllMyMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['allMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMyMessages();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

// Rating Queries
export function useLeaveRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ratee, score, feedback }: { ratee: Principal; score: bigint; feedback: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.leaveRating(ratee, score, feedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      toast.success('Rating submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit rating: ${error.message}`);
    },
  });
}

export function useGetRatingsForUser(user?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Rating[]>({
    queryKey: ['ratings', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getRatingsForUser(user);
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}

// Notification Queries
export function useGetNotifications(limit: bigint = BigInt(50)) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notifications', limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications(limit);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

// Candidate Search (for employers)
export function useSearchCandidates() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ department, location }: { department: Department; location: Location }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchCandidates(department, location);
    },
  });
}

// Admin Analytics Queries
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllAnalytics();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllCandidateProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, CandidateProfile]>>({
    queryKey: ['allCandidateProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCandidateProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllEmployerProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, EmployerProfile]>>({
    queryKey: ['allEmployerProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployerProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminDeleteCandidateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalString: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(principalString);
      return actor.adminDeleteCandidateProfile(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCandidateProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Candidate profile deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete profile: ${error.message}`);
    },
  });
}

export function useAdminDeleteEmployerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalString: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(principalString);
      return actor.adminDeleteEmployerProfile(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEmployerProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Employer profile deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete profile: ${error.message}`);
    },
  });
}

export function useAdminDeleteJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminDeleteJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allJobs'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Job posting deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete job: ${error.message}`);
    },
  });
}
