const { createPublicClient, http } = require('viem');
const { base } = require('viem/chains');

const client = createPublicClient({
  chain: base,
  transport: http()
});

async function analyze() {
  const txHash = '0x3bbed1acb3eaab60246f005e6663c8224e4b853141f46c5612d61a8fa2d97a7a';
  try {
    const tx = await client.getTransaction({ hash: txHash });
    const receipt = await client.getTransactionReceipt({ hash: txHash });

    console.log('--- Transaction Details ---');
    console.log('To:', tx.to);
    console.log('Input (Method ID):', tx.input.slice(0, 10));
    console.log('Value:', tx.value.toString());
    
    console.log('\n--- Logs ---');
    receipt.logs.forEach((log, index) => {
      console.log(`Log ${index} Address:`, log.address);
      console.log(`Log ${index} Topics:`, log.topics);
    });
  } catch (err) {
    console.error(err);
  }
}

analyze();
