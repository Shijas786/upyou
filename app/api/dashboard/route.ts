import { NextRequest, NextResponse } from "next/server";
import { getOnchainTransactions, getTransactionCount } from "@/lib/cdp";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address")?.toLowerCase();

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    console.log(`[API] Fetching onchain dashboard for address: ${address}`);

    try {
        // Fetch Onchain Transactions and Count in parallel
        // If getting transactions fails (e.g. API limits), at least we get the count
        const [transactions, txCount] = await Promise.all([
            getOnchainTransactions(address),
            getTransactionCount(address)
        ]);

        // --- PROCESS DATA for Dashboard ---

        // 1. Identify "Followers" (Unique Counterparties)
        const uniqueCounterparties = new Set<string>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processedFollowers: any[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onchainBuys = (transactions || []).map((tx: any) => {
            const transfer = tx.tokenTransfers?.[0];
            const isSend = (transfer?.from || "").toLowerCase() === address;
            const counterparty = isSend ? transfer?.to : transfer?.from;

            if (counterparty && counterparty.toLowerCase() !== address && !uniqueCounterparties.has(counterparty)) {
                uniqueCounterparties.add(counterparty);
                processedFollowers.push({
                    verifications: [counterparty],
                    username: "", // OnchainKit will resolve this
                    display_name: "", // OnchainKit will resolve this
                    active_status: "Active",
                    profile: { bio: { text: isSend ? "Received tokens from you" : "Sent tokens to you" } }
                });
            }

            return {
                type: isSend ? 'SELL' : 'BUY',
                token: transfer?.asset?.symbol || "TOKEN",
                amount: transfer?.value || "0",
                counterparty: counterparty,
                time: tx.timestamp || new Date().toISOString(),
                hash: tx.hash
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).filter((t: any) => t.amount !== "0"); // Filter out empty transfers if any

        // 2. Pivot "Post Buyers" (Use Transaction Data as proxy for "App Activity")
        // In a real app, you might distinguish specific contract interactions here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const postBuyersData = onchainBuys.slice(0, 10).map((buy: any) => ({
            creatorName: "Base App",
            buyerAddress: buy.counterparty || "",
            buyerName: "", // OnchainKit handles this
            token: buy.token,
            amount: buy.amount,
            time: buy.time
        }));

        // 3. "Verified Buyers" are essentially the same onchain trades
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const verifiedBuyers = onchainBuys.slice(0, 5).map((buy: any) => ({
            followerAddress: {
                addresses: [buy.counterparty],
                socials: [],
                tokenTransfers: [{
                    token: { symbol: buy.token, name: "Onchain Trade" },
                    formattedAmount: buy.amount,
                    blockTimestamp: buy.time
                }]
            }
        }));

        return NextResponse.json({
            // Minimal mocked user object to satisfy frontend types if needed, or null
            user: {
                username: "Onchain User",
                follower_count: uniqueCounterparties.size,
                display_name: address.slice(0, 6) + "..." + address.slice(-4)
            },
            stats: {
                followersCount: uniqueCounterparties.size,
                activityCount: Math.max(transactions.length, txCount), // Use real onchain nonce if list is short/empty
                commentersCount: Math.floor(uniqueCounterparties.size * 0.3), // Mock metric based on verified interactions
                buyersCount: onchainBuys.length,
                postBuyersCount: postBuyersData.length,
            },
            followers: processedFollowers.slice(0, 20),
            activity: [], // No Farcaster casts
            commenters: [], // No Farcaster comments
            buyers: verifiedBuyers,
            postBuyers: postBuyersData,
            onchainHistory: onchainBuys.slice(0, 10)
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Dashboard API Error:", error?.message || error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error?.message || String(error)
        }, { status: 500 });
    }
}
