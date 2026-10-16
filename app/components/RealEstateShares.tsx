"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/realEstateContract";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

export default function RealEstateShares() {
  const [propertyName, setPropertyName] = useState("");
  const [totalShares, setTotalShares] = useState("0");
  const [pricePerShare, setPricePerShare] = useState("0");
  const [sharesSold, setSharesSold] = useState("0");
  const [sharesAvailable, setSharesAvailable] = useState("0");
  const [userShares, setUserShares] = useState("0");

  const [shareAmount, setShareAmount] = useState("1");
  const [totalCost, setTotalCost] = useState("0");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function getContract() {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  async function loadPropertyData() {
    try {
      const contract = await getContract();

      const [name, total, price, sold, available] = await Promise.all([
        contract.propertyName(),
        contract.totalShares(),
        contract.pricePerShare(),
        contract.sharesSold(),
        contract.sharesAvailable(),
      ]);

      // Get the connected wallet address from the signer.
      // IMPORTANT: sharesOwned must exist in your Solidity contract/ABI.
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const walletSigner = await provider.getSigner();
      const signerAddress = await walletSigner.getAddress();

      const owned = await contract.sharesOwned(signerAddress);

      setPropertyName(name);
      setTotalShares(total.toString());
      setPricePerShare(ethers.formatEther(price));
      setSharesSold(sold.toString());
      setSharesAvailable(available.toString());
      setUserShares(owned.toString());

      calculateTotalCost(shareAmount, price);
    } catch (error) {
      console.error("Failed to load property data:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load property data.",
      );
    }
  }

  function calculateTotalCost(amount: string, price?: bigint) {
    try {
      if (!/^\d+$/.test(amount) || BigInt(amount) <= 0n) {
        setTotalCost("0");
        return;
      }

      const priceInWei = price ?? ethers.parseEther(pricePerShare || "0");

      const cost = priceInWei * BigInt(amount);

      setTotalCost(ethers.formatEther(cost));
    } catch {
      setTotalCost("0");
    }
  }

  async function buyShares() {
    try {
      setMessage("");

      if (!window.ethereum) {
        setMessage("Please install MetaMask.");
        return;
      }

      if (!/^[1-9]\d*$/.test(shareAmount)) {
        setMessage("Enter a valid positive whole number of shares.");
        return;
      }

      const amount = Number(shareAmount);

      if (!Number.isSafeInteger(amount)) {
        setMessage("Share quantity is too large.");
        return;
      }

      if (amount > Number(sharesAvailable)) {
        setMessage("Not enough shares available.");
        return;
      }

      setLoading(true);

      const contract = await getContract();
      const price: bigint = await contract.pricePerShare();
      const cost = price * BigInt(amount);

      setTotalCost(ethers.formatEther(cost));

      const tx = await contract.buyShares(amount, {
        value: cost,
      });

      setMessage("Transaction submitted. Waiting for confirmation...");

      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        throw new Error("Transaction failed or was reverted.");
      }

      setMessage("Shares purchased successfully!");

      await loadPropertyData();
    } catch (error: unknown) {
      console.error("Share purchase failed:", error);

      if (error instanceof Error) {
        const err = error as Error & {
          reason?: string;
          shortMessage?: string;
        };

        setMessage(
          err.reason ||
            err.shortMessage ||
            err.message ||
            "Transaction failed.",
        );
      } else {
        setMessage("Transaction failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPropertyData();
  }, []);

  return (
    <Card className="mt-10 bg-gray-900 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">
          {propertyName || "Real Estate Investment"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Shares</p>
            <p className="text-xl font-bold">{totalShares}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Price / Share</p>
            <p className="text-xl font-bold text-blue-400">
              {pricePerShare} ETH
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Shares Sold</p>
            <p className="text-xl font-bold">{sharesSold}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Available</p>
            <p className="text-xl font-bold text-green-400">
              {sharesAvailable}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-5">
          <p className="text-gray-400">Your Shares</p>
          <p className="text-3xl font-bold mb-6">{userShares}</p>

          <label
            htmlFor="shareAmount"
            className="block text-sm text-gray-300 mb-2"
          >
            Number of Shares
          </label>

          <input
            id="shareAmount"
            type="number"
            min="1"
            max={sharesAvailable}
            step="1"
            value={shareAmount}
            onChange={(e) => {
              const value = e.target.value;

              setShareAmount(value);
              calculateTotalCost(value);
            }}
            className="w-full rounded-md bg-gray-700 border border-gray-600 px-4 py-3 text-white"
          />

          <div className="flex justify-between mt-4 mb-4">
            <span className="text-gray-400">Total Cost</span>
            <span className="font-bold text-blue-400">{totalCost} ETH</span>
          </div>

          <Button
            onClick={buyShares}
            disabled={
              loading ||
              !/^[1-9]\d*$/.test(shareAmount) ||
              Number(shareAmount) > Number(sharesAvailable)
            }
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Processing..." : "Buy Shares"}
          </Button>

          {message && (
            <p className="mt-4 text-sm text-gray-300" role="status">
              {message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
