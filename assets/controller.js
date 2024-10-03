$(document).ready(()=>{
	$("#searchEngines").focus(()=>{
		enginesShow(true);
	});
	$("#searchEngines li").blur((e)=>{
		var last=$("#searchEngines li:last").attr("tabindex");
		if(e.currentTarget.tabIndex >= last){
			enginesShow(false)
		}
	});
	$("#searchEngines").mouseout((e)=>{
		if($("#searchEngines li:hover").length < 1){
			enginesShow(false)
			console.log("asd")
		}
	});
	$("#searchEngines").mouseenter(()=>{
		console.log("hover");
		enginesShow(true);
	});
	//$( document.activeElement )
	function enginesShow(show){
		if(show){
			$("#searchEngines li").fadeIn(199)
		}else{
			$("#searchEngines li").fadeOut(199)
		}
	}

	$('.elementContainer, .folder, .uriGroup').contextmenu(function() {
		return false;
	});

	rightClick('.elementContainer, .folder, .uriGroup');
	
	$('.uriGroup').mouseenter(function () {
		var container=$(this).find(".container")[0];
		$(container).css("left","71px");
		$(container).css("display","-webkit-inline-box");
	}).mouseleave();//trigger in

	document.onclick = hideMenu;
	function hideMenu() {
		$("#contenxtMenu").css("display","none");
	}

	$('.ui-menu-item').on('click', function (e) {
		if(e.which === 13){
			console.log(e);
		}
	});
	// --
	$("#editShort #link").bind("paste", function(e){
		autocompleteShortcut(e.originalEvent.clipboardData.getData('text'));
	});
});

//funciones
// secondary click functions
function rightClick(applyTo){
	// actualizar para elementos nuevos
	$(applyTo).mousedown(async function(event) {
		event.preventDefault();
		
		switch (event.which) {
			case 1:
				// alert('Left Mouse button pressed.');
				$(this).trigger('click');
				break;
			case 2:
				// alert('Middle Mouse button pressed.');
				break;
			case 3:
				// console.log('Right Mouse button pressed.');
				context = $("#contenxtMenu");
				
				posX=(event.pageX); // POSICION DEL CLICK
				posY = (event.pageY) - $("body").scrollTop(); // POSICION DEL CLICK
				
				// console.log("w->"+context.offsetWidth+"_h->"+context.offsetHeight); // POSICION DEL CLICK
				if(posX+context.offsetWidth+18 > (window.innerWidth + document.getElementsByTagName("body")[0].scrollLeft)){
					posX=posX-context.offsetWidth;
				}else{
					posX=posX+1;
				}
				if(posY+context.offsetHeight > (window.innerHeight + document.getElementsByTagName("body")[0].scrollTop)){
					posY=posY-context.offsetHeight;
				}else{
					posY=posY+1;
				}
				console.log($(this), posX, posY);

				$("#contenxtMenu").css("left", posX + "px")
				$("#contenxtMenu").css("top", posY + "px")
				$("#contenxtMenu").css("display", "block")
				$("#contenxtMenu li").css("display", "none")
				$("#contenxtMenu li." + $(this).attr("type")).css("display", "block")

				$("#OpenLinkNewTab").attr("target", $(this).attr("id"))
				$("#EditGroup").attr("target", $(this).attr("id"))
				$("#EditLink").attr("target", $(this).attr("id"))
				break;
			default:
				// alert('You have a strange Mouse!');
				break;
		}
	});
}

function openElement(file){
	console.log(file);
    $.ajax({
        url:"http://localhost:8080/open",
        data:{
            file :file
        }
    });
}

function launchFolder(folder){
	$.ajax({
		url:"/openPath?folder"+folder
	});
}

function searchss(uri, parameter){
    // console.log(uri+parameter+"="+$("#search").val());
    window.location.href=uri+parameter+"="+$("#searchInput").val();
}

async function testApi(){
	console.log("testApi")
	$("#suggestions").empty()
	// https://stackoverflow.com/questions/21549516/how-to-work-with-google-suggest-queries-using-jquery
	// console.log($("#searchInput").val());
	await $.ajax({
		url: 'http://suggestqueries.google.com/complete/search?client=chrome&q='+$("#searchInput").val(),
		type: 'GET',
		dataType: 'jsonp',
		success: function (data) {
			// availableTags=data[1];
			console.log(data);
			// data[1].forEach(function(sug){
			// 	console.log(sug);
			// 	$("#suggestions").append(`<option value="`+sug+`">`);
			// });
			$( "#searchInput" ).autocomplete({
				source: data[1],
				select: function( event, ui ) {
					$("#searchForm").submit();
				}
			  });
		},
		error: function(jqXHR, textStatus, errorThrown){
		  console.log(jqXHR);
		  console.log(textStatus);
		  console.log(errorThrown);
		}
	});
}

/*
$("#searchInput").val().match(/www.([A-z]{1,})(.+[A-z]{2,3})+(\/)?/)
$("#searchInput").val().match(/(www.?)+([A-z]{1,})(.+[A-z]{2,3})+(\/)?/)

"http://www.amazon.com.mx/".match(/((https|ftp|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
"www.amazon.com.mx/".match(/((https|ftp|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
"amazon.com.mx/".match(/((https|ftp|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
"amazon.com.mx".match(/((https|ftp|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
"amazon.com.mx/articulo".match(/((https|ftp|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
"amazon.com.mx/articulo/diagonal".match(/((https|ftp|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
"amazon.com.mx/articulo/diagonal".match(/^((https|ftp|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);

*/
async function validateSearch(searchEngine){
	var search=$("#searchInput").val();
	var x=search.match(/[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}(:[0-9]{1,5})?/);
	if(x){
		if(x[0].length == search.length){ // VALID IP
			window.location.href="http://"+search;
		}else{
			console.log("search2");
		}
	}
	else if(
			search.match(/https|ftp|http:\/\/www\.[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
			||
			search.match(/^mailto:(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		){
		//IS URI
		window.location.href=search;
		console.log("URI hhtps");
	}// IS WEB DOMAIN
	else if(search.match(/^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)){
		window.location.href="https://"+search;
		console.log("web");
	}
	else{
		//SEARCH
		if(searchEngine!=undefined){
			if(search==""){
				// search=404;
				search="";
			}
			window.location.href=searchEngine+"="+search;
			console.log("search owo");
		}else{
			console.log("Submit");
			if(search==""){
				$("#searchInput").val()
			}
			$("#searchForm").submit();
		}
	}
}

function showEdit(){
	$("#editLink").fadeIn(333);
}

function idGenerator(){
	return new Date().getTime().toString(16);
}

async function renderLinkTemplate(data){
	let temp = document.getElementById("LinkTemplate");
	let clon = temp.cloneNode(true);
	clon.id = "wasap"
	document.body.appendChild(clon);
}
/*
let startTime = new Date();
for(i=0; i<100; i++){
	renderLinkTemplate();
}
let endTime = new Date();
console.log(endTime - startTime);
*/