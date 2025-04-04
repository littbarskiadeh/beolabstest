import { useState, useEffect } from "react";
import { ethers } from "ethers";

const MetaMaskConnection = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        // Use BrowserProvider in ethers.js v6 instead of Web3Provider
        const provider = new ethers.BrowserProvider(window.ethereum, "any");

        // Request MetaMask accounts
        await provider.send("eth_requestAccounts", []);
        
        // Get the signer
        const signer = await provider.getSigner();
        
        // Access the wallet address using signer.address (no longer need getAddress)
        const address = signer.address;

        setWalletAddress(address);
        setIsConnected(true);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Error connecting to MetaMask: " + error.message);
      }
    } else {
      setErrorMessage("MetaMask is not installed.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setErrorMessage("");
  };

  useEffect(() => {
    // Check if user is already connected when component mounts
    if (window.ethereum?.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);
      setIsConnected(true);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow p-6 rounded-lg w-full max-w-md">
        <h1 className="text-2xl text-center text-gray-800 mb-6">
          MetaMask Wallet Connection
        </h1>
        {isConnected ? (
          <div>
            <p className="text-lg text-gray-800 mb-4">
              Connected Wallet Address:
              <span className="block text-purple-600 font-bold truncate">
                {walletAddress}
              </span>
            </p>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 text-white p-2 rounded w-full"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="bg-blue-600 text-white p-3 rounded w-full"
          >
            Connect Wallet
          </button>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default MetaMaskConnection;