export default function(target, ...args) {
  for (let i = 0, j = args.length; i < j; i++) {
    let source = args[i] || {};
    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        let value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }

  return target;
}
