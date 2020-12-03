const fs =require('fs');
const path = require('path');

function copyFile(filename, joinfiles, srcpath, dstpath){

    let src = path.join(srcpath, filename);
    let dst = path.join(dstpath, filename);

    let content = fs.readFileSync(src, 'utf8').replace(/html/g,'script');

    for (const item of joinfiles) {
        let joincontent = fs.readFileSync(path.join(dstpath, item), 'utf8');

        // add differnt join options css, js, ...
        // add search for <script src -> and include this file
        content = '<script type="text/javascript">\r\n'
            + joincontent.replace('Object.defineProperty(exports, "__esModule", { value: true });','')
            +'\r\n</script>\r\n\r\n'
            + content;
        fs.unlinkSync(path.join(dstpath, item));
    }
    fs.writeFileSync(dst, content, 'utf8')
}

var searchpath = 'src/';
var exportpath = 'nodes/'

var entries = fs.readdirSync(searchpath);
var dstentries = fs.readdirSync(exportpath);

for (i = 0; i < entries.length; i ++)
{
    let item = entries[i];
    let fullpath = path.join(searchpath, item);
    if (!fs.lstatSync(fullpath).isDirectory())
    {
        if (item.toLocaleLowerCase().endsWith('.html'))
        {
            let joinfiles = [];
            for (j = 0; j < dstentries.length; j++){
                let item2 = dstentries[j];
                let fullpath2 = path.join(exportpath, item2);
                
                try
                {
                    if (!fs.lstatSync(fullpath2).isDirectory())
                    {
                        if (item2.toLocaleLowerCase().startsWith(item.toLocaleLowerCase())
                        && item2.toLocaleLowerCase() != item.toLocaleLowerCase()) {
                            console.log("     " + item2);
                            joinfiles.push(item2);
                        }
                    }
                }
                catch {}
            }
            copyFile(item, joinfiles, searchpath, exportpath);
        }
    }
}


