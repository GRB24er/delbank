import Link from 'next/link';
import styles from '../public-pages.module.css';
export const metadata = { title: 'Contact Us | Fregetrust' };
export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>Contact</div>
        <h1 className={styles.heroTitle}>Get in Touch</h1>
        <p className={styles.heroSub}>Our enterprise support team is available 24/7 to assist you.</p>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.grid2}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Send us a Message</h2>
            <form style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151'}}>Name</label>
                <input type="text" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB'}} placeholder="Your full name" />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151'}}>Email</label>
                <input type="email" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB'}} placeholder="Your email address" />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151'}}>Subject</label>
                <input type="text" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB'}} placeholder="How can we help?" />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151'}}>Message</label>
                <textarea rows={5} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB'}} placeholder="Your message..."></textarea>
              </div>
              <button type="button" style={{background: '#1E40AF', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer'}}>Send Message</button>
            </form>
          </div>
          <div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Direct Contact</h2>
              <p className={styles.sectionText}>For immediate assistance, please email our support team directly. We aim to respond to all inquiries within 2 hours.</p>
              <div className={styles.highlight}>
                <strong style={{color:'#1E40AF',display:'block',marginBottom:6}}>Email Support</strong>
                <a href="mailto:admin@fregetrust.com" style={{fontSize: '18px', fontWeight: 700, color: '#0F172A', textDecoration: 'none'}}>admin@fregetrust.com</a>
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Corporate Headquarters</h2>
              <p className={styles.sectionText}>Fregetrust<br/>Global Operations Center</p>
              <p className={styles.sectionText} style={{fontSize: '13px', color: '#64748b', marginTop: '12px'}}>* In-person visits are by appointment only for enterprise clients.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
