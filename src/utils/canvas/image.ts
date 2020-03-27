export function getImageSize(url) {
  const img = document.createElement('img');
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = reject;

    img.src = url;
  });
}

export async function rotateImage(image, deg, quality) {
  const size: any = await getImageSize(image);
  return new Promise((resolve, reject) => {
    const changeWH = (deg / 90) % 2; // 是否交换宽高
    let canvas = document.createElement('canvas');
    canvas.width = changeWH ? size.height : size.width;
    canvas.height = changeWH ? size.width : size.height;

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((deg / 180) * Math.PI);

    let imageElement = document.createElement('img');
    imageElement.crossOrigin = 'Anonymous';
    imageElement.onload = () => {
      context.drawImage(imageElement, -size.width / 2, -size.height / 2);

      resolve(canvas.toDataURL('image/jpeg', quality));
      canvas = null;
      imageElement = null;
    };

    imageElement.onerror = err => reject(err);
    imageElement.src = image;
  });
}

export async function flipImage(
  image,
  horizontal = true /* 默认为水平翻转 false为纵向翻转*/,
  quality = 1 /* 质量分数 默认1 */
) {
  const size: any = await getImageSize(image);
  const { width, height } = size;
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    const scaleH = horizontal ? -1 : 1;
    const scaleV = !horizontal ? -1 : 1;
    const posX = horizontal ? width * -1 : 0;
    const posY = !horizontal ? height * -1 : 0;
    if (!ctx) {
      return;
    }
    ctx.save();
    ctx.scale(scaleH, scaleV);

    let imageElement = document.createElement('img');
    imageElement.crossOrigin = 'Anonymous';
    imageElement.onload = () => {
      ctx.drawImage(
        imageElement,
        0,
        0,
        width,
        height,
        posX,
        posY,
        width,
        height
      );
      resolve(canvas.toDataURL('image/jpeg', quality));
      imageElement = null;
      canvas = null;
    };
    imageElement.src = image;
    imageElement.onerror = err => reject(err);
  });
}
