import { Log } from "viem";
import { setProvider, subscribe } from "@fairai/evm-sdk";

(async () => {
  const callback = (logs: Log[]) => {
    console.log(logs);

    logs.forEach(log => {
      console.log(log);
    });
  }
  await setProvider({ privateKeyFile: '../../arb-dev-pk', providerUrl: 'https://sepolia-rollup.arbitrum.io/rpc' });

  const subscription = await subscribe('0xbdD8E24d367FE0Da06d27c2C67b81a5d6c68d027', callback);
})();