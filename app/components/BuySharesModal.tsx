"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/realEstateContract";

interface BuySharesModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function BuySharesModal({
  onClose,
  onSuccess,
}: BuySharesModalProps) {
  const [shareAmount, setShareAmount] = useState("1");
  const [pricePerShare, setPricePerShare] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const totalCost = Number(shareAmount || 0) * Number(pricePerShare);

  async function buyShares() {
    try {
      setMessage("");

      if (!window.ethereum) {
        setMessage(
          "MetaMask not detected. Please install MetaMask and refresh the page.",
        );
        return;
      }

      const amount = Number(shareAmount);

      if (!Number.isInteger(amount) || amount <= 0) {
        setMessage("Enter a valid number of shares.");
        return;
      }

      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer,
      );

      // Get the current price directly from the smart contract
      const price = await contract.pricePerShare();

      const totalValue = price * BigInt(amount);

      const tx = await contract.buyShares(amount, {
        value: totalValue,
      });

      setMessage("Transaction submitted. Waiting for confirmation...");

      await tx.wait();

      setMessage("Shares purchased successfully!");

      onSuccess();

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error(error);

      if (error?.reason) {
        setMessage(error.reason);
      } else if (error?.shortMessage) {
        setMessage(error.shortMessage);
      } else if (error?.code === "ACTION_REJECTED") {
        setMessage("Transaction rejected in MetaMask.");
      } else {
        setMessage("Transaction failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-xl bg-gray-900 border border-gray-700 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Buy RoyalCity Tower</h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Number of Shares
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={shareAmount}
              onChange={(e) => setShareAmount(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-600 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Enter number of shares"
            />
          </div>

          <div className="rounded-lg bg-gray-800 p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Price / Share</span>

              <span className="text-white font-semibold">
                {pricePerShare} ETH
              </span>
            </div>

            <div className="border-t border-gray-700 pt-3 flex justify-between">
              <span className="text-gray-400">Total Cost</span>

              <span className="text-blue-400 font-bold">
                {totalCost.toFixed(2)} ETH
              </span>
            </div>
          </div>

          {message && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-300">
              <p>{message}</p>

              {message.includes("MetaMask not detected") && (
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-semibold text-blue-400 underline hover:text-blue-300"
                >
                  Install MetaMask
                </a>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-gray-600 text-black hover:bg-red-300 hover:text-gray-900"
            >
              Cancel
            </Button>

            <Button
              onClick={buyShares}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Processing..." : "Buy Shares"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
