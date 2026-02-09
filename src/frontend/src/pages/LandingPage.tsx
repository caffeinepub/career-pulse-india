import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, Building2, Target, Mail, Phone, MapPin, Handshake } from 'lucide-react';
import { SiWhatsapp, SiFacebook, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';
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
  const { login, isLoggingIn } = useInternetIdentity();

  const handleGetStarted = async () => {
    try {
      setIntendedUserType(UserType.candidate);
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      setIntendedUserType(null);
    }
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
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Loading...' : 'Get Started'}
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
                <p className="leading-relaxed">
                  We are a Ludhiana-based recruitment partner connecting companies with reliable talent 
                  and candidates with stable careers across Punjab, North India, and PAN India.
                </p>
                <p className="leading-relaxed">
                  We understand the unique challenges of the Indian job market and work tirelessly to bridge the gap 
                  between talented professionals and organizations seeking growth.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FFA726] bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-[#112629]">
                  <Target className="h-6 w-6 text-[#FFA726]" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[#112629]/80">
                <p className="leading-relaxed">
                  <strong className="text-[#112629]">At Career Pulse India</strong>, we empower job seekers and employers nationwide by delivering a trusted, efficient, and forward‑thinking recruitment platform. We bridge the gap between talent and opportunity, fostering meaningful career connections that drive personal success and sustainable economic growth across India's diverse industries.
                </p>
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-semibold text-[#112629]">Our mission is guided by five core values:</p>
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#FF9800] mt-1.5 flex-shrink-0" />
                      <span>
                        <strong className="text-[#FF9800]">Trust</strong> – Building transparent, lasting relationships.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#FF9800] mt-1.5 flex-shrink-0" />
                      <span>
                        <strong className="text-[#FF9800]">Efficiency</strong> – Streamlining recruitment for faster, smarter hiring.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#FF9800] mt-1.5 flex-shrink-0" />
                      <span>
                        <strong className="text-[#FF9800]">Innovation</strong> – Leveraging technology to stay ahead.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#FF9800] mt-1.5 flex-shrink-0" />
                      <span>
                        <strong className="text-[#FF9800]">Inclusivity</strong> – Creating opportunities for all.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#FF9800] mt-1.5 flex-shrink-0" />
                      <span>
                        <strong className="text-[#FF9800]">Growth</strong> – Driving success for individuals and businesses alike.
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-[#F8F9FA] scroll-mt-16">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF9800] to-[#FFA726] bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-lg text-[#112629]/80 max-w-3xl mx-auto">
              Comprehensive recruitment and HR solutions tailored to your needs
            </p>
          </div>

          <div className="space-y-12">
            {serviceCategories.map((category, idx) => (
              <div key={idx} className="space-y-6">
                <div className={`flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r ${category.gradient}`}>
                  {category.icon}
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.services.map((service, serviceIdx) => (
                    <Card key={serviceIdx} className="border-l-4 border-l-[#FF9800] hover:shadow-lg transition-shadow bg-white">
                      <CardHeader>
                        <CardTitle className="text-lg text-[#112629]">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-[#112629]/70">{service.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-lg max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-[#112629]">Ready to Get Started?</CardTitle>
                <CardDescription className="text-[#112629]/70">
                  Join thousands of professionals and companies finding success through Career Pulse India
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-[#FF9800] hover:bg-[#FFA726] text-white font-semibold"
                  onClick={handleGetStarted}
                  disabled={isLoggingIn}
                >
                  Find Jobs
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800] hover:text-white font-semibold"
                  onClick={handleStartHiring}
                  disabled={isLoggingIn}
                >
                  Hire Talent
                </Button>
              </CardContent>
            </Card>
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
              Have questions? We're here to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-[#112629]">
                  <Mail className="h-5 w-5 text-[#FF9800]" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href={CONTACT.email.mailto}
                  className="text-[#FF9800] hover:text-[#FFA726] transition-colors font-medium"
                >
                  {CONTACT.email.display}
                </a>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-[#112629]">
                  <Phone className="h-5 w-5 text-[#FF9800]" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href={CONTACT.phone.tel}
                  className="text-[#FF9800] hover:text-[#FFA726] transition-colors font-medium"
                >
                  {CONTACT.phone.display}
                </a>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-[#112629]">
                  <MapPin className="h-5 w-5 text-[#FF9800]" />
                  Visit Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#112629]/80">{CONTACT.location}</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FF9800] bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-[#112629]">
                  <SiWhatsapp className="h-5 w-5 text-[#FF9800]" />
                  WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href={CONTACT.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF9800] hover:text-[#FFA726] transition-colors font-medium"
                >
                  Chat with us
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4 text-[#112629]">Connect With Us</h3>
            <div className="flex justify-center gap-6">
              <a
                href="https://www.linkedin.com/in/careerpulseindia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0077B5] hover:opacity-70 transition-opacity"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="h-8 w-8" />
              </a>
              <a
                href="https://www.facebook.com/share/14W8tsQn5Js/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:opacity-70 transition-opacity"
                aria-label="Facebook"
              >
                <SiFacebook className="h-8 w-8" />
              </a>
              <a
                href="https://www.instagram.com/careerpulseindia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E4405F] hover:opacity-70 transition-opacity"
                aria-label="Instagram"
              >
                <SiInstagram className="h-8 w-8" />
              </a>
              <a
                href="https://www.youtube.com/@CareerPulseIndia01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF0000] hover:opacity-70 transition-opacity"
                aria-label="YouTube"
              >
                <SiYoutube className="h-8 w-8" />
              </a>
              <a
                href={CONTACT.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:opacity-70 transition-opacity"
                aria-label="WhatsApp"
              >
                <SiWhatsapp className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
