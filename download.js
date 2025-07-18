function importDialog() {
  const typeSelect = document.getElementById("loadTypeSelect").value;
  if(typeSelect){
    const jsonDiv = document.getElementById("jsonImport")
    const browserDiv = document.getElementById("browserImport")
    if(typeSelect === "json"){
      browserDiv.className = "d-none"
      jsonDiv.className = ""
    } else if(typeSelect === "browser"){
      browserDiv.className = ""
      jsonDiv.className = "d-none"
      const table = document.getElementById("saveList")
      if(table.hasChildNodes()){table.innerHTML = ""}
      if(localStorage.saveDataArr){
        const arr = localStorage.saveDataArr.split(",");
        for(let i = 0; i < arr.length; i++){
          const tr = document.createElement("tr");
          tr.id = `loadData_${i}`
          for(let j = 0; j < 3; j++){
            const td = document.createElement("td");
            if(j === 0){
              td.innerText = decodeURIComponent(arr[i]);
            } else if(j !== 0){
              const btn = document.createElement("button");
              if(j === 1){
                btn.innerText = "読込";
                btn.className = "btn btn-outline-primary"
                btn.onclick = (() => {
                  pushJson(localStorage.getItem(`save_${arr[i]}`))
                });
              } else if(j === 2){
                btn.innerText = "削除";
                btn.className = "btn btn-outline-danger"
                btn.onclick = (() => {
                  localStorage.removeItem(`save_${arr[i]}`);
                  arr.splice( i, 1 );
                  console.log(arr)
                  localStorage.saveDataArr = arr.join(",");
                  importDialog();
                });
              }
              td.appendChild(btn);
            }
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }
      } else {
        const tr = document.createElement("tr")
        for(let i = 0; i < 2; i++){
          const td = document.createElement("td")
          if(i === 0){
            td.innerText = "データが見つかりませんでした"
            td.colSpan = 2;
          } else if (i === 1){
            const btn = document.createElement("button")
            btn.innerText = "再読込";
            btn.className = "btn btn-outline-primary"
            btn.onclick = (() => {
              importDialog();
            });
            td.appendChild(btn);
          }
          tr.appendChild(td)
        }
        table.appendChild(tr)
      }
    } else {
      browserDiv.className = "d-none"
      jsonDiv.className = "d-none"
    }
  }
}

function downloadDialog() {
  const fileTypeSelect = document.getElementById("typeSelect");
  const fileType = fileTypeSelect.value
  const fileTypeName = (fileType.includes(".")) ? fileType : "";
  const fileTypeT = document.getElementById("fileType")
  fileTypeT.innerText = fileTypeName
  const fileName = document.getElementById("fileName").value
  const saveForm = document.getElementById("saveName")
  if(fileType === ".png"){
    downloadPng(fileName);
    saveForm.className=""
  } else if(fileType === ".svg"){
    downloadSvg(fileName);
    saveForm.className=""
  } else if(fileType === ".json"){
    downloadJson(fileName);
    saveForm.className=""
  } else if(fileType === "browser"){
    saveBrowser(fileName);
    saveForm.className=""
  } else {
    const a = document.getElementById("dataSaveBtn");
    a.removeAttribute('href');
    a.removeAttribute('download');
    a.onclick = null;
    saveForm.className="d-none"
  }
}

function saveBrowser(rawFileName){
  const fileName = encodeURIComponent(rawFileName)
  const a = document.getElementById("dataSaveBtn");
  a.removeAttribute('href');
  a.removeAttribute('download');
  a.onclick = (() =>{
    const saveName = `save_${fileName}`
    const arr = (localStorage.saveDataArr) ? localStorage.saveDataArr.split(",") : [];
    if(!localStorage.saveDataArr || !arr.includes(fileName)){
      arr.push(fileName)
      localStorage.saveDataArr = arr.join(",");
    }
    localStorage.setItem(saveName, exportJson());
    alert("保存しました。")
  });
}

function downloadSvg(fileName) {
  const svg = document.getElementById("svg_main")
  removeTopLevelStyleTags(svg);
  const svgText = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const a = document.getElementById("dataSaveBtn");
  a.href = svgUrl;
  a.download = `${fileName}.svg`;
  a.onclick = null;
  URL.revokeObjectURL(svgUrl);
}

function downloadJson(fileName) {
  const json = exportJson();
  const jsonBlob = new Blob([json], { type: 'application/json' });
  const Url = URL.createObjectURL(jsonBlob); 
  const a = document.getElementById("dataSaveBtn");
  a.href = Url;
  a.download = `${fileName}.json`;
  a.onclick = null;
  URL.revokeObjectURL(Url);
}

function downloadPng(fileName) {
  const container = document.getElementById("container");
  const svgElement = container.querySelector("svg");

  const svg = document.getElementById("svg_main")
  const Mplus2 = fonts.Mplus2
  const Montserrat = fonts.Montserrat
  removeTopLevelStyleTags(svg);
  insertFontStyle(svg, Mplus2 , "M PLUS 2", Montserrat , "Montserrat")

  if (!svgElement) {
    console.error("SVG element not found inside #container.");
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const image = new Image();

  const width = svgElement.viewBox.baseVal.width || svgElement.clientWidth || 800;
  const height = svgElement.viewBox.baseVal.height || svgElement.clientHeight || 600;

  image.onload = function () {
    // 修正前：すぐに描画＆toBlob
    // 修正後：描画後に1フレーム待つ（フォントが反映されるのを待つ）

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const scale = 2;
        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;

        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.scale(scale, scale);

        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(function (blob) {
          const a = document.getElementById("dataSaveBtn");
          a.onclick = null;
          a.href = URL.createObjectURL(blob);
          a.download = `${fileName}.png`;
          URL.revokeObjectURL(url);
        });
      });
    });
  };

  image.src = url;
  removeTopLevelStyleTags(svg);
}

function exportJson() {
  const rawdata = getdatafromtextarea();
  const typedata = typedatacreate(rawdata);
  const stationdata = stationdatacreate(rawdata);
  const data = (() => {
    const stanameja = [];
    const stanameen = [];
    const stops = [];
    const changes = [];
    for(let i = 0; i < stationdata.length; i++){
      const nowedit = stationdata[i];
      stanameja.push(nowedit.nameja);
      stanameen.push(nowedit.nameen);
      stops.push(nowedit.stops);
      changes.push(nowedit.changes);
    }
    const typenameja = [];
    const typenameen = [];
    const color = [];
    for(let i = 0; i < typedata.length; i++){
      const nowedit = typedata[i];
      typenameja.push(nowedit.typeja);
      typenameen.push(nowedit.typeen);
      color.push(nowedit.color);
    }
    const returndata = {
      "linedata" : {
        "linenameja" : rawdata[5],
        "linenameen" : rawdata[6],
        "linemark" : rawdata[4]
      },
      "stadata" : {
        "stanameja" : stanameja,
        "stanameen" : stanameen,
        "stops" : stops
      },
      "typedata" : {
        "typenameja" : typenameja,
        "typenameen" : typenameen,
        "color" : color
      }
    }
    return returndata
  })();
  console.log(data)
  return JSON.stringify(data, null, '')
}

function waitForElement(id, callback) {
  const target = document.body;

  const observer = new MutationObserver(() => {
    const el = document.getElementById(id);
    if (el) {
      observer.disconnect();
      callback(el);
    }
  });

  observer.observe(target, {
    childList: true,
    subtree: true
  });

  // 最初からもう存在してたらすぐ実行
  const el = document.getElementById(id);
  if (el) {
    observer.disconnect();
    callback(el);
  }
}

function pushJson(json){
  let data;

  if (typeof json === "string") {
    console.log("type of str")
    try {
      data = JSON.parse(json);
    } catch (e) {
      console.error("JSONのパースに失敗しました", e);
      return;
    }
  } else {
    data = json;
  }

  const linenameja = document.getElementById("linenameja");
  const linenameen = document.getElementById("linenameen");
  const linemark = document.getElementById("number");
  const typenameja = document.getElementById("typenameja");
  const typenameen = document.getElementById("typenameen");
  const stanameja = document.getElementById("stationnameja");
  const stanameen = document.getElementById("stationnameen");
  linenameja.value = data.linedata.linenameja;
  linenameen.value = data.linedata.linenameen;
  linemark.value = data.linedata.linemark;
  stanameja.value = data.stadata.stanameja.join("\n");  
  stanameen.value = data.stadata.stanameen.join("\n");  
  typenameja.value = data.typedata.typenameja.join("\n");  
  typenameen.value = data.typedata.typenameen.join("\n");  
  main();
  for(let i = 0; i < data.stadata.stanameja.length; i++){
    for(let j = 0; j < data.typedata.typenameja.length; j++){
      waitForElement(`stops_${i}_${j}`, (checkbox) => {
        checkbox.checked = data.stadata.stops[i][j];
        console.log(checkbox.checked,data.stadata.stops[i][j])
      });
      if(i == 0){
        waitForElement(`color_${j}`, (color) => {
          color.value = data.typedata.color[j];
          console.log(color.value,data.typedata.color[j])
        });
      }
    }
  }
  main();
  console.log("インポートしました。")
}