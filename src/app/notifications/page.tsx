import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Notifications | Strangefregetrust' };
export default function NotificationsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Notifications</h2>
          <p className={styles.sectionText}>You have no new notifications at this time.</p>
        </div>
      </div>
    </div>
  );
}
