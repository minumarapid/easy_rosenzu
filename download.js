function downloadSvg(data) {
  let linename = data[6].split('/').join('_')
  linename = data[6].split(' ').join('_')
  console.log(linename);

  const svg = document.getElementById("svg_main")
  removeTopLevelStyleTags(svg);
  const svgText = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").split(".")[0];  
  const a = document.createElement('a');
  a.href = svgUrl;
  a.download = `${linename}_${timestamp}.svg`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(svgUrl);
}

function downloadJson(json,data) {
  const linename = data[6].split('/').join('_').split(' ').join('_')

  const jsonBlob = new Blob([json], { type: 'application/json' });
  const Url = URL.createObjectURL(jsonBlob);
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").split(".")[0];  
  const a = document.createElement('a');
  a.href = Url;
  a.download = `${linename}_${timestamp}.json`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(Url);
}

function downloadPng(data) {
  const container = document.getElementById("container");
  const svgElement = container.querySelector("svg");

  let linename = data[6].split('/').join('_')
  linename = data[6].split(' ').join('_')
  console.log(linename);
  

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
      const timestamp = new Date().toISOString().replace(/[-:T]/g, "").split(".")[0];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${linename}_${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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