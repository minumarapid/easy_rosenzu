function exportJson() {
  const rawdata = getdatafromtextarea();
  const typedata = typedatacreate(rawdata);
  const stationdata = stationdatacreate(rawdata);
  const data = (() => {
    const stanameja = [];
    const stanameen = [];
    const stops = [];
    for(let i = 0; i < stationdata.length; i++){
      const nowedit = stationdata[i];
      stanameja.push(nowedit.nameja);
      stanameen.push(nowedit.nameen);
      stops.push(nowedit.stops);
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