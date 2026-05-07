import Link from 'next/link';
import styles from '../../public-pages.module.css';
export const metadata = { title: 'Admin - Users | Strangefregetrust' };
export default function AdminUsersPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>User Management</h2>
          <p className={styles.sectionText}>Admin access required to view this page.</p>
        </div>
      </div>
    </div>
  );
}
