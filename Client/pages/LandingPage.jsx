import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = ({ connectWallet }) => {
  const navigate = useNavigate();

  const handleConnect = async () => {
    const connected = await connectWallet(); // ✅ using prop, not redefining
    if (connected) {
      navigate('/upload');
    }
    if (!connected) {
      alert("Connection failed 😓 Try again!");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] relative overflow-hidden">
      {/* Abstract Glow */}
      <motion.div
        className="absolute w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full -top-20 -left-20"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-pink-500 opacity-20 blur-2xl rounded-full bottom-10 right-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="z-10 backdrop-blur-xl bg-white/5 p-10 rounded-3xl border border-white/20 text-white shadow-2xl text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Enter the Vault</h1>
        <p className="text-sm text-gray-300">
          Connect your wallet to unlock encrypted storage and </p>
         <p className="text-sm mb-6 text-gray-300">
           vault features.
        </p>
        <motion.button 
          onClick={handleConnect}  /*whileTap={{ scale: 0.95 }} - if u want transtion */
          className="bg-purple-700 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-600 transition"
        >
          Connect Wallet
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPage;
