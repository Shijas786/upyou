const { createPublicClient, http } = require('viem');
const { base } = require('viem/chains');

const client = createPublicClient({ chain: base, transport: http() });

async function analyze() {
  const txHash = '0x3bbed1acb3eaab60246f005e6663c8224e4b853141f46c5612d61a8fa2d97a7a';
  const tx = await client.getTransaction({ hash: txHash });
  console.log('To:', tx.to);
  console.log('Method ID:', tx.input.slice(0, 10));
}
analyze();
