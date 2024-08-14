var http = require('http');
var https = require('https');
const path = require('path');
const fs = require('fs');
const lhl="D:/xampp/htdocs";
const myShortcuts="./config/shortcuts_test.json";
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

app.get('/shortcuts/read', async function(req, res) {
    // x= await readSavedShortcuts("id001");
    // res.send(x);
    var id=req.query.shortcutID;
    x= await readSavedShortcuts(id);
    res.send(x).status(200);
});

app.get('/shortcuts/save', async function(req, res) {
    var id=req.query.shortcutID;
    x= await readSavedShortcuts();
    // res.send(req.query);

    if(typeof x[id] === 'undefined'){
        // If id does not exist, then create element
        x[id]={};
    }
    x[id].type=req.query.type;
    x[id].name=req.query.name;
    
    switch (req.query.type) {
        case "group":
            x[id].content=[]; // links in this group
            break;
        case "link":
            x[id].blank=req.query.newtab;
            x[id].uri=req.query.link;
            x[id].icon=req.query.icon;
            break;
    }

    fs.writeFileSync(myShortcuts, JSON.stringify(x));
    // myShortcuts
    if(req.query.type=="link" && req.query.mode=="new"){
        res.send(
            renderUri(
                id,
                x[id].uri,
                x[id].icon,
                x[id].name,
                x[id].blank
            )
        ).status(200);
    }else if(req.query.type=="link" && req.query.mode=="edit"){
        res.send("link updated").status(200);
    }else if(req.query.type=="group" && req.query.mode=="new"){
        res.send(
            renderUriGroup(
                x[id],
                id
            )
        ).status(200);
    }else if(req.query.type=="group" && req.query.mode=="edit"){
        res.send("group updated").status(200);
    }
});
app.get('/shortcuts/delete', async function(req, res) {
    var id=req.query.shortcutID;
    x= await readSavedShortcuts();

    delete(x[id]);
    fs.writeFileSync(myShortcuts, JSON.stringify(x));
    res.send("deleted").status(200);
});
app.get('/shortcuts/addToGroup', async function(req, res) {
    var x= await readSavedShortcuts();
    // console.log(typeof(x));
    try {
        x[req.query.group]["content"][req.query.element]=new Array();
        x[req.query.group]["content"][req.query.element]=await x[req.query.element];
        // Object.assign(x[req.query.group]["content"][req.query.element], x[req.query.element]);
        await delete(x[req.query.element]);
        await fs.writeFileSync(myShortcuts, JSON.stringify(x));
        res.send("saved").status(200);
    } catch (error) {
        console.log(error);
        console.log(x[req.query.group]["content"][req.query.element]);
        res.send(error).status(200);
    }
});
app.get('/shortcuts/removeFromGroup', async function(req, res) {
    var x= await readSavedShortcuts();
    try {
        x[req.query.element]=x[req.query.group]["content"][req.query.element];
        delete(x[req.query.group]["content"][req.query.element]);
        fs.writeFileSync(myShortcuts, JSON.stringify(x));
        res.send("saved").status(200);
    } catch (error) {
        res.send(error).status(200);
    }
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

    res.status(200).render('index', {
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
});

app.get('/ultimoticket', async function(req, res) {
    pdf="C:/tabletBasculaHostess/ticket.pdf";
    fs.readFile(pdf, function (err,data){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.contentType("application/pdf");
        res.send(data);
    });
});
app.get('/openPath', function(req, res) {
    f=String(req.query.folder);
    f=f.replace(/\//g,"\\");

    const { exec } = require("child_process");

    exec(`start explorer.exe /k "${f}"`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;cursorTo()
        }
        console.log(`stdout: ${stdout}`);
    });

    res.status(200).send();
});


app.listen(34,()=>{
    console.log("running");
});

async function Shortcuts(){
    shortcuts="";
    return await new Promise((resolve,reject)=>{
        fs.readFile(myShortcuts,"utf8",async (err,jsonString)=>{
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
    var x;  
    await readFilePromise(myShortcuts).then(function(data) {
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
            <div></div>
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
        // try {
            fs.readdir(path, async function (err, files) {
                if (err) {
                    // return console.error('Unable to scan directory: ' + err);
                    // throw new Error();
                    // return false;
                    resolve();
                } 
                //listing all files using forEach
                files.forEach(function (file) {
                    try {
                        if(fs.lstatSync(path+"/"+file).isDirectory()){
                            folders+=renderFolder(path,file);
                        }else{
                            filesFound+=renderFile(path,file);
                        }
                    } catch (error) {
                        
                    }
                });
                resolve();
            });
            
        // } catch (error) {
            
        // }
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
            <li class="txt-shadow" onclick="event.preventDefault();launchFolder('${path}/${file}'">Open in explorer</li>
        </ol>
        
    </div>`;
}
function renderFile(path,file){
    try{
        var ext=(file.match(/\.([a-zA-Z]{3,4})$/)[0]).substring(1);
        return `<a class="element file" href="http://localhost/${file}">
            <!-- onclick="openElement('`+(path+"/"+file)+`')" -->
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
        <div class="element uriGroup" id=`+id+` type="group">
            <ol class="submenu">
                <li onclick="event.preventDefault();edit(this,'edit');">edit</li>
            </ol>
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
    <div class="elementContainer linkDraggable" id="`+id+`" type="uri">
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
            <li onclick="event.preventDefault();edit(this,'edit');">edit</li>
        </ol>
    </div>`;
    }
// window.open("https://www.geeksforgeeks.org", "_blank");
function renderExec(path,file){
    return `<div class='element folder' onclick="openElement('`+(path+"/"+file)+`')">
        <img src="/assets/styles/default/folder_ByDinosoftLabs.png">
        `+file+`
    </div>`;
}
