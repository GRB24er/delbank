'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './signin.module.css';

export default function SignInContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams?.get('registered') ?? '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>(
    registered ? 'Account created successfully. Please sign in.' : ''
  );
  const [isSuccess, setIsSuccess] = useState(!!registered);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    if (lockoutTime > 0) {
      const t = setTimeout(() => setLockoutTime(lockoutTime - 1), 1000);
      return () => clearTimeout(t);
    } else if (isLocked && lockoutTime === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [lockoutTime, isLocked]);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const t = setTimeout(() => router.push('/dashboard'), 100);
      return () => clearTimeout(t);
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLocked) { setErrorMsg(`Account temporarily locked. Try again in ${lockoutTime} seconds.`); return; }
    setErrorMsg(''); setIsSuccess(false); setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const res = await signIn('credentials', { redirect: false, email: email.trim(), password: password.trim() });
      setLoading(false);
      if (res?.error) {
        const n = attempts + 1; setAttempts(n);
        if (n >= 5) { setIsLocked(true); setLockoutTime(300); setErrorMsg('Too many failed attempts. Account locked for 5 minutes.'); }
        else { setErrorMsg(`Invalid email or password. ${5 - n} attempt(s) remaining.`); }
      } else if (res?.ok) { window.location.href = '/dashboard'; }
    } catch { setLoading(false); setErrorMsg('A network error occurred. Please try again.'); }
  };

  if (status === 'authenticated') {
    return <div className={styles.page}><div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',fontSize:'18px',color:'#6B7280'}}>Redirecting to dashboard...</div></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          <Link href="/" className={styles.logoRow}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="currentColor" opacity="0.9"/><path d="M12 2L3 7l9 5 9-5-9-5z" fill="white" opacity="0.3"/></svg>
            </div>
            <span className={styles.logoText}>Fregetrust</span>
          </Link>

          <div className={styles.formHeading}>
            <h1 className={styles.formTitle}>Welcome back</h1>
            <p className={styles.formSubtitle}>Sign in to your account to continue</p>
          </div>

          {errorMsg && (
            <div className={`${styles.alert} ${isSuccess ? styles.alertSuccess : styles.alertError}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isSuccess ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
              </svg>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
                <input type="email" className={styles.input} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" disabled={loading || isLocked}/>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
                <Link href="/auth/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
              </div>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                <input type={showPassword ? 'text' : 'password'} className={styles.input} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" disabled={loading || isLocked}/>
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.checkLabel}>
                <input type="checkbox" className={styles.checkInput} checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}/>
                <span className={styles.checkBox}>{rememberMe && <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2,6 5,9 10,3"/></svg>}</span>
                <span className={styles.checkText}>Keep me signed in</span>
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading || isLocked}>
              {loading ? <span className={styles.spinner}/> : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Sign In Securely</>}
            </button>
          </form>

          <div className={styles.divider}><span>New to Fregetrust?</span></div>
          <Link href="/auth/signup" className={styles.createBtn}>Open a Free Account</Link>

          <div className={styles.securityNote}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Fregetrust will never ask for your password via email or phone.
          </div>

          <div className={styles.trustRow}>
            {['256-bit SSL','FDIC Insured','SOC 2 Certified'].map(t => (
              <div key={t} className={styles.trustBadge}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>{t}</div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.heroPanel}>
        <div className={styles.heroPanelInner}>
          <div className={styles.heroLogo}>
            <div className={styles.heroLogoIcon}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" opacity="0.9"/><path d="M12 2L3 7l9 5 9-5-9-5z" fill="white" opacity="0.3"/></svg></div>
            <span className={styles.heroLogoText}>Fregetrust</span>
          </div>
          <h2 className={styles.heroTitle}>Enterprise Banking.<br/><span className={styles.heroAccent}>Built for Everyone.</span></h2>
          <p className={styles.heroSubtitle}>Trusted by over 100,000 customers worldwide. Manage your wealth with confidence.</p>
          <div className={styles.statsGrid}>
            {[{num:'$2.4B+',label:'Assets Under Management'},{num:'100K+',label:'Active Customers'},{num:'4.50%',label:'High-Yield APY'},{num:'99.9%',label:'Platform Uptime'}].map(s => (
              <div key={s.label} className={styles.statCard}><div className={styles.statNum}>{s.num}</div><div className={styles.statLabel}>{s.label}</div></div>
            ))}
          </div>
          <div className={styles.featureList}>
            {['Instant domestic & international transfers','Real-time transaction notifications','Multi-currency accounts & crypto wallet','Advanced fraud detection & 2FA security','Dedicated relationship manager'].map(f => (
              <div key={f} className={styles.featureItem}><div className={styles.featureCheck}><svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2,6 5,9 10,3"/></svg></div><span>{f}</span></div>
            ))}
          </div>
          <div className={styles.previewCard}>
            <div className={styles.previewCardHeader}>
              <div className={styles.previewAvatar}>JD</div>
              <div><div className={styles.previewName}>John Doe</div><div className={styles.previewAcct}>••• 4821 · Checking</div></div>
              <div className={styles.previewDot}/>
            </div>
            <div className={styles.previewBalance}>$48,250.00</div>
            <div className={styles.previewChange}>+2.4% this month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
