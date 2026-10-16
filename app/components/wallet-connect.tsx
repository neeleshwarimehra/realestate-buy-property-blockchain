"use client";

import { useEffect, useState } from "react";

interface EthereumProvider {
  request: (args: {
    method: string;
    params?: unknown[];
  }) => Promise<unknown>;

  on: (
    event: string,
    handler: (...args: unknown[]) => void
  ) => void;

  removeListener: (
    event: string,
    handler: (...args: unknown[]) => void
  ) => void;
}

interface EthereumError extends Error {
  code?: number;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const NETWORKS: Record<string, string> = {
  "0x1": "Ethereum Mainnet",
  "0xaa36a7": "Sepolia",
  "0x89": "Polygon",
  "0x13882": "Polygon Amoy",
};

const METAMASK_INSTALL_URL = "https://metamask.io/download/";

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    setError("");

    if (!window.ethereum) {
      setError(
        "MetaMask not detected. Please install MetaMask and refresh the page."
      );
      return;
    }

    if (isConnecting) {
      return;
    }

    try {
      setIsConnecting(true);

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      const currentChainId = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;

      setAddress(accounts[0] ?? null);
      setChainId(currentChainId);
    } catch (error) {
      const walletError = error as EthereumError;

      if (walletError.code === 4001) {
        setError("Connection request was rejected.");
      } else {
        console.error("MetaMask connection error:", error);
        setError("Unable to connect to MetaMask.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];

      if (!accounts || accounts.length === 0) {
        setAddress(null);
        return;
      }

      setAddress(accounts[0]);
      setError("");
    };

    const handleChainChanged = (...args: unknown[]) => {
      const newChainId = args[0] as string;

      setChainId(newChainId);
      setError("");
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );

      window.ethereum?.removeListener(
        "chainChanged",
        handleChainChanged
      );
    };
  }, []);

  const shortenAddress = (walletAddress: string) => {
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  };

  const networkName = chainId
    ? NETWORKS[chainId] || `Unknown Network (${chainId})`
    : "Unknown Network";

  if (!address) {
    return (
      <div className="mt-3 sm:mt-0 sm:ml-3">
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full rounded-md bg-[#10B981] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </button>

        {error && (
          <div className="mt-2 max-w-xs rounded-md bg-gray-700 px-3 py-3 text-sm text-red-300">
            <p>{error}</p>

            {!window.ethereum && (
              <a
                href={METAMASK_INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold text-blue-400 hover:text-blue-300 hover:underline"
              >
                Install MetaMask
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 sm:mt-0 sm:ml-3 rounded-md border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div className="text-xs text-gray-300">
        Wallet Connected
      </div>

      <div className="font-semibold text-white">
        {shortenAddress(address)}
      </div>

      <div className="text-xs text-gray-300">
        {networkName}
      </div>
    </div>
  );
}