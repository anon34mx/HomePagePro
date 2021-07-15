// temp1.offsetLeft
// window.innerWidth
// temp1.offsetWidth

// temp1.offsetWidth + temp1.offsetLeft > window.innerWidth

// temp1.style.left = "-95px"
$(document).ready(()=>{
    // $(".uriGroup").hover(function(){
    //     var container=$(this).find(".container")[0];
    //     var px2=$(this)[0].offsetLeft + $(this)[0].offsetWidth;
    //     var wx2=window.innerWidth;

    //     if(container.offsetWidth + px2 < wx2){
    //         $(container).css("left","69px");
    //     }
	// 	// else{
    //     //     $(container).css("left","0px");
    //     // }
    // });
	$('.uriGroup').mouseenter(function () {
		console.log("out");
		var container=$(this).find(".container")[0];
		$(container).css("left","69px");
	}).mouseleave();//trigger in

	$('.uriGroup').mouseleave(function () {
		console.log("out");
		var container=$(this).find(".container")[0];
		$(container).css("left","-10px");
	}).mouseleave();//trigger out
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
					$("#searchInput").val(404)
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