import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Wealth Advisory | Fregetrust' };
export default function WealthAdvisoryPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Wealth</div>
        <h1 className={styles.heroTitle}>Wealth Advisory</h1>
        <p className={styles.heroSub}>Expert guidance for your financial future.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Personalized Strategies</h2>
          <p className={styles.sectionText}>Work with our dedicated advisors to create a comprehensive wealth management plan.</p>
        </div>
      </div>
    </div>
  );
}
