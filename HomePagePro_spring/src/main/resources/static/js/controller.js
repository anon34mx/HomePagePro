$(document).ready(function() {

    $("#searchInput").on("keyup", googleAutocomplete);
    $("#searchInput").on("focusin", ()=>{
        hideSearchEnginesList();
    });


    $("#enginesArrow").on("click",
        showSearchEnginesList
    );
    $("#enginesArrow").on("mouseenter",
        showSearchEnginesList
    );
    $("#enginesArrow").on("focusin",
        showSearchEnginesList
    );

    $(".searchEnginesList").on("mouseenter", function(){
        hideSearchEnginesList();
    });
    $(".searchEnginesList").on("mouseleave", function(){
        hideSearchEnginesList();
    });
    $(".searchEnginesList li button").on("focusout", function(){
        // hideSearchEnginesList();
        let element=this.parentElement;
        let parent=this.parentElement.parentElement;
        if (element===parent.lastElementChild){
            hideSearchEnginesList();
        }
    });
    $(".searchEnginesList li button").on("click", function(){
        event.preventDefault();
        validateSearch(
            $(this).attr("uri"),
            $(this).attr("parameter"),
            this.form
        );
    });

    $("#editShortcuts").on("click", function(){
        event.preventDefault();
        editGroups();
    });
    $("#editGroupsDone").on("click", function(){
        event.preventDefault();
        editGroupsDone();
    });
    $("html").on("click", ()=>{
        switch (event.which) {
            case 1:
                contextmenuHide();
                break;
            case 2:
                // console.log('Middle Mouse button pressed.');
                break;
            case 3:
                // console.log('Right Mouse button pressed.');
                break;
            default:
                // console.log('You have a strange Mouse!');
        }
    });

    // CONTEXT MENU
    // $('.uriGroup, .uri').contextmenu(function() {
	// 	return false;
	// });

    // SHORTCUTS
    $("#btnSaveShortcut").on("click", saveShortcut)

    // INITIALIZE THINGS
    generateContent();
});

window.showFolderContent=function(){
    
    if($(this).hasClass("showChildren")){
        $(".showChildren").removeClass("showChildren");
    }else{
        $(".showChildren").removeClass("showChildren");
        $(this).addClass("showChildren");
    }
    // $(this).find(".children").css("opacity","1");
    if ($(this).offset().left + $(this).width()*2+20 > window.innerWidth){
        $(this).find(".container").css("left", "-100%");
    }else{
        $(this).find(".container").css("left", "100%");
    }
}

window.hideFolderContent=function(){
    $(this).removeClass("showChildren");
    $(this).find(".container").css("left", "0");
    $(this).find(".children").css("opacity","0");
}

window.googleAutocomplete=async function(){
    // https://stackoverflow.com/questions/21549516/how-to-work-with-google-suggest-queries-using-jquery
    $("#suggestions").empty()
    await $.ajax({
        url: 'http://suggestqueries.google.com/complete/search?client=chrome&q='+$("#searchInput").val(),
        type: 'GET',
        dataType: 'jsonp',
        success: function (data) {
            $( "#searchInput" ).autocomplete({
                source: data[1],
                select: function( event, ui ) {
                    $("#searchForm").submit();
                }
            });
            
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR);
            console.error(textStatus);
            console.error(errorThrown);
        }
    });
}

window.validateSearch=async function(searchEngine,parameterName,form){
	// Event.preventDefault();
	var search=$("#searchInput").val();
	// var isIP=search.match(/[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}(:[0-9]{1,5})?/);
	var isIP=search.match(/^(?!\.)(http:\/\/)?([0-9]{1,3}\.){3}[0-9]{1,3}((:[0-9]{1,5}(\/)?)?(\/.{1,}$)?|(\/)?)?$/);
	if(isIP && search.match(/\ /)){
        window.location.href="http://"+search; // GO
        return true;
	}
	if(
        // search.match(/https|ftp|http:\/\/www\.[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
        search.match(/https|ftp|http:\/\/www\.[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
        ||
        search.match(/^mailto:(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		){
		//IS URI
		window.location.href=search;
        return true;
	}
	if(search.match(/^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)){
        // IS WEB DOMAIN
		window.location.href="https://"+search;
        return true;
	}

    //SEARCH
    if(searchEngine!=undefined){
        $("#searchForm").attr("action",searchEngine);
        $("#searchInput").attr("name", parameterName);
        form.submit();
    }else{
        // use default search engine
        $("#searchForm").attr("action",defaultSearchEngine);
        $("#searchInput").attr("name",defaultSearchParameterName);
        form.submit();
    }
	
}

window.showSearchEnginesList=function(){
    event.preventDefault();
    $(".searchEnginesList .container").show();
}
window.hideSearchEnginesList=function(){
    event.preventDefault();
    $(".searchEnginesList .container").hide();
}


window.editGroupsStop=function(){
    $('.uri').draggable( "destroy" );
}
window.editGroups=function(){
    $( ".uri" ).draggable({
        // containment: $("#shortcuts"),
        revert: true,
        // grid: [ 20, 20 ]
        cursor: "grabbing",
        cursorAt: { top: 34, left: 34 },
        helper: function( event ) {
            return $( "<img class='pendulum dragging-uri' src='assets/themes/default/icons/web-svgrepo-com.svg'>" );
        }
    });

    $( "#shortcuts .shortcutsContainer.listing > .uri" ).not(".children").droppable({
        accept: "#shortcuts .shortcutsContainer.listing > .uri",
        greedy: true,
        classes: {
            "ui-droppable-active": "ui-state-highlight"
        },
        drop: function( event, ui ) {
            console.log("create group");
            // console.log(event.target);
            // console.log(ui.draggable[0]);
            let sh1=findShortcutByID(shortcuts, event.target.id);
            let sh2=findShortcutByID(shortcuts, ui.draggable[0].id);
            createGroup(sh1, sh2);
        },
        accept: "#shortcuts .uri",
    });
    $( "#shortcuts" ).droppable({
        // tolerance:"pointer",
        accept : ".uriGroup .children .uri",
        greedy: true,
        classes: {
            "ui-droppable-active": "ui-state-highlight"
        },
        drop: function(event, ui){
            // console.log("main group");
            // console.log(event.target);
            // console.log(ui.draggable[0].id);

            let sh=$(ui.draggable[0]).clone();
            
            let shortcut=findShortcutByID(shortcuts, ui.draggable[0].id);
            // console.log(shortcut);
            removeShortcutFromGroup(shortcut);

            $(ui.draggable[0]).remove()
            $("#shortcuts .shortcutsContainer").append(sh[0]);
        }
    });
    $( "#shortcuts .uriGroup" ).droppable({
        accept: "#shortcuts > .uri",
        greedy: true,
        classes: {
            "ui-droppable-active": "ui-state-highlight"
        },
        drop: function( event, ui ) {
            console.log("add to group");
            let sh=ui.draggable[0].id;
            let target=event.target.id;
            addShortcutToGroup(sh, target);
        },
        accept: "#shortcuts .uri",
    });

    $("#editGroupsDone").show();
    $("#editShortcuts").hide();
}

window.editGroupsDone=function(){
    $("#editGroupsDone").hide();
    $("#editShortcuts").show();

    $( ".uri" ).draggable("destroy");
    $( "#shortcuts .shortcutsContainer.listing > .uri" ).not(".children").droppable("destroy");
    $( "#shortcuts" ).droppable("destroy");
    $( "#shortcuts .uriGroup" ).droppable("destroy");
}

window.generateContent=async function(){
    shortcuts.forEach(async shortcut => {
        if(shortcut.folder==false){
            await renderShortcut(shortcut,$("#shortcuts .shortcutsContainer"));
        }else{
            await renderFolder(shortcut);
        }
    });

    lhFiles.forEach(async element=>{
        await renderShortcut(element,$("#server .listing"),"local");
    })
}

window.renderShortcut=async function(shortcut, target, type){
    var template=document.querySelector("#shortcutTemplate");
    let clone = template.content.cloneNode(true);
    let id=shortcut.id;

    if(type!="local"){
        clone.querySelector(".uri").id=id;
    }else{
        id=new Date().getTime();
        clone.querySelector(".uri").id=id;
        if(shortcut.isFolder){
            clone.querySelector(".uri").attributes.type.value="folder";
        }else{
            clone.querySelector(".uri").attributes.type.value="file";
        }
    }
    clone.querySelector(".uri").href=shortcut.uri;
    clone.querySelector(".uri").title=shortcut.uri;
    clone.querySelector("label.name").textContent=shortcut.name;
    clone.querySelector("picture source").srcset=shortcut.icon;

    await $(target).append(clone);
    await $("#"+id).contextmenu(()=>{
        return contextmenuShow(event)
    });
}
window.renderFolder=async function(folder){
    var template=document.querySelector("#uriGroupTemplate");
    let clone = template.content.cloneNode(true);

    clone.querySelector(".uriGroup").id=folder.id;
    clone.querySelector("label.name").textContent=folder.name;

    // console.log(folder);
    if(folder.content.length>0){
        folder.content.forEach(async shortcut => {
            await renderShortcut(shortcut, clone.querySelector(".children"));
        });
    }

    await $("#shortcuts .shortcutsContainer").append(clone);
    // await $("#"+folder.id).hover(showFolderContent,hideFolderContent);
    await $("#"+folder.id).on("click", showFolderContent);
    await $("#"+folder.id).contextmenu(()=>{
        return contextmenuShow(event);
    });
}

window.showModal=function(modalId){
    let modal=document.getElementById(modalId);
    modal.showModal();
}
window.closeModal=function(modalId){
    let modal=document.getElementById(modalId);
    modal.close();
}

// CONTEXT MENU
window.contextmenuShow=function(event){
    rclickTarget=event.target.parentElement;
    $("#contextMenu li").hide();
    $("#contextMenu li."+rclickTarget.attributes.type.value).show();
    // console.log("context menu");
    // console.log(this);
    // console.log(event.target.parentElement);
    // $("#contextMenu").attr("target",event.target.id);
    posX=(event.pageX); // POSICION DEL CLICK
    posY = (event.pageY); //- $("body").scrollTop(); // POSICION DEL CLICK

    if(posX+$("#contextMenu")[0].offsetWidth+10 > window.innerWidth){
        posX=posX-$("#contextMenu")[0].offsetWidth;
    }
    // console.log(posX, posY);
    // console.log();
    $("#contextMenu").css("display", "block")
    $("#contextMenu").css("top", posY + "px")
    $("#contextMenu").css("left", posX + "px")
    // $("#contextMenu").css("display", "block")
    return false;
}

window.contextmenuHide=function(){
    $("#contextMenu").css("display", "none");
}

function openElement(action){
	switch (action) {
		case "uri":
			rclickTarget.click();
			break;
		case "uriNewTab":
			window.open(rclickTarget.href, '_blank');
			break;
		case "execute":
			
			break;
		case "inExplorer":
			
			break;
	
		default:
			break;
	}
}

window.findShortcutByID=function(list, id, iteration=0){
    for(let i=0; i<list.length; i++){
        if(list[i]!=undefined){
            // console.log(list[i].id, list[i].name, list[i].folder, iteration);
            if(list[i].id==id){
                return list[i];
            }
            if(list[i].folder==true){
                let found = findShortcutByID(list[i].content, id, iteration+1);
                if(found){
                    return found;
                }
            }
        }
    }
    return null;
}
window.removeFromArrayByID=function(list, id){
    let ret=Array();
    for(let i=0; i<list.length; i++){
        if(list[i].id!=id){
            ret.push(list[i]);
        }
        if(list[i].folder==true){
            list[i].content=removeFromArrayByID(list[i].content, id);
        }
    }
    return ret;
}
window.insertShortcut=function(shortcut, groupID){
    let inserted=false;
    for(let i=0; i<shortcuts.length; i++){
        if(shortcuts[i].id==groupID){
            console.log("found",shortcuts[i]);
            inserted=true;
            shortcuts[i].content.push(shortcut);
            break;
        }
    }
}
// window.moveShortcutByID=function(id){
//     let sh=findShortcutByID(shortcuts, id);
//     shortcuts=removeFromArrayByID(shortcuts, id);
//     shortcuts.push(sh);
// }

// function findShortcutByID(arr, id) {
//     for (const item of arr) {
//         if (item.id === id) {// Found the element
//             return item;
//         } if (item.content && item.content.length > 0) {
//             const found = findShortcutByID(item.content, id);
//             if (found) {// Found inside nested content
//                 return found;
//             }
//         }
//     }
//     // Not found 
//     return null;
// }

window.createGroup=async function(shortcut1, shortcut2){
    $.ajax({
        type: "POST",
        url:"/shortcuts/merge",
        data: JSON.stringify({
            shortcut1,
            shortcut2
        }),
        contentType: "application/json",
        success: async function(response){
            console.log("Group created", response);
            await renderFolder(response);

            let sh1=$("#"+shortcut1.id).clone();
            await $("#"+shortcut1.id).remove();
            await $("#"+response.id+" .children").append($(sh1));
            
            let sh2=$("#"+shortcut2.id).clone();
            await $("#"+shortcut2.id).remove();
            await $("#"+response.id+" .children").append($(sh2));

            // move elements
            return true;
        },
        error: function(error){
            console.error("Error creating group", error);
            return false;
        }
    });
}

window.removeShortcutFromGroup=function(element){
    console.log(element)
    const promise = fetch('/shortcuts/removeFromGroup',{
        method: 'POST',
        headers:{
            'Content-type':'application/json',

        },
        body:JSON.stringify(element)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Shortcut removed from group", data);
        let sh=findShortcutByID(shortcuts, data.id);
        shortcuts=removeFromArrayByID(shortcuts, data.id);
        shortcuts.push(sh);

        let parent=findShortcutByID(shortcuts, element.parentId);
        console.log(parent, element.parentId, parent.content.length);
        
        if(parent.content.length < 1){
            shortcuts=removeFromArrayByID(shortcuts, element.parentId);
            $("#"+element.parentId).fadeOut(333);
            setTimeout(()=>{
                $("#"+element.parentId).remove();
            },333);
        }
    }).then(()=>{
        editGroups();
    });
}

window.addShortcutToGroup=function(shortcutID, groupID){
    console.log(shortcutID, groupID);
    fetch('/shortcuts/addToGroup',{
        method: 'POST',
        headers:{
            'Content-type':'application/json',
        },
        body:JSON.stringify({
            "shortcutId": shortcutID,
            "groupId": groupID
        }),
    })
    .then(response => response.text())
    .then(async data => {
        console.log("Shortcut added to group", data);
        if(data=="done"){
            let sh=findShortcutByID(shortcuts, shortcutID);
            shortcuts=removeFromArrayByID(shortcuts, shortcutID);
            insertShortcut(sh, groupID);

            let shElement=$("#"+shortcutID).clone();
            $("#"+shortcutID).remove();
            $("#"+groupID+" .children").append(shElement);
        }
    }).then(()=>{
        editGroups();
    });
}

window.saveShortcut=function(){
    let shortcut={
        // "id":   $("#editShortcutForm input[name='id']").val() || 0,
        "name": $("#editShortcutForm input[name='name']").val() || null,
        "icon": $("#editShortcutForm input[name='icon']").val() || null,
        "uri":  $("#editShortcutForm input[name='uri']").val() || null,
        "parentId": null,
        // "content": [],
        "folder": parseInt($("#editShortcutForm input[name='isFolder']:checked").val())
    };
    let valid=true;
    if(shortcut.name==null || shortcut.name.length < 1){
        valid=false;
        console.log("name");
    }
    if(shortcut.folder==false){
        if(shortcut.icon==null || shortcut.icon.length<1){
            valid=false;
            console.log("icon");
        }
        if(shortcut.uri==null || shortcut.uri.length<1){
            valid=false;
            console.log("uri");
        }
    }

    console.log(valid)
    if(valid){
        fetch('/shortcuts',{
            method: 'POST',
            headers:{
                'Content-type':'application/json',
            },
            body:JSON.stringify(shortcut)
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById("modal-createShortcut").close()
            if(shortcut.folder){
                renderFolder(data);
            }else{
                renderShortcut(data,$("#shortcuts .shortcutsContainer"));
            }
            alert("saved");
        });
    }else{
        alert("Add all the data");
    }
    return false;
}

window.modalEditShortcuts=function(){
    $("#editShortcutForm input[name='isFolder'").prop('disabled',false)
    if(1){

    }
}