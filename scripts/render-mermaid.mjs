import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const mmd = fs.readFileSync("docs/m2-roadmap.mmd", "utf8");

// 1. 用 kroki.io 渲染 SVG
const svgRes = await fetch("https://kroki.io/mermaid/svg", {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: mmd,
});
if (!svgRes.ok) {
  console.error("kroki SVG fail:", svgRes.status, await svgRes.text());
  process.exit(1);
}
const svg = await svgRes.text();
fs.writeFileSync("docs/m2-roadmap.svg", svg);
console.log("✅ docs/m2-roadmap.svg", svg.length, "bytes");

// 2. 用 kroki.io 渲染 PNG
const pngRes = await fetch("https://kroki.io/mermaid/png", {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: mmd,
});
if (!pngRes.ok) {
  console.error("kroki PNG fail:", pngRes.status, await pngRes.text());
  process.exit(1);
}
const pngBuf = Buffer.from(await pngRes.arrayBuffer());
fs.writeFileSync("docs/m2-roadmap.png", pngBuf);
console.log("✅ docs/m2-roadmap.png", pngBuf.length, "bytes");
