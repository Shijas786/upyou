import axios from "axios";

const getCDPUrl = () => {
    const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
    if (!apiKey) {
        console.warn("CDP API Key missing (NEXT_PUBLIC_ONCHAINKIT_API_KEY)");
        return null;
    }
    return `https://api.developer.coinbase.com/rpc/v1/base/${apiKey}`;
};

export async function getOnchainTransactions(address: string) {
    const url = getCDPUrl();
    if (!url) return [];

    try {
        console.log(`[CDP] Fetching transactions for: ${address}`);
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "cdp_listAddressTransactions",
            params: [{
                address,
                page_size: 5
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // 5 second timeout
        });

        if (response.data?.error) {
            console.error("CDP RPC Error:", response.data.error);
            return [];
        }

        console.log(`[CDP] Raw Result for ${address}:`, JSON.stringify(response.data?.result || {}, null, 2).slice(0, 500)); // Log first 500 chars

        const txs = response.data?.result?.transactions || [];
        console.log(`[CDP] Found ${txs.length} transactions`);
        return txs;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error("CDP Axios Error:", (error as any)?.message || error);
        return [];
    }
}

export async function getOnchainTokenBalances(address: string) {
    const url = getCDPUrl();
    if (!url) return [];

    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "cdp_listAddressTokenBalances",
            params: [{ address }]
        });

        return response.data?.result?.balances || [];
    } catch (error) {
        console.error("Error fetching token balances from CDP:", error);
        return [];
    }
}

export async function getTransactionCount(address: string) {
    const url = getCDPUrl();
    if (!url) return 0;

    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getTransactionCount",
            params: [address, "latest"]
        });
        
        if (response.data.result) {
            return parseInt(response.data.result, 16);
        }
        return 0;
    } catch (error) {
        console.error("Error fetching tx count:", error);
        return 0;
    }
}
