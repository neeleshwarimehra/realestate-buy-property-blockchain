
"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "@/lib/realEstateContract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface PurchaseTransaction {
  amount: string;
  transactionHash: string;
  blockNumber: number;
}

export default function MySharesHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState("");
  const [shareBalance, setShareBalance] = useState("0");
  const [transactions, setTransactions] =
    useState<PurchaseTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadHistory() {
    try {
      setLoading(true);
      setMessage("");

      if (!window.ethereum) {
        setMessage("Please install MetaMask.");
        return;
      }

      const provider = new ethers.BrowserProvider(
        window.ethereum
      );

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const network = await provider.getNetwork();

      if (network.chainId !== 31337n) {
        setMessage(
          "Please switch MetaMask to Hardhat Localhost (Chain ID 31337)."
        );
        return;
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const owned = await contract.sharesOwned(address);

      setAccount(address);
      setShareBalance(owned.toString());

      const filter =
        contract.filters.SharesPurchased(address);

      const logs = await contract.queryFilter(
        filter,
        0,
        "latest"
      );

      const history: PurchaseTransaction[] = logs
        .map((log: any) => ({
          amount: log.args.amount.toString(),
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        }))
        .reverse();

      setTransactions(history);
    } catch (error: any) {
      console.error(error);
      setMessage(
        error?.shortMessage ||
          error?.message ||
          "Unable to load your share history."
      );
    } finally {
      setLoading(false);
    }
  }

  async function openHistory() {
    setIsOpen(true);
    await loadHistory();
  }

  return (
    <>
      <Button
        onClick={openHistory}
        className="bg-gray-700 text-white hover:bg-gray-600"
      >
        My Shares & History
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shares-history-title"
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 text-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-800 p-5 sm:p-6">
              <div>
                <h2
                  id="shares-history-title"
                  className="text-xl font-bold sm:text-2xl"
                >
                  My Shares & History
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  RoyalCity Tower · Blockchain records
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-1 text-2xl text-gray-400 hover:bg-gray-800 hover:text-white"
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            {/* Scrollable content */}
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
              {message && (
                <div className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
                  {message}
                </div>
              )}

              {loading ? (
                <div className="py-12 text-center text-gray-400">
                  Loading your blockchain records...
                </div>
              ) : (
                <>
                  {/* Balance card */}
                  <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950 to-gray-900 p-5">
                    <p className="text-sm text-gray-400">
                      Your Share Balance
                    </p>

                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-4xl font-bold text-white">
                          {shareBalance}
                        </p>
                        <p className="mt-1 text-sm text-blue-300">
                          RoyalCity Tower shares
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-300">
                        On-chain
                      </span>
                    </div>

                    <p className="mt-4 break-all text-xs text-gray-500">
                      Wallet: {account}
                    </p>
                  </div>

                  {/* Transaction history */}
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Transaction History
                        </h3>
                        <p className="text-sm text-gray-400">
                          {transactions.length} purchase
                          {transactions.length === 1 ? "" : "s"} found
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={loadHistory}
                        disabled={loading}
                        className="shrink-0 border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 hover:text-white"
                      >
                        Refresh
                      </Button>
                    </div>

                    {transactions.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-700 px-4 py-10 text-center">
                        <p className="font-medium text-gray-300">
                          No purchases found
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Your confirmed share purchases will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-72 overflow-auto rounded-xl border border-gray-800">
                        <table className="w-full min-w-[600px] text-left text-sm">
                          <thead className="sticky top-0 z-10 bg-gray-800 text-gray-300">
                            <tr>
                              <th className="px-4 py-3 font-medium">
                                Shares
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Transaction
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Block
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-800">
                            {transactions.map((tx) => (
                              <tr
                                key={tx.transactionHash}
                                className="hover:bg-gray-900"
                              >
                                <td className="px-4 py-4 font-semibold text-blue-300">
                                  {tx.amount}
                                </td>

                                <td className="px-4 py-4">
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        tx.transactionHash
                                      )
                                    }
                                    title="Copy transaction hash"
                                    className="font-mono text-xs text-gray-300 hover:text-blue-300"
                                  >
                                    {tx.transactionHash.slice(0, 10)}...
                                    {tx.transactionHash.slice(-6)}
                                  </button>
                                </td>

                                <td className="px-4 py-4 text-gray-400">
                                  {tx.blockNumber}
                                </td>

                                <td className="px-4 py-4">
                                  <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-400">
                                    Confirmed
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <p className="mt-3 text-xs text-gray-500">
                      Scroll horizontally to view all columns on smaller
                      screens. Click a transaction hash to copy it.
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex shrink-0 justify-end border-t border-gray-800 p-4 sm:p-5">
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}