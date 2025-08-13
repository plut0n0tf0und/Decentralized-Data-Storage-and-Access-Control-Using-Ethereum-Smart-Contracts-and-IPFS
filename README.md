Decentralized File System on Ethereum and IPFS
A practical decentralized file management dApp. Users upload files through a web interface, files are stored on IPFS and pinned with Pinata, while file metadata and access rules are managed by an Ethereum smart contract. Wallet interactions are handled via MetaMask.

Summary
Decentralized storage using IPFS with Pinata pinning

On-chain metadata for integrity, access control, and traceability

Web app for upload, list, download, and soft-delete

Built with Solidity, Hardhat, Ethers.js, and React

Architecture
Layered design:

Application layer: React web app for authentication and file operations

Network layer: Ethereum testnet (for example, Sepolia) to execute contracts

Storage layer: IPFS to store file content; Pinata for pinning and persistence

Consensus and security layer: Blockchain for immutable state and access rules

High-level flow:

User selects a file in the UI

File is sent to Pinata and receives a CID

The CID and file metadata are registered on-chain

The UI lists files by reading contract state and events

Downloads use IPFS gateways or native IPFS resolution

Features
Content-addressed file storage on IPFS

Minimal metadata on-chain: name, CID, size, mime type, uploader, timestamps, soft-delete flag

Owner-only removal on-chain; unpin handled off-chain

Wallet connect and transactions via MetaMask

Gas-aware design keeping large data off-chain

Components
Blockchain and smart contracts: Ethereum for identities, access control, and metadata

IPFS: distributed object storage

Pinata: pinning and file management APIs

MetaMask: account management and transaction signing

Hardhat: compile, test, deploy

Ethers.js: contract interactions

React: front-end application

Prerequisites
Node.js 18 or newer

A package manager (npm, yarn, or pnpm)

A Pinata account and API credentials or a JWT

MetaMask configured for a test network

Test ETH on the chosen network

Environment Variables
Create an environment file to store at minimum:

Private key for deployment

RPC URL for the target network

Pinata credentials (API key and secret, or JWT)

Deployed contract address for the web app

Setup
Install dependencies for the project and the web app

Configure environment variables for Hardhat, Pinata, and the web app

Compile contracts and run tests locally

Deploy the contract to a test network

Start the web app and provide the deployed contract address and Pinata credentials via environment variables

Usage
Connect MetaMask in the web app

Upload a file; the app pins it to Pinata and obtains a CID

Register the file on-chain with metadata

List and download files from the UI using the stored CID

Soft-delete by marking the file in the contract; unpin off-chain when appropriate

Gas and Cost Notes
Keep file bytes off-chain to reduce gas

Store only essential metadata on-chain

Prefer events for indexing in off-chain services

Use test networks during development

Security Considerations
Validate inputs: non-empty CIDs, sane size limits, bounded metadata lengths

Enforce owner-only destructive operations

Treat gateway URLs carefully; consider an allow-listed set

Soft-delete on-chain; perform unpinning via a controlled service or worker

Testing
Unit tests for registration, duplicate prevention, removal, event emission, and getters

Consider property-based tests for CID formats and boundary conditions

Include negative tests for invalid inputs and unauthorized actions

Project Structure (described)
Contracts directory for Solidity sources and deployment scripts

Tests directory for unit and integration tests

Web directory for the React application, wallet hook, and Pinata integration helpers

Configuration files for Hardhat and environment management

Roadmap
Optional shared access lists or role-based sharing

Batch registration and pagination

Off-chain indexer for faster listings

Native IPFS protocol support in the UI where available

Automatic unpin worker upon on-chain soft-delete

Limitations
Availability depends on pinning; ensure reliable pin policies

Public CIDs are discoverable; encrypt at the client if confidentiality is required

Gas costs vary by network and traffic

License
This repository is released under an open license compatible with academic and commercial use. Add your preferred license file in the root of the repository.

Acknowledgments
Ethereum ecosystem and tooling

IPFS protocol and community

Pinata pinning service

Open-source libraries powering the stack
