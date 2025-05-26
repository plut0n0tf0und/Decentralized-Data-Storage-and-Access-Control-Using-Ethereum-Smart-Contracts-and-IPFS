import React, { useEffect, useState } from 'react';

const FilePrintView = () => {
  const params = new URLSearchParams(window.location.search);
  const fileUrl = params.get('fileUrl');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchText = async () => {
      try {
        setLoading(true);
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error('Failed to load file');
        const text = await res.text();
        setContent(text);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchText();
  }, [fileUrl]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      <button onClick={handlePrint} style={{ marginBottom: '1rem' }}>
        🖨️ Print
      </button>
      <pre>{content}</pre>
    </div>
  );
};

export default FilePrintView;
