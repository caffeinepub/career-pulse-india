import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Users, MessageSquare, Building2 } from 'lucide-react';
import JobManagementTab from '../components/employer/JobManagementTab';
import CandidateSearchTab from '../components/employer/CandidateSearchTab';
import EmployerChatTab from '../components/employer/EmployerChatTab';
import EmployerProfileTab from '../components/employer/EmployerProfileTab';

interface EmployerPortalProps {
  activeTab: 'jobs' | 'employers' | 'chat' | 'profile';
  setActiveTab: (tab: 'jobs' | 'employers' | 'chat' | 'profile') => void;
}

export default function EmployerPortal({ activeTab, setActiveTab }: EmployerPortalProps) {
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="jobs" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">My Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="employers" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Candidates</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <JobManagementTab />
        </TabsContent>

        <TabsContent value="employers">
          <CandidateSearchTab />
        </TabsContent>

        <TabsContent value="chat">
          <EmployerChatTab />
        </TabsContent>

        <TabsContent value="profile">
          <EmployerProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
