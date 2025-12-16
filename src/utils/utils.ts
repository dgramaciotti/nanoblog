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

/**
 * Adds a tag to all elements in the HTML string.
 * @param htmlString the HTML to be modified
 * @param tag tag information. Ex. { attr: "class", value: "post", tag: "p" }
 */
const addAttr = (htmlString: string, tag: {attr: string; value: string; tag: string}): string => {
    let output = htmlString;
    const regex = new RegExp(`(\<${tag.tag})(.*?)\>`, 'g');
    output = output.replaceAll(regex, `$1$2 ${tag.attr}="${tag.value}" >`)
    return output;
}

/**
 * 
 * @param path Full html string.
 * @returns the transformed HTML, replacing when necessary jpg or png to webp
 */
const replaceImagePaths = (htmlString: string) => {
    let output = htmlString
    return output.replace(/(\.png)|(\.jpg)|(\.jpeg)/g, '.webp')
}

export { formatUrlPath, addAttr, replaceImagePaths };