import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Investment Management | Fregetrust' };
export default function WealthInvestmentPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Wealth</div>
        <h1 className={styles.heroTitle}>Investment Management</h1>
        <p className={styles.heroSub}>Professional portfolio management.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Active & Passive Strategies</h2>
          <p className={styles.sectionText}>Tailored investment portfolios designed to meet your specific risk tolerance and goals.</p>
        </div>
      </div>
    </div>
  );
}
