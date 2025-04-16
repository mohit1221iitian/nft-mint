import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "./assets/abis.json"; // Ensure this is the correct ABI path

const contractAddress = "0x8e6Bd6d4557f78F44b75C57873D0eb0627C1a0DF";

function NFTGallery({ account }) {
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, ABI, provider);

        const balance = await contract.balanceOf(account);
        const ownedNFTs = [];

        for (let i = 0; i < balance.toNumber(); i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          const tokenURI = await contract.tokenURI(tokenId);

          const response = await fetch(tokenURI);
          const metadata = await response.json();

          ownedNFTs.push({
            tokenId: tokenId.toString(),
            ...metadata,
          });
        }

        setNFTs(ownedNFTs);
      } catch (err) {
        console.error("Error loading NFTs:", err);
      }
    };

    fetchNFTs();
  }, [account]);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Your NFT Gallery</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {nfts.map((nft) => (
          <div
            key={nft.tokenId}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              margin: "10px",
              padding: "10px",
              width: "180px",
              textAlign: "center",
            }}
          >
            <img
              src={nft.image}
              alt={nft.name}
              style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "6px" }}
            />
            <h4>{nft.name}</h4>
            <p style={{ fontSize: "12px" }}>{nft.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NFTGallery;
