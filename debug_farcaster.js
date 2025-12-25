const axios = require('axios');

async function checkFarcaster() {
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik
    // const address = "0xYourAddressHere"; 
    
    // Try Warpcast API (Unofficial but strictly for frontend read)
    try {
        console.log("Checking Warpcast for", address);
        const url = `https://client.warpcast.com/v2/user-by-verification?address=${address}`;
        const res = await axios.get(url);
        console.log("Warpcast Result:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log("Warpcast Error:", e.message);
    }
}

checkFarcaster();
