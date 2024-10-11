
const renderUri=(id, uri, icon, name, blank)=>{
    // <div class="imgContainer">
    // </div>
    return `<a href="`+uri+`"class="element">
        <div class="icon">
            <img class="" src="`+icon+`" onerror="http://localhost:34/assets/styles/default/html.svg"/>
        </div>
        <label class="txt-white-shadow">
           `+name+`
        </label>
        <div class="bg"></div>
    </a>`;
}

exports.renderUri = renderUri
