"use client";
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { Address, Name, Identity, Avatar } from "@coinbase/onchainkit/identity";
import { Stats } from "../components/Stats";
import { FollowerList } from "../components/FollowerList";
import { BuyerSection } from "../components/BuyerSection";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="dashboard-container">
      <header className="header">
        <div className="logo-section">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>UpYou Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Social Insights & Onchain Activity</p>
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

      <section className="highlights">
        <Stats />
      </section>

      <section className="section-grid">
        <div className="main-content">
          <FollowerList />
        </div>
        <aside className="sidebar">
          <BuyerSection />
        </aside>
      </section>

      <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', borderTop: '1px solid var(--glass-border)' }}>
        <p>&copy; 2025 UpYou Dashboard • Powered by Base & OnchainKit</p>
      </footer>
    </main>
  );
}
