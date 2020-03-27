<template>
  <div class="side-nav" :class="{
      'show-header': !showHeader
    }">
    <rz-scrollbar
      noresize
      :wrapClass="'sidenav-rz-scrollbar__wrap'"
      class="sidenav-scroller"
      style="height:100%"
    >
      <ul class="side-nav__container">
        <li
          :key="nav.path"
          :class="{
                    'pointer': !!nav.path,
                    'current': isCurrentRoute(nav.name)
                }"
          v-for="nav in navList"
        >
          <span @click="goToPage(nav)">{{nav.name}}</span>
          <div class="side-nav__groups" v-if="nav.groups">
            <ul class="side-nav__group" :key="group.groupName" v-for="group in nav.groups">
              <p>{{group.groupName}}</p>
              <li
                :key="item.path"
                class="side-nav__item"
                :class="{
                                'pointer': !!item.path,
                                'current': isCurrentRoute(item.title)
                            }"
                v-for="item in group.list"
                @click="goToPage(item)"
              >{{item.title}}</li>
            </ul>
          </div>
        </li>
      </ul>
    </rz-scrollbar>
  </div>
</template>

<script>
import navConfig from "doc/nav.config";
import showHeader from "../mixins/showHeader";

export default {
  name: "DocSideNav",
  mixins: [showHeader],
  data() {
    return {
      navList: navConfig,
      currentRoute: ""
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.currentRoute = val && val.name;
      },
      immediate: false
    }
  },
  methods: {
    goToPage(nav) {
      if (!nav.path) {
        return;
      }
      const path = !this.showHeader? nav.path + '?hideHeader=true' : nav.path
      this.$router.push(path);
    },
    isCurrentRoute(title) {
      const routeName = title.split(" ")[0];
      const currentRoute = this.currentRoute.toLowerCase();
      const route = routeName.toLowerCase();
      const isCurrent =
        currentRoute === "onoff" && route === "switch"
          ? true
          : currentRoute === route;
      return isCurrent;
    }
  }
};
</script>
<style>
.side-nav .sidenav-rz-scrollbar__wrap {
  overflow-x: auto;
}
</style>
<style lang="scss" scoped>
.side-nav.show-header{
  top: 0px;
}
.side-nav {
  position: fixed;
  top: 120px;
  min-width: 240px;
  bottom: 40px;
  ul {
    margin: 0;
    padding: 0;
    height: 100%;
    list-style: none;
  }
  &__container {
    margin: 0;
    padding: 0;
    list-style: none;
    & > li {
      margin: 30px 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  &__groups {
    p {
      margin-top: 20px;
      font-size: 13px;
      font-weight: 400;
      color: gray;
    }
    li {
      font-size: 14px;
      font-weight: 400;
      margin: 20px 0;
    }
  }
}
.pointer {
  cursor: pointer;
}
.current {
  color: #4285f4;
}
.rz-side-nav-srollerbar > .rz-scrollbar__wrap {
  overflow-x: hidden;
}
</style>