import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Business Accounts | Fregetrust' };
export default function BusinessAccountsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Business</div>
        <h1 className={styles.heroTitle}>Enterprise Accounts</h1>
        <p className={styles.heroSub}>Scalable banking solutions for growing businesses.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Business Checking & Savings</h2>
          <p className={styles.sectionText}>Manage your company's cash flow with our high-yield business accounts, featuring unlimited transactions and advanced reporting.</p>
        </div>
      </div>
    </div>
  );
}
