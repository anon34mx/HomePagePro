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
        console.log("mouse enter");
        hideSearchEnginesList();
    });
    $(".searchEnginesList").on("mouseleave", function(){
        console.log("mouse leave");
        hideSearchEnginesList();
    });
    $(".searchEnginesList li button").on("focusout", function(){
        // hideSearchEnginesList();
        let element=this.parentElement;
        let parent=this.parentElement.parentElement;
        console.log(element, parent, element===parent.lastElementChild);
        if (element===parent.lastElementChild){
            hideSearchEnginesList();
        }
    });
    $(".searchEnginesList li button").on("click", function(){
        event.preventDefault();
        // console.log(this, this.form)
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
    $("html").on("click", ()=>{
        switch (event.which) {
            case 1:
                // console.log('Left Mouse button pressed.');
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

    // INITIALIZE THINGS
    generateContent();
});

window.showFolderContent=function(){
    $(this).toggleClass("showChildren");
    // $(this).find(".children").css("opacity","1");
    if ($(this).offset().left + $(this).width()*2+20 > window.innerWidth){
        console.log("no cabe");
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
            // console.log(data);
            // var suggestions=null;
            // if(typeof(temp1[0])){
            //     console.log("usar 1");
            //     suggestions=data[1];
            // }
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
        console.log("IP detected");
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
		console.log("URI https");
		window.location.href=search;
        return true;
	}
	if(search.match(/^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)){
        // IS WEB DOMAIN
		console.log("web");
		window.location.href="https://"+search;
        return true;
	}

    //SEARCH
    if(searchEngine!=undefined){
        console.log("search with custom engine");
        $("#searchForm").attr("action",searchEngine);
        $("#searchInput").attr("name", parameterName);
        form.submit();
    }else{
        console.log("search with default engine");
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
            let sh1=filterShortcuts(shortcuts, event.target.id);
            let sh2=filterShortcuts(shortcuts, ui.draggable[0].id);
            console.log(sh1, sh2);
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
            console.log("main group");
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
        },
        accept: "#shortcuts .uri",
    });
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
        await renderShortcut(element,$("#server"),"local");
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
    folder.content.forEach(async shortcut => {
        await renderShortcut(shortcut, clone.querySelector(".children"));
    });

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
    console.log("context menu");
    console.log(this);
    console.log(event.target.parentElement);

    // $("#contextMenu").attr("target",event.target.id);
    rclickTarget=event.target.parentElement;

    posX=(event.pageX); // POSICION DEL CLICK
    posY = (event.pageY); //- $("body").scrollTop(); // POSICION DEL CLICK

    if(posX+$("#contextMenu")[0].offsetWidth+10 > window.innerWidth){
        posX=posX-$("#contextMenu")[0].offsetWidth;
    }

    console.log(posX, posY);
    console.log();

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

function filterShortcuts(list, id){
    return list.filter(sh=>{
        return sh.id == id ///search parameter
    })[0];
}

window.createGroup=async function(shortcut1, shortcut2){
    $.ajax({
        type: "POST",
        url:"/shortcuts/merge",
        data: JSON.stringify({
            shortcut1,
            shortcut2
        }),
        contentType: "application/json",
        success: function(response){
            console.log("Greoup created", response);

            // move elements
            return true;
        },
        error: function(error){
            console.error("Error creating group", error);
            return false;
        }
    });
}