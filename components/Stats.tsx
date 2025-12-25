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
            label: "Active Followers",
            value: realStats?.followersCount?.toLocaleString() || "1,284",
            change: realStats ? "Live" : "+12.5%",
            icon: Users,
            color: "rgba(59, 130, 246, 0.2)",
            textColor: "#3b82f6",
        },
        {
            label: "Post Buyers",
            value: realStats?.postBuyersCount?.toLocaleString() || (realStats?.buyersCount?.toLocaleString() || "89"),
            change: "Base App",
            icon: Heart,
            color: "rgba(255, 75, 145, 0.2)",
            textColor: "#ff4b91",
        },
        {
            label: "Verified Buyers",
            value: realStats?.buyersCount?.toLocaleString() || "89",
            change: realStats ? "Verified" : "+18.3%",
            icon: TrendingUp, // Changed to a more "verified" looking icon or just keep it
            color: "rgba(16, 185, 129, 0.2)",
            textColor: "#10b981",
        },
        {
            label: "Commenters",
            value: realStats?.commentersCount?.toLocaleString() || "24",
            change: realStats ? "Top users" : "+2.1%",
            icon: MessageSquare,
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
