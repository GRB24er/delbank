import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Private Banking | Strangefregetrust' };
export default function PrivateBankingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Wealth</div>
        <h1 className={styles.heroTitle}>Private Banking</h1>
        <p className={styles.heroSub}>Exclusive services for high-net-worth individuals.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Bespoke Financial Solutions</h2>
          <p className={styles.sectionText}>Enjoy personalized banking, priority support, and exclusive access to premium investment opportunities.</p>
        </div>
      </div>
    </div>
  );
}
