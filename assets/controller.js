$(document).ready(()=>{
	$('a, .folder').contextmenu(function() {
		return false;
	});

	$('a, .folder').mousedown(function(event) {
		event.preventDefault();
		
		switch (event.which) {
			case 1:
				// alert('Left Mouse button pressed.');
				// console.log(event)
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
		console.log("!");
		$(".submenu").css("opacity","0");
		setTimeout(()=>{
			$(".submenu").css("pointerEvents","none");
		},100);
	}
});

function openElement(file){
	console.log(file);
    $.ajax({
        url:"http://localhost:8080/open",
        data:{
            file :file
        }
    });
}

function searchss(uri, parameter){
    // console.log(uri+parameter+"="+$("#search").val());
    window.location.href=uri+parameter+"="+$("#search").val();
}

function testApi(){

}

async function validateSearch(searchEngine){
	var search=$("#searchInput").val();
	var x=search.match(/[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}(:[0-9]{4})?/);
	if(x == null){//no es IP
		if(search.match(/https|ftp|http?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/) || search.match(/^mailto:(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
			//IS URI
			window.location.href=search;
			console.log("URI");
		}else{
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
	}else{//IS IP DIRECTIO
		if(x[0].length == search.length){
			window.location.href="http://"+search;
			console.log("IP");
		}else{
			console.log("search2");
		}
	}
}

function autocomplete(){
	// http://suggestqueries.google.com/complete/search?client=firefox&q=YOURQUERY
	// $.ajax(){
		
	// }
}