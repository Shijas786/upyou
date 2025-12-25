"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { Address, Name, Identity, Avatar } from "@coinbase/onchainkit/identity";
import { Stats } from "../components/Stats";
import { FollowerList } from "../components/FollowerList";
import { BuyerSection } from "../components/BuyerSection";
import { motion } from "framer-motion";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [dashboardData, setDashboardData] = useState<{
    stats?: any;
    followers?: any[];
    buyers?: any[];
    postBuyers?: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchDashboardData(address);
    }
  }, [isConnected, address]);

  const fetchDashboardData = async (userAddress: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?address=${userAddress}`);
      const data = await res.json();
      if (!data.error) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-container">
      <header className="header" style={{ marginBottom: '2rem' }}>
        <div className="logo-section">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>UpYou Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Social Insights • Trade • Talk</p>
          </motion.div>
        </div>

        <div className="wallet-section">
          <Wallet>
            <ConnectWallet className="connect-wallet-btn">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--accent-blue)' }}>
          <p className="animate-pulse">Tracking Base App Double-Tap Interactions...</p>
        </div>
      )}

      <section className="highlights">
        <Stats realStats={dashboardData?.stats} />
      </section>

      <section className="section-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        <div className="main-content">
          <FollowerList data={dashboardData?.followers} />
        </div>
        <aside className="sidebar">
          <BuyerSection data={dashboardData?.buyers} postBuyersData={dashboardData?.postBuyers} />
        </aside>
      </section>

      <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', borderTop: '1px solid var(--glass-border)' }}>
        <p>&copy; 2025 UpYou Dashboard • Built for Base Social Trading</p>
      </footer>
    </main>
  );
}
