const axios = require('axios');

async function checkNeynar() {
    // We'll use a public Neynar API key or a standard one if available. 
    // Usually these are kept in env.
    const apiKey = "NEYNAR_API_DOCS"; // This is their free tier key usually for testing
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik
    
    try {
        const url = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`;
        const res = await axios.get(url, {
             headers: { 
                'accept': 'application/json',
                'api_key': apiKey
             }
        });
        console.log("Neynar Result:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log("Neynar Error:", e.message);
    }
}
checkNeynar();
