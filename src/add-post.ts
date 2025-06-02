import fs from 'fs/promises'
import path from 'path';

(async () => {
    try{
        if(process.argv.length < 2){
            throw new Error('Provide a post name.')
        }
        const postName = process.argv[2];
        const date = new Date().toISOString().split('T')[0];
        fs.writeFile(path.resolve(__dirname, `../posts/${date}_${postName}.md`), '')
    } catch(e){
        throw e;
    }
})();