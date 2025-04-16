import { useState } from 'react';
import { ethers } from 'ethers';
import ABI from './assets/abis.json'; // Make sure ABI is correct

const contractAddress = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace this

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed:", err);
        alert("Wallet connection failed!");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const mintNFT = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);

      const tx = await contract.safeMint(account);
      await tx.wait();

      alert("🎉 NFT Minted Successfully!");
    } catch (err) {
      console.error("❌ Minting failed:", err);
      alert("❌ Minting failed. See console.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Gunani NFT Minter</h1>
      {account ? (
        <>
          <p>Connected: {account}</p>
          <button onClick={mintNFT}>Mint NFT</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
