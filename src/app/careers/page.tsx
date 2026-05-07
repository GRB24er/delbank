import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Careers | Fregetrust' };
export default function CareersPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Careers</div>
        <h1 className={styles.heroTitle}>Build the Future of Banking</h1>
        <p className={styles.heroSub}>Join a team of innovators, engineers, and financial experts shaping the next generation of digital banking.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Why Work With Us</h2>
          <div className={styles.grid3}>
            {[
              { title: 'Competitive Compensation', text: 'Market-leading salaries, equity participation, and comprehensive benefits packages.' },
              { title: 'Remote-First Culture', text: 'Work from anywhere with flexible hours and a results-driven environment.' },
              { title: 'Growth & Learning', text: 'Dedicated learning budget, mentorship programs, and clear career progression paths.' },
            ].map((item) => (
              <div key={item.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Open Positions</h2>
          <p className={styles.sectionText}>We are currently building our team. To express interest in joining Fregetrust, please send your CV and a brief introduction to <strong>admin@fregetrust.com</strong> with the subject line "Career Enquiry".</p>
        </div>
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Interested in Joining?</h2>
          <p className={styles.ctaText}>Send us your details and we will be in touch when a suitable role opens.</p>
          <a href="mailto:admin@fregetrust.com?subject=Career Enquiry" className={styles.ctaBtn}>Send Your CV →</a>
        </div>
      </div>
    </div>
  );
}
