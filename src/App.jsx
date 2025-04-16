import { useState } from 'react';
import { ethers } from 'ethers';
import ABI from './assets/abis.json'; // Make sure this path is correct and the ABI file exists

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
      "0x5Fd7D91957aCd87591aAAA42d9bfbB0A6ABe6474", // Replace with your contract address
      ABI,
      signer
    );

    try {
      const tx = await contract.mintNFT(); // Replace with the correct contract method if different
      await tx.wait();
      alert("NFT Minted!");
    } catch (err) {
      console.error("Minting failed:", err);
      alert("Minting failed!");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>My NFT Minter</h1>
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
