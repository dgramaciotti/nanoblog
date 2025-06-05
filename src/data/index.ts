import fs from 'fs/promises';
import path from 'path';

const getIndexData = async () => {
    const files = await fs.readdir(path.resolve(__dirname, '../../posts'), {withFileTypes: true});
    const posts = files
                    .filter(file => !file.isDirectory() && file.name.endsWith('.md'))
                    .map(file => 
                        (
                            {
                                title: file.name.split('_')[1].replace('.md', ''),
                                path: file.name.replace('.md', '.html'),
                                date: file.name.split('_')[0],
                            }
                        )
                    )
                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { posts };
};

export default getIndexData;