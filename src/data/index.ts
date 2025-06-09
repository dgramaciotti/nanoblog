import fs from 'fs/promises';
import path from 'path';
import { formatUrlPath } from '../utils/utils';

const getIndexData = async () => {
    const files = await fs.readdir(path.resolve(__dirname, '../../posts'), {withFileTypes: true});
    const posts = files
                    .filter(file => !file.isDirectory() && file.name.endsWith('.md'))
                    .map(file => 
                        (
                            {
                                title: file.name.split('_')[1].replace('.md', ''),
                                path: formatUrlPath(file.name),
                                date: file.name.split('_')[0],
                            }
                        )
                    )
                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { posts };
};

export default getIndexData;