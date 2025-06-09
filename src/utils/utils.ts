/**
 * 
 * @param path original file path. Ex. file.md, file.ejs
 * @returns parsed path. Ex. file.html. Replaces white spaces with _ and treats other things (unwanted characters, date, etc)
 */
const formatUrlPath = (path: string): string => {
    let output = path;
    output = output.replace(/(\.md)|(\.ejs)/g, '.html');
    output = output.replace(/\s+/g, '_');
    output = output.replace(/-/g, '');
    output = output.replace(/^\d+_/g, '')
    output = output.toLowerCase();
    return output;
}

export { formatUrlPath };