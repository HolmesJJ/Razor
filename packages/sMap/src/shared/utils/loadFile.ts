// 资源加载类型
import { RazorMapUrlType } from "../../types/config";

function createFile(
  url: string,
  type: RazorMapUrlType
): HTMLScriptElement | HTMLLinkElement {
  let file: HTMLScriptElement | HTMLLinkElement;

  if (type === "script") {
    file = document.createElement("script");
    file.type = "text/javascript";
    file.src = url;
  } else {
    file = document.createElement("link");
    file.type = "text/css";
    file.rel = "stylesheet";
    file.href = url;
  }

  return file;
}

function loadFile(url: string, type: RazorMapUrlType) {
  return new Promise((resolve, reject) => {
    const file = createFile(url, type);
    document.body.appendChild(file);

    file.onload = resolve;

    file.onerror = error => {
      reject(error);
    };
  });
}

// http://localhost:9080/darkTiles
// offmapcfg.home = "http://localhost:9080/offlineMap/"; 
export function loadGlobalVar(tilesDir, offlineHome) {
  return new Promise((resolve, reject) => {
    const file = document.createElement("script");
    file.type = "text/javascript";
    file.text = `var offmapcfg = {
      'imgext'      : '.png',   //瓦片图的后缀 ------ 根据需要修改，一般是 .png .jpg
      'tiles_dir'   : '${tilesDir}',       //普通瓦片图的地址，为空默认在 offlineemap/tiles/ 目录
      'tiles_hybrid': '',       //卫星瓦片图的地址，为空默认在 offlineemap/tiles_hybrid/ 目录
      'tiles_self'  : '',       //自定义图层的地址，为空默认在 offlineemap/tiles_self/ 目录
      'home': '${offlineHome}'
    };`
    document.body.appendChild(file);

    resolve();
  });
}

export default loadFile;
