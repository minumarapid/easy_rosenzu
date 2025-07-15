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
      changes.push(nowedit.changes)
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
        "stops" : stops,
        "changes" : changes
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
  console.log(data)
  const linenameja = document.getElementById("linenameja");
  const linenameen = document.getElementById("linenameen");
  const linemark = document.getElementById("number");
  const typenameja = document.getElementById("typenameja");
  const typenameen = document.getElementById("typenameen");
  const stanameja = document.getElementById("stationnameja");
  const stanameen = document.getElementById("stationnameen");
  linenameja.value = data.linedata.linenameja || "";
  linenameen.value = data.linedata.linenameen || "";
  linemark.value   = data.linedata.linemark   || "";
  stanameja.value  = data.stadata.stanameja?.join("\n") || "";
  stanameen.value  = data.stadata.stanameen?.join("\n") || "";
  typenameja.value = data.typedata.typenameja?.join("\n") || "";
  typenameen.value = data.typedata.typenameen?.join("\n") || "";
  console.log(data.linedata.linenameja || "",data.linedata.linenameen || "",data.linedata.linemark || "",data.stadata.stanameja?.join("\n") || "",data.stadata.stanameen?.join("\n") || "",data.typedata.typenameja?.join("\n") || "",data.typedata.typenameen?.join("\n") || "")
  document.getElementById("addList").innerHTML = ""
  main();
  for(let i = 0; i < data.stadata.stanameja.length; i++){
    for(let j = 0; j < data.typedata.color.length; j++){
      if(data.stadata.stops[i]){
        waitForElement(`stops_${i}_${j}`, (checkbox) => {
          checkbox.checked = data.stadata.stops[i][j];
          console.log(checkbox.checked,data.stadata.stops[i][j])
        });
      }
      if(data.typedata.color[j] && i == 0){
        waitForElement(`color_${j}`, (color) => {
          color.value = data.typedata.color[j];
          console.log(color.value,data.typedata.color[j])
        });
      }
    }
    if(data.stadata.changes[i] !== undefined && data.stadata.changes[i].color.length > 0){
      for(let j = 0; j < data.stadata.changes[i].color.length; j++){
        const inp = {
          "element" : [document.getElementById("changesta"),document.getElementById("changecolor"),document.getElementById("changenameja"),document.getElementById("changenameen")],
          "id" : ["","color","ja","en"]
        }
        for(let k = 0; k < 4; k++){
          if(k == 0){
            inp.element[k].value = i.toString()
          } else {
            inp.element[k].value = data.stadata.changes[i][inp.id[k]][j]
          }
        }
        addChangeList();
      }
    }
  }
  main();
  console.log("インポートしました。")
}

async function createShortUrl(rawTargetUrl) {
  const targetUrl = (rawTargetUrl.includes("easy-rosenzu.pages.dev")) ? rawTargetUrl.replace("easy-rosenzu.pages.dev","rosenzu.o38.me") : rawTargetUrl;
  console.log(targetUrl)
  const apiEndpoint = 'https://s.o38.me/api/create';
  const apiKey = 'dV35Ey35';
  
  const fullUrl = `${apiEndpoint}?url=${encodeURIComponent(targetUrl)}`;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey
    }
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error);
    return null;
  }

  const data = await response.json();
  console.log('Short URL:', data.shortUrl);
  return data;
}