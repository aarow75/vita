function loadJSON(callback, path) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // console.log(JSON.parse(xobj.responseText));
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

function getSource(name, abbr) {
    loadJSON(function(json) {
        // loop through pericope id's that match what the results are and put them there.
        /*
        The "id" is to group pericopes by common themes
        the number inside <b></b> is tied to the manuscripts ordering and numbering.
        This is a numbering that scholars have determined and doesn't always line up 
        in different manuscripts particularly the Greek and Slavonic. The Latin, Georgian, 
        and Armenian mostly line up.
        TODO: I'd like switch this to using a atomic id for each manuscript pericope that can connect 
        all lines in the pericopes to related content (including Genesis references). I want to preserve 
        the pericope numbering but make it hideable and make the highlighting based on the atomic numbering.
        */
        for (let i = 0; i < json.length; i++) {
            let id = json[i]["id"];
            let container = document.querySelector(`.pericope[pericope-id='${id}'] *[data-column='${abbr}']`);
            let linenum = /\<b\>(.?\d\..?\d.?[a-z]{0,1})\<\/b\>/; // we will grab the second index
            let sublines = /[a-z]/;
            let content = "";
            if (Array.isArray(json[i]["content"])) {
                // if it's got a line number in the content, wrap it and give it an id so we can target it better
                // if it doesn't have a line number, lets mark it out so we know what we need to update
                content = json[i]["content"].map(f => {
                    if (f.match(linenum)) {
                        return `<span line-id='${f.match(linenum)[1].replace(sublines,'')}'>${f}</span>`
                    }
                    return `<span class="no-line-nums">${f}</span>`;
                }).join(" ")
            } else {
                content = `<span class="no-line-nums">${json[i]["content"]}</span>`;
            }
            container.innerHTML = content;
        }
    }, './assets/' + name + '.json');
}

function columnText(id, json) {
    let title = json[id].title;
    let version = json[id].version ? '<br><span>[' + json[id].version + ']</span><br>' : '';
    let edition = json[id].edition ? '(' + json[id].edition + ')<br>' : '';
    let manuscripts = json[id].manuscripts ? json[id].manuscripts + ' manuscripts' : '';
    let allText = `${title} ${version} ${edition} ${manuscripts} <br><a href="javascript:toggleVis('${id}')">hide</a>`;
    document.querySelector('[data-column=' + id + ']').innerHTML = allText;
}

function toggleVis(id) {
    console.log( document.querySelectorAll("[data-column='" + id + "']") )
    document.querySelectorAll("[data-column='" + id + "']").forEach(f => f.classList.toggle('hide'));
}

function showAllColumns() {
    document.querySelectorAll("[data-column]").forEach(f => f.classList.remove("hide"));
}
function toggleAllPericopes() {
    document.querySelectorAll(".pericope").forEach(f => f.classList.toggle("hide"));
}

function lineIdMouseover(target) {
    // console.log("lineIdMouseover",target)
    document.querySelectorAll(`[line-id='${target.getAttribute("line-id")}']`).forEach(f => f.classList.toggle("highlight"));
}

function lineIdMouseout(target) {
    // console.log("lineIdMouseover",target)
    document.querySelectorAll(`[line-id='${target.getAttribute("line-id")}']`).forEach(f => f.classList.remove("highlight"));
}

function mouseEvents() {
    document.querySelectorAll("[line-id]").forEach(f => f.addEventListener("mouseover", e => lineIdMouseover(e.target)));
    document.querySelectorAll("[line-id]").forEach(f => f.addEventListener("mouseout", e => lineIdMouseout(e.target)));
}

function clickEvents() {
    document.querySelectorAll('.title').forEach(f => f.addEventListener("click", e => ((e.target.parentNode).nextElementSibling).classList.toggle("hide")));
}

// loads page and column titles and info
loadJSON(function(json) {
    document.querySelector('#title').innerHTML = json.title;
    columnText("GRE", json);
    columnText("SLA", json);
    columnText("LAT", json);
    columnText("GEO", json);
    columnText("ARM", json);
    columnText("SYR", json);
    columnText("ETH", json);
    columnText("BIB", json);
    columnText("REF", json);
}, './assets/vita.json');


loadJSON(function(json) {
    // creates the pericope headings
    for (let i = 0; i < json.pericopes.length; i++) {
        let pericope = `
      <tr><th colspan="9" class="title">[${json.pericopes[i]["id"]}] ${json.pericopes[i]["title"]}</th></tr>
      <tr class="pericope hide" pericope-id="${json.pericopes[i]["id"]}">
        <td data-column="GRE" class="source"></td>
        <td data-column="SLA" class="source"></td>
        <td data-column="LAT" class="source"></td>
        <td data-column="GEO" class="source"></td>
        <td data-column="ARM" class="source"></td>
        <td data-column="SYR" class="source"></td>
        <td data-column="ETH" class="source"></td>
        <td data-column="BIB" class="source"></td>
        <td data-column="REF" class="source"></td>
      </tr>
    `;

        document.querySelector('.pericopes tbody').insertAdjacentHTML('beforeend', pericope);
    }

    // loads the manuscript's JSON file into the appropriate columns under the proper pericope section
    getSource("greek", "GRE");
    getSource("slavonic", "SLA");
    getSource("latin", "LAT");
    getSource("georgian", "GEO");
    getSource("armenian", "ARM");
    getSource("cave", "SYR");
    getSource("ethiopic", "ETH");
    getSource("bible", "BIB");
    getSource("references", "REF");
}, './assets/pericope.json');

setTimeout(mouseEvents, 2000);
setTimeout(clickEvents, 2000);
