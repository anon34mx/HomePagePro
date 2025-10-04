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