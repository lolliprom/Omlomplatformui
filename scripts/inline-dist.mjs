import fs from "fs/promises";
import path from "path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");

const readUtf8 = (filePath) => fs.readFile(filePath, "utf8");

const inlineAsset = async (html, pattern, replacer) => {
  const match = html.match(pattern);
  if (!match?.[1]) {
    return html;
  }

  const assetPath = path.join(distDir, match[1].replaceAll("/", path.sep));
  const assetContents = await readUtf8(assetPath);
  return html.replace(pattern, () => replacer(assetContents));
};

const main = async () => {
  let html = await readUtf8(indexPath);

  html = await inlineAsset(
    html,
    /<script type="module" crossorigin src="\.\/([^"]+)"><\/script>/,
    (contents) => `<script type="module">\n${contents}\n</script>`,
  );

  html = await inlineAsset(
    html,
    /<link rel="stylesheet" crossorigin href="\.\/([^"]+)">/,
    (contents) => `<style>\n${contents}\n</style>`,
  );

  await fs.writeFile(indexPath, html, "utf8");
};

main().catch((error) => {
  console.error("Failed to inline dist assets:", error);
  process.exitCode = 1;
});
