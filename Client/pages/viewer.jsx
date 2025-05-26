import { useEffect, useState } from "react";

const Viewer = ({ cid }) => {
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`/api/download/${cid}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch file");

        setFileContent(data.content);
      } catch (err) {
        console.error("💥 Fetch error:", err);
        setError("Couldn't load the file.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    // Disable right-click
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => document.removeEventListener("contextmenu", disableRightClick);
  }, [cid]);

  const handlePrint = () => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`<pre>${fileContent}</pre>`);
    newWindow.document.close();
    newWindow.print();
  };

  if (loading) return <p className="text-center mt-10 text-lg">🔄 Loading file...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">🔍 File Viewer</h1>

      <div className="bg-gray-100 border rounded-lg p-4 h-[500px] overflow-auto shadow-inner">
        <pre className="whitespace-pre-wrap break-words text-gray-800 text-sm">
          {fileContent}
        </pre>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
        >
          🖨️ Print
        </button>
      </div>
    </div>
  );
};

export default Viewer;
