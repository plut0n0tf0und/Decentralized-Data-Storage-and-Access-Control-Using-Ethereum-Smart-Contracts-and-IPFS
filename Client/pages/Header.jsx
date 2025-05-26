  const shortenAddress = (address) => address.slice(0, 6) + "..." + address.slice(-4);
const Header = ({ walletAddress, connectWallet, disconnectWallet }) => {

    return (
      
        <div className="ml-100 w-[calc(100%-2rem)] flex items-center justify-between pl-8 pr-8  py-5 bg-white/10 backdrop-blur-lg shadow-md rounded-md  border-white/20">
        <div className="text-xl font-bold font-[inter] antialiased">Decentralized Storage with IPFS</div>
        <div className="flex items-center gap-6 pr-5">
        <div className="flex items-center gap-2 py-2 pr-7">
          
          {walletAddress && (
            <div className="flex font-2xl space-x-1 items-center">
              <span className="w-1 h-3 bg-green-500 animate-pulse rounded"></span>
              <span className="w-1 h-4 bg-green-600 animate-pulse delay-75 rounded"></span>
              <span className="w-1 h-2 bg-green-400 animate-pulse delay-150 rounded"></span>
            </div>
          )}
          <span>
            Wallet Address: {walletAddress ? shortenAddress(walletAddress) : 'Connect Wallet'}
          </span>
        </div>

          <button
            onClick={disconnectWallet}
            className="bg-white text-black font-2xl border-2 border-black py-2 px-4 rounded-2xl transition duration-200 hover:bg-red-600 border-red hover:text-white"
          >
            Disconnect Wallet
          </button>
        </div>

      </div>
    );
  };
  
  export default Header; // 👈 Ensure this is included
  