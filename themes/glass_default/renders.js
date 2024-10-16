const fs = require('fs');
const renderUri=(id, uri, icon, name, blank)=>{
    // <div class="imgContainer">
    // </div>
    // http://localhost:34/assets/styles/default/html.svg
    return `<a id="${id}" href="${uri}" class="element prevent-select linkDraggable uri" type="uri">
        <div class="icon">
            <img class="" src="${icon}" onerror="this.src=null;this.src='./assets/styles/default/html.svg'"/>
        </div>
        <label class="txt-white-shadow">
           ${name}
        </label>
        <div class="bg"></div>
    </a>`;
}
function renderFile(path, file) {
    var ext = (file.match(/\.([a-zA-Z]{3,4})$/)[0]).substring(1);
    return `<a href="http://localhost/${file}" class="element prevent-select" title="${file}" type="file">
        <div class="icon">
            <img class="" src="/assets/styles/default/${ext}.svg" onerror="this.src=null;this.src='./assets/styles/default/html.svg'"/>
        </div>
        <label class="txt-white-shadow">
           ${file}
        </label>
        <div class="bg"></div>
    </a>`;
}
function renderFolder(path, file) {
    var project = false;
    try {
        if (fs.existsSync(path + "/" + file + "/index.php")) {
        } else {
            // console.error(path+"/"+file+"/index.php");
        }
    } catch (err) {
        console.error(err)
    }
    // return `
    // <div class='element folder' onclick="window.location.href='http://localhost/${file}'" title="${file}">
    // </div>`;
    return `<a href="http://localhost/${file}" class="element prevent-select" title="${file}" type="folder">
        <div class="icon">
            <img class="" src="/assets/styles/default/folder_ByDinosoftLabs.png" onerror="this.src=null;this.src='./assets/styles/default/html.svg'"/>
        </div>
        <label class="txt-white-shadow">
            ${file}${file}
        </label>
        <div class="bg"></div>
    </a>`;
}
function renderUriGroup(links, id) {
    console.log(links);
    return `<div id="${id}" class="element prevent-select linkDraggable uri" type="uri">
        <div class="icon">
            <img class="" src="./assets/styles/default/folder_ByDinosoftLabs.png"/>
        </div>
        <label class="txt-white-shadow">
           asd
        </label>
        <div class="bg"></div>
        <div class="container" style="position:absolute;background:red;"></div>
    </div>`;
}

module.exports={
    renderUri,
    renderFile,
    renderFolder,
    renderUriGroup
}