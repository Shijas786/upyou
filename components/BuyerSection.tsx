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

export function BuyerSection({ data, postBuyersData }: { data?: BuyerData[], postBuyersData?: PostBuyerData[] }) {
    const [activeTab, setActiveTab] = useState<'trade' | 'talk'>('trade');

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

    // --- TALK LOGIC (Mentions / Comments) ---
    const talkData = [
        {
            fallbackName: "jesse.base.eth",
            message: "This post is ungovernable! 🦝",
            time: "2m ago",
            isHighValue: true
        },
        {
            fallbackName: "basefan.eth",
            message: "L2 summer is here",
            time: "15m ago",
            isHighValue: false
        }
    ];

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
                    onClick={() => setActiveTab('talk')}
                    style={{
                        flex: 1,
                        padding: '1.25rem',
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'talk' ? '#fff' : 'rgba(255,255,255,0.4)',
                        borderBottom: activeTab === 'talk' ? '2px solid #fff' : 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Talk
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
                            key="talk-list"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="talk-list"
                        >
                            {talkData.map((talk, index) => (
                                <div key={index} className="buyer-card" style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <MessageCircle size={16} style={{ color: '#3b82f6' }} />
                                        </div>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{talk.fallbackName}</span>
                                        <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{talk.time}</span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.4' }}>{talk.message}</p>
                                    {talk.isHighValue && (
                                        <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <TrendingUp size={12} /> High Engagement Comment
                                        </div>
                                    )}
                                </div>
                            ))}
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
