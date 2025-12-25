import axios from "axios";

const CDP_RPC_URL = `https://api.developer.coinbase.com/rpc/v1/base/${process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}`;

export async function getOnchainTransactions(address: string) {
    try {
        const response = await axios.post(CDP_RPC_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "cdp_listAddressTransactions",
            params: [{ address }]
        });

        if (response.data?.error) {
            console.error("CDP RPC Error:", response.data.error);
            return [];
        }

        return response.data?.result?.transactions || [];
    } catch (error) {
        console.error("Error fetching onchain transactions from CDP:", error);
        return [];
    }
}

export async function getOnchainTokenBalances(address: string) {
    try {
        const response = await axios.post(CDP_RPC_URL, {
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
