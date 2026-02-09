import { useEffect, useState } from 'react';
import { SiWhatsapp } from 'react-icons/si';
import { CONTACT } from '@/constants/contact';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after a short delay for smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open(
      CONTACT.whatsapp.urlWithMessage,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`whatsapp-float-button ${isVisible ? 'whatsapp-visible' : ''}`}
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <SiWhatsapp className="whatsapp-icon" />
    </button>
  );
}
