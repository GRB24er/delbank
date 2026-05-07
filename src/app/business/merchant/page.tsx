import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Merchant Services | Strangefregetrust' };
export default function MerchantServicesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Business</div>
        <h1 className={styles.heroTitle}>Merchant Services</h1>
        <p className={styles.heroSub}>Accept payments globally with ease.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Payment Processing</h2>
          <p className={styles.sectionText}>Secure, fast, and reliable payment processing solutions for online and in-person transactions.</p>
        </div>
      </div>
    </div>
  );
}
