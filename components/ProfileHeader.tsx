import { Avatar, Name, Identity, Address } from "@coinbase/onchainkit/identity";
import { base } from "wagmi/chains";
import { useAccount } from "wagmi";
import { BadgeCheck, Globe, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
    address: string;
    stats?: {
        followersCount: number;
        activityCount: number;
        commentersCount: number; // Used as Token Holdings count
    };
}

export function ProfileHeader({ address, stats }: ProfileHeaderProps) {
    const { chain } = useAccount();

    const openBasenames = () => {
        window.open("https://www.base.org/names", "_blank");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="profile-header glass-card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2.5rem',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Gradient Effect */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Avatar & Identity */}
            <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>
                <Identity
                    address={address as `0x${string}`}
                    chain={base}
                    className="profile-identity-large"
                >
                    <div style={{
                        padding: '4px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #ff4b91 100%)',
                        borderRadius: '50%',
                        cursor: 'pointer'
                    }} onClick={openBasenames}>
                        <Avatar address={address as `0x${string}`} chain={base} style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #000' }} />
                    </div>
                </Identity>
            </div>

            <div style={{ textAlign: 'center', zIndex: 1, marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Identity
                        address={address as `0x${string}`}
                        chain={base}
                        className="profile-identity-name"
                    >
                        <Name address={address as `0x${string}`} chain={base} style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                    </Identity>
                    <BadgeCheck size={24} style={{ color: '#3b82f6' }} fill="rgba(59, 130, 246, 0.2)" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Address className="profile-address" />
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                        <Globe size={14} />
                        <span>{chain?.name || "Base Mainnet"}</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div style={{
                display: 'flex',
                gap: '3rem',
                padding: '1.5rem 3rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                zIndex: 1
            }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>
                        {stats?.followersCount.toLocaleString() || "0"}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>Unique Peers</span>
                </div>
                <div style={{ w: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>
                        {stats?.activityCount.toLocaleString() || "0"}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>Transactions</span>
                </div>
                <div style={{ w: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>
                        {stats?.commentersCount.toLocaleString() || "0"}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>Assets</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', zIndex: 1 }}>
                <button
                    onClick={openBasenames}
                    className="action-btn-primary"
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#fff',
                        color: '#000',
                        borderRadius: '12px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    Edit Profile <Share2 size={16} />
                </button>
            </div>
        </motion.div>
    );
}
