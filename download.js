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

  // 幅と高さを取得（viewBoxの幅を優先）
  const width = svgElement.viewBox.baseVal.width || svgElement.clientWidth || 800;
  const height = svgElement.viewBox.baseVal.height || svgElement.clientHeight || 600;



  image.onload = function () {
    const scale = 2; // ← ここで2倍にしてる！

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