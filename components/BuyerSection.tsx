"use client";
import { Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
import { ShoppingBag, ArrowUpRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

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

export function BuyerSection({ data, postBuyersData }: { data?: BuyerData[], postBuyersData?: any[] }) {
    // Combine traditional holders with new "Post Buyers" (Base App double-tap logic)
    const postBuyers = postBuyersData ? postBuyersData.flatMap(w =>
        w.buys?.map((b: any) => ({
            address: "", // We might not have the buyer's address directly here but we have the context
            fallbackName: `Buyer of ${w.name}'s Post`,
            item: `Bought ${b.token}`,
            price: `${parseFloat(b.amount).toFixed(4)} ${b.token}`,
            time: new Date(b.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isPostBuy: true
        })) || []
    ) : [];

    const traditionalBuyers = data && data.length > 0 ? data.map(b => {
        const follower = b.followerAddress;
        const social = follower.socials?.[0];
        const balance = follower.tokenBalances?.[0];
        const transfer = follower.tokenTransfers?.[0];

        return {
            address: follower.addresses?.[0] || "",
            fallbackName: social?.profileName || "Anonymous",
            item: transfer ? `Bought ${transfer.token.symbol}` : (balance ? `${balance.token.name} Holder` : "Verified Onchain"),
            price: transfer ? `${parseFloat(transfer.formattedAmount).toFixed(4)} ${transfer.token.symbol}` : (balance ? `${balance.amount} ${balance.token.symbol}` : "0 ETH"),
            time: "Recent",
            isPostBuy: !!transfer
        };
    }) : [
        {
            address: "0xA0Cf798816D4D9b5700819B160e7E0a9F19bb32d",
            fallbackName: "benny.eth",
            item: "Double Tapped Post",
            price: "0.05 ETH",
            time: "5m ago",
            isPostBuy: true
        },
        {
            address: "0x2C1A5ED15462D24F333E6E8b2CE0f97092c73010",
            fallbackName: "alpha.base.eth",
            item: "Bought Post",
            price: "0.12 ETH",
            time: "12m ago",
            isPostBuy: true
        }
    ];

    const displayData = [...postBuyers, ...traditionalBuyers].slice(0, 8);

    return (
        <div className="glass-card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div className="icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.5rem' }}>
                    <ShoppingBag size={20} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Post Buyers</h2>
            </div>
            <div className="buyers-list">
                {displayData.map((buyer: any, index: number) => (
                    <motion.div
                        key={(buyer.address || buyer.fallbackName) + index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="buyer-card"
                        style={{ borderLeft: buyer.isPostBuy ? '3px solid #ff4b91' : 'none' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {buyer.address ? (
                                    <Identity address={buyer.address as `0x${string}`} className="onchain-identity-mini">
                                        <Avatar style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                                    </Identity>
                                ) : (
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 75, 145, 0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                                        <Heart size={20} style={{ color: '#ff4b91', margin: 'auto' }} />
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {buyer.address && (
                                            <Identity address={buyer.address as `0x${string}`} className="onchain-identity-mini">
                                                <Name style={{ fontSize: '0.875rem', fontWeight: '600' }} />
                                            </Identity>
                                        )}
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff' }}>{buyer.fallbackName}</span>
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginTop: '2px' }}>
                                        {buyer.address ? `${buyer.address?.slice(0, 6)}...${buyer.address?.slice(-4)}` : 'Onchain Interaction'}
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
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
