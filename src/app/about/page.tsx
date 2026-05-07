import Link from 'next/link';
import styles from '../public-pages.module.css';

export const metadata = { title: 'About Us | Strangefregetrust' };

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>About Us</div>
        <h1 className={styles.heroTitle}>Built on Trust.<br />Driven by Innovation.</h1>
        <p className={styles.heroSub}>Strangefregetrust is a modern digital bank committed to delivering enterprise-grade financial services to individuals and businesses worldwide.</p>
        <div className={styles.statsBar}>
          <div className={styles.stat}><div className={styles.statNum}>100K+</div><div className={styles.statLabel}>Customers Served</div></div>
          <div className={styles.stat}><div className={styles.statNum}>$2.4B+</div><div className={styles.statLabel}>Assets Under Management</div></div>
          <div className={styles.stat}><div className={styles.statNum}>4.50%</div><div className={styles.statLabel}>APY on Savings</div></div>
          <div className={styles.stat}><div className={styles.statNum}>99.9%</div><div className={styles.statLabel}>Platform Uptime</div></div>
        </div>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.sectionText}>At Strangefregetrust, our mission is simple: to make enterprise-grade banking accessible to everyone. We believe that every individual and business deserves access to powerful, secure, and transparent financial tools — regardless of size or location.</p>
          <p className={styles.sectionText}>Founded on the principles of integrity, innovation, and inclusion, we have built a digital-first banking platform that combines the reliability of traditional banking with the agility of modern technology.</p>
        </div>
        <div className={styles.grid3}>
          {[
            { icon: '🏛️', title: 'FDIC Insured', text: 'Your deposits are insured up to $250,000 per depositor, per account category, through our FDIC membership.' },
            { icon: '🔒', title: 'Bank-Grade Security', text: '256-bit SSL encryption, multi-factor authentication, and real-time fraud monitoring protect every transaction.' },
            { icon: '🌍', title: 'Global Reach', text: 'Send and receive money in 180+ countries with competitive exchange rates and transparent fees.' },
          ].map((item) => (
            <div key={item.title} className={styles.card}>
              <div className={styles.cardIcon}><span style={{fontSize:22}}>{item.icon}</span></div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={styles.grid2}>
            {[
              { title: 'Transparency', text: 'No hidden fees. No fine print surprises. We believe you deserve to know exactly what you pay for.' },
              { title: 'Security First', text: 'Every product decision starts with security. Your money and data are protected at every layer.' },
              { title: 'Customer Empowerment', text: 'We give you the tools, insights, and control to make the best financial decisions for your life.' },
              { title: 'Continuous Innovation', text: 'We invest heavily in technology to ensure our platform evolves with your needs.' },
            ].map((v) => (
              <div key={v.title} className={styles.highlight}>
                <strong style={{color:'#1E40AF',display:'block',marginBottom:6}}>{v.title}</strong>
                <p className={styles.highlightText}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaText}>Join over 100,000 customers who trust Strangefregetrust with their financial future.</p>
          <Link href="/auth/signup" className={styles.ctaBtn}>Open a Free Account →</Link>
        </div>
      </div>
    </div>
  );
}
