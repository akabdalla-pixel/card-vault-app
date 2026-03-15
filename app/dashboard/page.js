"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconDashboard({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconCollection({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}
function IconWishlist({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconTrending() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function IconTrendingDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}
function IconCards() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function IconDollar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function IconValue() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
function IconReturn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconGainLoss() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 12 12 8 8 12" />
      <line x1="12" y1="16" x2="12" y2="8" />
    </svg>
  );
}

// ─── Card Storage Helpers ─────────────────────────────────────────────────────
function getCards() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("topload_cards") || "[]");
  } catch {
    return [];
  }
}

function computeStats(cards) {
  const totalCards = cards.length;
  const totalInvested = cards.reduce((s, c) => s + (parseFloat(c.buy) || 0), 0);
  const currentValue = cards.reduce((s, c) => s + (parseFloat(c.val) || parseFloat(c.buy) || 0), 0);
  const gainLoss = currentValue - totalInvested;
  const portfolioReturn = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
  let bestReturn = null;
  let bestReturnLabel = "-";
  cards.forEach((c) => {
    const bought = parseFloat(c.buy) || 0;
    const current = parseFloat(c.val) || bought;
    if (bought > 0) {
      const r = ((current - bought) / bought) * 100;
      if (bestReturn === null || r > bestReturn) {
        bestReturn = r;
        bestReturnLabel = `${r >= 0 ? "+" : ""}${r.toFixed(1)}% — ${c.player || c.name || "Card"}`;
      }
    }
  });
  const bySport = {};
  cards.forEach((c) => {
    const sport = c.sport || "Other";
    if (!bySport[sport]) bySport[sport] = { cards: 0, invested: 0, value: 0 };
    bySport[sport].cards++;
    bySport[sport].invested += parseFloat(c.buy) || 0;
    bySport[sport].value += parseFloat(c.val) || parseFloat(c.buy) || 0;
  });
  const topCards = [...cards]
    .sort((a, b) => {
      const va = parseFloat(a.val) || parseFloat(a.buy) || 0;
      const vb = parseFloat(b.val) || parseFloat(b.buy) || 0;
      return vb - va;
    })
    .slice(0, 6);
  return { totalCards, totalInvested, currentValue, gainLoss, portfolioReturn, bestReturnLabel, bySport, topCards };
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
  { label: "Collection", href: "/collection", icon: IconCollection },
  { label: "Wish List", href: "/wishlist", icon: IconWishlist },
];

function Sidebar({ active }) {
  return (
    <aside
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#0d1120",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#f0f2ff" }}>Top</span>
          <span style={{ color: "#00e5cc" }}>Load</span>
        </span>
        <div style={{ fontSize: "10px", color: "#4a5578", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "2px" }}>
          Card Investment Tracker
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <div style={{ fontSize: "10px", color: "#3a4465", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px" }}>
          Menu
        </div>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = active === label.toLowerCase().replace(" ", "");
          return (
            <Link
              key={label}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "10px",
                marginBottom: "2px",
                textDecoration: "none",
                color: isActive ? "#00e5cc" : "#7a85a8",
                background: isActive ? "rgba(0,229,204,0.08)" : "transparent",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.15s ease",
                borderLeft: isActive ? "2px solid #00e5cc" : "2px solid transparent",
              }}
            >
              <Icon active={isActive} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "10px",
            textDecoration: "none",
            color: "#4a5578",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <IconSettings />
          Settings
        </Link>
      </div>
    </aside>
  );
}

// ─── Bottom Tab Bar (mobile) ──────────────────────────────────────────────────
function BottomNav({ active }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "#0d1120",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        zIndex: 100,
      }}
      className="mobile-bottom-nav"
    >
      {navItems.map(({ label, href, icon: Icon }) => {
        const key = label.toLowerCase().replace(" ", "");
        const isActive = active === key;
        return (
          <Link
            key={label}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              textDecoration: "none",
              color: isActive ? "#00e5cc" : "#4a5578",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "10px",
              fontWeight: isActive ? 700 : 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              paddingBottom: "4px",
            }}
          >
            <Icon active={isActive} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent, positive }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #131929 0%, #0f1522 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "80px",
          height: "80px",
          background: accent || "rgba(0,229,204,0.06)",
          borderRadius: "50%",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 600, color: "#4a5578", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {label}
        </span>
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#00e5cc",
          }}
        >
          <Icon />
        </div>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "26px", fontWeight: 700, color: "#f0f2ff", letterSpacing: "-1px", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            color: positive === true ? "#00e5a0" : positive === false ? "#ff4d6a" : "#4a5578",
          }}
        >
          {positive === true && <IconTrending />}
          {positive === false && <IconTrendingDown />}
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const router = useRouter();

  const loadData = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/cards'),
      ]);
      if (!meRes.ok) { router.push('/login'); return; }
      setUser((await meRes.json()).user);
      if (cardsRes.ok) {
        const data = await cardsRes.json();
        setCards(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.error(e); }
  }, [router]);

  useEffect(() => {
    loadData();

    const onBeforeInstall = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    window.addEventListener("appinstalled", () => { setInstalled(true); setInstallPrompt(null); });

    // Reload when tab becomes visible again (e.g. coming back from collection)
    const onVisible = () => { if (document.visibilityState === 'visible') loadData(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loadData]);

  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") { setInstalled(true); setInstallPrompt(null); }
  }

  const stats = computeStats(cards);
  const gainPositive = stats.gainLoss >= 0;
  const returnPositive = stats.portfolioReturn >= 0;

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0c0f1a; color: #f0f2ff; font-family: 'Outfit', sans-serif; }

        .desktop-sidebar { display: flex; }
        .mobile-bottom-nav { display: none !important; }
        .mobile-topbar { display: none; }
        .main-content { margin-left: 220px; min-height: 100vh; }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .stat-grid-bottom {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 16px;
        }
        .body-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 1100px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-grid-bottom { grid-template-columns: repeat(2, 1fr); }
          .body-grid { grid-template-columns: 1fr; }
          .card-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-bottom-nav { display: flex !important; }
          .mobile-topbar { display: flex !important; }
          .main-content { margin-left: 0 !important; padding-bottom: 80px !important; }
          .stat-grid { grid-template-columns: 1fr 1fr; }
          .stat-grid-bottom { grid-template-columns: 1fr 1fr; }
          .body-grid { grid-template-columns: 1fr; }
          .card-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr; }
          .stat-grid-bottom { grid-template-columns: 1fr; }
          .card-grid { grid-template-columns: 1fr; }
        }

        .nav-link-hover:hover { background: rgba(255,255,255,0.04) !important; color: #c0c8e8 !important; }
        .card-item:hover { border-color: rgba(0,229,204,0.3) !important; transform: translateY(-2px); transition: all 0.2s ease; }
        .table-row:hover { background: rgba(255,255,255,0.03) !important; }
        .add-card-btn:hover { background: rgba(0,229,204,0.15) !important; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#0c0f1a" }}>
        {/* Sidebar — desktop only */}
        <div className="desktop-sidebar">
          <Sidebar active="dashboard" />
        </div>

        {/* Main content */}
        <main
          className="main-content"
          style={{ flex: 1, padding: "32px 32px 32px", maxWidth: "100%" }}
        >
          {/* Mobile top bar */}
          <div
            className="mobile-topbar"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800 }}>
              <span style={{ color: "#f0f2ff" }}>Top</span>
              <span style={{ color: "#00e5cc" }}>Load</span>
            </span>
            <Link href="/settings" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.07)", color: "#7a85a8", textDecoration: "none" }}>
              <IconSettings />
            </Link>
          </div>

          {/* Page Header */}
          <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "26px", fontWeight: 800, color: "#f0f2ff", letterSpacing: "-0.5px" }}>
                Portfolio Overview
              </h1>
              <p style={{ fontSize: "14px", color: "#4a5578", marginTop: "4px", fontWeight: 500 }}>
                {cards.length === 0 ? "No cards tracked yet — add your first card to get started" : `Tracking ${stats.totalCards} card${stats.totalCards !== 1 ? "s" : ""} across your collection`}
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {!installed && (
                <button
                  onClick={installPrompt ? handleInstall : () => setShowInstallModal(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 18px",
                    background: "rgba(124,92,252,0.1)",
                    border: "1px solid rgba(124,92,252,0.3)",
                    borderRadius: "10px", color: "#a78bfa",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  📲 Install App
                </button>
              )}
              <Link
                href="/collection"
                className="add-card-btn"
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 18px",
                  background: "rgba(0,229,204,0.1)",
                  border: "1px solid rgba(0,229,204,0.3)",
                  borderRadius: "10px", color: "#00e5cc",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "14px", fontWeight: 600,
                  textDecoration: "none", transition: "background 0.15s",
                }}
              >
                + Add Card
              </Link>
            </div>
          </div>

          {/* Stats Row 1 */}
          <div className="stat-grid">
            <StatCard label="Total Cards" value={stats.totalCards} icon={IconCards} />
            <StatCard label="Total Invested" value={fmt(stats.totalInvested)} icon={IconDollar} />
            <StatCard label="Current Value" value={fmt(stats.currentValue)} icon={IconValue} />
          </div>

          {/* Stats Row 2 */}
          <div className="stat-grid-bottom">
            <StatCard
              label="Gain / Loss"
              value={`${gainPositive ? "+" : ""}${fmt(stats.gainLoss)}`}
              icon={IconGainLoss}
              positive={stats.totalInvested > 0 ? gainPositive : undefined}
              accent={gainPositive ? "rgba(0,229,160,0.08)" : "rgba(255,77,106,0.08)"}
            />
            <StatCard
              label="Portfolio Return"
              value={`${returnPositive ? "+" : ""}${stats.portfolioReturn.toFixed(1)}%`}
              icon={IconReturn}
              positive={stats.totalInvested > 0 ? returnPositive : undefined}
              accent={returnPositive ? "rgba(0,229,160,0.08)" : "rgba(255,77,106,0.08)"}
            />
            <StatCard
              label="Best Return"
              value={stats.bestReturnLabel === "-" ? "-" : stats.bestReturnLabel.split(" — ")[0]}
              sub={stats.bestReturnLabel !== "-" ? stats.bestReturnLabel.split(" — ")[1] : undefined}
              icon={IconStar}
              positive={stats.bestReturnLabel !== "-" ? true : undefined}
              accent="rgba(255,190,60,0.07)"
            />
          </div>

          {/* Body Grid: Sport Breakdown + Top Cards */}
          <div className="body-grid">
            {/* By Sport */}
            <div
              style={{
                background: "linear-gradient(135deg, #131929 0%, #0f1522 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 700, color: "#c0c8e8", letterSpacing: "0.02em" }}>
                  By Sport
                </h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Sport", "Cards", "Invested", "Value", "G/L"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
                            textAlign: h === "Sport" ? "left" : "right",
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#3a4465",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(stats.bySport).length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "28px 16px", textAlign: "center", color: "#3a4465", fontFamily: "'Outfit', sans-serif", fontSize: "13px" }}>
                          No cards yet
                        </td>
                      </tr>
                    ) : (
                      Object.entries(stats.bySport).map(([sport, data]) => {
                        const gl = data.value - data.invested;
                        const glPos = gl >= 0;
                        return (
                          <tr key={sport} className="table-row" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}>
                            <td style={{ padding: "12px 16px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 600, color: "#c0c8e8" }}>{sport}</td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#7a85a8" }}>{data.cards}</td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#7a85a8" }}>{fmt(data.invested)}</td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#c0c8e8" }}>{fmt(data.value)}</td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: glPos ? "#00e5a0" : "#ff4d6a" }}>
                              {glPos ? "+" : ""}{fmt(gl)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Cards */}
            <div
              style={{
                background: "linear-gradient(135deg, #131929 0%, #0f1522 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 700, color: "#c0c8e8" }}>
                  Top Cards
                </h2>
                {stats.topCards.length > 0 && (
                  <Link href="/collection" style={{ fontSize: "12px", color: "#00e5cc", fontWeight: 600, textDecoration: "none", fontFamily: "'Outfit', sans-serif" }}>
                    View all →
                  </Link>
                )}
              </div>
              {stats.topCards.length === 0 ? (
                <div style={{ padding: "40px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px", opacity: 0.3 }}>🃏</div>
                  <p style={{ color: "#3a4465", fontFamily: "'Outfit', sans-serif", fontSize: "13px" }}>Add cards to see top performers</p>
                </div>
              ) : (
                <div style={{ padding: "16px" }}>
                  <div className="card-grid">
                    {stats.topCards.map((card, i) => {
                      const bought = parseFloat(card.buy) || 0;
                      const current = parseFloat(card.val) || bought;
                      const gl = current - bought;
                      const glPos = gl >= 0;
                      return (
                        <div
                          key={i}
                          className="card-item"
                          style={{
                            background: "#0c0f1a",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "10px",
                            padding: "14px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => router.push("/collection")}
                        >
                          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 700, color: "#c0c8e8", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {card.player || card.name || "Card"}
                          </div>
                          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", color: "#4a5578", marginBottom: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {card.year} {card.sport} — {card.grade || "Raw"}
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 700, color: "#f0f2ff" }}>
                            {fmt(current)}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", fontSize: "11px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: glPos ? "#00e5a0" : "#ff4d6a" }}>
                            {glPos ? <IconTrending /> : <IconTrendingDown />}
                            {glPos ? "+" : ""}{fmt(gl)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Bottom nav — mobile only */}
        <BottomNav active="dashboard" />
      </div>

      {/* Install Modal */}
      {showInstallModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "#151929", border: "1px solid #2a3150", borderRadius: "16px", padding: "28px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📲</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "18px", fontWeight: 700, color: "#f0f2ff", marginBottom: "8px" }}>Install TopLoad</h3>
            <p style={{ fontSize: "13px", color: "#6a75a0", marginBottom: "20px", lineHeight: 1.6 }}>Add TopLoad to your home screen for the full app experience.</p>
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              <div style={{ padding: "14px", borderRadius: "10px", background: "#0c0f1a", border: "1px solid #2a3150" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#a78bfa", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>📱 iPhone / Safari</div>
                <div style={{ fontSize: "13px", color: "#8b93b8", lineHeight: 1.6 }}>Tap the <strong style={{ color: "#f0f2ff" }}>Share</strong> button at the bottom → then tap <strong style={{ color: "#f0f2ff" }}>"Add to Home Screen"</strong></div>
              </div>
              <div style={{ padding: "14px", borderRadius: "10px", background: "#0c0f1a", border: "1px solid #2a3150" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#22d3a7", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>🤖 Android / Chrome</div>
                <div style={{ fontSize: "13px", color: "#8b93b8", lineHeight: 1.6 }}>Tap the <strong style={{ color: "#f0f2ff" }}>3 dots menu</strong> (⋮) → then tap <strong style={{ color: "#f0f2ff" }}>"Add to Home Screen"</strong></div>
              </div>
            </div>
            <button onClick={() => setShowInstallModal(false)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "linear-gradient(135deg, #06d6d6, #22f5e0)", border: "none", color: "#000", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Got it!</button>
          </div>
        </div>
      )}
    </>
  );
}
