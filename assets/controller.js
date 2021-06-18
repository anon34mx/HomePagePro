// temp1.offsetLeft
// window.innerWidth
// temp1.offsetWidth

// temp1.offsetWidth + temp1.offsetLeft > window.innerWidth

// temp1.style.left = "-95px"
$(document).ready(()=>{
    $(".uriGroup").hover(function(){
        var container=$(this).find(".container")[0];
        var px2=$(this)[0].offsetLeft + $(this)[0].offsetWidth;
        var wx2=window.innerWidth;

        if(container.offsetWidth + px2 < wx2){
            $(container).css("left","65px");
            console.log("cabe");
        }else{
            console.log("no cabe");
            $(container).css("left","0px");
        }
    });
});