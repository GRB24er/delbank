import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Credit Cards | Fregetrust' };
export default function CreditCardsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Cards</div>
        <h1 className={styles.heroTitle}>Premium Credit Cards</h1>
        <p className={styles.heroSub}>Exclusive rewards and global purchasing power.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Explore Our Cards</h2>
          <p className={styles.sectionText}>Find the perfect credit card to match your lifestyle, with premium travel benefits and cash back rewards.</p>
        </div>
      </div>
    </div>
  );
}
