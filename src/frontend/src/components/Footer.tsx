import { CONTACT } from '@/constants/contact';

export default function Footer() {
  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Branding */}
          <div className="space-y-3">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
              aria-label="Scroll to top"
            >
              <img 
                src="/assets/CPI FINAL LOGO.png" 
                alt="Career Pulse India Logo" 
                className="h-12 w-12 object-contain" 
              />
              <div className="flex flex-col">
                <h2 className="text-base font-bold leading-tight bg-gradient-to-r from-[#f58220] to-[#f7931d] bg-clip-text text-transparent">
                  Career Pulse India
                </h2>
                <p className="text-xs leading-tight text-[#1a1a1a]">
                  Bridging Talent to Top Jobs
                </p>
              </div>
            </button>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleSmoothScroll('about')}
                  className="text-sm text-muted-foreground hover:text-[#f58220] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSmoothScroll('services')}
                  className="text-sm text-muted-foreground hover:text-[#f58220] transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSmoothScroll('contact')}
                  className="text-sm text-muted-foreground hover:text-[#f58220] transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact and Social */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={CONTACT.email.mailto} className="hover:text-[#f58220] transition-colors">
                  {CONTACT.email.display}
                </a>
              </li>
              <li>
                <a href={CONTACT.phone.tel} className="hover:text-[#f58220] transition-colors">
                  {CONTACT.phone.display}
                </a>
              </li>
              <li>{CONTACT.location}</li>
            </ul>

            <div className="pt-2">
              <h4 className="text-sm font-semibold text-foreground mb-2">Connect With Us</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/careerpulseindia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  aria-label="LinkedIn"
                >
                  <img 
                    src="/assets/generated/social-linkedin-fullcolor.dim_64x64.png" 
                    alt="LinkedIn" 
                    className="h-5 w-5 object-contain"
                  />
                </a>
                <a
                  href="fb://page/careerpulseindia"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'fb://page/careerpulseindia';
                    setTimeout(() => {
                      window.open('https://www.facebook.com/share/14W8tsQn5Js/?mibextid=wwXIfr', '_blank');
                    }, 500);
                  }}
                  className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  aria-label="Facebook"
                >
                  <img 
                    src="/assets/generated/social-facebook-fullcolor.dim_64x64.png" 
                    alt="Facebook" 
                    className="h-5 w-5 object-contain"
                  />
                </a>
                <a
                  href="instagram://user?username=careerpulseindia"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'instagram://user?username=careerpulseindia';
                    setTimeout(() => {
                      window.open('https://www.instagram.com/careerpulseindia', '_blank');
                    }, 500);
                  }}
                  className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  aria-label="Instagram"
                >
                  <img 
                    src="/assets/generated/social-instagram-fullcolor.dim_64x64.png" 
                    alt="Instagram" 
                    className="h-5 w-5 object-contain"
                  />
                </a>
                <a
                  href="vnd.youtube://www.youtube.com/@CareerPulseIndia01"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'vnd.youtube://www.youtube.com/@CareerPulseIndia01';
                    setTimeout(() => {
                      window.open('https://www.youtube.com/@CareerPulseIndia01', '_blank');
                    }, 500);
                  }}
                  className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  aria-label="YouTube"
                >
                  <img 
                    src="/assets/generated/social-youtube-fullcolor.dim_64x64.png" 
                    alt="YouTube" 
                    className="h-5 w-5 object-contain"
                  />
                </a>
                <a
                  href={CONTACT.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  aria-label="WhatsApp"
                >
                  <img 
                    src="/assets/generated/social-whatsapp-fullcolor.dim_64x64.png" 
                    alt="WhatsApp" 
                    className="h-5 w-5 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© 2025. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-[#f58220] transition-colors">caffeine.ai</a></p>
        </div>
      </div>
    </footer>
  );
}
