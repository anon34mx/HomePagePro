const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const getStats = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const http = require('http');

handle_files = async (req, res) => {
    try {
        let files = await scanDir("logs_of_109");
        let result = await read_content(files)
        check_file_content(result)
        res.writeHead(200, { 'Content-Type': 'text/html' });
        // console.log(result)
        res.write("Hello");
        res.end();
    } catch (e) {
        // ...handle error here...
    }
};

check_file_content = (file_data) => {
    console.log(file_data[1])
}

async function read_content(files) {
    let file_data = []
    files.map(file => {
        let start_index = file.toString().lastIndexOf('.') + 1
        let ext = file.substring(start_index, file.length)
        if (ext == 'data') {
            file_data.push(fs.readFileSync(file, { encoding: 'utf-8' }))
        }
    })
    return file_data
}

http.createServer(handle_files).listen(8080)

async function scanDir(dir="D:/xampp/htdocs", fileList = []) {
    // fetch list of files from the giver directory
    let files = await readdir(dir);
    // loop through all the files
    for (let file of files) {
        // join new folder name after the parent folder
        // logs_of_109/24
        let filePath = path.join(dir, file);
        try {
            // 
            let stats = await getStats(filePath);
            if (!stats.isDirectory()) {
                // add the filepath to the array
                fileList.push(filePath);
            }
            if (stats.isDirectory()) {
                await scanDir(filePath, fileList);
            }
        } catch (err) {
            // Drop on the floor.. 
        }
    }

    return fileList;
}