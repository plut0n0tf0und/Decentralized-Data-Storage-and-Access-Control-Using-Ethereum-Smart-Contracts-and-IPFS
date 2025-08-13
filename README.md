
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Decentralized File System – Ethereum (Sepolia) + IPFS (Lighthouse)</title>
</head>
<body>
  <main class="container">
    <header>
      <h1 class="title">Decentralized File System</h1>
      <p class="subtitle">Ethereum (Sepolia) for metadata and access control + IPFS (Lighthouse) for content storage. Wallet interactions via MetaMask. Frontend as a lightweight web application.</p>
      <div>
        <span class="tag">Solidity</span>
        <span class="tag">Hardhat</span>
        <span class="tag">Ethers.js</span>
        <span class="tag">React</span>
        <span class="tag">IPFS</span>
        <span class="tag">Lighthouse</span>
        <span class="tag">MetaMask</span>
        <span class="tag">Sepolia</span>
      </div>
    </header>

    <section class="card">
      <div class="kicker">Summary</div>
      <p>Files are stored on IPFS and pinned using Lighthouse, while a smart contract on the Sepolia network keeps tamper‑evident metadata, ownership, and access rules. The web app lets users connect a wallet, upload files, register metadata on‑chain, list their files, download via IPFS, and soft‑delete when needed.</p>
      <div class="grid">
        <div>
          <h3>Key points</h3>
          <ul>
            <li>Content‑addressed storage using IPFS CIDs</li>
            <li>On‑chain metadata: name, CID, size, type, owner, timestamps, removal flag</li>
            <li>Owner‑only destructive actions</li>
            <li>Gas‑aware: large data lives off‑chain</li>
          </ul>
        </div>
        <div>
          <h3>Layers</h3>
          <ol>
            <li>Application: React web app for file operations</li>
            <li>Network: Ethereum Sepolia for contract execution</li>
            <li>Storage: IPFS via Lighthouse for persistence</li>
            <li>Consensus & Security: blockchain for integrity and traceability</li>
          </ol>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>Architecture Flow</h2>
      <ol>
        <li>User selects a file in the web app.</li>
        <li>The app uploads to Lighthouse and receives a CID.</li>
        <li>The app submits a transaction on Sepolia to register metadata with the CID.</li>
        <li>The UI queries on‑chain state and events to list user files.</li>
        <li>Downloads resolve via IPFS gateways or native IPFS.</li>
      </ol>
      <p class="small">Note: Soft‑delete on‑chain should be followed by an off‑chain unpin using Lighthouse if you want to free storage.</p>
    </section>

    <section class="card">
      <h2>Components</h2>
      <ul>
        <li><strong>Smart contracts</strong>: Solidity contracts manage registration, ownership, and removal flags.</li>
        <li><strong>Ethereum (Sepolia)</strong>: test network for deployment and interaction.</li>
        <li><strong>IPFS</strong>: distributed content storage identified by CIDs.</li>
        <li><strong>Lighthouse</strong>: pinning and persistence for IPFS content via API and dashboard.</li>
        <li><strong>Web app</strong>: React interface for wallet connect, upload, list, and download.</li>
        <li><strong>Tooling</strong>: Hardhat for compile, test, deploy; Ethers.js for RPC interactions.</li>
        <li><strong>Wallet</strong>: MetaMask for accounts and transaction signing.</li>
      </ul>
    </section>

    <section class="card">
      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18 or newer and a package manager</li>
        <li>MetaMask configured for Sepolia</li>
        <li>A Lighthouse account and API key or JWT</li>
        <li>Sepolia test ETH for deployment and interaction</li>
      </ul>
    </section>

    <section class="card">
      <h2>Configuration</h2>
      <p>Create environment entries for the following values. Store secrets securely and never commit them to version control.</p>
      <ul>
        <li>Private key used for Sepolia deployments</li>
        <li>RPC URL for Sepolia</li>
        <li>Lighthouse API key or JWT</li>
        <li>Deployed contract address for the web app</li>
      </ul>
    </section>

    <section class="card">
      <h2>Setup</h2>
      <ol>
        <li>Install project dependencies in the root and in the web application folder.</li>
        <li>Copy the example environment file and fill in your values for Sepolia and Lighthouse.</li>
        <li>Compile the contracts and run the test suite locally.</li>
        <li>Deploy the contracts to Sepolia and note the deployed address.</li>
        <li>Start the web app and provide the deployed address and Lighthouse credentials.</li>
      </ol>
    </section>

    <section class="card">
      <h2>Usage</h2>
      <ol>
        <li>Open the web app and connect MetaMask.</li>
        <li>Select a file to upload; the app pins it using Lighthouse and obtains a CID.</li>
        <li>Confirm the transaction that registers the metadata on Sepolia.</li>
        <li>View your file list and use the CID to download via IPFS.</li>
        <li>When removing, mark it on‑chain and optionally unpin in Lighthouse.</li>
      </ol>
    </section>

    <section class="card">
      <h2>Security</h2>
      <ul>
        <li>Validate inputs: non‑empty CIDs, reasonable size limits, bounded metadata lengths.</li>
        <li>Restrict destructive actions to the file owner.</li>
        <li>Use an allow‑listed set of IPFS gateways in the UI if required.</li>
        <li>For confidentiality, encrypt files client‑side before uploading to IPFS.</li>
      </ul>
    </section>

    <section class="card">
      <h2>Gas and Cost</h2>
      <ul>
        <li>Store only pointers and essential metadata on‑chain.</li>
        <li>Prefer event logs for off‑chain indexing.</li>
        <li>Keep large data off‑chain to minimize gas costs.</li>
        <li>Use test networks during development.</li>
      </ul>
    </section>

    <section class="card">
      <h2>Testing</h2>
      <ul>
        <li>Cover registration, duplicate prevention, removal, events, and getters.</li>
        <li>Include negative cases for invalid inputs and unauthorized actions.</li>
        <li>Consider property‑based tests for CID formats and limits.</li>
      </ul>
    </section>

    <section class="card">
      <h2>Project Structure (described)</h2>
      <ul>
        <li>Contracts folder for Solidity sources and deployment scripts</li>
        <li>Tests folder for unit and integration tests</li>
        <li>Web folder for the frontend application</li>
        <li>Configuration files for Hardhat and environment handling</li>
      </ul>
    </section>

    <section class="card">
      <h2>Roadmap</h2>
      <ul>
        <li>Optional shared access lists or roles</li>
        <li>Batch registration and pagination in listings</li>
        <li>Off‑chain indexer for faster queries</li>
        <li>Automated Lighthouse unpin when a file is soft‑deleted on‑chain</li>
      </ul>
    </section>

    <section class="card">
      <h2>Limitations</h2>
      <ul>
        <li>Availability depends on pinning policies; review Lighthouse pin rules</li>
        <li>Public CIDs are discoverable; use client‑side encryption if needed</li>
        <li>Gas costs and block times vary with network conditions</li>
      </ul>
    </section>

    <section class="card">
      <h2>License</h2>
      <p>Add a license file at the repository root that fits your distribution needs.</p>
    </section>

    <footer class="small">
      <p>Target network: Sepolia. Storage provider: Lighthouse IPFS. Replace placeholders with your actual values before publishing.</p>
    </footer>
  </main>
</body>
</html>
