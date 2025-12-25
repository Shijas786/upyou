"use client";
import { Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const buyers = [
    {
        address: "0xA0Cf798816D4D9b5700819B160e7E0a9F19bb32d",
        fallbackName: "benny.eth",
        item: "Base Pro Badge",
        price: "0.05 ETH",
        time: "5m ago",
    },
    {
        address: "0x2C1A5ED15462D24F333E6E8b2CE0f97092c73010",
        fallbackName: "alpha.base.eth",
        item: "Genesis NFT #442",
        price: "0.12 ETH",
        time: "12m ago",
    },
    {
        address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        fallbackName: "uniswapv2.eth",
        item: "Community Token",
        price: "10,000 $UP",
        time: "24m ago",
    },
];

export function BuyerSection() {
    return (
        <div className="glass-card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div className="icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.5rem' }}>
                    <ShoppingBag size={20} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Verified Buyers</h2>
            </div>
            <div className="buyers-list">
                {buyers.map((buyer, index) => (
                    <motion.div
                        key={buyer.address}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="buyer-card"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Identity address={buyer.address as `0x${string}`} className="onchain-identity-mini">
                                    <Avatar style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                                </Identity>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Identity address={buyer.address as `0x${string}`} className="onchain-identity-mini">
                                            <Name style={{ fontSize: '0.875rem', fontWeight: '600' }} />
                                        </Identity>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff' }}>{buyer.fallbackName}</span>
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginTop: '2px' }}>
                                        {buyer.address.slice(0, 6)}...{buyer.address.slice(-4)}
                                    </p>
                                </div>
                            </div>
                            <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.3)' }}>{buyer.time}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <p style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.2)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Item</p>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{buyer.item}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p className="price-tag">{buyer.price}</p>
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
