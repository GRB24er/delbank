import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Mortgages | Fregetrust' };
export default function MortgagesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Loans</div>
        <h1 className={styles.heroTitle}>Home Loans</h1>
        <p className={styles.heroSub}>Financing for your dream home.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Mortgage Solutions</h2>
          <p className={styles.sectionText}>Competitive rates and flexible terms for home purchases and refinancing.</p>
        </div>
      </div>
    </div>
  );
}
