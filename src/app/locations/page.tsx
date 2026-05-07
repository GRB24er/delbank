import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Locations | Strangefregetrust' };
export default function LocationsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Locations</div>
        <h1 className={styles.heroTitle}>Global Presence,<br/>Local Service</h1>
        <p className={styles.heroSub}>Strangefregetrust operates as a digital-first bank with a global footprint, serving customers in 180+ countries.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Digital Banking — Available Everywhere</h2>
          <p className={styles.sectionText}>As a digital-first institution, Strangefregetrust is accessible 24/7 from any device, anywhere in the world. Our platform supports international wire transfers, multi-currency accounts, and global card acceptance in 180+ countries.</p>
          <div className={styles.highlight}><p className={styles.highlightText}>For all inquiries, account support, and correspondence, please contact us at <strong>admin@strangefregetrust.com</strong>. Our support team operates 24 hours a day, 7 days a week.</p></div>
        </div>
        <div className={styles.grid3}>
          {['Americas', 'Europe & UK', 'Asia Pacific', 'Middle East & Africa', 'Caribbean', 'Latin America'].map((region) => (
            <div key={region} className={styles.card}>
              <h3 className={styles.cardTitle}>{region}</h3>
              <p className={styles.cardText}>Full digital banking services available. International wire transfers supported. Contact admin@strangefregetrust.com for regional enquiries.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
