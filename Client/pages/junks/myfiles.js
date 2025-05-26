import React from 'react';

const MyFilesPage = () => {
  const files = [
    { cid: 'Qm...123', name: 'file1.pdf' },
    { cid: 'Qm...456', name: 'image.png' },
    // Add real data later
  ];

  return (
    <div>
      <h2>My Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <a href={`/view/${file.cid}`} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyFilesPage;
