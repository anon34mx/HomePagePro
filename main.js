var http = require('http');
var https = require('https');
const path = require('path');
const fs = require('fs');
const lhl="c:/xampp/htdocs";
const lhlPort=84;
const myShortcuts="./config/shortcuts_test.json";
const openExplorer = require('open-file-explorer');
var express = require('express');
var app = express();
let ejs = require('ejs');
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets')); 
app.use('/themes', express.static('themes')); 
var filesFound="",folders="",shortcuts="x",engines="",defaultSearch="",defaultSearchImg="";

var currentTheme = "glass_default";//glass_default/frutero/
var theme = require("./themes/" + currentTheme+"/renders.js");

//xml
// var parseString = require('xml2js').parseString;
// const { resolve } = require('path');
// const { json } = require('express/lib/response');

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
            theme.renderUri(
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
            // renderUriGroup(
            //     x[id],
            //     id
            // )
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
    try {
        x[req.query.group]["content"][req.query.element]=new Array();
        x[req.query.group]["content"][req.query.element]=await x[req.query.element];
        // Object.assign(x[req.query.group]["content"][req.query.element], x[req.query.element]);
        await delete(x[req.query.element]);
        await fs.writeFileSync(myShortcuts, JSON.stringify(x));
        res.send("saved").status(200);
    } catch (error) {
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
    filesFound="";
    folders="";
    engines="";
    
    await renderEngines();
    await Shortcuts();
    let startTime = new Date();
    await scanFolder(lhl);
    let endTime = new Date();
    // console.log("render time", endTime.getMilliseconds() - startTime.getMilliseconds());

    res.status(200).render('index', {
        filesFound:filesFound,
        folders:folders,
        shortcuts:shortcuts,
        engines:engines,
        defaultSearch:defaultSearch,
        defaultSearchImg:defaultSearchImg,
        currentTheme
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
            console.error(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;cursorTo()
        }
        console.error(`stdout: ${stdout}`);
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

            let contador=0;
            for(element in jsonString){
                switch(jsonString[element].type){
                    case "group":
                        shortcuts+=theme.renderUriGroup(jsonString[element], element);
                        break;
                    case "link":
                        shortcuts+=theme.renderUri(
                            element,
                            jsonString[element]["uri"],
                            jsonString[element]["icon"],
                            jsonString[element]["name"],
                            jsonString[element]["blank"]
                            );
                        break;
                }
                contador++;
            };
            resolve();// repeats it
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
    contTabIndex=4;
    x.forEach(element => {
        // <button>test</button>
        ret+=`
            <li onclick="searchss('${element.uri}', '${element.parameter}')" tabindex="${contTabIndex}" id="${element.name}"
            onkeypress="$(this).click()" class="searchEngine txt-shadow"
            tabindex="1"
            >
            <span style="
                display: flex;
            ">
            <img src="${element.icon}" class="noselect">
                    ${element.name}
                </span>
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
                // return console.error('Unable to scan directory: ' + err);
                // throw new Error();
                // return false;
                resolve();
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                try {
                    if(fs.lstatSync(path+"/"+file).isDirectory()){
                        folders += theme.renderFolder(path,file);
                    }else{
                        filesFound +=theme.renderFile(path,file);
                    }
                } catch (error) {
                    
                }
            });
            resolve();
        });
    })
}

function renderExec(path,file){
    return `<div class='element folder' onclick="openElement('`+(path+"/"+file)+`')">
        <img src="/assets/styles/default/folder_ByDinosoftLabs.png">
        `+file+`
    </div>`;
}
