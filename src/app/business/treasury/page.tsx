import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Treasury Management | Strangefregetrust' };
export default function TreasuryManagementPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Business</div>
        <h1 className={styles.heroTitle}>Treasury Management</h1>
        <p className={styles.heroSub}>Optimize your working capital.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Cash Management Solutions</h2>
          <p className={styles.sectionText}>Advanced tools to manage liquidity, mitigate risk, and streamline your financial operations.</p>
        </div>
      </div>
    </div>
  );
}
