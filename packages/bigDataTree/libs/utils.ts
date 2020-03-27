export const ID = function() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

export const pagination = (current: number, pageSize: number, array: any[]) => {
  const offset = (current - 1) * pageSize;
  return offset + pageSize > array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + pageSize);
};

// deep update
export const deepUpdate = (vm: any) => {
  if (vm.initStatistics && !vm.isLeaf) {
    vm.initStatistics();
  }
  vm.$children.forEach(child => {
    deepUpdate(child);
  });
};

// deep destroy
export const deepDestroy = (vm: any) => {
  if (vm.$children.length) {
    vm.$children.forEach(child => {
      if (child.destroyNode) {
        child.destroyNode();
        deepDestroy(child);
      }
    });
  }
  vm.deepDestroy && vm.destroyNode();
};

export const diffReduce = (newVal: string[], oldVal: string[]) =>
  newVal.concat(oldVal).filter(v => oldVal.includes(v) && !newVal.includes(v));

export const diffStringArray = (a: string[], b: string[]) =>
  a.concat(b).filter(v => !a.includes(v) || !b.includes(v));
