// src/app/discover/page.js
import ContactForm from '@/components/forms/payment';

export const metadata = {
  title: 'Contact us page| FindPilot',
  description:
    'Discover top brands and curated reviews on FindPilot. Submit your product details to get featured in our partner showcase and reach targeted buyers.',
  keywords: [
    'FindPilot',
    'discover top brands',
    'partner showcase',
    'get featured',
    'contact FindPilot',
    'brand promotion',
    'product showcase',
    'affiliate partnership'
  ],
  openGraph: {
    title: 'Discover Top Brands & Partner Showcase | FindPilot',
    description:
      'Discover top brands and curated reviews on FindPilot. Get your product featured in our partner showcase today.',
    url: 'https://findpilot.cc/discover',
    siteName: 'FindPilot',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Top Brands & Partner Showcase | FindPilot',
    description:
      'Discover top brands and curated reviews on FindPilot. Get your product featured in our partner showcase today.'
  }
};

export default function DiscoverPage() {
  return (
    <div style={{ maxWidth: '840px', margin: '40px auto', padding: '0 20px' }}>
      <section style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Discover Top Brands</h1>
        <p style={{ color: '#636466' }}>
          Explore curated reviews and high-performing products promoted across our network.
        </p>
      </section>

      {/* Embedded Contact Form Component */}
      <ContactForm 
        title="Get Your Product Featured on getting" 
        badge="Partner Showcase" 
      />
    </div>
  );
}