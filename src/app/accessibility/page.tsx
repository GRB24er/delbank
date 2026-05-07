import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Accessibility | Fregetrust' };
export default function AccessibilityPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Accessibility</div>
        <h1 className={styles.heroTitle}>Accessibility Statement</h1>
        <p className={styles.heroSub}>Fregetrust is committed to ensuring digital accessibility for people of all abilities.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Commitment</h2>
          <p className={styles.sectionText}>We are committed to providing a website and mobile application that is accessible to the widest possible audience, regardless of technology or ability. We aim to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.</p>
        </div>
        <div className={styles.grid3}>
          {[
            { title: 'Screen Reader Support', text: 'Our platform is built with semantic HTML and ARIA labels to ensure compatibility with screen readers including NVDA, JAWS, and VoiceOver.' },
            { title: 'Keyboard Navigation', text: 'All functionality is accessible via keyboard. Focus indicators are clearly visible throughout the interface.' },
            { title: 'Colour Contrast', text: 'We maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text across all pages.' },
          ].map((item) => (
            <div key={item.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Feedback & Contact</h2>
          <p className={styles.sectionText}>If you experience any accessibility barriers on our platform, please contact our accessibility team at <strong>admin@fregetrust.com</strong>. We aim to respond to accessibility feedback within 2 business days.</p>
        </div>
      </div>
    </div>
  );
}
