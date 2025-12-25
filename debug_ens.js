const { createPublicClient, http } = require('viem');
const { mainnet, base } = require('viem/chains');
const { normalize } = require('viem/ens');

async function checkNames() {
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik
    
    const client = createPublicClient({
        chain: mainnet,
        transport: http()
    });
    
    const baseClient = createPublicClient({
        chain: base,
        transport: http() 
    });

    try {
        const ensName = await client.getEnsName({ address });
        console.log("Mainnet ENS:", ensName);
    } catch (e) {
        console.log("Mainnet ENS Error:", e.message);
    }

    try {
        // Base doesn't have a standardized simple "getEnsName" on the L2 the same way without a specific resolver often, 
        // but OnchainKit handles Basenames. 
        // Let's rely on OnchainKit logic or try to resolve a known Basename.
        // Actually, Basenames ARE L2 ENS.
        
        // This is just a test.
    } catch (e) {
    }
}

checkNames();
