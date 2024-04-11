import { setProvider, prompt, setIrys, getConnectedAddress, getUsdcSentLogs, decodeTxMemo, sendUSDC } from '@fairai/evm-sdk';
import { Query } from '@irys/query';

const pkFileLocation = process.env.PK_FILE_LOCATION;

if (!pkFileLocation) {
  throw new Error('Please provide PK_FILE_LOCATION');
}

(async () => {
  await setProvider({ privateKeyFile: pkFileLocation, providerUrl: 'https://sepolia-rollup.arbitrum.io/rpc' });
  await setIrys(pkFileLocation);
  
  const wallet = await getConnectedAddress();
  const irysQuery = new Query({ network: 'devnet' });
  const [data] = await irysQuery.search('irys:transactions').tags([
    { name: 'Protocol-Name', values: ['FairAI']},
    { name: 'Protocol-Version', values: ['2.0-test']},
    { name: 'Operation-Name', values: ['Inference Request']},
  ]).from([ wallet ]).sort('DESC').limit(1);

  console.log(data.id);
  const result = await fetch('https://arweave.net/'+data.id);
  console.log(await result.text());

  // check has paid
  const logs = await getUsdcSentLogs(wallet, '0xbdD8E24d367FE0Da06d27c2C67b81a5d6c68d027', 0.01);
  /* console.log(logs); */

  let hasPayment = false;
  for (const log of logs) {
    /* console.log(log); */
    const arweaveTx = await decodeTxMemo(log.transactionHash);
    /* console.log(arweaveTx); */
    if (arweaveTx === data.id) {
      hasPayment = true;
      break;
    }
  }
  console.log(hasPayment);
  if (!hasPayment) {
    await sendUSDC('0xbdD8E24d367FE0Da06d27c2C67b81a5d6c68d027', 0.01, data.id);
  }
  await prompt('Water Girl from X Men', 'VpRvG_kfkiyRl9kLHr5CQA-y6B5rHiEJYMqAO5uknbI', 1);
})();