const express = require("express");
const app = express();
const v1router = require("./src/configs/versions/v1");
const errorHandler = require("./src/configs/utils/errorhandler");
const ApiResponse = require("./src/configs/utils/ApiResponse");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const VIDEOS_DIR =
  process.env.VIDEOS_DIR || path.join("public", "uploads", "videos");
const HLS_DIR = path.join(__dirname, "public", "hls");
if (!fs.existsSync(HLS_DIR)) fs.mkdirSync(HLS_DIR, { recursive: true });

const transcoding = new Map();

app.use(express.json());
app.use("/hls", express.static(HLS_DIR));

app.get("/stream/*splat", (req, res) => {
  let rel = req.params.splat || "";
  if (!rel) return ApiResponse.badRequest(res, "media not found", 404, false);
  const root = path.resolve(VIDEOS_DIR);
  rel = rel.slice(3);
  let input = path.join(root, ...rel);
  if (input !== root && !input.startsWith(root + path.sep)) {
    return ApiResponse.badRequest(res, "media not found", 404, false);
  }
  if (!fs.existsSync(input)) {
    return ApiResponse.badRequest(res, "media not found", 404, false);
  }
  console.log(input);
  const name = path.parse(input).name;
  const outDir = path.join(HLS_DIR, name);
  const playlist = path.join(outDir, "index.m3u8");
  const hlsUrl = `/hls/${name}/index.m3u8`;
  if (fs.existsSync(playlist)) return res.json({ success: true, url: hlsUrl });

  if (transcoding.has(playlist)) {
    return transcoding.get(playlist).then(
      () => res.json({ success: true, url: hlsUrl }),
      (err) => res.status(500).send(err.message),
    );
  }
  fs.mkdirSync(outDir, { recursive: true });
  const job = new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions([
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-hls_time",
        "6",
        "-hls_playlist_type",
        "vod",
        "-hls_segment_filename",
        path.join(outDir, "seg_%03d.ts"),
      ])
      .output(playlist)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

  transcoding.set(playlist, job);

  job.then(
    () => {
      transcoding.delete(playlist);
      res.json({ success: true, url: hlsUrl });
    },
    (err) => {
      transcoding.delete(playlist);
      fs.rmSync(outDir, { recursive: true, force: true });
      if (!res.headersSent) res.status(500).send(err.message);
    },
  );
});

app.get("/watch", (req, res) => {
  try {
    res.sendFile(
      path.join(__dirname, "public", "pages", "customers", "watch.html"),
    );
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
});
// --- API ensuite ---
app.use(v1router);
app.use(express.static("public"));
app.use(errorHandler);
app.use((req, res) => ApiResponse.notFound(res, "Endpoint not found"));

module.exports = app;
