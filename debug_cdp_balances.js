const axios = require('axios');
const jwt = require('jsonwebtoken');

function generateToken() {
    const keyName = process.env.CDP_API_KEY_NAME;
    const privateKey = process.env.CDP_API_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!keyName || !privateKey) return null;
    const uri = "POST api.developer.coinbase.com/rpc/v1/base";
    return jwt.sign(
        { iss: "coinbase-cloud-api", nbf: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+120, sub: keyName, uri },
        privateKey,
        { algorithm: "ES256", header: { kid: keyName, nonce: Math.random().toString() } }
    );
}

async function test() {
    // Vitalik's address
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; 
    
    // Try to rely on RPC key if env vars for JWT aren't set in this shell
    // Note: This script runs in the agent's shell, which might NOT have the JWT keys if they were only added to Vercel.
    // So we validat against the RPC key first.
    
    const apiKey = "LzOmNRg1CK3SB2GN5vV5F7QY7BTF80EM";
    const url = `https://api.developer.coinbase.com/rpc/v1/base/${apiKey}`;

    console.log("Fetching balances...");
    try {
        const res = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "cdp_listAddressTokenBalances",
            params: [{ address, page_size: 5 }]
        });
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}

test();
