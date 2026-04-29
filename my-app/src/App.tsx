import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("hd720");
  const [type, setType] = useState("video");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url) {
      alert("Enter YouTube URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, quality, type })
      });

      if (!response.ok) {
        alert("Download failed ❌");
        setLoading(false);
        return;
      }

      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "video.mp4";
      link.click();

    } catch (error) {
      console.error(error);
      alert("Error occurred ❌");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>YouTube Downloader 🎬</h1>

      <input
        type="text"
        placeholder="Paste YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <select value={quality} onChange={(e) => setQuality(e.target.value)}>
        <option value="low">Low (360p)</option>
        <option value="medium">Medium (480p)</option>
        <option value="hd720">HD 720p</option>
        <option value="hd1080">Full HD 1080p</option>
      </select>

      <br /><br />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="video">Video</option>
        <option value="mp3">MP3 (Audio)</option>
      </select>

      <br /><br />

      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Processing..." : "Download"}
      </button>
    </div>
  );
}

export default App;