// Single source of truth for social media links - Version 77 configuration
export const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/careerpulseindia',
    icon: '/assets/generated/social-linkedin-fullcolor.dim_64x64.png',
    ariaLabel: 'Visit our LinkedIn page',
    behavior: 'direct', // Opens directly in new tab
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/14W8tsQn5Js/?mibextid=wwXIfr',
    deepLink: 'fb://page/careerpulseindia',
    icon: '/assets/generated/social-facebook-fullcolor.dim_64x64.png',
    ariaLabel: 'Visit our Facebook page',
    behavior: 'deep-link', // Tries app first, falls back to web
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/careerpulseindia',
    deepLink: 'instagram://user?username=careerpulseindia',
    icon: '/assets/generated/social-instagram-fullcolor.dim_64x64.png',
    ariaLabel: 'Visit our Instagram profile',
    behavior: 'deep-link',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@CareerPulseIndia01',
    deepLink: 'vnd.youtube://www.youtube.com/@CareerPulseIndia01',
    icon: '/assets/generated/social-youtube-fullcolor.dim_64x64.png',
    ariaLabel: 'Visit our YouTube channel',
    behavior: 'deep-link',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/919888955099',
    icon: '/assets/generated/social-whatsapp-fullcolor.dim_64x64.png',
    ariaLabel: 'Contact us on WhatsApp',
    behavior: 'direct',
  },
] as const;

export type SocialLink = typeof SOCIAL_LINKS[number];
