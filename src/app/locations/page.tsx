import Link from 'next/link';
import styles from '../public-pages.module.css';
import { BRAND } from '@/config/brand';
export const metadata = { title: 'Locations | Fregetrust' };

const OFFICES = [
  { label: BRAND.headOffice.label, city: BRAND.headOffice.city, lines: BRAND.headOffice.lines },
  ...BRAND.branches.map((b) => ({ label: b.label, city: b.city, lines: b.lines })),
];
export default function LocationsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Locations</div>
        <h1 className={styles.heroTitle}>Global Presence,<br/>Local Service</h1>
        <p className={styles.heroSub}>Fregetrust operates as a digital-first bank with a global footprint, serving customers in 180+ countries.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Offices</h2>
          <p className={styles.sectionText}>Fregetrust is headquartered in Glasgow, United Kingdom, with branch offices in Luxembourg and Dubai. Alongside our physical presence, our digital platform supports international wire transfers, multi-currency accounts, and global card acceptance in 180+ countries.</p>
        </div>
        <div className={styles.grid3}>
          {OFFICES.map((office) => (
            <div key={office.label} className={styles.card}>
              <h3 className={styles.cardTitle}>{office.label}</h3>
              <p className={styles.cardText} style={{ fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{office.city}</p>
              <p className={styles.cardText}>
                {office.lines.map((line) => (
                  <span key={line}>{line}<br/></span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.section}>
          <div className={styles.highlight}><p className={styles.highlightText}>For all inquiries, account support, and correspondence, please contact us at <strong>{BRAND.supportEmail}</strong>. Our support team operates 24 hours a day, 7 days a week. In-person visits are by appointment only.</p></div>
        </div>
      </div>
    </div>
  );
}
