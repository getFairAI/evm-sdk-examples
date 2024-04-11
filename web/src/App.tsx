import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getConnectedAddress, getEthBalance, getProvider, getUsdcBalance, getUsdcSentLogs, prompt, sendUSDC, setIrys, setProvider } from '@fairai/evm-sdk';
import { Client, Log, PublicClient, formatUnits, hexToBigInt, hexToString, parseUnits } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { getTransaction } from 'viem/actions';

const ARB_SEPOLIA_CHAIN_ID = '0x66eee';

function App() {
  const [count, setCount] = useState(0);
  const [ address, setAddress ] = useState('');
  const [ ethBalance, setEthBalance ] = useState(0);
  const [ usdcBalance, setUsdcBalance ] = useState(0);
  const [ chain, setChain ] = useState('');
  const [ logs, setLogs ] = useState<Log[]>([]);
  const [ input, setInput ] = useState('');
  const [ publicClient, setPublicClient ] = useState<Client | undefined>(undefined);

  useEffect(() => {
    (async () => {
      await setProvider();
      await setIrys();
      setChain(getProvider().publicClient.chain?.name ?? 'Not Available');
      const provider = getProvider();
      provider.walletClient.addChain({ chain: arbitrumSepolia });
      /* try {
        console.log(await provider.publicClient.estimateFeesPerGas());
        console.log(await provider.publicClient.estimateMaxPriorityFeePerGas());
      } catch (err) {
        console.error(err);
      } */
      
      provider.walletClient.switchChain({ id: arbitrumSepolia.id});
      setPublicClient(provider.publicClient);
      const addr = await getConnectedAddress();
      setAddress(addr);
      setEthBalance(await getEthBalance());
      setUsdcBalance(await getUsdcBalance());
      setLogs(await getUsdcSentLogs(addr,));
    })();
  }, []);

  const handleClick = async () => {
    console.log(input);
    await prompt(input, 'VpRvG_kfkiyRl9kLHr5CQA-y6B5rHiEJYMqAO5uknbI', 1);
  };

  const handleLinkClick = async (hash: `0x${string}` | null) => {
    if (!hash) {
      console.log('No hash provided');
    } else {
      const evmTx = await (publicClient as PublicClient).getTransaction({ hash });

      const data = evmTx.input;
      const memoSliceStart = 138;// 0x + function selector 4bytes-8chars + 2 32bytes arguments = 138 chars;
      const hexMemo = data.substring(memoSliceStart, data.length);
  
      const arweaveTx = hexToString(`0x${hexMemo}`);

      window.open(`https://arweave.net/${arweaveTx}`);
    }
  }

  const handleRetry = async () => {
    await sendUSDC('0xbdD8E24d367FE0Da06d27c2C67b81a5d6c68d027', 0.01, 'h-GLg4Ww0MOt9n5tAQ5dfDwpFINikrQF8uzhnHwzoY0');
  }
  
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>FairAI test</h1>
      <div className="card">
        <h2>Chain: {chain}</h2>
        <h2>Connected Address: {address}</h2>
        <h2>Eth Balance: {ethBalance}</h2>
        <h2>USDC Balance: {usdcBalance}</h2>
        <p>Hardcoded script id: 'VpRvG_kfkiyRl9kLHr5CQA-y6B5rHiEJYMqAO5uknbI'</p>

        <textarea onChange={(event) => setInput(event.target.value)} placeholder='Type your prompt'></textarea>
        <button onClick={handleClick}>
          Prompt
        </button>
        {/* <button onClick={handleRetry}>Retry h-GLg4Ww0MOt9n5tAQ5dfDwpFINikrQF8uzhnHwzoY0</button> */}
        <hr style={{ margin: "4px" }}>{/* <p>Transaction History</p> */}</hr>
        <h4>History</h4>
        {logs.map((log) => <div key={log.transactionHash} style={{ display: 'flex', flexDirection: 'row'}}>
          <p>Hash: {log.transactionHash}</p>
          <p>USDC transfered: {Number(formatUnits(hexToBigInt(log.data), 6))}</p>
          <a onClick={() => handleLinkClick(log.transactionHash)}>View Arweave Request</a>
        </div>
        )}
      </div>
    </>
  )
}

export default App
