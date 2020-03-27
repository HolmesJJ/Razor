import { mount } from "@vue/test-utils";
import Table from "../";
import TableColumn from "../../tableColumn";

const getTestData = function() {
  return [
    {
      id: 1,
      name: "Toy Story",
      release: "1995-11-22",
      director: "John Lasseter",
      runtime: 80
    },
    {
      id: 2,
      name: "A Bug's Life",
      release: "1998-11-25",
      director: "John Lasseter",
      runtime: 95
    },
    {
      id: 3,
      name: "Toy Story 2",
      release: "1999-11-24",
      director: "John Lasseter",
      runtime: 92
    },
    {
      id: 4,
      name: "Monsters, Inc.",
      release: "2001-11-2",
      director: "Peter Docter",
      runtime: 92
    },
    {
      id: 5,
      name: "Finding Nemo",
      release: "2003-5-30",
      director: "Andrew Stanton",
      runtime: 100
    }
  ];
};

// 编写 Table 的测试用例
describe("Table组件", () => {
  describe("render data is correct", () => {
    const vm = {
      components: {
        RzTable: Table,
        RzTableColumn: TableColumn
      },
      template: `
         <rz-table :data="testData">
          <rz-table-column prop="id" />
          <rz-table-column prop="name" label="片名" />
          <rz-table-column prop="release" label="发行日期" />
          <rz-table-column prop="director" label="导演" />
          <rz-table-column prop="runtime" label="时长（分）" />
        </rz-table>
      `,
      created() {
        this.testData = getTestData();
      }
    };

    const wrapper = mount(vm);

    it("mounted", () => {
      expect(wrapper.find(".rz-table")).toBeTruthy();
      expect(wrapper.classes()).toContain("rz-table");
      expect(wrapper.findAll("thead th").exists()).toBe(true);
    });

    it("render data", () => {
      // 第一列是空字符
      expect(wrapper.find("thead th").text()).toBe("");
      // 总共有5列
      expect(wrapper.findAll("thead th").length).toBe(5);

      const all = wrapper.findAll("thead th");
      const allVisiable = all.filter(w => w.text() !== "");

      expect(allVisiable.length).toEqual(4);
    });
  });

  describe("attributes", () => {
    const createTable = (props, opts = {}) => {
      return mount(
        Object.assign(
          {
            components: {
              RzTable: Table,
              RzTableColumn: TableColumn
            },
            template: `
            <rz-table :data="testData" ${props}>
              <rz-table-column prop="id" />
              <rz-table-column prop="name" label="片名" />
              <rz-table-column prop="release" label="发行日期" />
              <rz-table-column prop="director" label="导演" />
              <rz-table-column prop="runtime" label="时长（分）" />
            </rz-table>
          `,
            props: {
              height: [String, Number]
            },
            created() {
              this.testData = getTestData();
            }
          },
          opts
        )
      );
    };

    it("height", done => {
      const wrapper = createTable(`height="123"`);

      // mounted
      wrapper.vm.$nextTick().then(() => {
        expect(wrapper.vm.$el.style.height).toEqual("123px");
        done();
      });
    });

    it("height as string", done => {
      const wrapper = createTable(`height="100px"`);

      // mounted
      wrapper.vm.$nextTick().then(() => {
        expect(wrapper.vm.$el.style.height).toEqual("100px");
        done();
      });
    });

    it("maxHeight", done => {
      const wrapper = createTable(`maxHeight="123"`);

      // mounted
      wrapper.vm.$nextTick().then(() => {
        expect(wrapper.vm.$el.style.maxHeight).toEqual("123px");
        done();
      });
    });

    it("stripe", done => {
      const wrapper = createTable("stripe");
      wrapper.vm.$nextTick().then(() => {
        expect(wrapper.classes()).toContain("rz-table--striped");
        done();
      });
    });

    it("border", done => {
      const wrapper = createTable("border");
      wrapper.vm.$nextTick().then(() => {
        expect(wrapper.classes()).toContain("rz-table--border");
        done();
      });
    });

    it("fit", done => {
      const wrapper = createTable(``);
      wrapper.vm.$nextTick().then(() => {
        expect(wrapper.classes()).toContain("rz-table--fit");
      });

      const wrapper2 = createTable(`:fit="false"`);
      wrapper2.vm.$nextTick().then(() => {
        expect(wrapper2.classes()).not.toContain("rz-table--fit");
        done();
      });
    });

    it("show-header", done => {
      const wrapper = createTable(`:showHeader="false"`);
      wrapper.vm.$nextTick().then(() => {
        expect(wrapper.findAll(".rz-table__header-wrapper").length).toEqual(0);
        done();
      });
    });

    it("tableRowClassName", done => {
      const wrapper = createTable(`:row-class-name="tableRowClassName"`, {
        methods: {
          tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 1) {
              return "info-row";
            } else if (rowIndex === 3) {
              return "positive-row";
            }

            return "";
          }
        }
      });

      wrapper.vm.$nextTick().then(() => {
        expect(wrapper.findAll(".info-row").length).toEqual(1);
        expect(wrapper.findAll(".positive-row").length).toEqual(1);
        done();
      });
    });

    it("tableRowStyle[Object]", done => {
      const wrapper = createTable(`:rowStyle="rowStyle"`, {
        data() {
          return {
            rowStyle: {
              height: "60px"
            }
          };
        }
      });
      wrapper.vm.$nextTick().then(() => {
        expect(
          wrapper.vm.$el.querySelector(".rz-table__body tr").style.height
        ).toEqual("60px");

        done();
      });
    });

    it("tableRowStyle[Function]", done => {
      const wrapper = createTable(':row-style="tableRowStyle"', {
        methods: {
          tableRowStyle({ row, rowIndex }) {
            if (rowIndex === 1) {
              return { height: "60px", display: "none" };
            }

            return null;
          }
        }
      });

      wrapper.vm.$nextTick().then(() => {
        const el = wrapper.vm.$el;
        let child1 = el.querySelector(".rz-table__body tr:nth-child(1)");
        let child2 = el.querySelector(".rz-table__body tr:nth-child(2)");
        expect(child1.style.height).toEqual("");
        expect(child1.style.display).toEqual("");
        expect(child2.style.height).toEqual("60px");
        expect(child2.style.display).toEqual("none");
        done();
      });
    });

    it("select-on-indeterminate", done => {
      const vm = {
        components: {
          RzTable: Table,
          RzTableColumn: TableColumn
        },
        template: `
         <rz-table :data="testData" @selection-change="change" :select-on-indeterminate="false" ref="table">
          <rz-table-column type="selection" />
          <rz-table-column prop="name" label="name" />
          <rz-table-column prop="release" label="release" />
          <rz-table-column prop="director" label="director" />
          <rz-table-column prop="runtime" label="runtime" />
        </rz-table>
      `,
        created() {
          this.testData = getTestData();
        },

        mounted() {
          this.$refs.table.toggleRowSelection(this.testData[0]);
        },

        data() {
          return { selected: [] };
        },

        methods: {
          change(val) {
            this.selected = val;
          }
        }
      };

      const wrapper = mount(vm);
      wrapper.vm.$nextTick().then(() => {
        // select all
        const el = wrapper.vm.$el.querySelector(".rz-checkbox");
        el.click();
        wrapper.vm.$nextTick().then(() => {
          const id = Object.keys(wrapper.vm.$data.selected[0]);
          expect(id.length).toEqual(5);
          done();
        });
      });
      // done();
    });
  });
});
