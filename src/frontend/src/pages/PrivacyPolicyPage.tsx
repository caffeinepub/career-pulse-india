import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { CONTACT } from '@/constants/contact';

export default function PrivacyPolicyPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#f58220] to-[#f7931d] flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#f58220] to-[#f7931d] bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 31, 2025
          </p>
        </div>

        <Card className="border-t-4 border-t-[#f58220]">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Career Pulse India ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our recruitment platform.
            </p>
            <p>
              By using Career Pulse India, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Professional information (work experience, skills, department)</li>
                <li>Location and employment preferences</li>
                <li>CV/Resume documents</li>
                <li>Company information (for employers)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Usage Information</h3>
              <p>We automatically collect certain information about your device and how you interact with our platform.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide, maintain, and improve our recruitment services</li>
              <li>Match job seekers with relevant opportunities</li>
              <li>Enable communication between candidates and employers</li>
              <li>Send notifications about job matches and application updates</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Your data is stored securely on the Internet Computer blockchain, providing enterprise-grade security 
              and data integrity. We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="bg-gradient-to-r from-[#f58220]/10 to-[#f7931d]/10 p-4 rounded-lg border border-[#f58220]/20">
              <p className="font-semibold text-foreground">Blockchain Security</p>
              <p className="text-sm mt-1">
                Our platform leverages the Internet Computer's secure infrastructure, ensuring your data is protected 
                by cryptographic protocols and distributed consensus mechanisms.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access and review your personal information</li>
              <li>Update or correct your information</li>
              <li>Control your profile visibility to employers</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of certain communications</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us:
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
