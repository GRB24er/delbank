import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Retirement Planning | Strangefregetrust' };
export default function RetirementPlanningPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Wealth</div>
        <h1 className={styles.heroTitle}>Retirement Planning</h1>
        <p className={styles.heroSub}>Secure your future.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Plan for Tomorrow</h2>
          <p className={styles.sectionText}>Comprehensive retirement strategies to ensure you maintain your lifestyle in your golden years.</p>
        </div>
      </div>
    </div>
  );
}
