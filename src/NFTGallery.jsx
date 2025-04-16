import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "./assets/abis.json";

const contractAddress = "0x8e6Bd6d4557f78F44b75C57873D0eb0627C1a0DF";

function NFTGallery({ account }) {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to manage UI feedback
  const [error, setError] = useState(null); // Error state to capture errors

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, ABI, provider);

        // Get the next token ID
        const nextTokenId = await contract._nextTokenId();
        console.log("Next Token ID:", nextTokenId.toString()); // Debugging log

        const ownedNFTs = [];

        // Loop through token IDs (from 0 to nextTokenId - 1)
        for (let tokenId = 0; tokenId < nextTokenId.toNumber(); tokenId++) {
          try {
            const owner = await contract.ownerOf(tokenId);
            if (owner.toLowerCase() === account.toLowerCase()) {
              const tokenURI = await contract.tokenURI(tokenId);
              const response = await fetch(tokenURI);
              const metadata = await response.json();

              ownedNFTs.push({
                tokenId: tokenId.toString(),
                ...metadata,
              });
            }
          } catch (err) {
            // If an error occurs, it means the token doesn't exist or isn't owned by the user
            continue;
          }
        }

        setNFTs(ownedNFTs);
        setLoading(false); // NFTs fetched, set loading to false
      } catch (err) {
        console.error("Error loading NFTs:", err);
        setError("Failed to load NFTs.");
        setLoading(false); // In case of error, stop loading
      }
    };

    fetchNFTs();
  }, [account]);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Your NFT Gallery</h2>
      {loading && <p>Loading NFTs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {nfts.length === 0 && !loading ? (
          <p>No NFTs found</p>
        ) : (
          nfts.map((nft) => (
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
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <h4>{nft.name}</h4>
              <p style={{ fontSize: "12px" }}>{nft.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NFTGallery;
