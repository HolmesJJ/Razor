const createClusterElement = (data): HTMLElement => {
  const { point_count } = data.properties;

  let $el = document.createElement('div');
  let { width, height, backgroundColor} = {
    width: 80,
    height: 80,
    backgroundColor: "#3E96D7",
  }
  const { isSelected } = data.properties;
  // 如果是选中的话 另外一个颜色
  if (isSelected) backgroundColor = "#4DA971";

  $el.style.cssText = `width: ${width}px; height: ${height}px; background: ${backgroundColor}; border-radius: 50%; opacity: 0.7`;
  
  let textNode;
  textNode = document.createElement('div');
  textNode.style.cssText = 'color: #fff; position: absolute; width: 100%; text-align: center; font-size: 20px; font-family: SourceHanSansCN-Medium; line-height: 20px';
  // create cluster text node
  textNode.style.top = '30px';
  textNode.innerHTML = isSelected ? `${isSelected}/${point_count}` : `${point_count}`;

  $el.appendChild(textNode);
  return $el;
}

const createUnclusterElement = (data): HTMLElement => {
  let $el = document.createElement('div');
  let { width, height, backgroundColor } = {
    width: 30,
    height: 30,
    backgroundColor: "#FF9800",
  };
  const { isSelected } = data.properties;
  // 如果是选中的话 另外一个颜色
  if (isSelected) backgroundColor = "#77ba5d";

  $el.style.cssText = `width: ${width}px; height: ${height}px; background: ${backgroundColor}; border-radius: 50%`;
  
  let textNode;
  textNode = document.createElement('div');
  textNode.style.cssText = 'color: #fff; position: absolute; width: 100%; text-align: center; top: 5px';

  $el.appendChild(textNode);
  return $el;
}

export default {
  createClusterElement,
  createUnclusterElement
}