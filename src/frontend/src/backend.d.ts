import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Location = string;
export type Time = bigint;
export interface Rating {
    feedback: string;
    score: bigint;
    ratee: Principal;
    rater: Principal;
}
export interface JobApplication {
    cv?: ExternalBlob;
    id: bigint;
    status: ApplicationStatus;
    jobId: bigint;
    candidateId: Principal;
}
export interface JobPosting {
    id: bigint;
    title: string;
    description: string;
    employerId: Principal;
    salaryRange: [bigint, bigint];
    requiredDepartment: Department;
    location: Location;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type Department = string;
export interface Notification {
    recipient: Principal;
    message: string;
    timestamp: Time;
}
export interface ChatMessage {
    content: string;
    sender: Principal;
    timestamp: Time;
    receiver: Principal;
}
export interface LoginResult {
    userType?: UserType;
    needsSetup: boolean;
    success: boolean;
}
export interface CandidateProfile {
    cv?: ExternalBlob;
    name: string;
    experience: bigint;
    searchable: boolean;
    contactNumber: string;
    department: Department;
    location: Location;
}
export interface EmployerProfile {
    contactEmail: string;
    companyName: string;
    contactNumber: string;
    location: Location;
    industry: string;
}
export interface UserProfile {
    userType: UserType;
    name: string;
}
export enum ApplicationStatus {
    hired = "hired",
    interview = "interview",
    applied = "applied",
    rejected = "rejected",
    shortlisted = "shortlisted"
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserType {
    employer = "employer",
    candidate = "candidate"
}
export interface backendInterface {
    adminDeleteCandidateProfile(user: Principal): Promise<void>;
    adminDeleteEmployerProfile(user: Principal): Promise<void>;
    adminDeleteJob(jobId: bigint): Promise<void>;
    adminUpdateCandidateProfile(user: Principal, profile: CandidateProfile): Promise<void>;
    adminUpdateEmployerProfile(user: Principal, profile: EmployerProfile): Promise<void>;
    applyForJob(jobId: bigint, cv: ExternalBlob | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteJob(jobId: bigint): Promise<void>;
    getAllAnalytics(): Promise<{
        employers: bigint;
        placementRate: number;
        jobPostings: bigint;
        applications: bigint;
        candidates: bigint;
    }>;
    getAllCandidateProfiles(): Promise<Array<[Principal, CandidateProfile]>>;
    getAllEmployerProfiles(): Promise<Array<[Principal, EmployerProfile]>>;
    getAllJobs(): Promise<Array<JobPosting>>;
    getAllMyMessages(): Promise<Array<ChatMessage>>;
    getApplicationsCount(): Promise<bigint>;
    getApplicationsForJob(jobId: bigint): Promise<Array<JobApplication>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidateProfile(user: Principal): Promise<CandidateProfile | null>;
    getCandidatesCount(): Promise<bigint>;
    getEmployerProfile(user: Principal): Promise<EmployerProfile | null>;
    getEmployersCount(): Promise<bigint>;
    getJobPostingsCount(): Promise<bigint>;
    getMessagesWithUser(user: Principal): Promise<Array<ChatMessage>>;
    getMyApplications(): Promise<Array<JobApplication>>;
    getNotifications(limit: bigint): Promise<Array<Notification>>;
    getPlacementSuccessRate(): Promise<number>;
    getRatingsForUser(user: Principal): Promise<Array<Rating>>;
    getTopJobRecommendations(location: Location, department: Department): Promise<Array<JobPosting>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    leaveRating(ratee: Principal, score: bigint, feedback: string): Promise<void>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    login(): Promise<LoginResult>;
    postJob(job: JobPosting): Promise<bigint>;
    registerCandidate(profile: CandidateProfile): Promise<void>;
    registerEmployer(profile: EmployerProfile): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchCandidates(department: Department, location: Location): Promise<Array<Principal>>;
    searchJobsByDepartment(department: Department, location: Location): Promise<Array<JobPosting>>;
    sendMessage(receiver: Principal, content: string): Promise<void>;
    sendNotification(recipient: Principal, message: string): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    updateApplicationStatus(applicationId: bigint, status: ApplicationStatus): Promise<void>;
    updateCandidateProfile(profile: CandidateProfile): Promise<void>;
    updateEmployerProfile(profile: EmployerProfile): Promise<void>;
    updateJob(jobId: bigint, job: JobPosting): Promise<void>;
}
