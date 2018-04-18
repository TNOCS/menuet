<template>
  <div class="menu row">
    <h1>{{ menu.title}}</h1>
    <ul class="collapsible col s12 m6 l4">
      <li v-for="(group, index) in menuState" :key="index">
        <!-- <i class="material-icons">filter_drama</i> -->
        <div v-if="groupHasVisibleChildren(group)" class="collapsible-header">{{ group.title }}</div>
        <div class="collapsible-body">
          <ul>
            <li v-for="(child, i) in group.children" :key="i" v-if="child.isVisible">
              <a href="#" @click="activateMenuItem(child.id)">{{ child.title }}</a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { restClient } from '../services/rest-client';
import { IMenuGroup } from '../models/menu-group';
import { socketClient } from '../services/socket-client';

@Component
export default class Menu extends Vue {
  @Prop() private menu!: { id: string; title: string; };
  public menuState = {};

  private get route() { return `/menus/${this.menu.id}`; }

  private mounted() {
    this.reload();
  }

  private created() {
    socketClient.on('connect', () => this.reload());
    socketClient.on('MenuUpdated', (menuId: string) => {
      console.log('Menu updated: ' + menuId);
      if (this.menu.id === menuId) {
        this.reload();
      }
    });
  }

  private beforeDestroy() {
    socketClient.off('MenuUpdated');
  }

  private activateMenuItem(menuId: string) {
    console.log(menuId);
    const r = `${this.route}/${menuId}`;
    console.log(r);
    restClient
      .put(r)
      .then(response => console.log(response));
  }

  private groupHasVisibleChildren(group: IMenuGroup) {
    const result = group.children && group.children.reduce((p, c) => p || (typeof c.isVisible === 'undefined' ? true : c.isVisible), false);
    console.log('Checking group: ' + group.title + ', ' + result);
    return result;
  }

  @Watch('$route')
  private reload(value?: any) {
    console.log('Reloading menu: ' + this.menu.title);
    restClient
      .get(this.route)
      .then(response => {
        this.menuState = response.data.state;
        $('.collapsible').collapsible();
        // log(JSON.stringify(response.data, null, 2));
      })
      .catch(error => console.error(error));
  }
}
</script>