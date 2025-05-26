import React from 'react';
import { useNavigate } from 'react-router-dom';


const LandingPage = ({ connectWallet }) => {
  const navigate = useNavigate();

  const handleConnect = async () => {
    const connected = await connectWallet(); // handle Metamask or whatever
    if (connected) {
      navigate('/upload'); // go straight to upload page
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center">
      {/* Replace this with a subtle SVG or image later */}
      <div className="text-4xl font-bold mb-6 tracking-wide">Enter the Vault</div>
      <p className="mb-8 text-gray-400 text-center max-w-md">
        Connect your wallet to store and secure your files with our encrypted system.
      </p>
      <button
        onClick={handleConnect}
        className="bg-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-900"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default LandingPage;
