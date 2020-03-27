let themes: { [key: string]: any } = {};

const themeJsons = require['context']('./', true, /\.json$/);

themeJsons.keys().forEach((fileDir) => {
  const key = fileDir.replace(/.*[\\\/]|.json/g, '');
  themes[key] = themeJsons(fileDir);
})

export default themes;
