import Link from 'next/link';
import styles from './brokerage.module.css';

export const metadata = {
  title: 'Product Sourcing & Brokerage Services | FindPilot',
  description:
    'Streamline your product sourcing with FindPilot. Connect with pre-vetted global suppliers, negotiate competitive terms, and protect your deals for a flat 3% sourcing fee.',
  keywords: [
    'FindPilot brokerage',
    'product sourcing service',
    'global supplier vetting',
    'manufacturing brokerage',
    'custom product sourcing',
    '3% sourcing fee',
    'supplier matching',
    'contract negotiation',
    'quality verification'
  ],
  openGraph: {
    title: 'Product Sourcing & Brokerage Services | FindPilot',
    description:
      'Connect with verified global suppliers and secure top terms for custom product sourcing with FindPilot’s 3% brokerage solution.',
    url: 'https://findpilot.cc/brokerage',
    siteName: 'FindPilot',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Sourcing & Brokerage Services | FindPilot',
    description:
      'Connect with verified global suppliers and secure top terms for custom product sourcing with FindPilot’s 3% brokerage solution.'
  }
};

export default function BrokeragePage() {
  const steps = [
    {
      number: '01',
      title: 'Submit Detailed Specifications',
      description:
        'Share your exact product or service specifications, required order volume, target pricing, and delivery timeline through our intake form.',
      details: [
        'Custom technical spec & blueprint review',
        'Target unit economics & budget alignment',
        'Compliance & regulatory requirement checks'
      ]
    },
    {
      number: '02',
      title: 'Supplier Vetting & Matching',
      description:
        'We tap into our pre-screened global network of verified suppliers and manufacturers to find exact matches for your production criteria.',
      details: [
        'Rigorous manufacturer background checks',
        'Capacity and quality standard audit',
        'Shortlist of top 2-3 optimal suppliers'
      ]
    },
    {
      number: '03',
      title: 'Negotiation & Sample Verification',
      description:
        'We negotiate competitive terms on your behalf and coordinate prototype or sample validation before committing to full production.',
      details: [
        'Direct price & MOQ (Minimum Order Quantity) negotiation',
        'Sample delivery & quality assurance approval',
        'Contract terms & timeline confirmation'
      ]
    },
    {
      number: '04',
      title: 'Deal Closing & 3% Sourcing Fee',
      description:
        'Once terms are approved and the contract is signed, we finalize the deal. Our transparent 3% brokerage fee is applied only upon successful transaction closing.',
      details: [
        'Transparent 3% commission on fulfilled order value',
        'No hidden upfront retainer or monthly subscription',
        'Ongoing escrow and milestone deal support'
      ]
    }
  ];

  const features = [
    {
      title: '3% Transparent Sourcing Fee',
      text: 'You only pay when a deal is successfully closed and verified. Zero hidden costs or recurring lock-ins.'
    },
    {
      title: 'Pre-Vetted Global Network',
      text: 'Access audited, trusted suppliers and service providers capable of fulfilling custom, high-detail orders.'
    },
    {
      title: 'End-to-End Deal Protection',
      text: 'From contract terms to sample checks, we safeguard your specifications and capital throughout the process.'
    }
  ];

  return (
    <main className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.badge}>SOURCING & BROKERAGE</span>
        <h1 className={styles.title}>How Our Product & Service Brokerage Works</h1>
        <p className={styles.subtitle}>
          Need a specific product or custom manufacturing partner? We connect you directly with pre-vetted suppliers, handle negotiations, and secure the best terms for a flat 3% fee.
        </p>
      </header>

      {/* Overview Cards */}
      <section className={styles.overviewGrid}>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureText}>{feature.text}</p>
          </div>
        ))}
      </section>

      {/* Process Feed (Quora Style Timeline) */}
      <section className={styles.processSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>The 4-Step Sourcing Workflow</h2>
          <p className={styles.sectionSubtitle}>
            A streamlined, transparent path from technical request to verified delivery.
          </p>
        </div>

        <div className={styles.timelineFeed}>
          {steps.map((step) => (
            <article key={step.number} className={styles.stepCard}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
              </div>
              <p className={styles.stepDescription}>{step.description}</p>
              
              <ul className={styles.detailList}>
                {step.details.map((item, idx) => (
                  <li key={idx} className={styles.detailItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to Find Your Supplier?</h2>
          <p className={styles.ctaText}>
            Review our transparent pricing structure or request custom product sourcing today.
          </p>
          <Link href="/index/pricing" className={styles.ctaBtn}>
            Go to Pricing & Sourcing Plans
          </Link>
        </div>
      </section>
    </main>
  );
}