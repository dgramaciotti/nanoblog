import fs from 'fs/promises'
import path from 'path'
import markdownit from 'markdown-it'
import { renderTemplate } from './renderTemplate'
import getIndexData from './data'
import { addAttr, formatUrlPath, replaceImagePaths } from './utils/utils'
import sharp from 'sharp'
const md = markdownit()


/** 
 * Build all pages based on the templates on the template folder
 * post template is excluded, because it has a different build process
*/
async function buildPages(templateVars: Record<string, any>){
    const files = (await fs.readdir(path.resolve(__dirname, './template'), {withFileTypes: true}))
        .filter(file => !file.isDirectory() && file.name.endsWith('.ejs') && !file.name.includes('post'));
    return Promise.all(files.map(file => {
        const dataIndex = file.name.replace('.ejs', '');
        return renderTemplate(`./template/${file.name}`, templateVars[dataIndex], `../dist/${formatUrlPath(file.name)}`);
    }));
};

async function buildPosts(){
    const files = await fs.readdir(path.resolve(__dirname, '../posts'), { withFileTypes: true });
    const filePtrs = files.filter(file => !file.isDirectory() && file.name.endsWith('.md'));
    Promise.all(filePtrs.map(async (file) => {
        const rawFile = await fs.readFile(path.resolve(__dirname, `../posts/${file.name}`), { encoding: 'utf-8' });
        let post = md.render(rawFile);
        post = addAttr(post, { tag: 'a', attr: 'target', value: '_blank'});
        post = replaceImagePaths(post)
        return await renderTemplate('./template/post.ejs', {post}, `../dist/${formatUrlPath(file.name)}`)
    }));
}

async function copyAssets() {
  const assetPath = path.resolve(__dirname, "../posts/assets");
  const destPath = path.resolve(__dirname, "../dist/assets");

  await fs.mkdir(destPath, { recursive: true });

  const files = await fs.readdir(assetPath);

  return Promise.all(
    files.map(async (file) => {
      const src = path.join(assetPath, file);

      const { name, ext } = path.parse(file);

      if(ext === '.svg'){
        return await fs.copyFile(src, path.join(destPath, `${name}.svg`))
      }

      const dest = path.join(destPath, `${name}.webp`);
      const image = sharp(src);

      const meta = await image.metadata();
      const stat = await fs.stat(src);

      const aspect = meta.width / meta.height;

      let maxWidth = 1000;
      if (aspect > 1.6) maxWidth = 1200;
      else if (aspect < 0.8) maxWidth = 900;

      const shouldResize =
        meta.width > maxWidth || stat.size > 200 * 1024;

      if (shouldResize) {
        image.resize({
          width: maxWidth,
          withoutEnlargement: true,
        });
      }

      return image
        .webp({
          quality: 75,
          effort: 4,
        })
        .toFile(dest);
    })
  );
}


(async () => {
    try{
        // cleanup dist folder
        await fs.rm(path.resolve(__dirname, '../dist'), {recursive: true, force: true});
        fs.mkdir(path.resolve(__dirname, '../dist'));
        // Build all pages
        buildPages({ index: await getIndexData()})
        buildPosts();
        copyAssets();
    } catch(e){
        console.log('Error building', e);
        throw e;
    }
})();