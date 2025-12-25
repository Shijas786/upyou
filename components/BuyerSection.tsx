"use client";
import { useState } from "react";
import { Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BuyerData {
    followerAddress: {
        addresses: string[];
        socials?: Array<{ profileName: string; userId: string }>;
        tokenBalances?: Array<{
            token: { name: string; symbol: string };
            amount: string;
        }>;
        tokenTransfers?: Array<{
            token: { name: string; symbol: string };
            formattedAmount: string;
            blockTimestamp: string;
        }>;
    };
}

interface PostBuyerItem {
    address: string;
    fallbackName: string;
    item: string;
    price: string;
    time: string;
    isPostBuy: boolean;
}

interface PostBuyerData {
    creatorName: string;
    buyerAddress: string;
    buyerName: string;
    token: string;
    amount: string;
    time: string | number | Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BuyerSection({ data, postBuyersData, portfolio }: { data?: BuyerData[], postBuyersData?: PostBuyerData[], portfolio?: any[] }) {
    const [activeTab, setActiveTab] = useState<'trade' | 'portfolio'>('trade');

    // --- TRADE LOGIC (Double Tap / Buy) ---
    const postBuyers: PostBuyerItem[] = postBuyersData ? postBuyersData.map((pb) => ({
        address: pb.buyerAddress,
        fallbackName: pb.buyerName || `Buyer of ${pb.creatorName}'s Post`,
        item: `Bought ${pb.token} (Post @${pb.creatorName})`,
        price: `${parseFloat(pb.amount).toFixed(4)} ${pb.token}`,
        time: new Date(pb.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPostBuy: true
    })) : [];

    const traditionalBuyers: PostBuyerItem[] = (data && data.length > 0) ? data.map(b => {
        const follower = b.followerAddress;
        const social = follower.socials?.[0];
        const transfer = follower.tokenTransfers?.[0];

        return {
            address: follower.addresses?.[0] || "",
            fallbackName: social?.profileName || "Anonymous",
            item: transfer ? `Bought ${transfer.token.symbol}` : "Verified Onchain",
            price: transfer ? `${parseFloat(transfer.formattedAmount).toFixed(4)} ${transfer.token.symbol}` : "0 ETH",
            time: "Recent",
            isPostBuy: !!transfer
        };
    }) : [];

    const tradeDataRaw = [...postBuyers, ...traditionalBuyers];
    const tradeData = tradeDataRaw; // No fallback

    // --- PORTFOLIO LOGIC ---
    const portfolioItems = portfolio?.map(p => ({
        symbol: p.asset.symbol || "UNK",
        name: p.asset.name || "Unknown Token",
        amount: p.value,
        decimals: p.asset.decimals || 18,
        image: p.asset.image_url,
    })) || [];

    return (
        <div className="glass-card" style={{ height: '100%', padding: '0' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                <button
                    onClick={() => setActiveTab('trade')}
                    style={{
                        flex: 1,
                        padding: '1.25rem',
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'trade' ? '#fff' : 'rgba(255,255,255,0.4)',
                        borderBottom: activeTab === 'trade' ? '2px solid #fff' : 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Trade
                </button>
                <button
                    onClick={() => setActiveTab('portfolio')}
                    style={{
                        flex: 1,
                        padding: '1.25rem',
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'portfolio' ? '#fff' : 'rgba(255,255,255,0.4)',
                        borderBottom: activeTab === 'portfolio' ? '2px solid #fff' : 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Portfolio
                </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'trade' ? (
                        <motion.div
                            key="trade-list"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="buyers-list"
                        >
                            {tradeData.length > 0 ? (
                                tradeData.map((buyer, index) => (
                                    <div
                                        key={(buyer.address || buyer.fallbackName) + index}
                                        className="buyer-card"
                                        style={{ borderLeft: buyer.isPostBuy ? '3px solid #ff4b91' : 'none' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {buyer.address && buyer.address !== "" ? (
                                                    <Identity address={buyer.address as `0x${string}`} className="onchain-identity-mini">
                                                        <Avatar style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                                                    </Identity>
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 75, 145, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Heart size={20} style={{ color: '#ff4b91', margin: 'auto' }} />
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        {buyer.address && buyer.address !== "" && (
                                                            <Identity address={buyer.address as `0x${string}`} className="onchain-identity-mini">
                                                                <Name style={{ fontSize: '0.875rem', fontWeight: '600' }} />
                                                            </Identity>
                                                        )}
                                                        {(!buyer.address || buyer.address === "") && <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff' }}>{buyer.fallbackName}</span>}
                                                    </div>
                                                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginTop: '2px' }}>
                                                        {buyer.address && buyer.address !== "" ? `${buyer.address.slice(0, 6)}...${buyer.address.slice(-4)}` : 'Onchain Interaction'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.3)' }}>{buyer.time}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <div>
                                                <p style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.2)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                                    {buyer.isPostBuy ? 'Action' : 'Status'}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{buyer.item}</p>
                                                    {buyer.isPostBuy && <Heart size={12} style={{ color: '#ff4b91' }} fill="#ff4b91" />}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p className="price-tag" style={{ color: buyer.isPostBuy ? '#ff4b91' : 'var(--accent-green)' }}>{buyer.price}</p>
                                                <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.625rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', padding: 0 }}>
                                                    TX <ArrowUpRight size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                    No transaction activity yet.
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="portfolio-list"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="portfolio-list"
                        >
                            {portfolioItems.length > 0 ? (
                                portfolioItems.map((token, index) => (
                                    <div key={index} className="buyer-card" style={{ marginBottom: '1rem', borderLeft: '3px solid #10b981' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            {token.image ? (
                                                <img src={token.image} alt={token.symbol} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                            ) : (
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <TrendingUp size={16} />
                                                </div>
                                            )}
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{token.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#10b981', marginLeft: 'auto', fontWeight: 'bold' }}>
                                                {(BigInt(token.amount) / BigInt(10 ** 18)).toString()} {token.symbol}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                            Balance: {token.amount} (Wei)
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                    No verifiable tokens found.
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function TrendingUp({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
    );
}
