var http = require('http');
const path = require('path');
const fs = require('fs');
const lhl="D:/xampp/htdocs";
const openExplorer = require('open-file-explorer');
var express = require('express');
var app = express();
let ejs = require('ejs');
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets')); 
var filesFound="",folders="",shortcuts="x",engines="";

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function(req, res) {
    console.log("START___"+new Date().getTime());
    filesFound="";
    folders="";
    engines="";
    
    await renderEngines();
    console.log("owo"+engines);
    await Shortcuts();
    await scanFolder(lhl);
    console.log("END_____"+new Date().getTime());

    res.render('index', {
        filesFound:filesFound,
        folders:folders,
        shortcuts:shortcuts,
        engines:engines
    });
});
app.get('/open', function(req, res) {
    console.log(req.query.file.replace(/\//g,"\\"));
    require('child_process').exec('start "" "'+req.query.file.replace(/\//g,"\\")+'"');
    res.status(200).send();
    // https://www.youtube.com/watch?v=5jTXE9txzwQ
});
app.get('/openPath', function(req, res) {
    // using nodejs-open-file-explorer
    // const path = 'C:\\Users';
    // path = req.query.file;
    f=String(req.query.file);
    f=f.replace(/\//g,"\\");
    // console.log(f.replace(/\//g,"\\"));
    openExplorer(f, err => {
        if(err) {
            console.log(err);
        }
        else {
            //Do Something
        }
    });
    res.status(200).send();
});
app.listen(8080,()=>{});

async function Shortcuts(){
    shortcuts="";
    return await new Promise((resolve,reject)=>{
        fs.readFile("./config/shortcuts.json","utf8",async (err,jsonString)=>{
            jsonString=JSON.parse(jsonString)
            
            await jsonString.forEach(element => {
                // if(element.type=="group"){
                //     
                // }else{
                //     
                // }
                switch (element.type) {
                    case "group":
                        shortcuts+=renderUriGroup(element);
                        break;
                    case "file":
                        // shortcuts+=renderExec(path,file)
                        break;
                    default:
                        shortcuts+=renderUri(element);
                        break;
                }
            });
            resolve();
        });
    });

}

async function renderEngines(){
    return await new Promise((resolve,reject)=>{
        fs.readFile("./config/searchEngines.json", "utf-8", async (err, jsonString)=>{
            jsonString=JSON.parse(jsonString);

            await jsonString.forEach(element=>{
                engines+=`<li class="noselect" onclick="validateSearch('`+element.uri+element.parameter+`')">
                    <div class="bgBlur"></div>
                    <img class="noselect" src="`+element.icon+`" alt="" draggable="false">
                    `+element.name+`
                </li>`;
            });
        });
        resolve();
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
                    folders+=renderFolder(path,file);
                }else{
                    filesFound+=renderFile(path,file);
                    console.log(file);
                }
            });
            resolve();
        });
    })
}
function renderFolder(path,file){
    var project=false;
    try {
        if (fs.existsSync(path+"/"+file+"/index.php")) {
          console.log("asdasd");
        }else{
            console.log(path+"/"+file+"/index.php");
        }
      } catch(err) {
        console.error(err)
      }
    return `
    <div class='element folder'>
        <div class="bgBlur"></div>
        <div onclick="window.location.href='http://localhost/`+file+`'">
            <div class="imgContainer">
                <img src="/assets/styles/default/folder_ByDinosoftLabs.png" onerror="this.onerror=null;this.src='assets/styles/default/noIcon.png';">
            </div>
            <span>
            `+file+`
            </span>
        </div>
        <ol class="submenu">
            <li onclick="event.preventDefault();window.location.href='http://localhost/`+file+`'">Execute</li>
            <li onclick="openElement('`+(path+"/"+file)+`')">Open in explorer</li>
        </ol>
        
    </div>`;
}
function renderFile(path,file){
    var ext=(file.match(/\.([a-zA-Z]{3,4})$/)[0]).substring(1);
    // href='=`+path+"/"+file+`'
    return `<a class="element file" onclick="openElement('`+(path+"/"+file)+`')">
        <div class="bgBlur"></div>
        <div class="imgContainer">
            <img src="/assets/styles/default/`+ext+`.svg" onerror="this.onerror=null;this.src='assets/styles/default/noIcon.png';">
        </div>
        <span>`+file+`</span>    
    </a>`;
}
function renderUriGroup(links){
    var html=`
        <div class="element uriGroup">
            <div class="bgBlur"></div>
            <div class="imgContainer">
                <img src="/assets/styles/default/`+links.icon+`" onerror="this.onerror=null;this.src='assets/styles/default/noIcon.png';">
            </div>
            <span>`+links.name+`</span>
            <div class="container">`;
            links.content.forEach(link => {
                html+=renderUri(link);
            });
    return html+=`</div></div>`;
}
function renderUri(element){
    /***
    <ol class="submenu">
        <li onclick="window.location.href='http://localhost/`+file+`'">Execute</li>
        <li onclick="openElement('`+(path+"/"+file)+`')">Open in explorer</li>
    </ol>
     */
    return `<a class="element uri" href="`+element.uri+`">
        <div class="bgBlur"></div>  
        <div class="imgContainer">
            <img src="`+element.icon+`" onerror="this.onerror=null;this.src='assets/styles/default/noIcon.png';">
        </div>
            <span>`+element.name+`</span>
        <ol class="submenu">
        <li onclick="event.preventDefault();window.open('`+element.uri+`', '_blank');">Open in new tab</li>
        </ol>
        </a>`;
    }
// window.open("https://www.geeksforgeeks.org", "_blank");
// <li onclick="window.location.href='`+element.uri+`'">Execute</li>
function renderExec(path,file){
    return `<div class='element folder' onclick="openElement('`+(path+"/"+file)+`')">
        <img src="/assets/styles/default/folder_ByDinosoftLabs.png">
        `+file+`
    </div>`;
}
