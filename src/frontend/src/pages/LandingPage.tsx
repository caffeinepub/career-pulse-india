import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, Building2, Target, Mail, Phone, MapPin, Handshake } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { setIntendedUserType } from '../App';
import { UserType } from '../backend';
import { CONTACT } from '@/constants/contact';

interface Service {
  name: string;
  description: string;
}

interface ServiceCategory {
  title: string;
  icon: React.ReactNode;
  services: Service[];
  gradient: string;
}

export default function LandingPage() {
  const { login } = useInternetIdentity();

  const handleGetStarted = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfPd7k1jiJqI71faIie9aYOmeScqdQ98jTcIFtYoJK9AJvHig/viewform?usp=preview', '_blank', 'noopener,noreferrer');
  };

  const handleStartHiring = async () => {
    try {
      setIntendedUserType(UserType.employer);
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      setIntendedUserType(null);
    }
  };

  const serviceCategories: ServiceCategory[] = [
    {
      title: 'For Candidates',
      icon: <Users className="h-6 w-6 text-white" />,
      gradient: 'from-[#FF9800] to-[#FFA726]',
      services: [
        { name: 'Job Matching', description: 'Connect with opportunities that match your skills and career goals.' },
        { name: 'Resume Optimization', description: 'Professional resume enhancement to stand out to employers.' },
        { name: 'Interview Coaching', description: 'Expert guidance to help you ace your interviews.' },
        { name: 'LinkedIn Profile Enhancement', description: 'Optimize your LinkedIn presence to attract recruiters and opportunities.' },
        { name: 'Career Guidance', description: 'Personalized career counseling to help you navigate your professional journey.' },
      ],
    },
    {
      title: 'For Employers',
      icon: <Briefcase className="h-6 w-6 text-white" />,
      gradient: 'from-[#FF9800] to-[#FFA726]',
      services: [
        { name: 'End‑to‑End Staffing', description: 'Complete recruitment solutions from sourcing to onboarding.' },
        { name: 'Candidate Sourcing', description: 'Access to a vast network of qualified professionals.' },
        { name: 'Payroll Support', description: 'Efficient payroll management and processing services.' },
        { name: 'Training Programs', description: 'Customized training solutions for your workforce.' },
        { name: 'HR Compliance Audits', description: 'Ensure your HR practices meet regulatory standards.' },
      ],
    },
    {
      title: 'For Corporate Clients',
      icon: <Building2 className="h-6 w-6 text-white" />,
      gradient: 'from-[#FF9800] to-[#FFA726]',
      services: [
        { name: 'HR Consulting', description: 'Strategic HR advisory for organizational growth.' },
        { name: 'Payroll Management', description: 'Efficient and accurate payroll processing solutions.' },
        { name: 'Statutory Compliance', description: 'Stay compliant with labor laws and regulations.' },
        { name: 'Employer Branding', description: 'Build a strong employer brand to attract top talent.' },
        { name: 'Digital Marketing', description: 'Strategic digital marketing solutions to enhance your brand visibility.' },
      ],
    },
    {
      title: 'For Business Partners',
      icon: <Handshake className="h-6 w-6 text-white" />,
      gradient: 'from-[#FF9800] to-[#FFA726]',
      services: [
        { name: 'Referral Programs', description: 'Earn rewards by referring quality candidates or clients.' },
        { name: 'Co-Branded Campaigns', description: 'Collaborative marketing initiatives for mutual growth.' },
        { name: 'White-Label Staffing', description: 'Recruitment under your brand name.' },
        { name: 'Job Ad Posting', description: 'Expand your reach with our job posting network.' },
      ],
    },
  ];

  return (
    <div className="flex-1 bg-[#F8F9FA]">
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-[#F8F9FA] py-16 md:py-24 scroll-mt-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/assets/CPI FINAL LOGO.png" 
                  alt="Career Pulse India" 
                  className="h-24 w-24 object-contain" 
                />
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF9800] to-[#FFA726] bg-clip-text text-transparent">
                    Career Pulse India
                  </h2>
                  <p className="text-sm text-[#112629] font-medium">Bridging Talent to Top Jobs</p>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#112629]">
                Find Your Dream Job in <span className="bg-gradient-to-r from-[#FF9800] to-[#FFA726] bg-clip-text text-transparent">India</span>
              </h1>
              <p className="text-lg text-[#112629]/80">
                Career Pulse India connects talented professionals with leading employers across the nation. 
                Start your journey to career success today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 bg-[#FF9800] hover:bg-[#FFA726] text-white border-0 font-semibold"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/generated/candidate-hero.dim_800x600.jpg" 
                alt="Career opportunities" 
                className="rounded-lg shadow-2xl border-4 border-[#112629]/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-[#F2F3F8] scroll-mt-16">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF9800] to-[#FFA726] bg-clip-text text-transparent">
              About Career Pulse India
            </h2>
            <p className="text-lg text-[#112629]/80 max-w-3xl mx-auto">
              Career Pulse India is a Talent Solutions & HR Consulting Firm offering recruitment, career development, 
              payroll, compliance, and employer branding services across India.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-[#112629]">
                  <Building2 className="h-6 w-6 text-[#FF9800]" />
                  Who We Are
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[#112629]/80">
                <p>
                  Career Pulse India is a Talent Solutions & HR Consulting Firm offering recruitment, career development, 
                  payroll, compliance, and employer branding services across India.
                </p>
                <p>
                  We specialize in connecting top talent with leading organizations while providing comprehensive HR solutions 
                  to businesses of all sizes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-[#112629]">
                  <Target className="h-6 w-6 text-[#FF9800]" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[#112629]/80">
                <p>
                  To bridge the gap between talented professionals and leading employers, creating meaningful career 
                  opportunities and driving organizational success.
                </p>
                <p>
                  We are committed to delivering excellence in recruitment and HR services while maintaining the highest 
                  standards of integrity and professionalism.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-[#112629]">Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FF9800] to-[#FFA726] flex items-center justify-center">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#112629] mb-2">Excellence</h3>
                    <p className="text-sm text-[#112629]/70">Delivering exceptional quality in every service</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FF9800] to-[#FFA726] flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#112629] mb-2">Integrity</h3>
                    <p className="text-sm text-[#112629]/70">Maintaining trust through honest practices</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FF9800] to-[#FFA726] flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#112629] mb-2">Innovation</h3>
                    <p className="text-sm text-[#112629]/70">Embracing new approaches to recruitment</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FF9800] to-[#FFA726] flex items-center justify-center">
                      <Handshake className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#112629] mb-2">Partnership</h3>
                    <p className="text-sm text-[#112629]/70">Building lasting relationships with clients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-[#F8F9FA] scroll-mt-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF9800] to-[#FFA726] bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-lg text-[#112629]/80 max-w-3xl mx-auto">
              Comprehensive talent solutions and HR services tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {serviceCategories.map((category, idx) => (
              <Card key={idx} className="border-t-4 border-t-[#FF9800] bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.gradient}`}>
                      {category.icon}
                    </div>
                    <span className="text-[#112629]">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.services.map((service, serviceIdx) => (
                      <li key={serviceIdx} className="border-l-2 border-[#FF9800] pl-4">
                        <h4 className="font-semibold text-[#112629] mb-1">{service.name}</h4>
                        <p className="text-sm text-[#112629]/70">{service.description}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#112629] to-[#1a3a3f]">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're looking for your dream job or seeking top talent for your organization, 
            Career Pulse India is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 bg-[#FF9800] hover:bg-[#FFA726] text-white border-0 font-semibold"
              onClick={handleGetStarted}
            >
              Find Jobs
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 bg-white hover:bg-white/90 text-[#112629] border-2 border-white font-semibold"
              onClick={handleStartHiring}
            >
              Hire Talent
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-[#F2F3F8] scroll-mt-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF9800] to-[#FFA726] bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-lg text-[#112629]/80">
              We're here to help you succeed. Reach out to us today!
            </p>
          </div>

          <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#112629]">Contact Information</CardTitle>
              <CardDescription className="text-[#112629]/70">
                Connect with us through any of these channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <a 
                  href={CONTACT.phone.tel}
                  className="flex items-start gap-3 p-4 rounded-lg bg-[#F8F9FA] hover:bg-[#FF9800]/10 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF9800] to-[#FFA726] group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#112629] mb-1">Phone</h3>
                    <p className="text-sm text-[#112629]/70">{CONTACT.phone.display}</p>
                  </div>
                </a>

                <a 
                  href={CONTACT.email.mailto}
                  className="flex items-start gap-3 p-4 rounded-lg bg-[#F8F9FA] hover:bg-[#FF9800]/10 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF9800] to-[#FFA726] group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#112629] mb-1">Email</h3>
                    <p className="text-sm text-[#112629]/70 break-all">{CONTACT.email.display}</p>
                  </div>
                </a>

                <a 
                  href={CONTACT.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-lg bg-[#F8F9FA] hover:bg-[#FF9800]/10 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF9800] to-[#FFA726] group-hover:scale-110 transition-transform">
                    <SiWhatsapp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#112629] mb-1">WhatsApp</h3>
                    <p className="text-sm text-[#112629]/70">{CONTACT.phone.display}</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#F8F9FA]">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF9800] to-[#FFA726]">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#112629] mb-1">Location</h3>
                    <p className="text-sm text-[#112629]/70">{CONTACT.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
