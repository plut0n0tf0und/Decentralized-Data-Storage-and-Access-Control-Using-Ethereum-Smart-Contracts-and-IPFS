import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Menu = ({ walletAddress, connectWallet }) => {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

return (
  <nav style={navStyle}>
    <style>{styles}</style> {/* Needed to inject navlink styles */}
    
    <div className="relative flex flex-col items-center">
      {/* Fancy Glow Blobs for Bougie UI */}
      <div className="absolute w-48 h-48 bg-purple-500 opacity-20 blur-3xl rounded-full -top-12 -left-10 z-0" />
      <div className="absolute w-40 h-40 bg-pink-400 opacity-15 blur-2xl rounded-full top-24 right-0 z-0" />

      {/* Titles */}
      <h1 className="text-white text-4xl font-vault font-extrabold tracking-wide z-10 mt-4">
        Meta
      </h1>
      <h1 className="text-white text-4xl font-vault font-extrabold tracking-wide mb-12 z-10">
        Vault
      </h1>
    </div>

    {/* Menu List */}
    <ul style={listStyle} className="z-10 space-y-4">
      {!walletAddress && (
        <li>
          <button onClick={connectWallet} className="bg-orange-500 hover:bg-orange-400 transition text-white font-semibold py-3 px-4 rounded-lg w-full shadow-md">
            Connect Wallet
          </button>
        </li>
      )}
      {walletAddress && (
        <>
          <li>
            <NavLink
              to="/upload"
              className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
              style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
              Upload File
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/view"
              className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
              style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
              View
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/myfiles"
              className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
              style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
              History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
              style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
              About
            </NavLink>
          </li>
        </>
      )}
    </ul>
  </nav>
);

};

const sharedLinkBase = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  fontSize: "22px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "12px 0",
  paddingLeft: "20px",
  width: "100%",
  boxSizing: "border-box",
  color: "#fff",
  transition: "all 0.3s ease",
};

const linkStyle = {
  ...sharedLinkBase,
};

const activeLinkStyle = {
  ...sharedLinkBase,
  color: "#3b82f6",
};

const navStyle = {
  width: "240px",
  position: "fixed",
  left: "0",
  top: "0",
  height: "100vh",
  background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
  padding: "40px 20px",
  display: "flex",
  flexDirection: "column",
  zIndex: 20,
  boxShadow: "5px 0 15px rgba(0, 0, 0, 0.3)"
};




const listStyle = {
  listStyle: "none",
  padding: "0",
  margin: "0",
};

const connectBtnStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  padding: "12px",
  border: "none",
  background: "#ff6600",
  color: "#fff",
  cursor: "pointer",
  borderRadius: "5px",
  width: "100%",
};

// 🔥 These styles are injected via <style> on mount
const styles = `
  .navlink {
    position: relative;
  }

  .navlink:hover {
    color: #00538C ;
    background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
  }

  .navlink.active::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 34px; /* match font size exactly */
    background-color: #3b82f6;
    border-radius: 2px;
  }
`;

export default Menu;
