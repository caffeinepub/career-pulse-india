import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { CONTACT } from '@/constants/contact';

export default function TermsOfServicePage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#f58220] to-[#f7931d] flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#f58220] to-[#f7931d] bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 31, 2025
          </p>
        </div>

        <Card className="border-t-4 border-t-[#f58220]">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              By accessing or using Career Pulse India, you agree to be bound by these Terms of Service and all 
              applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
              from using this platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Account Creation</h3>
              <p>
                To use Career Pulse India, you must create an account using Internet Identity authentication. 
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Account Types</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Job Seekers:</strong> Create profiles, search jobs, and apply to positions</li>
                <li><strong>Employers:</strong> Post jobs, search candidates, and manage applications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Account Responsibilities</h3>
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Keep your profile information up to date</li>
                <li>Not share your account with others</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the platform for any illegal purposes</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Scrape or collect data without permission</li>
              <li>Post spam or unsolicited messages</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Postings and Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">For Employers</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Job postings must be legitimate and accurate</li>
                <li>You are responsible for managing applications and communications</li>
                <li>You must comply with all applicable employment laws</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">For Job Seekers</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Applications must contain truthful information</li>
                <li>You are responsible for the content of your CV and profile</li>
                <li>Career Pulse India is not responsible for employment outcomes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The Career Pulse India platform, including its design, features, and content, is owned by Career Pulse 
              India and protected by intellectual property laws. You retain ownership of the content you submit, 
              but grant us a license to use it for providing our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Career Pulse India provides the platform "as is" without warranties of any kind. We are not liable 
              for any damages arising from your use of the platform, including but not limited to employment 
              outcomes, data loss, or service interruptions.
            </p>
            <div className="bg-gradient-to-r from-[#f58220]/10 to-[#f7931d]/10 p-4 rounded-lg border border-[#f58220]/20">
              <p className="font-semibold text-foreground">Important Notice</p>
              <p className="text-sm mt-1">
                Career Pulse India is a platform connecting job seekers and employers. We do not guarantee 
                employment outcomes and are not party to any employment agreements made through our platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We reserve the right to suspend or terminate your account at any time for violations of these Terms 
              of Service or for any other reason at our discretion. You may also delete your account at any time 
              through your profile settings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may update these Terms of Service from time to time. We will notify you of any material changes 
              by posting the new terms on this page and updating the "Last updated" date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> <a href={CONTACT.email.mailto} className="text-[#f58220] hover:underline">{CONTACT.email.display}</a></p>
              <p><strong>Phone:</strong> <a href={CONTACT.phone.tel} className="text-[#f58220] hover:underline">{CONTACT.phone.display}</a></p>
              <p><strong>Location:</strong> {CONTACT.location}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
