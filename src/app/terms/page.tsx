import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Terms of Service | Fregetrust' };
export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Legal</div>
        <h1 className={styles.heroTitle}>Terms of Service</h1>
        <p className={styles.heroSub}>Please read these terms carefully before using our services.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <p className={styles.lastUpdated}>Last updated: May 1, 2026 · Effective: May 1, 2026</p>
        {[
          { title: '1. Acceptance of Terms', text: 'By accessing or using Fregetrust services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.' },
          { title: '2. Account Registration', text: 'To use our services, you must register for an account and provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
          { title: '3. Acceptable Use', text: 'You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services for any fraudulent, illegal, or unauthorized purpose, including money laundering, terrorist financing, or any other criminal activity.' },
          { title: '4. Transaction Authorization', text: 'All transactions initiated through our platform require your explicit authorization. Once a transaction is submitted and processed, it may not be reversible. You are responsible for verifying all transaction details before submission.' },
          { title: '5. Fees and Charges', text: 'Certain services may be subject to fees. All applicable fees will be disclosed to you before you complete a transaction. We reserve the right to modify our fee structure with 30 days notice to account holders.' },
          { title: '6. Limitation of Liability', text: 'Fregetrust shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services, to the maximum extent permitted by applicable law.' },
          { title: '7. Governing Law', text: 'These Terms shall be governed by and construed in accordance with applicable financial regulations and laws. Any disputes arising under these Terms shall be resolved through binding arbitration.' },
          { title: '8. Contact', text: 'For questions about these Terms, contact us at admin@fregetrust.com.' },
        ].map((s) => (
          <div key={s.title} className={styles.section}>
            <h2 className={styles.sectionTitle}>{s.title}</h2>
            <p className={styles.sectionText}>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
