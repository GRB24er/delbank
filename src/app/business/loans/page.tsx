import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Business Loans | Strangefregetrust' };
export default function BusinessLoansPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Business</div>
        <h1 className={styles.heroTitle}>Commercial Lending</h1>
        <p className={styles.heroSub}>Capital to fuel your business growth.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Flexible Financing</h2>
          <p className={styles.sectionText}>From lines of credit to commercial real estate loans, we offer tailored financing solutions for your enterprise.</p>
        </div>
      </div>
    </div>
  );
}
