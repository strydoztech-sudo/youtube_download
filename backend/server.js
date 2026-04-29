const express = require("express");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const { url, quality, type } = req.body;

  let format = "best";

  if (quality === "low") {
    format = "worst";
  } else if (quality === "medium") {
    format = "best[height<=480]";
  } else if (quality === "hd720") {
    format = "bestvideo[height<=720]+bestaudio";
  } else if (quality === "hd1080") {
    format = "bestvideo[height<=1080]+bestaudio";
  }

  const output = "%(title)s.%(ext)s";

  let args = [];

  if (type === "mp3") {
    args = ["-x", "--audio-format", "mp3", "-o", output, url];
  } else {
 args = [
  "-f",
  "best[ext=mp4]/best",
  "-o",
  "%(title)s.%(ext)s",
  url
];
  }

  const ytDlpPath = path.join(__dirname, "yt-dlp.exe");

  const process = spawn(ytDlpPath, args);

  process.on("close", (code) => {
    if (code === 0) {
      const files = fs.readdirSync(__dirname);

      const videoFiles = files.filter(f =>
        f.endsWith(".mp4") ||
        f.endsWith(".mkv") ||
        f.endsWith(".webm") ||
        f.endsWith(".mp3")
      );

      if (videoFiles.length === 0) {
        return res.status(404).send("File not found");
      }

      const latestFile = videoFiles
        .map(f => ({
          name: f,
          time: fs.statSync(path.join(__dirname, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)[0].name;

      const filePath = path.join(__dirname, latestFile);

      res.download(filePath, () => {
        // auto delete after download (optional)
        fs.unlinkSync(filePath);
      });

    } else {
      res.status(500).send("Download failed");
    }
  });
});

app.listen(5000, () => {
  console.log("🔥 Server running on port 5000");
});