$(document).ready(function() {
    $('.uriGroup').hover(showFolderContent,hideFolderContent);
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
                // alert('Left Mouse button pressed.');
                contextmenuHide();
                break;
            case 2:
                // alert('Middle Mouse button pressed.');
                break;
            case 3:
                // alert('Right Mouse button pressed.');
                break;
            default:
                // alert('You have a strange Mouse!');
        }
    })

    // CONTEXT MENU
    // $('.uriGroup, .uri').contextmenu(function() {
	// 	return false;
	// });

    // INITIALIZE THINGS
    generateContent();
});

window.showFolderContent=function(){
    $(this).addClass("showChildren");
    $(this).find(".children").css("opacity","1");
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

    $( ".uri" ).droppable({
        accept: ".uri",
        classes: {
            "ui-droppable-active": "ui-state-highlight"
        },
        drop: function( event, ui ) {
            console.log("create group");
        },
        accept: "#shortcuts .uri",
        //   accept: "#shortcuts .uri > .linkDraggable",
    });
    $( "#shortcuts" ).droppable({
        tolerance:"pointer",
        classes: {
            "ui-droppable-active": "ui-state-highlight"
        },
        drop: function(event, ui){
            console.log("main group");
        }
    });
}

window.generateContent=function(){
    shortcuts.forEach(shortcut => {
        if(shortcut.folder==false){
            renderShortcut(shortcut,$("#shortcuts"));
        }else{
            renderFolder(shortcut);
        }
    });

    lhFiles.forEach(element=>{
        renderShortcut(element,$("#server"));
    })
}

window.renderShortcut=function(shortcut, target){
    var template=document.querySelector("#shortcutTemplate");
    let clone = template.content.cloneNode(true);

    clone.querySelector(".uri").id=shortcut.id;
    clone.querySelector(".uri").href=shortcut.uri;
    clone.querySelector(".uri").title=shortcut.uri;
    clone.querySelector("label.name").textContent=shortcut.name;
    clone.querySelector("picture source").srcset=shortcut.icon;

    $(target).append(clone);
    $("#"+shortcut.id).contextmenu(()=>{
        return contextmenuShow(event)
    });
}
window.renderFolder=function(folder){
    var template=document.querySelector("#uriGroupTemplate");
    let clone = template.content.cloneNode(true);

    clone.querySelector(".uriGroup").id=folder.id;
    clone.querySelector("label.name").textContent=folder.name;

    // console.log(folder);
    folder.content.forEach(shortcut => {
        renderShortcut(shortcut, clone.querySelector(".children"));
    });

    $("#shortcuts").append(clone);
    $("#"+folder.id).hover(showFolderContent,hideFolderContent);
    $("#"+folder.id).contextmenu(()=>{
        return contextmenuShow(event)
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
    console.log(event);

    // $("#contextMenu").attr("target",event.target.id);
    rclickTarget=event.target;

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