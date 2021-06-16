var http = require('http');
const path = require('path');
const fs = require('fs');
const lhl="D:/xampp/htdocs";
var express = require('express');
var app = express();
let ejs = require('ejs');
app.set('view engine', 'ejs');

var filesFound="",folders="";

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function(req, res) {
    filesFound="";
    folders="";
    console.log("START___"+new Date().getTime());
    await promesa(lhl);
    console.log(filesFound);
    console.log(folders);
    console.log("END_____"+new Date().getTime());
    res.render('index', {
        filesFound:filesFound,
        folders:folders
    });
});

app.listen(8080,()=>{});

function promesa(path){
    return new Promise(async (resolve,reject)=>{
        await fs.readdir(path, async function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            await files.forEach(function (file) {
                if(fs.lstatSync(path+"/"+file).isDirectory()){
                    folders+=path+"/"+file+"<br>";
                }else{
                    // filesFound+=path+"/"+file+"<br>";
                    filesFound+=renderFile(path,file);
                }
            });
            resolve();
        });
    })
}
function renderFolder(){
    
}
function renderFile(path,file){
    // return `<a href="http://localhost/`+file+`">
    return `<a href="`+path+`/`+file+`">
        asd
    </a>`
}
function renderUri(){

}
// async function scanDir(path) {
//     await fs.readdir(path, async function (err, files) {
//         if (err) {
//             return console.log('Unable to scan directory: ' + err);
//         } 
//         //listing all files using forEach
//         await files.forEach(function (file) {
//             console.log(file);
//             if(fs.lstatSync(path+"/"+file).isDirectory()){
//                 folders+=path+"/"+file+"<br>";
//             }else{
//                 filesFound+=path+"/"+file+"<br>";
//             }
//         });
//     });
// }