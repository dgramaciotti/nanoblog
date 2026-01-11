import fs from "fs/promises";
import path from "path";
import { ejsPlugin, sitemapPlugin, articlePlugin, blogPlugin, tailwindPlugin } from "basic-ssg";
import { assetsPlugin } from "@basic-ssg/plugin-assets";

const copyCss = () => ({
  name: "copy-tailwind",
  setup: (cfg) => ({
    beforeBuild: [],
    afterBuild: [
      {
        glob: ["pages/nanoblog/output.css"],
        fn: async (files, cfg) => {
          await Promise.all(
            files.map(async (file) => {
              const rel = path.relative(cfg.paths.root, file);
              const dest = path.join(cfg.paths.dist, rel);
              await fs.mkdir(path.dirname(dest), { recursive: true });
              await fs.copyFile(file, dest);
            })
          );
        },
      },
    ],
  }),
});

export default {
  root: "pages",
  outDir: "dist",
  plugins: [
    assetsPlugin(),
    ejsPlugin(),
    tailwindPlugin(),
    sitemapPlugin(),
    articlePlugin(),
    blogPlugin(),
  ],
  siteUrls: {
    nanoblog: "https://dgramaciotti.github.io",
  },
};
