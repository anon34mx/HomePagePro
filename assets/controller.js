$(document).ready(()=>{

	//$("#searchEngines li:hover").click()
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
		// console.log("salio owo");
		// console.log(e)
		// console.log($("#searchEngines li:hover").length)

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

	$('.elementContainer, .folder, .uriGroup').mousedown(async function(event) {
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
				$(".submenu").css("opacity","0");
				$(".submenu").css("pointerEvents","none");
				context=$(this).find(".submenu")[0];
				context.style.opacity="1";
				context.style.pointerEvents="initial";

				console.log("\n\n___________________\n");
				// console.log(context.style.opacity);
				// context.offsetHeight // ALTO DEL MENU
				////
				// context.style.top=(event.pageY); // POSICION DEL CLICK
				// context.style.left=(event.pageX); // POSICION DEL CLICK
				posX=(event.pageX); // POSICION DEL CLICK
				posY=(event.pageY); // POSICION DEL CLICK

				console.log("click"); // POSICION DEL CLICK
				console.log("w->"+context.offsetWidth+"_h->"+context.offsetHeight); // POSICION DEL CLICK
				console.log("X->"+event.pageX+"_Y->"+event.pageY); // POSICION DEL CLICK
				console.log("W->"+window.innerWidth+"_H->"+window.innerHeight); // POSICION DEL CLICK
				console.log("T->"+document.getElementsByTagName("body")[0].scrollTop+"_H->"+document.getElementsByTagName("body")[0].scrollLeft); // POSICION DEL CLICK
				// console.log("\n");
				// console.log(event.pageX + posX); // POSICION DEL CLICK
				// console.log(event.pageY + posY); // POSICION DEL CLICK
				// console.log("\n");
				
				// console.log(window.innerWidth); // TAMAÑO DE LA VENTANA
				// console.log(window.innerHeight); // TAMAÑO DE LA VENTANA

				//document.getElementsByTagName("body")[0].scrollTop
				if(posX+context.offsetWidth > (window.innerWidth + document.getElementsByTagName("body")[0].scrollLeft)){
					// console.log(event.pageX + posX);
					posX=posX-context.offsetWidth;
				}else{
					posX=posX+1;
				}
				if(posY+context.offsetHeight > (window.innerHeight + document.getElementsByTagName("body")[0].scrollTop)){
					// console.log(event.pageY + posY);
					posY=posY-context.offsetHeight;
				}else{
					posY=posY+1;
				}

				context.style.left=(posX); // POSICION DEL CLICK
				context.style.top=(posY); // POSICION DEL CLICK
				$("#testClick").css("left",event.pageX+"px");
				$("#testClick").css("top",event.pageY+"px");

				// console.log($(this).attr("id"));
				await shortcutsRead($(this)[0]);
				break;
			default:
				// alert('You have a strange Mouse!');
		}
	});
	$('.uriGroup').mouseenter(function () {
		var container=$(this).find(".container")[0];
		$(container).css("left","71px");
	}).mouseleave();//trigger in

	document.onclick = hideMenu;
	function hideMenu() {
		$(".submenu").css("opacity","0");
		setTimeout(()=>{
			$(".submenu").css("pointerEvents","none");
		},100);
	}

	// $(".ui-menu-item").trigger((event)=>{
	// 	console.log(event);
	// });
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
		url:"http://localhost:3434/openPath?folder"+folder
	});
}

function searchss(uri, parameter){
    // console.log(uri+parameter+"="+$("#search").val());
    window.location.href=uri+parameter+"="+$("#searchInput").val();
}

async function testApi(){
	$("#suggestions").empty()
	https://stackoverflow.com/questions/21549516/how-to-work-with-google-suggest-queries-using-jquery
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

function autocomplete(){
// http://suggestqueries.google.com/complete/search?client=firefox&q=YOURQUERY
	$.ajax({
		url: 'http://suggestqueries.google.com/complete/search?client=chrome&q='+$("#searchInput").val(),
		type: 'GET',
		dataType: 'jsonp',
		success: function (data) {
		  console.log(data);
		  $( "#searchInput" ).autocomplete({
			source: availableTags
		  });
		},
		error: function(jqXHR, textStatus, errorThrown){
		  console.log(jqXHR);
		  console.log(textStatus);
		  console.log(errorThrown);
		}
	});
}

function showEdit(){
	$("#editLink").fadeIn(333);
}