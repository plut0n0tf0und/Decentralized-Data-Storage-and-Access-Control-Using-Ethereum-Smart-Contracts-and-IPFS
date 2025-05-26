import React from 'react';

const AboutPage = () => {
  return (
  <main className="max-w-6xl p-7 text-left text-gray-800 font-sans mt-4 mr-auto">
      <article className="prose prose-lg">
        <h1 className="text-3xl font-bold mb-6">How to Use the Decentralised File Vault</h1>

        <p className="mb-6">
          This application enables users to securely upload, store, and manage files using decentralised technologies, including IPFS and Ethereum-based wallet authentication. The following guide outlines the steps to effectively use the platform.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Connect Your Wallet</h2>
          <p>
            Upon accessing the platform, you will be prompted to connect your Ethereum-compatible wallet, such as Metamask. This connection is required to authenticate your session and link uploaded content to your unique wallet address.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Upload Files</h2>
          <p>
            Navigate to the Upload section. Select your file and choose between encrypted or unencrypted(public upload):
          </p>
          <ul className="list-disc list-inside ml-6 mt-2">
            <li><strong>Encrypted Upload:</strong> Files are encrypted locally in your browser. A decryption key will be generated, which must be retained for future access.</li>
            <li><strong>Unencrypted Upload:</strong> Files are uploaded without encryption and the metadata won't be stored in DB. The Content Identifier (CID) can be accessed through public gateways.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Retrieve Your CID</h2>
          <p>
            After a successful upload, the application will return a Content Identifier (CID). This CID acts as a pointer to your file within the IPFS network. For encrypted files, a corresponding decryption key will also be provided.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. View Stored Files</h2>
          <p>
            To access a file, go to the View tab, enter the corresponding CID, and ensure your wallet is connected. If the file was uploaded with encryption, you will be prompted to provide the decryption key.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Access Upload History</h2>
          <p>
            The History section allows users to review previously uploaded encrypted files. Information displayed includes the original filename, upload timestamp, and CID, with a quick-copy function for ease of access.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl  font-semibold mb-3">Notes:</h2>
          <ul className="list-disc list-inside ml-6 mt-2">
            <li>Only encrypted files are registered in the database; unencrypted files remain anonymous.</li>
            <li>The platform does not access your files, decryption keys, or personal credentials.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Support</h2>
          <p>
            For any technical difficulties or general inquiries, please contact the development team or consult the project's documentation.
          </p>
        </section>
      </article>
    </main>
  );
};

export default AboutPage;
