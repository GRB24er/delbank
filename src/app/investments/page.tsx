import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Investments | Fregetrust' };
export default function InvestmentsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Investments</div>
        <h1 className={styles.heroTitle}>Grow Your Wealth<br/>With Confidence</h1>
        <p className={styles.heroSub}>Access a full suite of investment products — from stocks and ETFs to fixed income and alternative assets.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.grid3}>
          {[
            { title: 'Stocks & ETFs', text: 'Trade thousands of stocks and ETFs with real-time pricing and zero commission on eligible trades.' },
            { title: 'Fixed Income', text: 'Access government and corporate bonds with competitive yields and transparent pricing.' },
            { title: 'Crypto Assets', text: 'Buy, sell, and hold leading cryptocurrencies directly from your Fregetrust account.' },
            { title: 'Managed Portfolios', text: 'Let our algorithm build and rebalance a diversified portfolio tailored to your risk profile.' },
            { title: 'Retirement Accounts', text: 'IRA and Roth IRA accounts with tax advantages to help you plan for the future.' },
            { title: 'Research & Analytics', text: 'Access professional-grade market research, earnings reports, and portfolio analytics.' },
          ].map((item) => (
            <div key={item.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Start Investing Today</h2>
          <p className={styles.ctaText}>Open an account in minutes and access world-class investment tools.</p>
          <Link href="/auth/signup" className={styles.ctaBtn}>Open Investment Account →</Link>
        </div>
      </div>
    </div>
  );
}
