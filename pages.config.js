import { ejsPlugin, tailwindPlugin, sitemapPlugin, articlePlugin, blogPlugin } from "basic-ssg";
import { assetsPlugin } from "@basic-ssg/plugin-assets";

export default {
  root: "pages",
  outDir: "dist",
  plugins: [
    assetsPlugin(),
    ejsPlugin(),
    tailwindPlugin(),
    sitemapPlugin(),
    articlePlugin(),
    blogPlugin()
  ],
  siteUrls: {
    "nanoblog": "https://dgramaciotti.github.io",
  },
};
