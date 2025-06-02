import fs from 'fs/promises'
import path from 'path'
import markdownit from 'markdown-it'
import ejs from 'ejs'
const md = markdownit()


// 1. Read base HTML template
// 2. Read all file names within posts folder
// 3. Add posts list to base HTML
// 4. Create a new HTML file for each post based on post template

async function renderHome(){
    const homePath = path.resolve(__dirname, './template/home.ejs')
    const files = await fs.readdir(path.resolve(__dirname, '../posts'), {withFileTypes: true});
    const posts = files
                    .filter(file => !file.isDirectory() && file.name.endsWith('.md'))
                    .map(file => 
                        (
                            {
                                title: file.name.split('_')[1].replace('.md', ''),
                                path: file.name.replace('.md', '.html'),
                                date: file.name.split('_')[0],
                            })
                    )
    ejs.renderFile(homePath, {posts}, async (err, data) => {
        if(err) {
            throw err
        }
        const str = data;
        
        fs.writeFile(path.resolve(__dirname, '../dist/index.html'), str, {encoding: 'utf-8'});
    })
}

async function renderPosts(){
    const postPath = path.resolve(__dirname, './template/post.ejs')
    const files = await fs.readdir(path.resolve(__dirname, '../posts'), {withFileTypes: true});
    const filePtrs = files
                    .filter(file => !file.isDirectory() && file.name.endsWith('.md'))
                    .map(file => file)
    filePtrs.forEach(async (file) => {
        const rawFile = await fs.readFile(path.resolve(__dirname, `../posts/${file.name}`), {encoding: 'utf-8'});
        const post = md.render(rawFile);
        ejs.renderFile(postPath, {post}, async (err, data) => {
            if(err) {
                throw err
            }
            const str = data;
            
            fs.writeFile(path.resolve(__dirname, `../dist/${file.name.replace('.md', '.html')}`), str, {encoding: 'utf-8'});
        })
    })
    
}

(async () => {
    try{
        await fs.rm(path.resolve(__dirname, '../dist'), {recursive: true, force: true});
        fs.mkdir(path.resolve(__dirname, '../dist'));
        renderHome();
        renderPosts();
    } catch(e){
        console.log('Error building', e);
        throw e;
    }
})();