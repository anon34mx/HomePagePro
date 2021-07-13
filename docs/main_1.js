var http = require('http');
const path = require('path');
const fs = require('fs');
const lhl="D:/xampp/htdocs";
// const directoryPath = path.join(__dirname, 'Documents');

http.createServer(async function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
    await fs.readdir(lhl, async function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        await files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file);
            // fs.lstat(lhl+"/"+file, (err, stats) => {
            //     if(stats.isFile()){
            //         console.log("file_"+file);
            //     }else if(stats.isDirectory()){
            //         console.log("dir__"+file);
            //     }
            // });
        });
    });
    res.end(lhl);
}).listen(8081);