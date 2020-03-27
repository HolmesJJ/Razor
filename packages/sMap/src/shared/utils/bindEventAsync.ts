/**
 * 异步绑定事件，默认会把事件resolve
 * @param target target to bind event
 * @param name event name
 * @param handler handler
 */
const bindEventAsync = (
  target: any,
  name: string,
  handler: Function = (event: any, resolve: Function) => {
    resolve(event);
  }
) => {
  const p = new Promise((resolve: Function) => {
    target.addEventListener(name, (event: any) => {
      handler(event, resolve, target);
    });
  });

  return p;
};

export default bindEventAsync;
