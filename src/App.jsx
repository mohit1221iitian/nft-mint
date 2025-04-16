import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "./assets/abis.json";

const contractAddress = "0x8e6Bd6d4557f78F44b75C57873D0eb0627C1a0DF";

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log("Connected:", userAddress);
      setAccount(userAddress);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Wallet connection failed. Check console for details.");
    }
  };

  const mintNFT = async () => {
    if (!account) return alert("Please connect your wallet first.");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.safeMint(account);
      await tx.wait();
      alert("🎉 NFT Minted!");
    } catch (err) {
      console.error("❌ Minting failed:", err);
      alert("❌ Minting failed. See console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
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
