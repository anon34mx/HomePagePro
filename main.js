var http = require('http');
var https = require('https');
const path = require('path');
const fs = require('fs');
const lhl="C:/xampp/htdocs";
const openExplorer = require('open-file-explorer');
var express = require('express');
var app = express();
let ejs = require('ejs');
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets')); 
var filesFound="",folders="",shortcuts="x",engines="",defaultSearch="",defaultSearchImg="";


//xml
var parseString = require('xml2js').parseString;
const { resolve } = require('path');
const { json } = require('express/lib/response');
// respond with "hello world" when a GET request is made to the homepage
app.get('/shortcuts/read', async function(req, res) {
    x= await readSavedShortcuts("id001");
    // res.setHeader('Content-Type', 'application/json');
    // res.json(x);
    res.send(x);
});
app.get('/', async function(req, res) {
    // console.log("START___"+new Date().getTime());
    filesFound="";
    folders="";
    engines="";
    
    await renderEngines();
    await Shortcuts();
    await scanFolder(lhl);
    // console.log("END_____"+new Date().getTime());

    res.render('index', {
        filesFound:filesFound,
        folders:folders,
        shortcuts:shortcuts,
        engines:engines,
        defaultSearch:defaultSearch,
        defaultSearchImg:defaultSearchImg
    });
});
app.get('/open', function(req, res) {
    require('child_process').exec('start "" "'+req.query.file.replace(/\//g,"\\")+'"');
    res.status(200).send();
    // https://www.youtube.com/watch?v=5jTXE9txzwQ
});

app.get('/limpiarcola', function(req, res) {
    require('child_process').exec('start "" "C:\\tabletBasculaHostess\\restart pooler.lnk"');
    res.status(200).send();
    // https://www.youtube.com/watch?v=5jTXE9txzwQ
});

app.get('/reiniciarbascula', function(req, res) {
    require('child_process').exec('start "" "C:\\HomePagePro\\REINICIAR PRO.bat"');
    res.status(200).send();
    // https://www.youtube.com/watch?v=5jTXE9txzwQ
    //C:/tabletBasculaHostess/ticket.pdf
});

app.get('/ultimoticket', async function(req, res) {
    //C:/tabletBasculaHostess/ticket.pdf
    pdf="C:/tabletBasculaHostess/ticket.pdf";
    fs.readFile(pdf, function (err,data){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.get('/openPath', function(req, res) {
    // using nodejs-open-file-explorer
    // const path = 'C:\\Users';
    // path = req.query.file;
    f=String(req.query.file);
    f=f.replace(/\//g,"\\");
    openExplorer(f, err => {
        if(err) {
            console.error(err);
        }
        else {
            //Do Something
        }
    });
    res.status(200).send();
});
app.listen(3434,()=>{});

async function Shortcuts(){
    shortcuts="";
    return await new Promise((resolve,reject)=>{
        fs.readFile("./config/shortcuts_test.json","utf8",async (err,jsonString)=>{
            try{
                jsonString=JSON.parse(jsonString,true)
            }catch(e){
                console.error("error ALV");
            }
            for(element in jsonString){
                switch(jsonString[element].type){
                    case "group":
                        shortcuts+=renderUriGroup(jsonString[element], element);
                        break;
                    case "link":
                        shortcuts+=renderUri(
                            element,
                            jsonString[element]["uri"],
                            jsonString[element]["icon"],
                            jsonString[element]["name"],
                            jsonString[element]["blank"]
                            );
                        break;
                }
            };
            resolve();
        });
    });
}
var readFilePromise = function(file) {
    return new Promise(function(ok, notOk) {
      fs.readFile(file, function(err, data) {
          if (err) {
            notOk(err)
          } else {
            ok(data)
          }
      })
    })
  }
async function readSavedShortcuts(id){
    // "./config/shortcuts_test.json"
    var x;  
    await readFilePromise("./config/shortcuts_test.json").then(function(data) {
        x=JSON.parse(data)
      })
    if(id==undefined){
        return x;
    }else{
        return x[id];
    }
}
async function renderEngines(){
    var x;
    var ret="";
    await readFilePromise("./config/searchEngines.json").then(function(data) {
        x=JSON.parse(data)
    });
    contTabIndex=3;
    x.forEach(element => {
        ret+=`
            <li onclick="searchss('${element.uri}', '${element.parameter}')" tabindex="${contTabIndex}" id="${element.name}"
            onkeypress="$(this).click()" class="searchEngine txt-shadow"
            >
            <img src="${element.icon}" class="noselect">
                <span>${element.name}</span>
            </li>`;
        contTabIndex++;
        if(element.default==true){
            defaultSearch=element.uri+element.parameter;
            defaultSearchImg=element.icon
        }
    });
    engines=ret;
}

function scanFolder(path){
    return new Promise(async (resolve,reject)=>{
        fs.readdir(path, async function (err, files) {
            if (err) {
                return console.error('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                if(fs.lstatSync(path+"/"+file).isDirectory()){
                    folders+=renderFolder(path,file);
                }else{
                    filesFound+=renderFile(path,file);
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
        }else{
            // console.error(path+"/"+file+"/index.php");
        }
      } catch(err) {
        console.error(err)
      }
    return `
    <div class='element folder' onclick="window.location.href='http://localhost/`+file+`'">
        <div class="bgBlur"></div>
        
            <div class="imgContainer">
                <img src="/assets/styles/default/folder_ByDinosoftLabs.png" onerror="this.onerror=null;this.src='assets/styles/default/noIcon.png';">
            </div>
            <span class="txt-shadow">
            `+file+`
            </span>
        
        <ol class="submenu ">
            <li class="txt-shadow" onclick="event.preventDefault();window.location.href='http://localhost/`+file+`'">Execute</li>
            <li class="txt-shadow" onclick="openElement('`+(path+"/"+file)+`')">Open in explorer</li>
        </ol>
        
    </div>`;
}
function renderFile(path,file){
    try{
        var ext=(file.match(/\.([a-zA-Z]{3,4})$/)[0]).substring(1);
        // href='=`+path+"/"+file+`'
        return `<a class="element file" onclick="openElement('`+(path+"/"+file)+`')">
            <div class="bgBlur"></div>
            <div class="imgContainer">
                <img src="/assets/styles/default/`+ext+`.svg" onerror="this.onerror=null;this.src='assets/styles/default/noIcon.png';">
            </div>
            <span class="txt-shadow">`+file+`</span>    
        </a>`;
    }catch(e){
        return "";
    }
}
function renderUriGroup(links,id){
    var html=`
        <div class="element uriGroup" id=`+id+`>
            <div class="bgBlur"></div>
            <div class="imgContainer">
                <img src="/assets/styles/default/`+links.icon+`" onerror="this.onerror=null;this.src='assets/styles/default/noIcon.png';">
            </div>
            <span class="text-shadow">`+links.name+`</span>
            <div class="container">`;
            for(var id in links.content){
                html+=renderUri(
                    id,
                    links.content[id]["uri"],
                    links.content[id]["icon"],
                    links.content[id]["name"],
                    links.content[id]["blank"]
                    );
            }
            
    return html+=`</div></div>`;
}
function renderUri(id,uri,icon,name,blank){
    return `
    <div class="elementContainer" id="`+id+`">
        <a class="element uri" `+(blank==true ? 'target="_blank"':'')+`
            href="${uri}">
            <div class="bgBlur"></div>  
            <div class="imgContainer">
                <img src="`+icon+`" onerror="this.onerror=null;this.src='assets/styles/default/noIcon.png';">
            </div>
            <span class="txt-shadow">`+name+`</span>
        </a>
        <ol class="submenu">
            <li onclick="event.preventDefault();window.open('`+uri+`', '_blank');">Open in new tab</li>
            <li onclick="event.preventDefault();console.log('editar');">edit</li>
        </ol>
    </div>`;
    }
// window.open("https://www.geeksforgeeks.org", "_blank");
// <li onclick="window.location.href='`+element.uri+`'">Execute</li>
function renderExec(path,file){
    return `<div class='element folder' onclick="openElement('`+(path+"/"+file)+`')">
        <img src="/assets/styles/default/folder_ByDinosoftLabs.png">
        `+file+`
    </div>`;
}
