// easy_rosenzu/script.js - v0.2.0
// easy_rosenzuは、駅の名前や種別を入力することで、snapsvgを使用して路線図を自動で描画するサイトです。


function main() {
  //TODO: mainの関数。実行順に関数を実行する。 ]
  const data = getdatafromtextarea();
  stopscheckboxcreate(data);
  typecolorformcreate(data);
  station(data);
}

function isSafari() {
  const ua = navigator.userAgent;

  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isSafari;
}

function addevent() {
  const textareas = document.querySelectorAll('.inputarea');
  textareas.forEach(area => {
    area.addEventListener('input',() => {
      main();
    });
  });

  const pngbutton = document.getElementById("pngbutton");
  pngbutton.addEventListener("click", () => { 
    const data = getdatafromtextarea();
    downloadPng(data);
  });

  const svgbutton = document.getElementById("svgbutton");
  svgbutton.addEventListener("click", () => {
    const data = getdatafromtextarea();
    downloadSvg(data);
  });
}

function error(str){
  const errorhtml = document.getElementById("error");
  errorhtml.innerHTML = str;
}

function getdatafromtextarea() {
  // テキストエリアからデータを取得する関数。
  const stationnameja = splitinputdata(toFullWidth(document.getElementById("stationnameja").value));
  const stationnameen = splitinputdata(tomacron(document.getElementById("stationnameen").value));
  const typenameja = splitinputdata(toFullWidth(document.getElementById("typenameja").value));
  const typenameen = splitinputdata(tomacron(document.getElementById("typenameen").value));
  const linenum = document.getElementById("number").value;
  const linenameja = toFullWidth(document.getElementById("linenameja").value);
  const linenameen = tomacron(document.getElementById("linenameen").value);

  if (stationnameja.length !== stationnameen.length || typenameja.length !== typenameen.length) {
    console.error("Error: Station names and types do not match in length.");
    if (stationnameja.length == stationnameen.length && typenameja.length !== typenameen.length){
      error("種別名の日英はそれぞれ同じ行数にする必要があります。")
      return [];
    } else if (stationnameja.length !== stationnameen.length && typenameja.length == typenameen.length){
      error("駅名の日英はそれぞれ同じ行数にする必要があります。")
      return [];
    } else if (stationnameja.length == stationnameen.length && typenameja.length == typenameen.length){
      error("駅名及び種別名の日英はそれぞれ同じ行数にする必要があります。")
      return [];
    }
  } else {
    error("")
  }

  return [stationnameja, stationnameen, typenameja, typenameen, linenum, linenameja, linenameen];
}

function toFullWidth(str) {
  // 半角英数字を全角に変換
  str = str.replace(/[A-Za-z0-9]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
  return str;
}

function tomacron(str) {
  str = str.split("ā").join("ā");
  str = str.split("ī").join("ī");
  str = str.split("ū").join("ū");
  str = str.split("ē").join("ē");
  str = str.split("ō").join("ō");
  return str;
}

function stopscheckboxcreate(data) {
  //table内にチェックボックスを生成する関数。
  //by chatGPT

  let stopsdata = []

  if(document.getElementById("stops_0_0") !== null) {
    stopsdata = getstopsdata(data);
  } else {
    stopsdata = null;
  }

  console.log(stopsdata)

  document.getElementById("stops").innerHTML = "";
  const stations = data[0];
  const types = data[2];

  const table = document.getElementById("stops");

  // ヘッダー行を作成
  const headerRow = document.createElement("tr");
  types.forEach(type => {
    const th = document.createElement("th");
    th.className = "vertical";
    th.textContent = type;
    headerRow.appendChild(th);
  });
  const emptyTh = document.createElement("th"); // 駅名列
  headerRow.appendChild(emptyTh);
  table.appendChild(headerRow);

  // 駅ごとの行を作成
  stations.forEach((station, rowIndex) => {
    const row = document.createElement("tr");
    types.forEach((_, colIndex) => {
      const td = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      const id = `stops_${rowIndex}_${colIndex}`
      checkbox.id = id;
      checkbox.className = "stopscheck"
      if(stopsdata !== null && stopsdata.length > rowIndex) {
        if(stopsdata[rowIndex].length > colIndex){
          checkbox.checked = stopsdata[rowIndex][colIndex] || false;
        }else{
          checkbox.checked = true
        }
      } else {
        checkbox.checked = true
      }
      td.appendChild(checkbox);
      row.appendChild(td);
    });
    const nameCell = document.createElement("td");
    nameCell.textContent = station;
    nameCell.id = `stationname_${rowIndex}`
    row.appendChild(nameCell);

    table.appendChild(row);
  });
  const stopscheck = document.querySelectorAll('.stopscheck');
  stopscheck.forEach(area => {
    area.addEventListener('change',() => {
      main();
    });
  });
}

function typecolorformcreate(data) {
  //種別の色を設定するフォームを生成する関数。


  let colorvalue = []

  if(document.getElementById("stops_0_0") !== null){
    colorvalue = getcolordata(data);
  } else {
    colorvalue = null
  }
  
  document.getElementById("typecolor").innerHTML = "";

  const types = data[2];
  const table = document.getElementById("typecolor");

  types.forEach((type, rowIndex) => {
    const div = document.createElement("div");
    div.className = "input-group mb-3";
    const span = document.createElement("span");
    span.className  = "input-group-text";
    span.textContent = type;
    const colorinput = document.createElement("input");
    colorinput.className = "form-control form-control-color colorinput"
    colorinput.type = "color"
    colorinput.id = `color_${rowIndex}`
    if(colorvalue[0] !== null && colorvalue.length > rowIndex) {
      colorinput.value = colorvalue[rowIndex];
    } else {
      colorinput.value = "#000000"
    }
    div.appendChild(span);
  div.appendChild(colorinput);
  table.appendChild(div);
  });
  const colorinput = document.querySelectorAll('.colorinput');
  colorinput.forEach(area => {
    area.addEventListener('change',() => {
      main();
    });
  });
}

// 改行区切り関数 テキストエリアに入力されたものをデータに変換する際に利用する
function splitinputdata(input) {
  return input.split("\n");
}

function getstopsdata(data) {
  const namejadata = data[0]
  const typejadata = data[2]
  
  let stopsdata = [[]];
  for (let i = 0; i < namejadata.length; i++) {
    for (let j = 0; j < typejadata.length; j++) {
      let chackbox = document.getElementById(`stops_${i}_${j}`);
      if (chackbox) {
        if (stopsdata[i] === undefined) {
          stopsdata[i] = [];
        }
        stopsdata[i][j] = chackbox.checked;
      } else {
        console.error(`Checkbox for station ${i} and type ${j} not found.`);
      }
    }
  }
  return stopsdata;
}

function getcolordata(data) {
  const typejadata = data[2];
  let colorvalue = [];
  for(let i=0; i < typejadata.length; i++){
    let color = document.getElementById(`color_${i}`);
    if (!color) {
      console.error(`Color input for type ${i} not found.`);
      colorvalue[i] = null
    } else {
      colorvalue[i] = color.value
    }
  }
  return colorvalue
}

function removeTopLevelStyleTags(svgElement) {
  const children = svgElement.childNodes;

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      child.tagName.toLowerCase() === "style"
    ) {
      svgElement.removeChild(child);
    }
  }
}

function insertFontStyle(svgElement, base64Font1, fontFamilyName1, base64Font2, fontFamilyName2) {

    // <style> 要素を SVG 直下に追加し、フォントの埋め込みを行う。
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.setAttribute("type", "text/css");

    style.textContent = `
      @font-face {
        font-family: '${fontFamilyName1}';
        src: url("data:font/woff2;base64,${base64Font1}") format("woff2");
      }
      @font-face {
        font-family: '${fontFamilyName2}';
        src: url("data:font/woff2;base64,${base64Font2}") format("woff2");
      }
    `;

    // SVG の最初の子要素の前に挿入
    const firstChild = svgElement.firstChild;
    svgElement.insertBefore(style, firstChild);
}

function stationdatacreate(data) {
  //駅データを作成する関数
  
  const namejadata = data[0];
  const nameendata = data[1];
  const typejadata = data[2];
  const typeendata = data[3];
  const stopsdata = getstopsdata(data);

  if (namejadata.length !== nameendata.length || typejadata.length !== typeendata.length) {
    console.error("Error");
    console.log(namejadata.length, nameendata.length, typejadata.length, typeendata.length);
    return;
  }

  let numdata = [];
  for (let i = 0; i < namejadata.length; i++) {

    let numi = function (i) {
      if (i < 9) {
        return ("0" + (i + 1)).slice(-2);
      } else {
        return (i + 1);
      }
    }

    numdata[i] = document.getElementById("number").value + numi(i);
    if (document.getElementById("number").value === "") {
      numdata[i] = numi(i);
    }
  } 

  let stationdata = [];
  for (let i = 0; i < namejadata.length; i++) {
    stationdata[i] = {
      nameja: namejadata[i],
      nameen: nameendata[i],
      num: numdata[i],
      stops: stopsdata[i],
    };
  }
  console.log(stationdata);
  return stationdata;
}

function typedatacreate(data) {
  //種別の名称、種別色を扱う関数。
  const typejadata = data[2];
  const typeendata = data[3];
  let typedata = [];
  const colorValue = getcolordata(data);
  for (let i = 0; i < typejadata.length; i++) {


    let typeja = typejadata[i];
    let typeen = typeendata[i];

    typedata[i] = {
      typeja: typeja,
      typeen: typeen,
      color: colorValue[i]
    };
    
    // ここでtypeja, typeen, colorValueを使って何か処理をする
    console.log(`Type: ${typeja}, ${typeen}, Color: ${colorValue}`);
  }
  console.log(typedata);
  return typedata;
}

function station(data) {
  document.getElementById("container").innerHTML = "";
  const stationdata = stationdatacreate(data);
  const typedata = typedatacreate(data);
  console.log(data)
  const linenameja = data[5]
  const linenameen = data[6]
  console.log(stationdata, typedata);
  const stationlength = stationdata.length;
  const typelength = typedata.length;
  console.log(stationlength, typelength);
  // 計算：サイズ
  const cellWidth = 70;
  const cellHeight = 30;
  const svgWidth = stationlength * cellWidth + 95;//95は凡例部分の分
  const svgHeight = (typelength + 10) * cellHeight; // +12.5は駅名表示領域の分
  
  // SVG初期化
  const svg = Snap.parse(`<svg id="svg_main" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg"></svg>`);
  container.appendChild(svg.node);
  
  //ここで駅の座標を確定しstationname関数とstationstoptrain関数に渡す。
  linename(5,40,linenameja,linenameen)

  for (let i = 0; i < stationdata.length; i++) {
    let x = 95 + i * 70; // X座標を70ずつずらす
    let y = 75 + typelength * 30; // Y座標を30ずつずらす
    let nameja = stationdata[i].nameja;
    let nameen = stationdata[i].nameen;
    let num = stationdata[i].num;
    let stops = stationdata[i].stops;
    for (let j = 0; j < typelength; j++) {  
      let nj = j + 1
      let ny = nj * -30 + y;
      let typenameja = typedata[j].typeja
      let typenameen = typedata[j].typeen
      let color = typedata[j].color;
      if (i == 0) {
        linepath (73,ny,color)
        typeexsample(5, ny, typenameja, typenameen, color)
      }
      if (i + 1 !== stationdata.length){   
        linepath (x,ny,color)    
      }      
      stationstoptrain(x, ny, color, stops[j]);
    }
    stationname(x, y - 2, nameja, nameen, num);
  }
}

function textboxsize(nameen,attr){
  const paper = Snap("#svg_main");

  // 仮描画用の非表示グループ
  const tempGroup = paper.g().attr({ visibility: "hidden" });
  
  const nattr = {
    fontFamily: attr.fontFamily,
    fontSize: attr.fontSize,
    textAnchor: "left",
    "writing-mode": "lr"
  }

  // 仮描画して幅を測定
  const tempText = tempGroup.text(0, 0, nameen).attr(nattr);

  // 実際の幅を取得
  const bbox = tempText.getBBox();
  tempGroup.remove();
  return(bbox.width)
};

function typeexsample(x, y, typenameja, typenameen, color) {
  const paper = Snap("#svg_main")

  let typejaAttr = {
    fontFamily: "'M PLUS 2'",
    fontSize: "14.8167px",
    textAnchor: "middle",
    fill: "#ffffff"
  }
  let typeenAttr = {
    fontFamily: "Montserrat", fontSize: "7.40833px",
    textAnchor: 
    "middle", 
    fill: "#ffffff"
  }

  typejaWidth = textboxsize(typenameja,typejaAttr);
  typeenWidth = textboxsize(typenameen,typeenAttr);

  if (typejaWidth > 70) {
    typejaAttr.textLength = "70px";
    typejaAttr.lengthAdjust = "spacingAndGlyphs";
  }
  if (typeenWidth > 70) {
    typeenAttr.textLength = "70px";
    typeenAttr.lengthAdjust = "spacingAndGlyphs";
  }

  paper.rect(x,y,75,25)
    .attr({fill: color})
  paper.text(x+37.5,y+14.552083,typenameja)
    .attr(typejaAttr)
  paper.text(x+37.5, y+22.754166, typenameen)
    .attr(typeenAttr)
}

function linename(x, y, linenameja,linenameen) {
  //路線名を生成する関数。
  const paper = Snap("#svg_main")
  paper.text(x,y,linenameja)
    .attr({fontFamily:"'M PLUS 2'", fontSize: "33.8667px", 
      textAnchor: "left"});
  paper.text(x,y + 20,linenameen)
    .attr({fontFamily:"Montserrat", fontSize: "15.5222px", 
      textAnchor: "left"});
}

function linepath(x,y,color) {
  const paper = Snap("#svg_main");
  paper.line(x,y + 12.5,x + 71,y + 12.5).attr(
    {stroke:color ,strokeWidth:21.1667});  
}

function stationstoptrain(x, y, color, stops) {
  //停車駅を表す四角のSVGを生成する。停車駅等の変数生成の仕組みが整い次第すぐ作れると思う。
  if (stops === false) {
    return;
  }
  const paper = Snap("#svg_main");
  //paper.rect(x + 1.0583349, y + 1.0583371, 50.799999, 23)
  paper.rect(x + 1, y + 1, 50.799999, 23)
    .attr({fill: "#ffffff", stroke: color, strokeWidth: 2});
}

function stationname(x, y, nameja, nameen, num) {
  const paper = Snap("#svg_main");
  let namejaAttrs = {
    fontFamily: "'M PLUS 2'",
    fontSize: "33.8667px",
    textAnchor: "left",
    "writing-mode": "vertical-rl",
    skipx: 0,
  };

  let nameenAttrs = {
    fontFamily: "Montserrat",
    fontSize: "15.5222px",
    textAnchor: "left",
    "writing-mode": "vertical-rl"
  };

  let stanumAttrs = {
    fontFamily:"Montserrat", 
    fontSize: "15.5222px", 
    textAnchor: "middle"
  }

  const namejaWidth = textboxsize(nameja,namejaAttrs)
  const nameenWidth = textboxsize(nameen,nameenAttrs)
  const stanumWidth = textboxsize(num, stanumAttrs)
  const namejalen = namejaWidth / 33.8667
  
  if (namejaWidth > 170) {
    if (isSafari()) {
      namejaAttrs.textLength = (33.8667 * 5 / namejalen) + "px";
    } else {
      namejaAttrs.textLength = (33.8667 * 5) + "px";
    }
    
    console.log(33.8667 * 5 / nameja.length);
    
    namejaAttrs.lengthAdjust = "spacingAndGlyphs";
    namejaAttrs.skipy = 33.8667 * 5 / namejalen;
  } else {
    namejaAttrs.skipy = 33.8667
  }
  
  // 170px以上なら縮める
  if (nameenWidth > 170) {
    nameenAttrs.textLength = (33.8667 * 5) + "px";
    nameenAttrs.lengthAdjust = "spacingAndGlyphs";
  }

  
  if (stanumWidth > 45) {
    stanumAttrs.textLength = "45px";
    stanumAttrs.lengthAdjust = "spacingAndGlyphs";
  }
  
  paper.text(x + 25.682186, y + 15.098883, num)
    .attr(stanumAttrs);
  paper.text(x + 18.464384, y + 18.797308, nameja).attr(namejaAttrs);
	paper.text(x + 44.215252, y + 19.906576, nameen).attr(nameenAttrs);
}

async function get(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('ネットワークエラー');
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('通信エラー:', error);
    return null;
  }
}

async function getdatafromurl() {
    // 文字列としてURLを取得する。
  const url_string = window.location.href;
  // 文字列としてのURLをURLオブジェクトに変換する。
  const url = new URL(url_string);

  const rawstaname = url.searchParams.get("staname")
  const linename = url.searchParams.get("linename");
  const linemark = url.searchParams.get("linemark");

  if (rawstaname !== null || linename !== null || linemark !== null){

    let staname

    if (rawstaname !== null) {
      staname = rawstaname.split(',').join('\n')
    }

    const linenameen = await get(`https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${linename}&source=ja&target=en`);
    const rawstanameen = await get(`https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${rawstaname}&source=ja&target=en`);
  
    let stanameen

    if (staname !== null) {
      stanameen = rawstanameen.split(', ').join('\n')
    }

    console.log(staname,linename,linemark,stanameen,linenameen);

    const linenametextarea = document.getElementById("linenameja")
    const stanametextarea = document.getElementById("stationnameja")
    const linemarktextarea = document.getElementById("number")
    const linenameenarea = document.getElementById("linenameen")
    const stanameenarea = document.getElementById("stationnameen")

    if (linenametextarea.value == ""){
      linenametextarea.value = linename;
    }

    if (stanametextarea.value == ""){
      stanametextarea.value = staname;
    }  

    if (linemarktextarea.value == ""){
      linemarktextarea.value = linemark;
    }

    if (linenameenarea.value == ""){
      linenameenarea.value = linenameen
    }

    if (stanameenarea.value == ""){
      stanameenarea.value = stanameen
    }

    main();
  } else {
    return
  }
}

// 乗換案内の実装予定はありません。いまのところ。
window.onload = function onload(){
  getdatafromurl();

  addevent();
  
  console.log("easy_rosenzu/script.js v0.2.0 loaded successfully."); 

  main();
};
