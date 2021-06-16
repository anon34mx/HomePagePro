var http = require('http');
const path = require('path');
const fs = require('fs');
const lhl="D:/xampp/htdocs";
var express = require('express');
var app = express();
let ejs = require('ejs');
app.set('view engine', 'ejs');

var filesFound="",folders="",shortcuts="x";

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function(req, res) {
    filesFound="";
    folders="";
    // shortcuts="";
    console.log("START___"+new Date().getTime());
    await Shortcuts();
    await scanFolder(lhl);
    console.log("END_____"+new Date().getTime());

    res.render('index', {
        filesFound:filesFound,
        folders:folders,
        shortcuts:shortcuts,
    });
});
app.get('/open', function(req, res) {
    // console.log(req);
    // "D:\xampp\htdocs\EV 12 corregido_v4.rar"
    // require('child_process').exec('start "" "D:/xampp/htdocs/EV 12 corregido_v4.rar"');
    // res.render('index', {
    //     filesFound:filesFound,
    //     folders:folders
    // });
});

app.listen(8080,()=>{});

async function Shortcuts(){
    shortcuts="";
    return await new Promise((resolve,reject)=>{
        fs.readFile("./shortcuts.json","utf8",async (err,jsonString)=>{
            jsonString=JSON.parse(jsonString)
            
            await jsonString.forEach(element => {
                if(element.type=="group"){
                    shortcuts+=renderUriGroup(element);
                }else{
                    shortcuts+=renderUri(element);
                }
            });
            resolve();
        });
    });

}
function scanFolder(path){
    return new Promise(async (resolve,reject)=>{
        fs.readdir(path, async function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                if(fs.lstatSync(path+"/"+file).isDirectory()){
                    // folders+=path+"/"+file+"<br>";
                    folders+=renderFolder(path,file);
                }else{
                    // filesFound+=path+"/"+file+"<br>";
                    filesFound+=renderFile(path,file);
                }
            });
            resolve();
        });
    })
}
function renderFolder(path,file){
    return `<div class='element folder'>
        `+file+`
    </div>`;
}
function renderFile(path,file){
    // return `<a href="http://localhost/`+file+`">
    return `<a class="element file" href='http://localhost:8080/open?file=`+path+"/"+file+`'>
        asd
    </a>`;
}
function renderUriGroup(element){
    return `
        <div class="element uriGroup">`+element.name+`</div>
    `;
}
function renderUri(element){
    return `
        <div class="element uri">`+element.name+`</div>
    `;

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