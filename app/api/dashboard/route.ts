import { NextRequest, NextResponse } from "next/server";
import { getOnchainTransactions, getTransactionCount, getOnchainTokenBalances } from "@/lib/cdp";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address")?.toLowerCase();

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    console.log(`[API] Fetching onchain dashboard for address: ${address}`);

    try {
        // Fetch Onchain Transactions, Count, and Balances in parallel
        const [transactions, txCount, portfolio] = await Promise.all([
            getOnchainTransactions(address),
            getTransactionCount(address),
            getOnchainTokenBalances(address)
        ]);

        // --- FETCH FARCASTER PROFILE (Via generic Neynar or public API) ---
        let farcasterProfile = null;
        try {
            // Using a generic public call or relying on client-side OnchainKit is safer for non-authed, 
            // but if we have a key (env) we use it. fallback to empty.
            const neynarKey = process.env.NEYNAR_API_KEY || "NEYNAR_API_DOCS"; // Fallback to free tier doc key for testing
            const fetch = (await import("node-fetch")).default; // Dynamic import for fetch if needed or just use built-in in Next 15+

            const neynarRes = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`, {
                headers: { 'accept': 'application/json', 'api_key': neynarKey }
            });

            if (neynarRes.ok) {
                const neynarData = await neynarRes.json();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const user = (neynarData as any)[address.toLowerCase()]?.[0];
                if (user) {
                    farcasterProfile = {
                        username: user.username,
                        displayName: user.display_name,
                        bio: user.profile?.bio?.text,
                        pfpUrl: user.pfp_url,
                        fid: user.fid
                    };
                }
            }
        } catch (e) {
            console.log("Farcaster fetch failed (non-critical):", e);
        }

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

        // 2. Identify "Buy Post" Transactions (Interactions with Specific Contract)
        // Contract: 0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789
        // Method ID: 0x1fad948c
        const BUY_POST_CONTRACT = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789".toLowerCase();
        const BUY_POST_METHOD = "0x1fad948c";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const postBuyTransactions = (transactions || []).filter((tx: any) => {
            const isToContract = (tx.to || "").toLowerCase() === BUY_POST_CONTRACT;
            const hasMethodId = (tx.input || "").toLowerCase().startsWith(BUY_POST_METHOD);
            // Also check 'data' field as some RPCs use that instead of 'input'
            const hasDataMethodId = (tx.data || "").toLowerCase().startsWith(BUY_POST_METHOD);

            return isToContract && (hasMethodId || hasDataMethodId);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const postBuyersData = postBuyTransactions.length > 0 ? postBuyTransactions.map((tx: any) => ({
            creatorName: "Base App Creator",
            buyerAddress: tx.from || "",
            buyerName: "", // OnchainKit handles this
            token: "ETH", // Assuming ETH for now based on method analysis
            amount: (parseInt(tx.value || "0") / 1e18).toFixed(4), // Convert Wei to ETH
            time: tx.timestamp || new Date().toISOString()
        })) : onchainBuys.slice(0, 10).map((buy: any) => ({
            // Fallback to generic buys if no specific "Buy Post" tx found (to keep UI populated)
            creatorName: "Base App",
            buyerAddress: buy.counterparty || "",
            buyerName: "",
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
                username: farcasterProfile?.username || "Onchain User",
                follower_count: uniqueCounterparties.size,
                display_name: farcasterProfile?.displayName || (address.slice(0, 6) + "..." + address.slice(-4))
            },
            profile: farcasterProfile, // Pass full profile object
            stats: {
                followersCount: uniqueCounterparties.size,
                activityCount: Math.max(transactions.length, txCount), // Use real onchain nonce if list is short/empty
                commentersCount: (portfolio as any[]).length, // Repurpose "Commenters" as "Token Holdings"
                buyersCount: onchainBuys.length,
                postBuyersCount: postBuyersData.length,
            },
            followers: processedFollowers.slice(0, 20),
            activity: [], // No Farcaster casts
            commenters: [], // No Farcaster comments
            buyers: verifiedBuyers,
            postBuyers: postBuyersData,
            onchainHistory: onchainBuys.slice(0, 10),
            portfolio: portfolio // Pass real portfolio data
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
