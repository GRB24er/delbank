import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Personal Loans | Fregetrust' };
export default function PersonalLoansPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Loans</div>
        <h1 className={styles.heroTitle}>Personal Loans</h1>
        <p className={styles.heroSub}>Funds for whatever you need.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Flexible Personal Financing</h2>
          <p className={styles.sectionText}>Consolidate debt or fund a major purchase with our low-rate personal loans.</p>
        </div>
      </div>
    </div>
  );
}
