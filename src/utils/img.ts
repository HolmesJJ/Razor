/**
 * 给指定元素添加/移除事件
 * @param {HTMLElement} document  HTML文档对象
 * @param {String} fileName 文件名
 * @param {String} content 文件base64字节流
 */

function base64Img2Blob(content: string) {
  let parts = content.split(";base64,");
  let contentType = parts[0].split(":")[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

export function downloadFile(fileName: string, content: string) {
  let aLink = document.createElement("a");
  let blob = base64Img2Blob(content); //new Blob([content]);
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
}

export function getCanvas(
  dom: CanvasImageSource,
  width: number,
  height: number,
  imagePosition?
) {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let canvas2d = canvas.getContext("2d");
  if (canvas2d) {
    canvas2d.drawImage(dom, 0, 0, canvas.width, canvas.height);
    if (imagePosition) {
      let { left, right } = imagePosition;
      let imgData = canvas2d.getImageData(
        left.x * canvas.width,
        left.y * canvas.height,
        right.x * canvas.width,
        right.y * canvas.height
      );
      canvas.width = (right.x - left.x) * canvas.width;
      canvas.height = (right.y - left.y) * canvas.height;
      canvas2d.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height);
    }
  }

  return canvas;
}
/**
 * 给指定元素添加/移除事件
 * @param {CanvasImageSource} dom  操作对象
 * @param {Number} width 对象宽度
 * @param {Number} height 对象高度
 * @param {Object} imagePosition 截取特定区域图片 {left:{x,y}, right:{x, y}}
 */
export function getBase64FromCanvas(
  dom: CanvasImageSource,
  width: number,
  height: number,
  imagePosition?
) {
  return getCanvas(dom, width, height, imagePosition).toDataURL("image/png");
}
