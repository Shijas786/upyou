import axios from "axios";
import jwt from 'jsonwebtoken';

const getCDPUrl = () => {
    // If we have a JWT setup, use the base RPC URL, but the auth header will handle access.
    // Standard RPC URL for Base:
    return `https://api.developer.coinbase.com/rpc/v1/base`;
};

// Generate JWT for CDP API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateCDPToken(method: string, path: string): string | null {
    const keyName = process.env.CDP_API_KEY_NAME;
    const privateKey = process.env.CDP_API_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!keyName || !privateKey) {
        // Fallback to standard API Key if CDP Key Name/Private Key are not set
        return null;
    }

    const requestMethod = "POST"; // RPC uses POST
    const url = "api.developer.coinbase.com/rpc/v1/base"; // No scheme in URI claim usually, but let's follow standard practices or just the host+path

    // According to docs, uri claim should be: "POST api.developer.coinbase.com/rpc/v1/base"
    const uri = `${requestMethod} ${url}`;

    try {
        const token = jwt.sign(
            {
                iss: "coinbase-cloud-api",
                nbf: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 120, // 2 mins
                sub: keyName,
                uri,
            },
            privateKey,
            {
                algorithm: "ES256",
                header: {
                    kid: keyName,
                    nonce: Math.floor(Math.random() * 1000000).toString(), // optional but good practice
                },
            }
        );
        return token;
    } catch (e) {
        console.error("Error generating CDP JWT:", e);
        return null;
    }
}

export async function getOnchainTransactions(address: string) {
    let url = getCDPUrl();
    const token = generateCDPToken("POST", "rpc/v1/base");

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        // Fallback to URL key if no JWT
        const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
        if (apiKey) {
            url = `${url}/${apiKey}`;
        }
    }

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
            headers,
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
    let url = getCDPUrl();
    const token = generateCDPToken("POST", "rpc/v1/base");

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
        if (apiKey) url = `${url}/${apiKey}`;
    }

    if (!url) return [];

    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "cdp_listAddressTokenBalances",
            params: [{ address, page_size: 10 }]
        }, { headers, timeout: 5000 });

        if (response.data?.error) {
            console.error("CDP Token Balances Error:", response.data.error);
            return [];
        }

        return response.data?.result?.balances || [];
    } catch (error) {
        console.error("Error fetching token balances from CDP:", error);
        return [];
    }
}

export async function getTransactionCount(address: string) {
    let url = getCDPUrl();
    // Use simple URL key for eth_ methods usually, but JWT works too.
    // Let's stick to the same pattern for consistency if possible, 
    // BUT eth_getTransactionCount is a standard RPC that doesn't NEED advanced auth.
    // However, the base URL logic above might strip the key if we don't handle it.

    // Fallback logic copy-paste short version for now as this is a simple call
    const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
    if (apiKey) url = `${url}/${apiKey}`;

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
