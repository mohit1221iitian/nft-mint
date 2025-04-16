import { useState } from 'react';
import { ethers } from 'ethers';
import ABI from './assets/abis.json'; // Ensure ABI is correct and updated

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Wallet connection failed!");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const mintNFT = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0x8e6Bd6d4557f78F44b75C57873D0eb0627C1a0DF", // <-- Replace this with your actual deployed contract address
      ABI,
      signer
    );

    try {
      const tx = await contract.safeMint(account); // Pass the connected wallet as recipient
      await tx.wait();
      alert("🎉 NFT Minted Successfully!");
    } catch (err) {
      console.error("Minting failed:", err);
      alert("❌ Minting failed! See console for details.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Gunani NFT Minter</h1>
      {account ? (
        <>
          <p>Connected Wallet: {account}</p>
          <button onClick={mintNFT}>Mint NFT</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
