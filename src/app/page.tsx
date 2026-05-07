"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./landing.module.css";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [count, setCount] = useState({ customers: 0, assets: 0, countries: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Animate counters
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        customers: Math.floor(250000 * progress),
        assets: Math.floor(48 * progress),
        countries: Math.floor(32 * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles.landingPage}>
      {/* ===== HEADER ===== */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.topBar}>
          <div className={styles.container}>
            <span>NMLS #2025001 &nbsp;|&nbsp; Member FDIC &nbsp;|&nbsp; Equal Housing Lender</span>
            <div className={styles.topBarRight}>
              <Link href="/locations">Branch Locator</Link>
              <Link href="/support">Help Center</Link>
              <a href="mailto:admin@strangefregetrust.com">admin@strangefregetrust.com</a>
            </div>
          </div>
        </div>
        <div className={styles.mainHeader}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <Link href="/" className={styles.logoLink}>
                <div style={{width:"44px",height:"44px",background:"linear-gradient(135deg,#1E40AF,#1E3A8A)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" opacity="0.9"/><path d="M12 2L3 7l9 5 9-5-9-5z" fill="white" opacity="0.3"/></svg></div>
                <span className={styles.logoText}>Strangefregetrust</span>
              </Link>
              <nav className={styles.mainNav}>
                <div className={styles.navItem} onMouseEnter={() => setActiveNav("personal")} onMouseLeave={() => setActiveNav(null)}>
                  <span>Personal</span>
                  {activeNav === "personal" && (
                    <div className={styles.dropdown}>
                      <Link href="/accounts/checking">Checking Accounts</Link>
                      <Link href="/accounts/savings">Savings Accounts</Link>
                      <Link href="/cards">Credit & Debit Cards</Link>
                      <Link href="/loans">Personal Loans</Link>
                      <Link href="/deposit">Deposits</Link>
                    </div>
                  )}
                </div>
                <div className={styles.navItem} onMouseEnter={() => setActiveNav("business")} onMouseLeave={() => setActiveNav(null)}>
                  <span>Business</span>
                  {activeNav === "business" && (
                    <div className={styles.dropdown}>
                      <Link href="/business">Business Banking</Link>
                      <Link href="/business">Business Loans</Link>
                      <Link href="/business">Merchant Services</Link>
                      <Link href="/business">Treasury Management</Link>
                    </div>
                  )}
                </div>
                <div className={styles.navItem} onMouseEnter={() => setActiveNav("wealth")} onMouseLeave={() => setActiveNav(null)}>
                  <span>Wealth</span>
                  {activeNav === "wealth" && (
                    <div className={styles.dropdown}>
                      <Link href="/investments">Investments</Link>
                      <Link href="/investments/portfolio">Portfolio Management</Link>
                      <Link href="/investments/trading">Trading</Link>
                      <Link href="/crypto">Crypto</Link>
                    </div>
                  )}
                </div>
                <Link href="/about" className={styles.navLink}>About</Link>
              </nav>
              <div className={styles.headerActions}>
                <Link href="/auth/signin" className={styles.btnSignIn}>Sign In</Link>
                <Link href="/auth/signup" className={styles.btnOpenAccount}>Open Account</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className={styles.hero} style={{backgroundImage:"url('/images/hero-banking.jpg')",backgroundSize:"cover",backgroundPosition:"center 40%"}}>
        <div className={styles.heroOverlay} />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 7v6c0 4.52 3.13 8.75 8 9.88 4.87-1.13 8-5.36 8-9.88V7l-8-5z"/></svg>
              FDIC Insured · Member Since 2010
            </div>
            <h1 className={styles.heroTitle}>
              Trust. Built<br />
              <span className={styles.heroAccent}>Different.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Enterprise-grade banking for individuals, businesses, and institutions.
              Secure, transparent, and built for the modern world.
            </p>
            <div className={styles.heroActions}>
              <Link href="/auth/signup" className={styles.btnHeroPrimary}>
                Open a Free Account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/about" className={styles.btnHeroSecondary}>
                Learn More
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>{count.customers.toLocaleString()}+</span>
                <span className={styles.heroStatLabel}>Customers Worldwide</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>${count.assets}B+</span>
                <span className={styles.heroStatLabel}>Assets Under Management</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>{count.countries}</span>
                <span className={styles.heroStatLabel}>Countries Served</span>
              </div>
            </div>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardHeader}>
              <div className={styles.heroCardAvatar}>JD</div>
              <div>
                <div className={styles.heroCardName}>John Doe</div>
                <div className={styles.heroCardAcct}>Premium Checking ···· 4821</div>
              </div>
              <div className={styles.heroCardLiveDot} />
            </div>
            <div className={styles.heroCardBalance}>
              <div className={styles.heroCardBalLabel}>Available Balance</div>
              <div className={styles.heroCardBalAmt}>$84,250.00</div>
              <div className={styles.heroCardBalChange}>+2.4% this month</div>
            </div>
            <div className={styles.heroCardTxns}>
              {[
                { label: "Wire Transfer", amt: "-$12,500.00", status: "Completed", color: "#10b981" },
                { label: "Deposit", amt: "+$25,000.00", status: "Completed", color: "#10b981" },
                { label: "Int'l Transfer", amt: "-$3,200.00", status: "Pending", color: "#f59e0b" },
              ].map((t, i) => (
                <div key={i} className={styles.heroCardTxn}>
                  <span className={styles.heroCardTxnLabel}>{t.label}</span>
                  <span className={styles.heroCardTxnAmt}>{t.amt}</span>
                  <span className={styles.heroCardTxnStatus} style={{ color: t.color }}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className={styles.trustBar}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            {[
              { icon: "M12 2L4 7v6c0 4.52 3.13 8.75 8 9.88 4.87-1.13 8-5.36 8-9.88V7l-8-5z", label: "FDIC Insured" },
              { icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", label: "256-bit SSL" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "SOC 2 Compliant" },
              { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "PCI DSS Certified" },
              { icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", label: "4.9/5 Rated" },
              { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Equal Housing" },
            ].map((b, i) => (
              <div key={i} className={styles.trustBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={b.icon}/></svg>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Our Products</span>
            <h2 className={styles.sectionTitle}>Everything you need to manage your finances</h2>
            <p className={styles.sectionSubtitle}>From everyday checking to global wealth management — all in one secure platform.</p>
          </div>
          <div className={styles.productsGrid}>
            {[
              { href: "/accounts/checking", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", title: "Checking Accounts", desc: "Zero-fee checking with real-time alerts, mobile deposit, and instant transfers." },
              { href: "/accounts/savings", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Savings Accounts", desc: "High-yield savings with up to 4.85% APY and no minimum balance requirements." },
              { href: "/loans", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", title: "Loans & Mortgages", desc: "Competitive rates on personal, auto, and home loans with flexible repayment." },
              { href: "/investments", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Investments", desc: "Diversified portfolios, ETFs, and stocks managed by certified advisors." },
              { href: "/crypto", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Crypto Banking", desc: "Buy, sell, and hold digital assets with institutional-grade security." },
              { href: "/business", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Business Banking", desc: "Full-suite business accounts, payroll, and treasury management solutions." },
            ].map((p, i) => (
              <Link key={i} href={p.href} className={styles.productCard}>
                <div className={styles.productIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={p.icon}/></svg>
                </div>
                <h3 className={styles.productTitle}>{p.title}</h3>
                <p className={styles.productDesc}>{p.desc}</p>
                <span className={styles.productCta}>
                  Learn more
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Why Strangefregetrust</span>
            <h2 className={styles.sectionTitle}>Built for security. Designed for simplicity.</h2>
          </div>
          <div className={styles.featuresGrid}>
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Bank-Grade Security", desc: "256-bit encryption, biometric authentication, and 24/7 fraud monitoring protect every transaction." },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Instant Transfers", desc: "Send money domestically and internationally in seconds with real-time confirmation." },
              { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Smart Analytics", desc: "AI-powered insights and spending reports help you make smarter financial decisions." },
              { icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", title: "Always Available", desc: "24/7 online banking, mobile app, and dedicated support whenever you need it." },
            ].map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={f.icon}/></svg>
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF / IMAGE SECTION ===== */}
      <section className={styles.proofSection}>
        <div className={styles.container}>
          <div className={styles.proofGrid}>
            <div className={styles.proofImageWrap}>
              <Image src="/images/signin-side.jpg" alt="Professional banking" width={480} height={560} className={styles.proofImage} />
              <div className={styles.proofBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Bank-grade security
              </div>
            </div>
            <div className={styles.proofContent}>
              <div className={styles.proofEyebrow}>Why Strangefregetrust</div>
              <h2 className={styles.proofTitle}>Banking built on trust, not promises</h2>
              <p className={styles.proofDesc}>We combine the reliability of a traditional financial institution with the speed and transparency of modern technology. Every account is FDIC insured, every transaction is encrypted, and every decision is made with your financial future in mind.</p>
              <div className={styles.proofStats}>
                <div className={styles.proofStat}><div className={styles.proofStatNum}>$250K</div><div className={styles.proofStatLabel}>FDIC Insured Per Depositor</div></div>
                <div className={styles.proofStat}><div className={styles.proofStatNum}>99.99%</div><div className={styles.proofStatLabel}>Platform Uptime</div></div>
                <div className={styles.proofStat}><div className={styles.proofStatNum}>&lt;2 min</div><div className={styles.proofStatLabel}>Account Opening</div></div>
              </div>
              <div className={styles.proofFeatureList}>
                {["Zero monthly fees on all checking accounts","Instant internal transfers, 24/7","Real-time fraud monitoring and alerts","Dedicated relationship manager for premium accounts"].map((item, i) => (
                  <div key={i} className={styles.proofFeatureItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup" className={styles.proofCta}>Open Your Account Today</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURE IMAGES ===== */}
      <section className={styles.featureImgSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Our Commitment</span>
            <h2 className={styles.sectionTitle}>Security. Growth. Global Reach.</h2>
          </div>
          <div className={styles.featureImgGrid}>
            <div className={styles.featureImgCard}>
              <div className={styles.featureImgWrap}><Image src="/images/feature-security.jpg" alt="Security" width={400} height={260} className={styles.featureImg} /></div>
              <div className={styles.featureImgContent}>
                <h3>Military-Grade Security</h3>
                <p>256-bit encryption, biometric authentication, and real-time fraud detection protect every transaction.</p>
              </div>
            </div>
            <div className={styles.featureImgCard}>
              <div className={styles.featureImgWrap}><Image src="/images/feature-growth.jpg" alt="Growth" width={400} height={260} className={styles.featureImg} /></div>
              <div className={styles.featureImgContent}>
                <h3>Grow Your Wealth</h3>
                <p>High-yield savings at 4.85% APY, diversified investment portfolios, and automated wealth management.</p>
              </div>
            </div>
            <div className={styles.featureImgCard}>
              <div className={styles.featureImgWrap}><Image src="/images/feature-global.jpg" alt="Global" width={400} height={260} className={styles.featureImg} /></div>
              <div className={styles.featureImgContent}>
                <h3>Global Transfers</h3>
                <p>Send money to 32+ countries via SWIFT, SEPA, and our proprietary real-time network.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RATES BANNER ===== */}
      <section className={styles.ratesBanner}>
        <div className={styles.container}>
          <div className={styles.ratesGrid}>
            {[
              { rate: "4.85%", label: "High-Yield Savings APY", note: "No minimum balance" },
              { rate: "6.49%", label: "Personal Loan APR", note: "From, subject to credit" },
              { rate: "7.25%", label: "30-Year Mortgage", note: "Fixed rate" },
              { rate: "0%", label: "Monthly Fees", note: "On all checking accounts" },
            ].map((r, i) => (
              <div key={i} className={styles.rateCard}>
                <div className={styles.rateNum}>{r.rate}</div>
                <div className={styles.rateLabel}>{r.label}</div>
                <div className={styles.rateNote}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to bank with confidence?</h2>
            <p className={styles.ctaSubtitle}>Join over 250,000 customers who trust Strangefregetrust with their financial future.</p>
            <div className={styles.ctaActions}>
              <Link href="/auth/signup" className={styles.btnCtaPrimary}>Open a Free Account</Link>
              <Link href="/contact" className={styles.btnCtaSecondary}>Talk to an Advisor</Link>
            </div>
            <p className={styles.ctaNote}>No credit check required to open. FDIC insured up to $250,000.</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoRow}>
                <div style={{width:"40px",height:"40px",background:"linear-gradient(135deg,#1E40AF,#1E3A8A)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" opacity="0.9"/></svg></div>
                <span className={styles.footerBrandName}>Strangefregetrust</span>
              </div>
              <p className={styles.footerTagline}>Trust. Built Different.</p>
              <p className={styles.footerContact}>admin@strangefregetrust.com</p>
            </div>
            <div className={styles.footerColumn}>
              <h4>Banking</h4>
              <Link href="/accounts/checking">Checking</Link>
              <Link href="/accounts/savings">Savings</Link>
              <Link href="/cards">Cards</Link>
              <Link href="/loans">Loans</Link>
              <Link href="/deposit">Deposits</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4>Wealth</h4>
              <Link href="/investments">Investments</Link>
              <Link href="/investments/portfolio">Portfolio</Link>
              <Link href="/investments/trading">Trading</Link>
              <Link href="/crypto">Crypto</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <Link href="/about">About Us</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/support">Help Center</Link>
              <Link href="/security">Security</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/disclosures">Disclosures</Link>
              <Link href="/accessibility">Accessibility</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Strangefregetrust Financial Institution. All rights reserved.</p>
            <p className={styles.footerLegal}>Member FDIC &nbsp;·&nbsp; NMLS #2025001 &nbsp;·&nbsp; Equal Housing Lender &nbsp;·&nbsp; Deposits insured up to $250,000</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
