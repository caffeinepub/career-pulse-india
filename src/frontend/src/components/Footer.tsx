import { CONTACT } from '@/constants/contact';
import { SOCIAL_LINKS } from '@/constants/socialLinks';

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

  const handleSocialClick = (link: typeof SOCIAL_LINKS[number]) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (link.behavior === 'deep-link' && link.deepLink) {
      e.preventDefault();
      // Try to open the app
      window.location.href = link.deepLink;
      // Fallback to web URL after a short delay
      setTimeout(() => {
        window.open(link.url, '_blank');
      }, 500);
    }
    // For 'direct' behavior, let the default anchor behavior handle it
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
              <h4 className="text-sm font-semibold text-foreground mb-2">Follow Us</h4>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.behavior === 'direct' ? '_blank' : undefined}
                    rel={link.behavior === 'direct' ? 'noopener noreferrer' : undefined}
                    onClick={handleSocialClick(link)}
                    className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    aria-label={link.ariaLabel}
                  >
                    <img 
                      src={link.icon} 
                      alt={link.name} 
                      className="h-8 w-8 object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#f58220] transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
