import { NextRequest, NextResponse } from "next/server";
import { getFollowers, getRecentActivity, getActiveCommenters } from "@/lib/neynar";
import { getOnchainTransactions } from "@/lib/cdp";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Neynar API key missing" }, { status: 500 });
    }

    try {
        const neynar = new NeynarAPIClient(apiKey);

        // 1. Resolve address to FID and User Data
        const usersResponse = await neynar.fetchBulkUsersByEthereumAddress([address]);
        const user = usersResponse[address.toLowerCase()]?.[0];

        if (!user) {
            return NextResponse.json({ error: "Farcaster user not found for this address" }, { status: 404 });
        }

        const fid = Number(user.fid);

        // 2. Fetch Social and Onchain data in parallel
        const [followers, activity, commenters, transactions] = await Promise.all([
            getFollowers(fid),
            getRecentActivity(fid),
            getActiveCommenters(fid),
            getOnchainTransactions(address)
        ]);

        // 3. Process Onchain Transactions into "Buy Post Info"
        /* eslint-disable @typescript-eslint/no-explicit-any */

        // Filter for token transfers or interesting social trade activity
        const onchainBuys = (transactions || [])
            .filter((tx: any) => tx.tokenTransfers && tx.tokenTransfers.length > 0)
            .map((tx: any) => {
                const transfer = tx.tokenTransfers[0];
                return {
                    type: transfer.from.toLowerCase() === address.toLowerCase() ? 'SELL' : 'BUY',
                    token: transfer.asset?.symbol || "TOKEN",
                    amount: transfer.value,
                    counterparty: transfer.from.toLowerCase() === address.toLowerCase() ? transfer.to : transfer.from,
                    time: tx.timestamp,
                    hash: tx.hash
                };
            });

        // 4. Pivot Neynar data for "Post Buyers" (Social engagement)
        const postBuyersData = activity
            .filter((cast: any) => cast.reactions.recasts.length > 0)
            .flatMap((cast: any) => cast.reactions.recasts.map((r: any) => ({
                creatorName: user.username,
                buyerAddress: r.user?.verified_addresses?.eth_addresses?.[0] || "",
                buyerName: r.user?.display_name || r.user?.username,
                token: "POST",
                amount: "1.0",
                time: cast.timestamp
            })))
            .slice(0, 10);

        // Filter "Verified Buyers" using actual onchain data from CDP
        const verifiedBuyers = onchainBuys.slice(0, 5).map((buy: any) => ({
            followerAddress: {
                addresses: [buy.counterparty],
                socials: [], // We'll let the frontend resolve this with Identity component
                tokenTransfers: [{
                    token: { symbol: buy.token, name: "Onchain Trade" },
                    formattedAmount: buy.amount,
                    blockTimestamp: buy.time
                }]
            }
        }));
        /* eslint-enable @typescript-eslint/no-explicit-any */

        return NextResponse.json({
            fid,
            user,
            stats: {
                followersCount: followers.length,
                activityCount: activity.length,
                commentersCount: commenters.length,
                buyersCount: onchainBuys.length,
                postBuyersCount: postBuyersData.length,
            },
            followers: followers.slice(0, 10),
            activity: activity.slice(0, 10),
            commenters: commenters.slice(0, 10),
            buyers: verifiedBuyers,
            postBuyers: postBuyersData,
            onchainHistory: onchainBuys.slice(0, 10)
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
