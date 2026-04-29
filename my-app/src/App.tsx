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
      const response = await fetch(
        "https://youtube-download-iczp.onrender.com/download",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            quality,
            type,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Backend Error:", errorText);

        alert("Backend error ❌");
        setLoading(false);
        return;
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;

      if (type === "mp3") {
        a.download = "audio.mp3";
      } else {
        a.download = "video.mp4";
      }

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Error occurred ❌");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        color: "white",
      }}
    >
      <h1>YouTube Downloader 🎬</h1>

      <input
        type="text"
        placeholder="Paste YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          padding: "10px",
          width: "320px",
          borderRadius: "5px",
        }}
      />

      <br />
      <br />

      <select
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "5px",
        }}
      >
        <option value="low">Low (360p)</option>
        <option value="medium">Medium (480p)</option>
        <option value="hd720">HD 720p</option>
        <option value="hd1080">Full HD 1080p</option>
      </select>

      <br />
      <br />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "5px",
        }}
      >
        <option value="video">Video</option>
        <option value="mp3">MP3 (Audio)</option>
      </select>

      <br />
      <br />

      <button
        onClick={handleDownload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Download"}
      </button>
    </div>
  );
}

export default App;