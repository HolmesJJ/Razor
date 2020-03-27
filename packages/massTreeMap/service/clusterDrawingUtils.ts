import { Vue } from "vue-property-decorator";
import IconCmp from "../src/Icon.vue";
import ClusterCmp from "../src/Cluster.vue";

const createClusterElement = (data): HTMLElement => {
  const vm = new Vue({
    render: h =>
      h(ClusterCmp, {
        props: {
          camera: data
        }
      })
  });

  return (vm.$mount() as any).$el;
};

const createUnclusterElement = (data): HTMLElement => {
  const { isSelected, node } = data.properties;
  const name = node.name;

  const vm = new Vue({
    render: h =>
      h(IconCmp, {
        props: {
          isSelected,
          content: name
        }
      })
  });

  return (vm.$mount() as any).$el;
};

export default {
  createClusterElement,
  createUnclusterElement
};
