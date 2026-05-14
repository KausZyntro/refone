import ContactSection from '@/components/contact/ContactSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Refone',
  description: 'Get in touch with Refone',
  alternates: {
    canonical: '/contact-us',
  },
};

export default function ContactUsPage() {
  return (
    <main style={{ minHeight: '60vh', paddingTop: '20px' }}>
      <ContactSection />
    </main>
  );
}
