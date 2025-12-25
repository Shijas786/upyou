"use client";
import { Users, MessageSquare, Heart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
    followersCount: number;
    activityCount: number;
    commentersCount: number;
    buyersCount: number;
    postBuyersCount?: number;
}

export function Stats({ realStats }: { realStats?: DashboardStats }) {
    const stats = [
        {
            label: "Network Activity",
            value: realStats ? realStats.followersCount.toLocaleString() : "0",
            change: realStats ? "Unique Peers" : "-",
            icon: Users,
            color: "rgba(59, 130, 246, 0.2)",
            textColor: "#3b82f6",
        },
        {
            label: "Total Transactions",
            value: realStats ? (realStats.activityCount ?? 0).toLocaleString() : "0",
            change: "Lifetime",
            icon: MessageSquare,
            color: "rgba(255, 75, 145, 0.2)",
            textColor: "#ff4b91",
        },
        {
            label: "Token Holdings",
            value: realStats ? realStats.commentersCount.toLocaleString() : "0",
            change: "Assets",
            icon: TrendingUp,
            color: "rgba(16, 185, 129, 0.2)",
            textColor: "#10b981",
        },
        {
            label: "Post Buyers",
            value: realStats ? (realStats.postBuyersCount ?? 0).toLocaleString() : "0",
            change: "Recent",
            icon: Heart,
            color: "rgba(245, 158, 11, 0.2)",
            textColor: "#f59e0b",
        },
    ];

    return (
        <div className="stats-grid">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card stat-item"
                >
                    <div className="stat-header">
                        <div className="icon-wrapper" style={{ backgroundColor: stat.color, color: stat.textColor }}>
                            <stat.icon size={24} />
                        </div>
                        <span className="change-badge" style={{ color: stat.textColor }}>
                            {stat.change}
                        </span>
                    </div>
                    <h3 className="stat-label">{stat.label}</h3>
                    <p className="stat-value">{stat.value}</p>
                </motion.div>
            ))}
        </div>
    );
}
