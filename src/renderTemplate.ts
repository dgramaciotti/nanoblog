import path from 'path';
import fs from 'fs/promises';
import ejs from 'ejs';


export async function renderTemplate(templatePath: string, templateData: Record<string, any>, outputPath: string): Promise<boolean | Error>{
    const inPath = path.resolve(__dirname, templatePath);
    const outPath = path.resolve(__dirname, outputPath);
    return new Promise((res, rej) => {
        ejs.renderFile(inPath, {...templateData}, async (err, parsedMd) => {
            if (err) {
                rej(err);
                return;
            }
            try {
                await fs.writeFile(outPath, parsedMd, { encoding: 'utf-8' });
                res(true);
                return;
            } catch(e){
                rej(e);
                return;
            }
        });
    })
}