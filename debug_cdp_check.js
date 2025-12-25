const axios = require('axios');

const apiKey = "LzOmNRg1CK3SB2GN5vV5F7QY7BTF80EM";
const address = "0x554d3d7B67c7e0c80539129eC15617D9f3c77d5D"; // A random Base user
const url = `https://api.developer.coinbase.com/rpc/v1/base/${apiKey}`;

async function testCDP() {
    console.log("Testing CDP connection to:", url);
    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "cdp_listAddressTransactions",
            params: [{
                address,
                page_size: 1
            }]
        });

        console.log("Status:", response.status);
        if (response.data.error) {
            console.error("RPC Error:", JSON.stringify(response.data.error, null, 2));
        } else {
            const txs = response.data.result?.transactions || [];
            console.log(`Found ${txs.length} transactions`);
            if (txs.length > 0) {
                console.log("Sample TX:", JSON.stringify(txs[0], null, 2));
            } else {
                console.log("Raw Result:", JSON.stringify(response.data.result, null, 2));
            }
        }
    } catch (e) {
        console.error("Request failed:", e.message);
        if (e.response) {
            console.error("Data:", e.response.data);
        }
    }
}

testCDP();
