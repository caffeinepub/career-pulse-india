import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";
import UserApproval "user-approval/approval";

actor {
  include MixinStorage();

  public type Department = Text;
  public type Location = Text;

  public type CandidateProfile = {
    name : Text;
    experience : Nat;
    department : Department;
    location : Location;
    contactNumber : Text;
    cv : ?Storage.ExternalBlob;
    searchable : Bool;
  };

  public type EmployerProfile = {
    companyName : Text;
    industry : Text;
    location : Location;
    contactEmail : Text;
    contactNumber : Text;
  };

  public type JobPosting = {
    id : Nat;
    title : Text;
    location : Location;
    salaryRange : (Nat, Nat);
    description : Text;
    requiredDepartment : Department;
    employerId : Principal;
  };

  public type JobApplication = {
    id : Nat;
    candidateId : Principal;
    jobId : Nat;
    status : ApplicationStatus;
    cv : ?Storage.ExternalBlob;
  };

  public type ApplicationStatus = {
    #applied;
    #shortlisted;
    #rejected;
    #interview;
    #hired;
  };

  public type ChatMessage = {
    sender : Principal;
    receiver : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type Rating = {
    rater : Principal;
    ratee : Principal;
    score : Nat;
    feedback : Text;
  };

  public type Notification = {
    recipient : Principal;
    message : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    userType : UserType;
  };

  public type UserType = {
    #candidate;
    #employer;
  };

  module Search {
    public func compareByScore(job1 : (JobPosting, Nat), job2 : (JobPosting, Nat)) : Order.Order {
      Int.compare(job1.1, job2.1);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let candidateProfiles = Map.empty<Principal, CandidateProfile>();
  let employerProfiles = Map.empty<Principal, EmployerProfile>();
  let jobPostings = Map.empty<Nat, JobPosting>();
  let jobApplications = Map.empty<Nat, JobApplication>();
  let chatMessages = Map.empty<Principal, [ChatMessage]>();
  let ratings = Map.empty<Principal, [Rating]>();
  let notifications = Map.empty<Principal, [Notification]>();

  var nextJobId = 1;
  var nextApplicationId = 1;

  let accessControlState = AccessControl.initState();

  let approvalState = UserApproval.initState(accessControlState);

  public type LoginResult = {
    success : Bool;
    userType : ?UserType;
    needsSetup : Bool;
  };

  public shared ({ caller }) func login() : async LoginResult {
    // Login should be accessible to all users including guests (anonymous)
    // No authorization check needed here - this is the entry point for authentication
    
    switch (userProfiles.get(caller)) {
      case (null) {
        let result : LoginResult = {
          success = false;
          userType = null;
          needsSetup = false;
        };
        result;
      };
      case (?profile) {
        let needsSetup = switch (profile.userType) {
          case (#candidate) { candidateProfiles.get(caller) == null };
          case (#employer) { employerProfiles.get(caller) == null };
        };
        let result : LoginResult = {
          success = true;
          userType = ?profile.userType;
          needsSetup;
        };
        result;
      };
    };
  };

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerCandidate(profile : CandidateProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register");
    };
    candidateProfiles.add(caller, profile);
    let userProfile : UserProfile = {
      name = profile.name;
      userType = #candidate;
    };
    userProfiles.add(caller, userProfile);
  };

  public shared ({ caller }) func updateCandidateProfile(profile : CandidateProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      switch (candidateProfiles.get(caller)) {
        case (null) { Runtime.trap("Profile not found") };
        case (?_) { candidateProfiles.add(caller, profile) };
      };
    } else {
      candidateProfiles.add(caller, profile);
    };
  };

  public shared ({ caller }) func registerEmployer(profile : EmployerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register");
    };
    employerProfiles.add(caller, profile);
    let userProfile : UserProfile = {
      name = profile.companyName;
      userType = #employer;
    };
    userProfiles.add(caller, userProfile);
  };

  public shared ({ caller }) func updateEmployerProfile(profile : EmployerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      switch (employerProfiles.get(caller)) {
        case (null) { Runtime.trap("Profile not found") };
        case (?_) { employerProfiles.add(caller, profile) };
      };
    } else {
      employerProfiles.add(caller, profile);
    };
  };

  private func hasLegitimateAccessToCandidate(employerId : Principal, candidateId : Principal) : Bool {
    let employerJobs = jobPostings.values().toArray().filter(
      func(job : JobPosting) : Bool {
        job.employerId == employerId;
      }
    );

    let hasApplication = jobApplications.values().toArray().filter(
      func(app : JobApplication) : Bool {
        app.candidateId == candidateId and
        employerJobs.filter(func(job : JobPosting) : Bool { job.id == app.jobId }).size() > 0;
      }
    ).size() > 0;

    hasApplication;
  };

  public query ({ caller }) func getCandidateProfile(user : Principal) : async ?CandidateProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    // Own profile - always accessible
    if (caller == user) {
      return candidateProfiles.get(user);
    };

    // Admin - full access
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return candidateProfiles.get(user);
    };

    // Employer access - only if candidate is searchable or has legitimate business relationship
    switch (employerProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Only candidates (own profile), employers, and admins can view candidate profiles");
      };
      case (?_) {
        switch (candidateProfiles.get(user)) {
          case (null) { null };
          case (?profile) {
            if (profile.searchable or hasLegitimateAccessToCandidate(caller, user)) {
              ?profile;
            } else {
              Runtime.trap("Unauthorized: Cannot view this candidate profile");
            };
          };
        };
      };
    };
  };

  private func hasLegitimateAccessToEmployer(candidateId : Principal, employerId : Principal) : Bool {
    // Check if candidate has applied to any jobs from this employer
    let employerJobs = jobPostings.values().toArray().filter(
      func(job : JobPosting) : Bool {
        job.employerId == employerId;
      }
    );

    let hasApplication = jobApplications.values().toArray().filter(
      func(app : JobApplication) : Bool {
        app.candidateId == candidateId and
        employerJobs.filter(func(job : JobPosting) : Bool { job.id == app.jobId }).size() > 0;
      }
    ).size() > 0;

    hasApplication;
  };

  public query ({ caller }) func getEmployerProfile(user : Principal) : async ?EmployerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    // Own profile - always accessible
    if (caller == user) {
      return employerProfiles.get(user);
    };

    // Admin - full access
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return employerProfiles.get(user);
    };

    // Candidate access - only if they have applied to jobs from this employer
    switch (candidateProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Only employers (own profile), candidates with applications, and admins can view employer profiles");
      };
      case (?_) {
        if (hasLegitimateAccessToEmployer(caller, user)) {
          return employerProfiles.get(user);
        } else {
          Runtime.trap("Unauthorized: Can only view employer profiles for jobs you have applied to");
        };
      };
    };
  };

  public query ({ caller }) func getAllCandidateProfiles() : async [(Principal, CandidateProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all candidate profiles");
    };
    candidateProfiles.entries().toArray();
  };

  public query ({ caller }) func getAllEmployerProfiles() : async [(Principal, EmployerProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all employer profiles");
    };
    employerProfiles.entries().toArray();
  };

  public shared ({ caller }) func adminUpdateCandidateProfile(user : Principal, profile : CandidateProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update other users' profiles");
    };
    candidateProfiles.add(user, profile);
  };

  public shared ({ caller }) func adminUpdateEmployerProfile(user : Principal, profile : EmployerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update other users' profiles");
    };
    employerProfiles.add(user, profile);
  };

  public shared ({ caller }) func adminDeleteCandidateProfile(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete profiles");
    };
    candidateProfiles.remove(user);
    userProfiles.remove(user);
  };

  public shared ({ caller }) func adminDeleteEmployerProfile(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete profiles");
    };
    employerProfiles.remove(user);
    userProfiles.remove(user);
  };

  public shared ({ caller }) func postJob(job : JobPosting) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post jobs");
    };

    switch (employerProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Only employers can post jobs");
      };
      case (?_) {
        let jobId = nextJobId;
        nextJobId += 1;
        let newJob = {
          job with
          id = jobId;
          employerId = caller;
        };
        jobPostings.add(jobId, newJob);
        jobId;
      };
    };
  };

  public shared ({ caller }) func updateJob(jobId : Nat, job : JobPosting) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update jobs");
    };

    switch (jobPostings.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?existingJob) {
        if (existingJob.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own job postings");
        };
        let updatedJob = {
          job with
          id = jobId;
          employerId = existingJob.employerId;
        };
        jobPostings.add(jobId, updatedJob);
      };
    };
  };

  public shared ({ caller }) func deleteJob(jobId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete jobs");
    };

    switch (jobPostings.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?existingJob) {
        if (existingJob.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own job postings");
        };
        jobPostings.remove(jobId);
      };
    };
  };

  public shared ({ caller }) func adminDeleteJob(jobId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete any job posting");
    };
    jobPostings.remove(jobId);
  };

  public query ({ caller }) func searchJobsByDepartment(
    department : Department,
    location : Location,
  ) : async [JobPosting] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can search jobs");
    };

    jobPostings.values().toArray().filter(
      func(job : JobPosting) : Bool {
        job.location == location and job.requiredDepartment == department;
      }
    );
  };

  public query ({ caller }) func getTopJobRecommendations(
    location : Location,
    department : Department,
  ) : async [JobPosting] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get recommendations");
    };

    jobPostings.values().toArray().filter(
      func(job : JobPosting) : Bool {
        job.location == location and job.requiredDepartment == department;
      }
    );
  };

  public query ({ caller }) func getAllJobs() : async [JobPosting] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view jobs");
    };
    jobPostings.values().toArray();
  };

  public shared ({ caller }) func applyForJob(jobId : Nat, cv : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply for jobs");
    };

    switch (candidateProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Only candidates can apply for jobs");
      };
      case (?_) {
        switch (jobPostings.get(jobId)) {
          case (null) { Runtime.trap("Job not found") };
          case (?_) {
            let applicationId = nextApplicationId;
            nextApplicationId += 1;
            let application : JobApplication = {
              id = applicationId;
              candidateId = caller;
              jobId;
              status = #applied;
              cv;
            };
            jobApplications.add(applicationId, application);
          };
        };
      };
    };
  };

  public query ({ caller }) func getMyApplications() : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view applications");
    };

    jobApplications.values().toArray().filter(
      func(app : JobApplication) : Bool {
        app.candidateId == caller;
      }
    );
  };

  public query ({ caller }) func getApplicationsForJob(jobId : Nat) : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view applications");
    };

    switch (jobPostings.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view applications for your own jobs");
        };
        jobApplications.values().toArray().filter(
          func(app : JobApplication) : Bool {
            app.jobId == jobId;
          }
        );
      };
    };
  };

  public shared ({ caller }) func updateApplicationStatus(
    applicationId : Nat,
    status : ApplicationStatus,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update applications");
    };

    switch (jobApplications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) {
        switch (jobPostings.get(app.jobId)) {
          case (null) { Runtime.trap("Job not found") };
          case (?job) {
            if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only update applications for your own jobs");
            };
            let updatedApp = { app with status = status };
            jobApplications.add(applicationId, updatedApp);
          };
        };
      };
    };
  };

  public shared ({ caller }) func sendMessage(receiver : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    if (userProfiles.get(receiver) == null) {
      Runtime.trap("Invalid receiver: User not found");
    };

    let message : ChatMessage = {
      sender = caller;
      receiver;
      content;
      timestamp = Time.now();
    };

    let senderMessages = switch (chatMessages.get(caller)) {
      case (null) { [] };
      case (?msgs) { msgs };
    };
    chatMessages.add(caller, senderMessages.concat([message]));

    let receiverMessages = switch (chatMessages.get(receiver)) {
      case (null) { [] };
      case (?msgs) { msgs };
    };
    chatMessages.add(receiver, receiverMessages.concat([message]));
  };

  public query ({ caller }) func getMessagesWithUser(user : Principal) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    let allMessages = switch (chatMessages.get(caller)) {
      case (null) { [] };
      case (?msgs) { msgs };
    };

    allMessages.filter(
      func(msg : ChatMessage) : Bool {
        (msg.sender == caller and msg.receiver == user) or
        (msg.sender == user and msg.receiver == caller);
      }
    );
  };

  public query ({ caller }) func getAllMyMessages() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (chatMessages.get(caller)) {
      case (null) { [] };
      case (?msgs) { msgs };
    };
  };

  public shared ({ caller }) func leaveRating(ratee : Principal, score : Nat, feedback : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can leave ratings");
    };

    if (score < 1 or score > 5) {
      Runtime.trap("Invalid rating: score must be between 1 and 5");
    };

    if (userProfiles.get(ratee) == null) {
      Runtime.trap("Invalid ratee: User not found");
    };

    let rating : Rating = {
      rater = caller;
      ratee;
      score;
      feedback;
    };
    let existingRatings = switch (ratings.get(ratee)) {
      case (null) { [] };
      case (?r) { r };
    };
    ratings.add(ratee, existingRatings.concat([rating]));
  };

  public query ({ caller }) func getRatingsForUser(user : Principal) : async [Rating] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view ratings");
    };

    switch (ratings.get(user)) {
      case (null) { [] };
      case (?r) { r };
    };
  };

  public shared ({ caller }) func sendNotification(recipient : Principal, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can send notifications");
    };

    if (userProfiles.get(recipient) == null) {
      Runtime.trap("Invalid recipient: User not found");
    };

    let notification : Notification = {
      recipient;
      message;
      timestamp = Time.now();
    };
    let existingNotifications = switch (notifications.get(recipient)) {
      case (null) { [] };
      case (?n) { n };
    };
    notifications.add(recipient, existingNotifications.concat([notification]));
  };

  public query ({ caller }) func getNotifications(limit : Nat) : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };

    let allNotifications = switch (notifications.get(caller)) {
      case (null) { [] };
      case (?n) { n };
    };

    let limitInt = if (limit > 0) { Nat.min(limit, allNotifications.size()) } else { allNotifications.size() };
    Array.tabulate<Notification>(limitInt, func(i : Nat) : Notification { allNotifications[i] });
  };

  public query ({ caller }) func getJobPostingsCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };
    jobPostings.size();
  };

  public query ({ caller }) func getApplicationsCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };
    jobApplications.size();
  };

  public query ({ caller }) func getCandidatesCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };
    candidateProfiles.size();
  };

  public query ({ caller }) func getEmployersCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };
    employerProfiles.size();
  };

  public query ({ caller }) func getPlacementSuccessRate() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };

    let totalApplications = jobApplications.size();
    if (totalApplications == 0) {
      return 0.0;
    };

    let hiredCount = jobApplications.values().toArray().filter(
      func(app : JobApplication) : Bool {
        switch (app.status) {
          case (#hired) { true };
          case (_) { false };
        };
      }
    ).size();

    (hiredCount.toFloat()) / (totalApplications.toFloat());
  };

  public query ({ caller }) func getAllAnalytics() : async {
    jobPostings : Nat;
    applications : Nat;
    candidates : Nat;
    employers : Nat;
    placementRate : Float;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };

    let totalApplications = jobApplications.size();
    let hiredCount = jobApplications.values().toArray().filter(
      func(app : JobApplication) : Bool {
        switch (app.status) {
          case (#hired) { true };
          case (_) { false };
        };
      }
    ).size();

    let placementRate = if (totalApplications == 0) {
      0.0;
    } else {
      (hiredCount.toFloat()) / (totalApplications.toFloat());
    };

    {
      jobPostings = jobPostings.size();
      applications = totalApplications;
      candidates = candidateProfiles.size();
      employers = employerProfiles.size();
      placementRate;
    };
  };

  public query ({ caller }) func searchCandidates(
    department : Department,
    location : Location,
  ) : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search candidates");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      switch (employerProfiles.get(caller)) {
        case (null) {
          Runtime.trap("Unauthorized: Only employers can search candidates");
        };
        case (?_) {};
      };
    };

    let matchingCandidates = candidateProfiles.entries().toArray().filter(
      func(entry : (Principal, CandidateProfile)) : Bool {
        let (_, profile) = entry;
        profile.location == location and 
        profile.department == department and
        profile.searchable;
      }
    );

    matchingCandidates.map(
      func(entry : (Principal, CandidateProfile)) : Principal {
        entry.0;
      }
    );
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };
};
