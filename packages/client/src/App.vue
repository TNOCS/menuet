<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper">
        <a href="#" class="brand-logo" style="margin-left: 20px;">Logo</a>
        <ul id="nav-mobile" class="right">
          <li><router-link to="/">Home</router-link></li>
          <li v-for="(menu, index) in menus" :key="index"><router-link :to="'/' + menu.id">{{ menu.title }}</router-link></li>
          <li><router-link to="/about">About</router-link></li>
        </ul>
      </div>
    </nav>
    <div style="margin: 20px;">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { restClient } from './services/rest-client';
import { Store } from './services/store';
import { socketClient } from './services/socket-client';
import router from './router';
import Menu from './views/Menu.vue';

const log = console.log;

@Component({
  components: {}
})
export default class App extends Vue {
  private menus: { id: string; title: string }[] = [];

  public created() {
    if (Store.isInitialized) { return; }
    Store.isInitialized = true;
    socketClient.on('connect', () => log('Connected!'));
    restClient
      .get('/menus')
      .then(response => {
        this.menus = response.data;
        const component = Menu;
        const newRoutes = this.menus.map(m => ({ path: `/${m.id}`, name: m.title, component: Menu, props: { menu: m } }));
        log(JSON.stringify(newRoutes, null, 2));
        router.addRoutes(newRoutes);
        // router.
        log(response.data);
      })
      .catch(error => log(error));
  }

  public beforeDestroy() {
    socketClient.disconnect();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

nav a.router-link-exact-active {
  background-color: rgba(0,0,0,0.1);
}
</style>
