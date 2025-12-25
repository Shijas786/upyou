const axios = require('axios');
require('dotenv').config();

async function check() {
    // Standard RPC URL for Base
    const url = 'https://api.developer.coinbase.com/rpc/v1/base/' + process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik

    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "cdp_listAddressTransactions",
            params: [{ address, page_size: 1 }]
        });
        
        console.log("TX Sample:", JSON.stringify(response.data.result.transactions[0], null, 2));
    } catch (e) {
        console.error(e.message);
    }
}
check();
