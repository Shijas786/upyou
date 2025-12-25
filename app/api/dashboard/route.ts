import { NextRequest, NextResponse } from "next/server";
import { getFollowers, getRecentActivity, getActiveCommenters } from "@/lib/neynar";
import { getVerifiedBuyers } from "@/lib/airstack";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY || "");

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    try {
        // 1. Resolve address to FID
        const userLookup = await neynar.lookupUserByAddress(address);
        const user = userLookup[address.toLowerCase()]?.[0];

        if (!user) {
            return NextResponse.json({ error: "Farcaster user not found for this address" }, { status: 404 });
        }

        const fid = parseInt(user.fid);

        // 2. Fetch data in parallel
        const [followers, activity, commenters, buyers] = await Promise.all([
            getFollowers(fid),
            getRecentActivity(fid),
            getActiveCommenters(fid),
            getVerifiedBuyers(fid)
        ]);

        return NextResponse.json({
            fid,
            user,
            stats: {
                followersCount: followers.length,
                activityCount: activity.length,
                commentersCount: commenters.length,
                buyersCount: buyers?.length || 0,
            },
            followers: followers.slice(0, 5), // Limit for preview
            activity: activity.slice(0, 5),
            commenters: commenters.slice(0, 5),
            buyers: buyers?.slice(0, 5) || []
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
