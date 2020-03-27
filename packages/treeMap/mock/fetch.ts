import data from "../mock/treeData.json";

const fetch = () => {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data.data.responseData);
    }, 1500);
  });

  return p;
};

export default {
  fetch
};
