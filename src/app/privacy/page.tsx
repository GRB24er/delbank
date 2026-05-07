import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Privacy Policy | Strangefregetrust' };
export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Legal</div>
        <h1 className={styles.heroTitle}>Privacy Policy</h1>
        <p className={styles.heroSub}>We are committed to protecting your personal information and your right to privacy.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <p className={styles.lastUpdated}>Last updated: May 1, 2026</p>
        {[
          { title: '1. Information We Collect', text: 'We collect information you provide directly to us, such as when you create an account, make a transaction, or contact us for support. This includes your name, email address, phone number, date of birth, government-issued ID, and financial information necessary to provide our services.' },
          { title: '2. How We Use Your Information', text: 'We use the information we collect to provide, maintain, and improve our services; process transactions; send you technical notices and support messages; respond to your comments and questions; and comply with legal obligations including anti-money laundering (AML) and Know Your Customer (KYC) requirements.' },
          { title: '3. Information Sharing', text: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.' },
          { title: '4. Data Security', text: 'We implement industry-standard security measures including 256-bit SSL encryption, multi-factor authentication, and regular security audits to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
          { title: '5. Data Retention', text: 'We retain your personal information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.' },
          { title: '6. Your Rights', text: 'You have the right to access, update, or delete your personal information at any time through your account settings. You may also contact us at admin@strangefregetrust.com to exercise your rights or if you have any privacy concerns.' },
          { title: '7. Contact Us', text: 'If you have any questions about this Privacy Policy, please contact our Privacy Team at admin@strangefregetrust.com. We will respond to your inquiry within 5 business days.' },
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
