"use client";
import { Users, MessageSquare, ShoppingCart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
    {
        label: "Active Followers",
        value: "1,284",
        change: "+12.5%",
        icon: Users,
        color: "rgba(59, 130, 246, 0.2)",
        textColor: "#3b82f6",
    },
    {
        label: "Recent Activity",
        value: "452",
        change: "+5.2%",
        icon: MessageSquare,
        color: "rgba(139, 92, 246, 0.2)",
        textColor: "#8b5cf6",
    },
    {
        label: "Bought Users",
        value: "89",
        change: "+18.3%",
        icon: ShoppingCart,
        color: "rgba(16, 185, 129, 0.2)",
        textColor: "#10b981",
    },
    {
        label: "Growth Rate",
        value: "24%",
        change: "+2.1%",
        icon: TrendingUp,
        color: "rgba(245, 158, 11, 0.2)",
        textColor: "#f59e0b",
    },
];

export function Stats() {
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
                        <span className="change-badge">
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
