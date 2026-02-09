// Single source of truth for contact information
export const CONTACT = {
  phone: {
    display: '+91 9888955099',
    number: '919888955099',
    tel: 'tel:+919888955099',
  },
  whatsapp: {
    url: 'https://wa.me/919888955099',
    urlWithMessage: 'https://wa.me/919888955099?text=Hi,%20I%20have%20a%20query%20about%20your%20services!',
  },
  email: {
    display: 'resume1.cpi@gmail.com',
    mailto: 'mailto:resume1.cpi@gmail.com',
  },
  location: 'Ludhiana, India',
} as const;
