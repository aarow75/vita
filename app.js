function loadJSON(callback, path) {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', path, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // console.log(JSON.parse(xobj.responseText));
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);  
}

function getSource(name, abbr) {
  loadJSON(function(json){
    // loop through pericope id's that match what the results are and put them there.
    for (let i = 0; i < json.length; i++) {
      let id = json[i]["id"];
      document.querySelector(`.pericope[pericope-id='${id}'] *[data-column='${abbr}']`).innerHTML = json[i]["content"];
    }
  }, './assets/' + name + '.json');
}

function columnText(id, json) {
  let title = json[id].title;
  let version = json[id].version ? '<br><span>[' + json[id].version + ']</span><br>' : '';
  let edition = json[id].edition? '(' + json[id].edition + ')<br>' : '';
  let manuscripts = json[id].manuscripts ? json[id].manuscripts + ' manuscripts' : '';
  let allText = `${title} ${version} ${edition} ${manuscripts}`
  document.querySelector('[data-column=' + id + ']').innerHTML = allText;
}

loadJSON(function(json) {
  document.querySelector('#title').innerHTML = json.title;
  columnText("GEO", json);
  columnText("LAT", json);
  columnText("GRE", json);
  columnText("SLA", json);
  columnText("ARM", json);
  columnText("BIB", json);
  columnText("REF", json);
  // document.querySelector('[data-column=GEO]').innerHTML = json.GEO.title + ' [' + json.GEO.version + '] ' + '(' + json.GEO.edition + ')<br>' + json.GEO.manuscripts + ' manuscripts';
  // document.querySelector('[data-column=LAT]').innerHTML = json.LAT.title + ' [' + json.LAT.version + '] ' + '(' + json.LAT.edition + ')<br>' + json.LAT.manuscripts + ' manuscripts';
  // document.querySelector('[data-column=GRE]').innerHTML = json.GRE.title + ' [' + json.GRE.version + '] ' + '(' + json.GRE.edition + ')<br>' + json.GRE.manuscripts + ' manuscripts';
  // document.querySelector('[data-column=SLA]').innerHTML = json.SLA.title + ' [' + json.SLA.version + '] ' + '(' + json.SLA.edition + ')<br>' + json.SLA.manuscripts + ' manuscripts';
  // document.querySelector('[data-column=ARM]').innerHTML = json.ARM.title + ' [' + json.ARM.version + '] ' + '(' + json.ARM.edition + ')<br>' + json.ARM.manuscripts + ' manuscripts';
}, './assets/vita.json');


loadJSON(function(json) {
  for (let i = 0; i < json.pericopes.length; i++) {
    let pericope = `
      <tr><th colspan="6" class="title">${json.pericopes[i]["title"]}</th></tr>
      <tr class="pericope" pericope-id="${json.pericopes[i]["id"]}">
        <td data-column="LAT" class="source"></td>
        <td data-column="GRE" class="source"></td>
        <td data-column="GEO" class="source"></td>
        <td data-column="SLA" class="source"></td>
        <td data-column="ARM" class="source"></td>
        <td data-column="BIB" class="source"></td>
        <td data-column="REF" class="source"></td>
      </tr>
    `;

    document.querySelector('.pericopes tbody').insertAdjacentHTML('beforeend',pericope);

    getSource("latin", "LAT");
    getSource("armenian", "ARM");
    getSource("georgian", "GEO");
    getSource("greek", "GRE");
    getSource("slavonic", "SLA");
    getSource("bible", "BIB");
    getSource("references", "REF");
  }
}, './assets/pericope.json');