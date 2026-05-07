"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Sidebar.module.css";

const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS: Record<string, string> = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  accounts: "M3 3h18v4H3z M3 10h18v4H3z M3 17h18v4H3z",
  transfers: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  crypto: "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",
  transactions: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 12h.01 M12 16h.01",
  cards: "M3 10h18 M7 15h.01M11 15h2 M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  investments: "M22 12h-4l-3 9L9 3l-3 9H2",
  bills: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  statements: "M9 12h6 M9 16h6 M9 8h6 M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
  admin: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  chevron: "M9 18l6-6-6-6",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [balances, setBalances] = useState({ checking: 0, savings: 0, investment: 0 });

  const isAdmin = (session?.user as any)?.role === "admin" ||
    session?.user?.email === "admin@strangefregetrust.com";

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || "User");
      setUserEmail(session.user.email || "");
      fetch("/api/user/dashboard")
        .then(r => r.json())
        .then(d => {
          if (d.balances) setBalances(d.balances);
          if (d.user?.name) setUserName(d.user.name);
        })
        .catch(() => {});
    }
  }, [session]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
    );
  };

  const fmt = (n: number) => {
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n.toLocaleString()}`;
  };

  const totalCash = balances.checking + balances.savings;

  return (
    <>
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <button className={styles.mobileBtn} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>

        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" opacity="0.9"/>
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <span className={styles.logoText}>Strangefregetrust</span>
        </div>

        {/* Balance Card */}
        <div className={styles.balanceCard}>
          <div className={styles.balanceLabel}>Total Cash Balance</div>
          <div className={styles.balanceAmt}>{fmt(totalCash)}</div>
          <div className={styles.balanceBreakdown}>
            <div className={styles.balanceRow}>
              <span className={styles.dot} style={{ background: "#1E40AF" }} />
              <span>Checking</span>
              <span className={styles.balanceVal}>{fmt(balances.checking)}</span>
            </div>
            <div className={styles.balanceRow}>
              <span className={styles.dot} style={{ background: "#1D4ED8" }} />
              <span>Savings</span>
              <span className={styles.balanceVal}>{fmt(balances.savings)}</span>
            </div>
          </div>
          <button className={styles.transferBtn} onClick={() => router.push("/transfers/internal")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            Quick Transfer
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navSection}>MAIN MENU</div>

          <Link href="/dashboard" className={`${styles.navLink} ${pathname === "/dashboard" ? styles.active : ""}`}>
            <span className={styles.navIcon}><Icon d={ICONS.dashboard} /></span>
            Dashboard
          </Link>

          {/* Accounts */}
          <div className={styles.navGroup}>
            <button className={styles.navLink} onClick={() => toggleExpand("Accounts")}>
              <span className={styles.navIcon}><Icon d={ICONS.accounts} /></span>
              Accounts
              <span className={`${styles.chevron} ${expandedItems.includes("Accounts") ? styles.chevronOpen : ""}`}>
                <Icon d={ICONS.chevron} size={13} />
              </span>
            </button>
            {expandedItems.includes("Accounts") && (
              <div className={styles.subMenu}>
                <Link href="/accounts/checking" className={`${styles.subLink} ${pathname === "/accounts/checking" ? styles.active : ""}`}>Checking</Link>
                <Link href="/accounts/savings" className={`${styles.subLink} ${pathname === "/accounts/savings" ? styles.active : ""}`}>Savings</Link>
                <Link href="/accounts/investment" className={`${styles.subLink} ${pathname === "/accounts/investment" ? styles.active : ""}`}>Investment</Link>
              </div>
            )}
          </div>

          {/* Transfers */}
          <div className={styles.navGroup}>
            <button className={styles.navLink} onClick={() => toggleExpand("Transfers")}>
              <span className={styles.navIcon}><Icon d={ICONS.transfers} /></span>
              Transfers
              <span className={`${styles.chevron} ${expandedItems.includes("Transfers") ? styles.chevronOpen : ""}`}>
                <Icon d={ICONS.chevron} size={13} />
              </span>
            </button>
            {expandedItems.includes("Transfers") && (
              <div className={styles.subMenu}>
                <Link href="/transfers/internal" className={`${styles.subLink} ${pathname === "/transfers/internal" ? styles.active : ""}`}>Internal Transfer</Link>
                <Link href="/transfers/wire" className={`${styles.subLink} ${pathname === "/transfers/wire" ? styles.active : ""}`}>Wire Transfer</Link>
                <Link href="/transfers/international" className={`${styles.subLink} ${pathname === "/transfers/international" ? styles.active : ""}`}>International</Link>
              </div>
            )}
          </div>

          {/* Crypto */}
          <div className={styles.navGroup}>
            <button className={styles.navLink} onClick={() => toggleExpand("Crypto")}>
              <span className={styles.navIcon}><Icon d={ICONS.crypto} /></span>
              Crypto
              <span className={`${styles.chevron} ${expandedItems.includes("Crypto") ? styles.chevronOpen : ""}`}>
                <Icon d={ICONS.chevron} size={13} />
              </span>
            </button>
            {expandedItems.includes("Crypto") && (
              <div className={styles.subMenu}>
                <Link href="/crypto" className={`${styles.subLink} ${pathname === "/crypto" ? styles.active : ""}`}>Wallet</Link>
                <Link href="/crypto/convert" className={`${styles.subLink} ${pathname === "/crypto/convert" ? styles.active : ""}`}>Buy / Convert</Link>
                <Link href="/crypto/send" className={`${styles.subLink} ${pathname === "/crypto/send" ? styles.active : ""}`}>Send Crypto</Link>
                <Link href="/crypto/transactions" className={`${styles.subLink} ${pathname === "/crypto/transactions" ? styles.active : ""}`}>Transactions</Link>
              </div>
            )}
          </div>

          <Link href="/transactions" className={`${styles.navLink} ${pathname === "/transactions" ? styles.active : ""}`}>
            <span className={styles.navIcon}><Icon d={ICONS.transactions} /></span>
            Transactions
          </Link>

          {/* Cards */}
          <div className={styles.navGroup}>
            <button className={styles.navLink} onClick={() => toggleExpand("Cards")}>
              <span className={styles.navIcon}><Icon d={ICONS.cards} /></span>
              Cards
              <span className={`${styles.chevron} ${expandedItems.includes("Cards") ? styles.chevronOpen : ""}`}>
                <Icon d={ICONS.chevron} size={13} />
              </span>
            </button>
            {expandedItems.includes("Cards") && (
              <div className={styles.subMenu}>
                <Link href="/accounts/credit-cards" className={`${styles.subLink} ${pathname === "/accounts/credit-cards" ? styles.active : ""}`}>My Cards</Link>
                <Link href="/accounts/credit-cards/apply" className={`${styles.subLink} ${pathname === "/accounts/credit-cards/apply" ? styles.active : ""}`}>Apply for Card</Link>
              </div>
            )}
          </div>

          {/* Investments */}
          <div className={styles.navGroup}>
            <button className={styles.navLink} onClick={() => toggleExpand("Investments")}>
              <span className={styles.navIcon}><Icon d={ICONS.investments} /></span>
              Investments
              <span className={`${styles.chevron} ${expandedItems.includes("Investments") ? styles.chevronOpen : ""}`}>
                <Icon d={ICONS.chevron} size={13} />
              </span>
            </button>
            {expandedItems.includes("Investments") && (
              <div className={styles.subMenu}>
                <Link href="/investments/portfolio" className={`${styles.subLink} ${pathname === "/investments/portfolio" ? styles.active : ""}`}>Portfolio</Link>
                <Link href="/investments/trading" className={`${styles.subLink} ${pathname === "/investments/trading" ? styles.active : ""}`}>Trading</Link>
              </div>
            )}
          </div>

          <Link href="/bills" className={`${styles.navLink} ${pathname === "/bills" ? styles.active : ""}`}>
            <span className={styles.navIcon}><Icon d={ICONS.bills} /></span>
            Bills
          </Link>

          <Link href="/accounts/statements" className={`${styles.navLink} ${pathname === "/accounts/statements" ? styles.active : ""}`}>
            <span className={styles.navIcon}><Icon d={ICONS.statements} /></span>
            Statements
          </Link>

          {isAdmin && (
            <>
              <div className={styles.navSection} style={{ marginTop: 12 }}>ADMINISTRATION</div>
              <div className={styles.navGroup}>
                <button className={styles.navLink} onClick={() => toggleExpand("Admin")}>
                  <span className={styles.navIcon}><Icon d={ICONS.admin} /></span>
                  Admin Panel
                  <span className={`${styles.chevron} ${expandedItems.includes("Admin") ? styles.chevronOpen : ""}`}>
                    <Icon d={ICONS.chevron} size={13} />
                  </span>
                </button>
                {expandedItems.includes("Admin") && (
                  <div className={styles.subMenu}>
                    <Link href="/dashboard/admin" className={`${styles.subLink} ${pathname === "/dashboard/admin" ? styles.active : ""}`}>Overview</Link>
                    <Link href="/admin/users" className={`${styles.subLink} ${pathname === "/admin/users" ? styles.active : ""}`}>Users</Link>
                    <Link href="/admin/transactions" className={`${styles.subLink} ${pathname === "/admin/transactions" ? styles.active : ""}`}>Approvals</Link>
                    <Link href="/admin/crypto" className={`${styles.subLink} ${pathname === "/admin/crypto" ? styles.active : ""}`}>Crypto Approvals</Link>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        {/* User Section */}
        <div className={styles.userSection}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{userName}</div>
              <div className={styles.userEmail}>{userEmail}</div>
            </div>
            <button className={styles.settingsBtn} onClick={() => router.push("/settings")} aria-label="Settings">
              <Icon d={ICONS.settings} size={14} />
            </button>
          </div>
          <div className={styles.security}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            256-bit Encrypted Session
          </div>
        </div>

      </aside>
    </>
  );
}
