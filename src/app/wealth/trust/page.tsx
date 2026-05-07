import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Trust & Estate | Strangefregetrust' };
export default function TrustEstatePage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Wealth</div>
        <h1 className={styles.heroTitle}>Trust & Estate Services</h1>
        <p className={styles.heroSub}>Preserve your legacy.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Generational Wealth Transfer</h2>
          <p className={styles.sectionText}>Expert trust administration and estate planning services to protect your assets for future generations.</p>
        </div>
      </div>
    </div>
  );
}
