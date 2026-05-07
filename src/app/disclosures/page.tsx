import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Disclosures | Fregetrust' };
export default function DisclosuresPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Legal</div>
        <h1 className={styles.heroTitle}>Important Disclosures</h1>
        <p className={styles.heroSub}>Regulatory disclosures and important information about our products and services.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>FDIC Insurance Disclosure</h2>
          <p className={styles.sectionText}>Fregetrust is a Member FDIC institution. Deposits are insured up to $250,000 per depositor, per insured bank, for each account ownership category. FDIC insurance covers checking accounts, savings accounts, money market deposit accounts, and certificates of deposit.</p>
          <div className={styles.highlight}><p className={styles.highlightText}><strong>Member FDIC · NMLS #2024001 · Equal Housing Lender</strong><br/>Deposits insured up to $250,000 per depositor per account category.</p></div>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Interest Rate Disclosures</h2>
          <p className={styles.sectionText}>Annual Percentage Yields (APYs) are accurate as of the date of this disclosure and may change at any time. Fees may reduce earnings. The minimum balance required to open an account and earn the stated APY is disclosed at account opening.</p>
          <table className={styles.table}>
            <thead><tr><th>Account Type</th><th>APY</th><th>Min. Balance</th></tr></thead>
            <tbody>
              <tr><td>High-Yield Savings</td><td>4.50%</td><td>$0</td></tr>
              <tr><td>Checking</td><td>0.01%</td><td>$0</td></tr>
              <tr><td>Investment Account</td><td>Variable</td><td>$100</td></tr>
            </tbody>
          </table>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Wire Transfer Disclosures</h2>
          <p className={styles.sectionText}>International wire transfers are subject to applicable fees and exchange rates. Transfer times vary by destination country and correspondent bank. Fregetrust is not responsible for delays caused by receiving banks or intermediary institutions.</p>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact for Disclosures</h2>
          <p className={styles.sectionText}>For questions about any of these disclosures, please contact us at <strong>admin@fregetrust.com</strong>.</p>
        </div>
      </div>
    </div>
  );
}
