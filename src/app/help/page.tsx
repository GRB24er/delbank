'use client';
import Link from 'next/link';
import { useState } from 'react';
import styles from './help.module.css';

const categories = [
  {
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: 'Account & Registration',
    desc: 'Opening accounts, KYC, verification, and profile management.',
    faqs: [
      { q: 'How do I open an account?', a: 'Visit our registration page and complete the 4-step process. You will need a valid government-issued ID, proof of address, and a few minutes to fill in your personal details. Accounts are typically approved within 24 hours.' },
      { q: 'What documents do I need to register?', a: 'You will need a valid government-issued photo ID (passport or national ID), proof of residential address (utility bill or bank statement dated within 3 months), and a valid email address and phone number.' },
      { q: 'Why is my account pending verification?', a: 'Our compliance team reviews all new accounts within 1–2 business days. You will receive an email at the address you registered with once your account is approved or if additional documents are required.' },
      { q: 'How do I update my personal information?', a: 'Log in to your dashboard, navigate to Profile Settings, and update your details. Some changes such as name or address may require supporting documentation for compliance purposes.' },
    ],
  },
  {
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    title: 'Transfers & Payments',
    desc: 'Internal transfers, wire transfers, international payments, and transaction status.',
    faqs: [
      { q: 'How long do transfers take?', a: 'Internal transfers between Strangefregetrust accounts are processed immediately. Domestic wire transfers are processed within 1 business day. International SWIFT transfers typically take 2–5 business days depending on the destination country and correspondent bank.' },
      { q: 'Why is my transfer showing as Pending?', a: 'All transfers are reviewed by our compliance team before funds are released. This is a standard security measure to protect our customers from fraud. You will receive an email confirmation once your transfer is processed.' },
      { q: 'What are the transfer limits?', a: 'Standard accounts have a daily transfer limit of $10,000 for domestic transfers and $25,000 for international transfers. Premium account holders have higher limits. Contact us at admin@strangefregetrust.com to request a limit increase.' },
      { q: 'Can I cancel a transfer?', a: 'Transfers that are still in Pending status may be cancellable. Please contact us immediately at admin@strangefregetrust.com with your transaction reference number. Once a transfer has been processed, it cannot be reversed.' },
    ],
  },
  {
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    title: 'Cards & Deposits',
    desc: 'Debit cards, deposits, check deposits, and Flutterwave payments.',
    faqs: [
      { q: 'How do I fund my account?', a: 'You can fund your account via bank transfer, debit/credit card through our secure Flutterwave payment gateway, or mobile check deposit. Navigate to Fund Account in your dashboard to get started.' },
      { q: 'How does mobile check deposit work?', a: 'Take a clear photo of the front and back of your cheque using the Strangefregetrust mobile app. Enter the amount and select your destination account. Funds are typically available within 1–2 business days after verification.' },
      { q: 'Is my card information secure?', a: 'All card transactions are processed through Flutterwave, a PCI-DSS Level 1 certified payment processor. We never store your full card number on our servers.' },
      { q: 'How do I request a physical debit card?', a: 'Navigate to Cards in your dashboard and select Request Physical Card. Cards are issued within 7–10 business days and delivered to your registered address.' },
    ],
  },
  {
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    title: 'Security & Privacy',
    desc: 'Two-factor authentication, login alerts, device management, and data protection.',
    faqs: [
      { q: 'How do I enable two-factor authentication?', a: 'Go to Security Settings in your dashboard and toggle on Two-Factor Authentication. You can choose to receive codes via email or an authenticator app. We strongly recommend enabling 2FA on all accounts.' },
      { q: 'I received a suspicious login alert. What should I do?', a: 'If you did not initiate the login, change your password immediately and contact us at admin@strangefregetrust.com. Do not share your password or OTP with anyone — Strangefregetrust will never ask for these via email or phone.' },
      { q: 'How is my data protected?', a: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We are SOC 2 Type II certified and comply with all applicable data protection regulations. See our Privacy Policy for full details.' },
      { q: 'How do I remove a trusted device?', a: 'Navigate to Security Settings > Trusted Devices in your dashboard. You can view all devices that have accessed your account and remove any that you do not recognise.' },
    ],
  },
  {
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Loans & Investments',
    desc: 'Loan applications, investment accounts, portfolio management, and rates.',
    faqs: [
      { q: 'How do I apply for a loan?', a: 'Navigate to Loans in your dashboard and select the loan type that suits your needs. Complete the application form and our team will review your application within 2–3 business days. Approval is subject to creditworthiness assessment.' },
      { q: 'What investment products are available?', a: 'We offer fixed-term deposits, managed investment portfolios, and direct market access for eligible customers. Visit the Investments section of your dashboard or contact us at admin@strangefregetrust.com for a personalised consultation.' },
      { q: 'What is the current savings APY?', a: 'Our High-Yield Savings Account currently offers 4.85% APY with no minimum balance requirement. Rates are subject to change. Visit our Rates page for the most current information.' },
    ],
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Crypto',
    desc: 'Crypto wallet, sending, converting, and transaction status.',
    faqs: [
      { q: 'How do I send cryptocurrency?', a: 'Navigate to Crypto in your dashboard, select Send, enter the recipient wallet address, amount, and network. All crypto transactions are reviewed by our compliance team before processing. You will receive an email confirmation once completed.' },
      { q: 'Why is my crypto transaction pending?', a: 'All crypto send and convert transactions are held for compliance review before execution. This is a standard anti-money-laundering measure. Processing typically takes 1–2 business days.' },
      { q: 'What cryptocurrencies are supported?', a: 'We currently support Bitcoin (BTC), Ethereum (ETH), USDT (Tether), and USDC. Additional assets may be added in future. Contact us at admin@strangefregetrust.com for enquiries about specific assets.' },
    ],
  },
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      {/* ===== HEADER ===== */}
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" opacity="0.9"/></svg>
            </div>
            <span className={styles.logoText}>Strangefregetrust</span>
          </Link>
          <nav className={styles.headerNav}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/auth/signin" className={styles.navLink}>Sign In</Link>
            <Link href="/auth/signup" className={styles.navLinkPrimary}>Open Account</Link>
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Help Center
          </div>
          <h1 className={styles.heroTitle}>How can we help you?</h1>
          <p className={styles.heroSubtitle}>Find answers to common questions or contact our team directly at <a href="mailto:admin@strangefregetrust.com" className={styles.heroEmail}>admin@strangefregetrust.com</a></p>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.layout}>

            {/* ===== CATEGORY SIDEBAR ===== */}
            <aside className={styles.categorySidebar}>
              <h3 className={styles.sidebarTitle}>Categories</h3>
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className={`${styles.categoryBtn} ${activeCategory === i ? styles.categoryBtnActive : ''}`}
                  onClick={() => { setActiveCategory(i); setOpenFaq(null); }}
                >
                  <div className={styles.categoryBtnIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={cat.icon}/></svg>
                  </div>
                  <div className={styles.categoryBtnText}>
                    <div className={styles.categoryBtnTitle}>{cat.title}</div>
                    <div className={styles.categoryBtnDesc}>{cat.desc}</div>
                  </div>
                </button>
              ))}

              {/* Contact Card */}
              <div className={styles.contactCard}>
                <div className={styles.contactCardIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h4>Still need help?</h4>
                <p>Our support team responds within 24 business hours.</p>
                <a href="mailto:admin@strangefregetrust.com" className={styles.contactCardBtn}>
                  Email Support
                </a>
              </div>
            </aside>

            {/* ===== FAQ PANEL ===== */}
            <div className={styles.faqPanel}>
              <div className={styles.faqHeader}>
                <div className={styles.faqHeaderIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={categories[activeCategory].icon}/></svg>
                </div>
                <div>
                  <h2 className={styles.faqTitle}>{categories[activeCategory].title}</h2>
                  <p className={styles.faqSubtitle}>{categories[activeCategory].desc}</p>
                </div>
              </div>

              <div className={styles.faqList}>
                {categories[activeCategory].faqs.map((faq, i) => (
                  <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ''}`}>
                    <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{faq.q}</span>
                      <svg className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    {openFaq === i && (
                      <div className={styles.faqAnswer}>
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ===== CONTACT FORM ===== */}
              <div className={styles.contactSection}>
                <h3 className={styles.contactTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  Send us a message
                </h3>
                <p className={styles.contactSubtitle}>We typically respond within 24 business hours. For urgent matters, email us directly at <a href="mailto:admin@strangefregetrust.com">admin@strangefregetrust.com</a></p>

                {submitted ? (
                  <div className={styles.successMsg}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                    <div>
                      <strong>Message received</strong>
                      <p>Thank you for reaching out. Our team will respond to {contactForm.email} within 24 business hours.</p>
                    </div>
                  </div>
                ) : (
                  <form className={styles.contactForm} onSubmit={handleContact}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Full Name</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="John Smith"
                          value={contactForm.name}
                          onChange={e => setContactForm({...contactForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email Address</label>
                        <input
                          type="email"
                          className={styles.formInput}
                          placeholder="john@example.com"
                          value={contactForm.email}
                          onChange={e => setContactForm({...contactForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Subject</label>
                      <select
                        className={styles.formSelect}
                        value={contactForm.subject}
                        onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                        required
                      >
                        <option value="">Select a topic</option>
                        <option>Account Registration</option>
                        <option>Transfer Issue</option>
                        <option>Card or Deposit</option>
                        <option>Security Concern</option>
                        <option>Loan or Investment</option>
                        <option>Crypto Transaction</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Message</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Please describe your issue in detail. Include any relevant account numbers or transaction references."
                        rows={5}
                        value={contactForm.message}
                        onChange={e => setContactForm({...contactForm, message: e.target.value})}
                        required
                      />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                      Send Message
                    </button>
                    <p className={styles.formNote}>By submitting this form you agree to our <Link href="/privacy">Privacy Policy</Link>. We will only use your information to respond to your enquiry.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoRow}>
                <div className={styles.footerLogoIcon}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" opacity="0.9"/></svg></div>
                <span>Strangefregetrust</span>
              </div>
              <p>admin@strangefregetrust.com</p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/disclosures">Disclosures</Link>
              <Link href="/accessibility">Accessibility</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Strangefregetrust Financial Institution. All rights reserved.</p>
            <p>Member FDIC · NMLS #2025001 · Equal Housing Lender</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
