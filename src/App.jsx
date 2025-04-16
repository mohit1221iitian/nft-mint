import React, { useState } from 'react';
import { ethers } from 'ethers';
import ABI from './assets/abis.json'; // Make sure ABI is correct

const contractAddress = "0x8e6Bd6d4557f78F44b75C57873D0eb0627C1a0DF"; // Replace this with your contract address

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  // Connect to MetaMask and get the user's account
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected account:", accounts[0]);
        setAccount(accounts[0]);

        // Optionally, detect network changes
        window.ethereum.on('chainChanged', () => window.location.reload());
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
        });
      } catch (err) {
        console.error("Wallet connection failed:", err);
        alert("Wallet connection failed!");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Mint NFT function
  const mintNFT = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setLoading(true); // Show loading spinner or message
    try {
      // Ensure Web3Provider is correctly imported and initialized
      const provider = new ethers.providers.Web3Provider(window.ethereum); // Using Ethers.js Web3Provider
      const signer = provider.getSigner(); // Get signer from the provider

      // Create contract instance with ABI and contract address
      const contract = new ethers.Contract(contractAddress, ABI, signer);

      // Call the minting function (replace with your actual minting method)
      console.log("Calling safeMint...");
      const tx = await contract.safeMint(account);
      console.log("Minting transaction:", tx);

      // Wait for the transaction to be mined
      await tx.wait();

      alert("🎉 NFT Minted Successfully!");
    } catch (err) {
      console.error("❌ Minting failed:", err);
      alert("❌ Minting failed. Check the console for details.");
    } finally {
      setLoading(false); // Hide loading spinner/message
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Gunani NFT Minter</h1>
      {account ? (
        <>
          <p>Connected: {account}</p>
          <button onClick={mintNFT} disabled={loading}>
            {loading ? "Minting..." : "Mint NFT"}
          </button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
