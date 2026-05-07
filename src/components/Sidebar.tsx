"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Sidebar.module.css";

/* ── Inline SVG icon helper ── */
const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICONS: Record<string, string> = {
  dashboard:    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  accounts:     "M3 3h18v4H3z M3 10h18v4H3z M3 17h18v4H3z",
  transfers:    "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  crypto:       "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",
  transactions: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 12h.01 M12 16h.01",
  cards:        "M3 10h18 M7 15h.01M11 15h2 M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  investments:  "M22 12h-4l-3 9L9 3l-3 9H2",
  bills:        "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  statements:   "M9 12h6 M9 16h6 M9 8h6 M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
  admin:        "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  settings:     "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  chevron:      "M9 18l6-6-6-6",
  lock:         "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  help:         "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  mail:         "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8 M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z",
};

/* ── Number formatter ── */
const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/* ── NavLink helper ── */
function NavItem({
  href,
  icon,
  label,
  pathname,
}: {
  href: string;
  icon: string;
  label: string;
  pathname: string;
}) {
  const active = pathname === href;
  return (
    <Link href={href} className={`${styles.navLink} ${active ? styles.active : ""}`}>
      <span className={styles.navIcon}><Icon d={ICONS[icon]} /></span>
      {label}
    </Link>
  );
}

/* ── Expandable group helper ── */
function NavGroup({
  icon,
  label,
  expanded,
  onToggle,
  children,
}: {
  icon: string;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.navGroup}>
      <button className={styles.navLink} onClick={onToggle}>
        <span className={styles.navIcon}><Icon d={ICONS[icon]} /></span>
        {label}
        <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}>
          <Icon d={ICONS.chevron} size={12} />
        </span>
      </button>
      {expanded && <div className={styles.subMenu}>{children}</div>}
    </div>
  );
}

function SubItem({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  return (
    <Link href={href} className={`${styles.subLink} ${pathname === href ? styles.active : ""}`}>
      {label}
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Sidebar Component
   ══════════════════════════════════════════════════════════ */
export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: session } = useSession();

  const [expanded, setExpanded]   = useState<string[]>([]);
  const [userName, setUserName]   = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [balances, setBalances]   = useState({ checking: 0, savings: 0, investment: 0 });

  const isAdmin =
    (session?.user as { role?: string })?.role === "admin" ||
    session?.user?.email === "admin@strangefregetrust.com";

  /* Fetch user data */
  useEffect(() => {
    if (!session?.user) return;
    setUserName(session.user.name ?? "User");
    setUserEmail(session.user.email ?? "");
    fetch("/api/user/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.balances) setBalances(d.balances);
        if (d.user?.name) setUserName(d.user.name);
      })
      .catch(() => {});
  }, [session]);

  /* Close mobile sidebar on route change */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggle = (key: string) =>
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );

  const totalCash = balances.checking + balances.savings;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile toggle button */}
      <button
        className={styles.mobileBtn}
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle navigation menu"
      >
        <span /><span /><span />
      </button>

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>

        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" opacity="0.9"/>
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="white" opacity="0.25"/>
            </svg>
          </div>
          <span className={styles.logoText}>Strangefregetrust</span>
        </div>

        {/* Balance card */}
        <div className={styles.balanceCard}>
          <div className={styles.balanceLabel}>Total Cash Balance</div>
          <div className={styles.balanceAmt}>{fmt(totalCash)}</div>
          <div className={styles.balanceBreakdown}>
            <div className={styles.balanceRow}>
              <span className={styles.dot} style={{ background: "#3B82F6" }} />
              <span>Checking</span>
              <span className={styles.balanceVal}>{fmt(balances.checking)}</span>
            </div>
            <div className={styles.balanceRow}>
              <span className={styles.dot} style={{ background: "#1D4ED8" }} />
              <span>Savings</span>
              <span className={styles.balanceVal}>{fmt(balances.savings)}</span>
            </div>
          </div>
          <button
            className={styles.transferBtn}
            onClick={() => router.push("/transfers/internal")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            Quick Transfer
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navSection}>Main Menu</div>

          <NavItem href="/dashboard"    icon="dashboard"    label="Dashboard"    pathname={pathname} />
          <NavItem href="/transactions" icon="transactions" label="Transactions"  pathname={pathname} />

          <NavGroup icon="accounts" label="Accounts" expanded={expanded.includes("Accounts")} onToggle={() => toggle("Accounts")}>
            <SubItem href="/accounts/checking"   label="Checking Account"  pathname={pathname} />
            <SubItem href="/accounts/savings"    label="Savings Account"   pathname={pathname} />
            <SubItem href="/accounts/investment" label="Investment Account" pathname={pathname} />
          </NavGroup>

          <NavGroup icon="transfers" label="Transfers" expanded={expanded.includes("Transfers")} onToggle={() => toggle("Transfers")}>
            <SubItem href="/transfers/internal"      label="Internal Transfer"  pathname={pathname} />
            <SubItem href="/transfers/wire"          label="Wire Transfer"      pathname={pathname} />
            <SubItem href="/transfers/international" label="International"      pathname={pathname} />
          </NavGroup>

          <NavGroup icon="crypto" label="Crypto" expanded={expanded.includes("Crypto")} onToggle={() => toggle("Crypto")}>
            <SubItem href="/crypto"              label="Wallet"        pathname={pathname} />
            <SubItem href="/crypto/convert"      label="Buy / Convert" pathname={pathname} />
            <SubItem href="/crypto/send"         label="Send Crypto"   pathname={pathname} />
            <SubItem href="/crypto/transactions" label="History"       pathname={pathname} />
          </NavGroup>

          <NavGroup icon="cards" label="Cards" expanded={expanded.includes("Cards")} onToggle={() => toggle("Cards")}>
            <SubItem href="/accounts/credit-cards"       label="My Cards"      pathname={pathname} />
            <SubItem href="/accounts/credit-cards/apply" label="Apply for Card" pathname={pathname} />
          </NavGroup>

          <NavGroup icon="investments" label="Investments" expanded={expanded.includes("Investments")} onToggle={() => toggle("Investments")}>
            <SubItem href="/investments/portfolio" label="Portfolio" pathname={pathname} />
            <SubItem href="/investments/trading"   label="Trading"   pathname={pathname} />
          </NavGroup>

          <NavItem href="/bills"              icon="bills"      label="Bills & Payments" pathname={pathname} />
          <NavItem href="/accounts/statements" icon="statements" label="Statements"       pathname={pathname} />

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className={styles.navSection} style={{ marginTop: 8 }}>Administration</div>
              <NavGroup icon="admin" label="Admin Panel" expanded={expanded.includes("Admin")} onToggle={() => toggle("Admin")}>
                <SubItem href="/dashboard/admin"    label="Overview"         pathname={pathname} />
                <SubItem href="/admin/users"        label="Users"            pathname={pathname} />
                <SubItem href="/admin/transactions" label="Approvals"        pathname={pathname} />
                <SubItem href="/admin/crypto"       label="Crypto Approvals" pathname={pathname} />
              </NavGroup>
            </>
          )}
        </nav>

        {/* User section */}
        <div className={styles.userSection}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{userName}</div>
              <div className={styles.userEmail}>{userEmail}</div>
            </div>
            <button
              className={styles.settingsBtn}
              onClick={() => router.push("/settings")}
              aria-label="Account settings"
            >
              <Icon d={ICONS.settings} size={14} />
            </button>
          </div>

          <div className={styles.helpRow}>
            <a href="/help" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>
              <Icon d={ICONS.help} size={11} />
              Help Center
            </a>
            <a href="mailto:admin@strangefregetrust.com" className={styles.helpLink}>
              <Icon d={ICONS.mail} size={11} />
              Support
            </a>
          </div>

          <div className={styles.security}>
            <Icon d={ICONS.lock} size={10} />
            256-bit Encrypted Session
          </div>
        </div>

      </aside>
    </>
  );
}
