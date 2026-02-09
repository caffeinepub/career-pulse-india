import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Building2, MessageSquare, User } from 'lucide-react';
import JobSearchTab from '../components/candidate/JobSearchTab';
import EmployersTab from '../components/candidate/EmployersTab';
import ChatTab from '../components/candidate/ChatTab';
import CandidateProfileTab from '../components/candidate/CandidateProfileTab';

interface CandidatePortalProps {
  activeTab: 'jobs' | 'employers' | 'chat' | 'profile';
  setActiveTab: (tab: 'jobs' | 'employers' | 'chat' | 'profile') => void;
}

export default function CandidatePortal({ activeTab, setActiveTab }: CandidatePortalProps) {
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="jobs" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Find Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="employers" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Employers</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <JobSearchTab />
        </TabsContent>

        <TabsContent value="employers">
          <EmployersTab />
        </TabsContent>

        <TabsContent value="chat">
          <ChatTab />
        </TabsContent>

        <TabsContent value="profile">
          <CandidateProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
