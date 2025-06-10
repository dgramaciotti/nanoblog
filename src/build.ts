import fs from 'fs/promises'
import path from 'path'
import markdownit from 'markdown-it'
import { renderTemplate } from './renderTemplate'
import getIndexData from './data'
import { addAttr, formatUrlPath } from './utils/utils'
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
        return await renderTemplate('./template/post.ejs', {post}, `../dist/${formatUrlPath(file.name)}`)
    }));
}

async function copyAssets(){
    const assetPath = path.resolve(__dirname, '../posts/assets');
    const destPath = path.resolve(__dirname, '../dist/assets');
    fs.cp(assetPath, destPath, { recursive: true });
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