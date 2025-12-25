"use client";
import { Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
import { motion } from "framer-motion";

interface FollowerData {
    verifications?: string[];
    display_name?: string;
    username?: string;
    active_status?: string;
    profile?: {
        bio?: {
            text?: string;
        };
    };
}

export function FollowerList({ data }: { data?: FollowerData[] }) {
    // Use real data if available, otherwise fallback to mock
    const displayData = data ? data.map(u => ({
        address: u.verifications?.[0] || "",
        fallbackName: u.display_name || u.username || "Anonymous",
        status: u.active_status || "Active",
        lastSeen: "Recent",
        activity: u.profile?.bio?.text?.slice(0, 40) + "..." || "Active on Farcaster"
    })) : [
        {
            address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
            fallbackName: "vitalik.eth",
            status: "Active",
            lastSeen: "1m ago",
            activity: "Voted on DAO proposal",
        },
        {
            address: "0x838aD0EAEca69d12D738E619623C83D6176378A5",
            fallbackName: "baseuser.eth",
            status: "Active",
            lastSeen: "15m ago",
            activity: "Posted a new cast",
        }
    ];

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Active Followers</h2>
                <button style={{ color: 'var(--accent-blue)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    View Analytics
                </button>
            </div>
            <div className="followers-list">
                {displayData.map((follower, index) => (
                    <motion.div
                        key={follower.address + index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="follower-item"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Identity
                                address={follower.address as `0x${string}`}
                                className="onchain-identity"
                            >
                                <Avatar style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1a1a1a' }} />
                            </Identity>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {follower.address && (
                                        <Identity address={follower.address as `0x${string}`} className="onchain-identity">
                                            <Name style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }} />
                                        </Identity>
                                    )}
                                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>{follower.fallbackName}</span>
                                </div>
                                <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>{follower.activity}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                            <span className={`badge ${follower.status === 'active' ? 'badge-active' : ''}`} style={{ backgroundColor: follower.status !== 'active' ? 'rgba(255,255,255,0.1)' : '' }}>
                                {follower.status}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{follower.lastSeen}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
